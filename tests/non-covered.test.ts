import { test } from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { PGlite } from '@electric-sql/pglite';
import ExcelJS from 'exceljs';
import seed from '../src/lib/nonCoveredSeed.json';
import { nonCoveredData } from '../src/app/(public)/non-covered/data';
import { applyFeeCommand, parseFee, publicFeeSections, orderedFeeItems, type FeeCatalog, type FeeDraft } from '../src/lib/nonCovered';
import { buildFeeWorkbook } from '../src/lib/nonCoveredExcel';

const catalog = seed as FeeCatalog;
const draft: FeeDraft = { ...catalog.items[0], name: '새 항목', code: '0012300', cost: 0, updateDate: '2026-09-28' };

test('migration preserves every public value, order, duplicated code and blank versus zero', () => {
  assert.equal(catalog.items.length, 173);
  assert.deepEqual(publicFeeSections(catalog), nonCoveredData);
  assert.equal(parseFee('0'), 0); assert.equal(parseFee(''), null); assert.equal(parseFee('1,000'), 1000);
  for (const value of ['-1', '1,2', '1e4', 'NaN', '1.5', '1,000,000,000']) assert.throws(() => parseFee(value));
  assert.ok(catalog.items.filter(i => i.code === 'EZ776').length > 1);
});

test('validation rejects invalid range, date, missing group and absent prices', () => {
  for (const values of [
    { minCost: 100, maxCost: 99 }, { updateDate: '2026-02-30' }, { cost: -1 }, { cost: Number.NaN },
    { groupId: 'missing' }, { name: '' }, { cost: null, minCost: null, maxCost: null },
  ]) assert.throws(() => applyFeeCommand(catalog, { type: 'saveItem', item: { ...draft, ...values } }, 'new'));
});

test('create, rename, reorder, delete and restore retain identity without mutating source', () => {
  const created = applyFeeCommand(catalog, { type: 'saveItem', item: draft }, 'new');
  assert.equal(catalog.items.length, 173); assert.equal(created.content.items.length, 174);
  assert.equal(created.content.items.at(-1)?.cost, 0);
  const moved = applyFeeCommand(created.content, { type: 'moveItem', id: 'new', direction: -1 }, 'unused');
  assert.equal(orderedFeeItems(moved.content)[0].id, 'new');
  const deleted = applyFeeCommand(moved.content, { type: 'deleteItem', id: 'new' }, 'unused');
  assert.equal(orderedFeeItems(deleted.content).length, 173);
  const restored = applyFeeCommand(deleted.content, { type: 'restoreItem', id: 'new' }, 'unused');
  assert.equal(orderedFeeItems(restored.content)[0].id, 'new');
  const group = catalog.sections[1].groups[0];
  const renamed = applyFeeCommand(restored.content, { type: 'saveGroup', sectionId: catalog.sections[1].id, id: group.id, name: '변경 분류' }, 'unused');
  assert.equal(orderedFeeItems(renamed.content)[0].categoryName, '변경 분류');
});

test('xlsx round trip preserves codes as text, amounts as numbers, blanks, order and excludes deleted', async () => {
  const created = applyFeeCommand(catalog, { type: 'saveItem', item: { ...draft, name: '=1+1' } }, 'new');
  const removed = applyFeeCommand(created.content, { type: 'deleteItem', id: catalog.items[0].id }, 'unused');
  const workbook = await buildFeeWorkbook({ version: 3, content: removed.content }, []);
  const loaded = new ExcelJS.Workbook(); await loaded.xlsx.load(await workbook.xlsx.writeBuffer());
  const sheet = loaded.getWorksheet('비급여 안내')!;
  assert.equal(sheet.rowCount, 176);
  const row = sheet.getRow(4);
  assert.equal(row.getCell(3).value, '=1+1'); assert.equal(row.getCell(3).type, ExcelJS.ValueType.String);
  assert.equal(row.getCell(4).value, '0012300'); assert.equal(row.getCell(4).type, ExcelJS.ValueType.String);
  assert.equal(row.getCell(6).value, 0); assert.equal(row.getCell(7).value, null);
  assert.equal(sheet.views[0].state, 'frozen'); assert.ok(sheet.autoFilter);
});

test('SQL migration is repeatable, denies anonymous access, commits audit atomically and rejects stale writes', async () => {
  const db = new PGlite();
  try {
    await db.exec('CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;');
    const sql = await readFile('setup_non_covered.sql', 'utf8');
    await db.exec(sql);
    const { rows } = await db.query<{ content: FeeCatalog }>("SELECT content FROM public.non_covered_catalog WHERE id='main'");
    assert.deepEqual(rows[0].content, catalog);
    await db.exec('SET ROLE anon');
    await assert.rejects(db.query('SELECT * FROM public.non_covered_catalog'), /permission denied/);
    await assert.rejects(db.query("SELECT public.save_non_covered_catalog(1,'{}','수정','test',null,null)"), /permission denied/);
    await db.exec('RESET ROLE; SET ROLE service_role;');
    const change = applyFeeCommand(catalog, { type: 'saveItem', item: draft }, 'new');
    const call = () => db.query('SELECT public.save_non_covered_catalog($1,$2,$3,$4,$5,$6)', [1, JSON.stringify(change.content), change.action, change.label, JSON.stringify(change.before), JSON.stringify(change.after)]);
    await call();
    await assert.rejects(call(), /CATALOG_CONFLICT/);
    const counts = await db.query<{ n: number }>('SELECT count(*)::integer n FROM public.non_covered_history');
    assert.equal(counts.rows[0].n, 1);
    await db.exec('RESET ROLE'); await db.exec(sql);
    const state = await db.query<{ version: number; content: FeeCatalog }>('SELECT version, content FROM public.non_covered_catalog');
    assert.equal(state.rows[0].version, 2); assert.equal(state.rows[0].content.items.length, 174);
    await db.exec("CREATE FUNCTION public.reject_fee_audit() RETURNS trigger LANGUAGE plpgsql AS $$ BEGIN RAISE EXCEPTION 'audit failed'; END $$; CREATE TRIGGER reject_audit BEFORE INSERT ON public.non_covered_history FOR EACH ROW EXECUTE FUNCTION public.reject_fee_audit();");
    await assert.rejects(db.query('SELECT public.save_non_covered_catalog($1,$2,$3,$4,$5,$6)', [2, JSON.stringify(catalog), '수정', 'rollback', null, null]), /audit failed/);
    const rollback = await db.query<{ version: number }>('SELECT version FROM public.non_covered_catalog'); assert.equal(rollback.rows[0].version, 2);
  } finally { await db.close(); }
});

test('section renumbering SQL upgrades an already-migrated catalogue once and keeps admin renames', async () => {
  // Rebuild the pre-renumbering catalogue that production received from the first seed.
  const oldTitles: Record<string, string> = {
    '1. 행위료': '1장. 행위료', '1-1. 상급병실료 차액': '1-1장. 상급병실료 차액', '1-2. 검사료': '2장. 검사료',
    '1-3. 초음파 검사료': '2-1장. 초음파검사료', '1-4. 초음파 영상료': '3-1장. 초음파 영상료',
    '1-5. 자기공명영상진단료(MRI)': '3-2장. 자기공명영상진단료', '1-6. 이학요법료(물리치료료)': '7장. 이학요법료(물리치료료)',
    '1-7. 처치 및 수술료': '9장. 처치 및 수술료', '2. 치료재료대': '2장. 치료재료대', '3. 약제비': '3장. 약제비',
    '4. 제증명료': '4. 제증명료', '5. 기타': '기타.',
  };
  const legacy: FeeCatalog = structuredClone(catalog);
  legacy.sections = legacy.sections.map(s => ({
    ...s, title: oldTitles[s.title],
    groups: ['3. 약제비', '4. 제증명료'].includes(s.title) ? s.groups.map(g => ({ ...g, name: '기타' })) : s.groups,
  }));
  const etc = legacy.sections.pop()!;
  legacy.sections.splice(legacy.sections.findIndex(s => s.title === '2장. 치료재료대'), 0, etc);
  assert.deepEqual(legacy.sections.map(s => s.title).slice(8, 10), ['기타.', '2장. 치료재료대']);

  const db = new PGlite();
  try {
    await db.exec('CREATE ROLE anon; CREATE ROLE authenticated; CREATE ROLE service_role BYPASSRLS;');
    await db.exec(await readFile('setup_non_covered.sql', 'utf8'));
    const update = await readFile('update_non_covered_sections.sql', 'utf8');
    await db.exec(update);
    let state = await db.query<{ version: number }>('SELECT version FROM public.non_covered_catalog');
    assert.equal(state.rows[0].version, 1, 'fresh installs are already renumbered');

    await db.query("UPDATE public.non_covered_catalog SET content = $1 WHERE id = 'main'", [JSON.stringify(legacy)]);
    await db.exec(update);
    const upgraded = await db.query<{ version: number; content: FeeCatalog }>('SELECT version, content FROM public.non_covered_catalog');
    assert.equal(upgraded.rows[0].version, 2);
    assert.deepEqual(upgraded.rows[0].content, catalog);
    const audit = await db.query<{ action: string; label: string }>('SELECT action, label FROM public.non_covered_history');
    assert.deepEqual(audit.rows.map(({ action, label }) => ({ action, label })), [{ action: '분류 수정', label: '장 제목 번호 정리' }]);

    await db.exec(update);
    state = await db.query<{ version: number }>('SELECT version FROM public.non_covered_catalog');
    assert.equal(state.rows[0].version, 2, 'second run changes nothing');

    const renamed = structuredClone(legacy);
    renamed.sections[2].title = '검사료(관리자 수정)';
    await db.query("UPDATE public.non_covered_catalog SET content = $1 WHERE id = 'main'", [JSON.stringify(renamed)]);
    await db.exec(update);
    const kept = await db.query<{ content: FeeCatalog }>('SELECT content FROM public.non_covered_catalog');
    assert.equal(kept.rows[0].content.sections[2].title, '검사료(관리자 수정)');
    assert.equal(kept.rows[0].content.sections.at(-1)?.title, '5. 기타');
  } finally { await db.close(); }
});
