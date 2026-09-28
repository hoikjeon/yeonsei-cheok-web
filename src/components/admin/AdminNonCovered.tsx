'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { mutateFee } from '@/app/admin/(dashboard)/non-covered/actions';
import {
  type FeeSnapshot, type FeeHistory, type FeeItem, type FeeCommand, type FeeDraft,
  feeFieldLabels, formatFee, koreaDate, orderedFeeItems, parseFee, validateFeeDraft, historyDescription,
} from '@/lib/nonCovered';

const fieldStyle = 'mt-1 w-full rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm focus:border-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-100';
const buttonStyle = 'inline-flex min-h-10 shrink-0 items-center justify-center whitespace-nowrap rounded-lg border border-slate-300 bg-white px-3 py-2 text-sm font-semibold hover:bg-slate-50 disabled:opacity-40';
const primaryStyle = 'inline-flex min-h-10 items-center justify-center rounded-lg bg-blue-800 px-4 py-2 text-sm font-bold text-white hover:bg-blue-900 disabled:opacity-40';
// 표가 옆으로 넘칠 때도 관리 버튼이 항상 보이도록 오른쪽에 고정합니다.
const stickyActionCell = 'sticky right-0 z-[1] px-4 shadow-[-8px_0_12px_-10px_rgba(15,23,42,0.35)]';
type FormValues = Record<keyof FeeDraft, string>;
function valuesFor(item: FeeItem | undefined, groupId: string): FormValues {
  return {
    groupId: item?.groupId ?? groupId, name: item?.name ?? '', code: item?.code ?? '', division: item?.division ?? '',
    cost: item ? formatFee(item.cost) : '', minCost: item ? formatFee(item.minCost) : '', maxCost: item ? formatFee(item.maxCost) : '',
    materialIncluded: item?.materialIncluded ?? '', drugIncluded: item?.drugIncluded ?? '', note: item?.note ?? '',
    updateDate: koreaDate(),
  };
}
function Modal({ title, close, children, busy }: { title: string; close: () => void; children: React.ReactNode; busy: boolean }) {
  const ref = useRef<HTMLDialogElement>(null);
  useEffect(() => { const dialog = ref.current; dialog?.showModal(); return () => dialog?.close(); }, []);
  return <dialog ref={ref} aria-label={title} onCancel={e => { e.preventDefault(); if (!busy) close(); }} className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-3xl overflow-y-auto rounded-2xl border-0 bg-white p-0 shadow-2xl backdrop:bg-slate-950/50">
    <div className="sticky top-0 z-10 flex items-center justify-between border-b bg-white px-6 py-4"><h2 className="text-lg font-bold">{title}</h2><button type="button" onClick={close} disabled={busy} className={buttonStyle} aria-label="닫기">닫기</button></div>
    <div className="p-6">{children}</div>
  </dialog>;
}
export default function AdminNonCovered({ initial, initialHistory }: { initial: FeeSnapshot; initialHistory: FeeHistory[] }) {
  const [snapshot, setSnapshot] = useState(initial);
  const [history, setHistory] = useState(initialHistory);
  const [tab, setTab] = useState<'items' | 'groups' | 'history'>('items');
  const [query, setQuery] = useState('');
  const [sectionFilter, setSectionFilter] = useState('');
  const [status, setStatus] = useState('active');
  const [editor, setEditor] = useState<{ id?: string; values: FormValues } | null>(null);
  const [preview, setPreview] = useState<FeeDraft | null>(null);
  const [confirmation, setConfirmation] = useState<{ command: FeeCommand; title: string; message: string } | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [busy, setBusy] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const catalog = snapshot.content;
  const all = orderedFeeItems(catalog, true);
  const rows = all.filter(i => (status === 'deleted' ? Boolean(i.deletedAt) : !i.deletedAt)
    && (!sectionFilter || catalog.sections.find(s => s.id === sectionFilter)?.groups.some(g => g.id === i.groupId))
    && `${i.name} ${i.code}`.toLocaleLowerCase().includes(query.trim().toLocaleLowerCase()));

  async function save(command: FeeCommand) {
    setBusy(true); setError(''); setSuccess('');
    try {
      const result = await mutateFee(command, snapshot.version);
      if (result.error) { setError(result.error); return; }
      if (result.snapshot) setSnapshot(result.snapshot);
      if (result.history) setHistory(result.history);
      setEditor(null); setPreview(null); setConfirmation(null); setSuccess(result.success ?? '저장되었습니다.');
    } catch { setError('연결 상태를 확인해주세요. 저장 결과가 불확실하므로 새로고침해 확인한 뒤 다시 시도해주세요.'); }
    finally { setBusy(false); }
  }
  async function download() {
    setDownloading(true); setError('');
    try {
      const response = await fetch('/api/admin/non-covered/export', { cache: 'no-store' });
      if (!response.ok) throw new Error(response.status === 401 ? '다시 로그인한 뒤 다운로드해주세요.' : '엑셀 다운로드에 실패했습니다. 다시 시도해주세요.');
      const blob = await response.blob(); const url = URL.createObjectURL(blob);
      const a = document.createElement('a'); a.href = url; a.download = `연세척병원_비급여_${koreaDate()}.xlsx`; a.click();
      setTimeout(() => URL.revokeObjectURL(url), 1000);
    } catch (e) { setError(e instanceof Error ? e.message : '다운로드에 실패했습니다.'); }
    finally { setDownloading(false); }
  }
  function edit(item?: FeeItem) {
    setError(''); setSuccess(''); setPreview(null);
    setEditor({ id: item?.id, values: valuesFor(item, catalog.sections.flatMap(s => s.groups)[0]?.id ?? '') });
  }
  function confirm(command: FeeCommand, title: string, message: string) { setError(''); setSuccess(''); setConfirmation({ command, title, message }); }
  const alert = error ? <p role="alert" className="my-4 rounded-lg bg-red-50 p-3 text-sm text-red-800">{error}</p> : null;
  return <div className="mx-auto w-full max-w-[1600px] p-4 sm:p-8">
    <Link href="/admin" className="mb-4 inline-block text-sm text-slate-600">← 관리자 홈</Link>
    <header className="mb-6 flex flex-wrap items-start justify-between gap-4">
      <div><h1 className="text-2xl font-bold text-slate-900">비급여 관리</h1><p className="mt-2 text-sm text-slate-600">공개 {all.filter(i => !i.deletedAt).length}개 · 삭제 {all.filter(i => i.deletedAt).length}개 · 안내 기준일 {catalog.publishedDate}</p></div>
      <div className="flex flex-wrap gap-2"><Link href="/non-covered" target="_blank" className={buttonStyle}>홈페이지 보기 ↗</Link><button onClick={download} disabled={downloading || busy} className={buttonStyle}>{downloading ? '엑셀 만드는 중…' : '엑셀 다운로드'}</button><button onClick={() => edit()} disabled={busy} className={primaryStyle}>항목 추가</button></div>
    </header>
    {success && <p role="status" className="mb-4 rounded-lg bg-green-50 p-3 text-sm text-green-800">{success}</p>}
    {!editor && !confirmation && alert}
    <nav aria-label="비급여 관리 메뉴" className="mb-6 flex gap-2 border-b border-slate-200 pb-3">
      {([['items', '항목 관리'], ['groups', '분류·순서 관리'], ['history', '변경 이력']] as const).map(([key, label]) => <button key={key} onClick={() => setTab(key)} aria-current={tab === key ? 'page' : undefined} className={tab === key ? primaryStyle : buttonStyle}>{label}</button>)}
    </nav>
    {tab === 'items' && <>
      <div className="mb-4 grid gap-3 rounded-xl border border-slate-200 bg-white p-4 sm:grid-cols-[2fr_1fr_1fr]">
        <label className="text-sm font-semibold">항목명·코드 검색<input value={query} onChange={e => setQuery(e.target.value)} className={fieldStyle} placeholder="명칭 또는 코드를 입력하세요" /></label>
        <label className="text-sm font-semibold">대분류<select value={sectionFilter} onChange={e => setSectionFilter(e.target.value)} className={fieldStyle}><option value="">전체 분류</option>{catalog.sections.map(s => <option value={s.id} key={s.id}>{s.title}</option>)}</select></label>
        <label className="text-sm font-semibold">공개 상태<select value={status} onChange={e => setStatus(e.target.value)} className={fieldStyle}><option value="active">공개 중</option><option value="deleted">삭제된 항목</option></select></label>
      </div>
      <p className="mb-3 text-sm text-slate-500">{rows.length}개 항목 · 순서는 같은 분류 안에서 변경됩니다.</p>
      <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white">
        <table className="w-full min-w-[900px] text-left text-sm"><thead className="bg-slate-100 text-slate-600"><tr>{['분류 / 명칭', '코드', '비용', '최저비용', '최고비용', '변경일'].map(h => <th key={h} className="px-4 py-3">{h}</th>)}<th className={`${stickyActionCell} bg-slate-100 py-3`}>관리</th></tr></thead>
          <tbody>{rows.map(item => {
            const siblings = all.filter(i => i.groupId === item.groupId && !i.deletedAt);
            const index = siblings.findIndex(i => i.id === item.id);
            return <tr key={item.id} data-fee-id={item.id} className="border-t border-slate-100">
              <td className="max-w-[340px] px-4 py-4"><p className="mb-1 text-xs text-slate-500">{item.sectionTitle} / {item.categoryName}</p><p className="font-semibold text-slate-900">{item.name}</p></td>
              <td className="px-4 py-4 text-slate-600">{item.code || '—'}</td>
              {[item.cost, item.minCost, item.maxCost].map((v, i) => <td key={i} className="whitespace-nowrap px-4 py-4 tabular-nums">{v === null ? '—' : `${formatFee(v)}원`}</td>)}
              <td className="whitespace-nowrap px-4 py-4 text-slate-500">{item.updateDate || '—'}</td>
              <td className={`${stickyActionCell} bg-white py-4`}><div className="flex gap-1">
                {item.deletedAt ? <button className={buttonStyle} disabled={busy} onClick={() => confirm({ type: 'restoreItem', id: item.id }, '항목 복원', `${item.name}을 복원하면 홈페이지에 다시 공개됩니다.`)}>복원</button> : <>
                  <button className={buttonStyle} disabled={busy} onClick={() => edit(item)}>수정</button>
                  <button className={buttonStyle} disabled={busy} onClick={() => confirm({ type: 'deleteItem', id: item.id }, '항목 삭제', `${item.name}을 홈페이지에서 제외합니다. 삭제된 항목에서 복원할 수 있습니다.`)}>삭제</button>
                  <button aria-label={`${item.name} 위로`} className={buttonStyle} disabled={busy || index === 0} onClick={() => save({ type: 'moveItem', id: item.id, direction: -1 })}>↑</button>
                  <button aria-label={`${item.name} 아래로`} className={buttonStyle} disabled={busy || index === siblings.length - 1} onClick={() => save({ type: 'moveItem', id: item.id, direction: 1 })}>↓</button>
                </>}
              </div></td>
            </tr>;
          })}{!rows.length && <tr><td colSpan={7} className="p-12 text-center text-slate-500">해당하는 항목이 없습니다.</td></tr>}</tbody>
        </table>
      </div>
    </>}
    {tab === 'groups' && <div className="space-y-4">
      <p className="text-sm text-slate-600">대분류와 분류 이름을 변경하거나 추가할 수 있습니다. 이름과 순서를 저장하면 홈페이지에도 반영됩니다.</p>
      <form className="flex flex-wrap items-end gap-2 rounded-xl border bg-white p-4" onSubmit={e => { e.preventDefault(); const title = String(new FormData(e.currentTarget).get('title') ?? ''); confirm({ type: 'saveSection', title }, '대분류 추가', `‘${title}’ 대분류를 추가합니다.`); }}>
        <label className="flex-1 text-sm font-semibold">새 대분류 이름<input name="title" required maxLength={150} className={fieldStyle} placeholder="예: 검사료" /></label><button disabled={busy} className={primaryStyle}>대분류 추가</button>
      </form>
      {catalog.sections.map((section, si) => <section key={section.id} className="rounded-xl border border-slate-200 bg-white p-4">
        <form className="mb-4 flex flex-wrap items-end gap-2" onSubmit={e => { e.preventDefault(); const title = String(new FormData(e.currentTarget).get('title') ?? ''); confirm({ type: 'saveSection', id: section.id, title }, '대분류 이름 변경', `${section.title} → ${title}`); }}>
          <label className="min-w-48 flex-1 text-sm font-semibold">대분류 이름<input name="title" defaultValue={section.title} key={section.title} required maxLength={150} className={fieldStyle} /></label><button className={buttonStyle} disabled={busy}>이름 저장</button>
          <button type="button" className={buttonStyle} disabled={busy || si === 0} aria-label={`${section.title} 위로`} onClick={() => save({ type: 'moveSection', id: section.id, direction: -1 })}>↑</button>
          <button type="button" className={buttonStyle} disabled={busy || si === catalog.sections.length - 1} aria-label={`${section.title} 아래로`} onClick={() => save({ type: 'moveSection', id: section.id, direction: 1 })}>↓</button>
        </form>
        <div className="space-y-2 border-l-2 border-blue-100 pl-4">{section.groups.map((group, gi) => <form key={group.id} className="flex flex-wrap items-end gap-2" onSubmit={e => { e.preventDefault(); const name = String(new FormData(e.currentTarget).get('name') ?? ''); confirm({ type: 'saveGroup', id: group.id, sectionId: section.id, name }, '분류 이름 변경', `${group.name} → ${name}`); }}>
          <label className="min-w-40 flex-1 text-xs text-slate-600">분류 이름<input name="name" defaultValue={group.name} key={group.name} className={fieldStyle} required maxLength={150} /></label><button disabled={busy} className={buttonStyle}>이름 저장</button>
          <button type="button" className={buttonStyle} disabled={busy || gi === 0} aria-label={`${group.name} 위로`} onClick={() => save({ type: 'moveGroup', id: group.id, direction: -1 })}>↑</button>
          <button type="button" className={buttonStyle} disabled={busy || gi === section.groups.length - 1} aria-label={`${group.name} 아래로`} onClick={() => save({ type: 'moveGroup', id: group.id, direction: 1 })}>↓</button>
        </form>)}
        <form className="flex items-end gap-2 pt-2" onSubmit={e => { e.preventDefault(); const name = String(new FormData(e.currentTarget).get('name') ?? ''); confirm({ type: 'saveGroup', sectionId: section.id, name }, '분류 추가', `${section.title}에 ‘${name}’ 분류를 추가합니다.`); }}><label className="flex-1 text-xs text-slate-600">새 분류 이름<input name="name" className={fieldStyle} required maxLength={150} /></label><button className={buttonStyle} disabled={busy}>분류 추가</button></form>
        </div>
      </section>)}
    </div>}
    {tab === 'history' && <div className="space-y-3">
      <p className="text-sm text-slate-600">최근 100건을 표시합니다. 전체 이력은 엑셀의 ‘변경 내역’ 시트에서 확인할 수 있습니다.</p>
      {!history.length && <p className="rounded-xl border bg-white p-8 text-slate-500">아직 변경 이력이 없습니다.</p>}
      {history.map(h => <details key={h.id} className="rounded-xl border border-slate-200 bg-white p-4"><summary className="cursor-pointer text-sm"><strong className="mr-3">{h.action}</strong>{h.label}<span className="ml-3 text-slate-500">{new Date(h.created_at).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</span></summary><div className="mt-4 grid gap-4 text-sm sm:grid-cols-2"><div className="rounded-lg bg-slate-50 p-3"><h3 className="mb-2 font-semibold">변경 전</h3><p className="break-words leading-relaxed">{historyDescription(h.before_value)}</p></div><div className="rounded-lg bg-blue-50 p-3"><h3 className="mb-2 font-semibold">변경 후</h3><p className="break-words leading-relaxed">{historyDescription(h.after_value)}</p></div></div></details>)}
    </div>}
    {editor && <Modal title={preview ? '변경 내용 확인' : editor.id ? '비급여 항목 수정' : '비급여 항목 추가'} busy={busy} close={() => { setEditor(null); setPreview(null); setError(''); }}>
      {alert}
      {preview ? <>
        <p className="mb-4 text-sm text-slate-600">저장하면 홈페이지와 다음 엑셀 다운로드에 반영됩니다.</p>
        <div className="overflow-x-auto"><table className="w-full text-left text-sm"><thead><tr><th className="p-2">항목</th><th className="p-2">변경 전</th><th className="p-2">변경 후</th></tr></thead><tbody>
          {(Object.keys(feeFieldLabels) as (keyof FeeDraft)[]).map(key => {
            const original = catalog.items.find(i => i.id === editor.id);
            if (original && original[key] === preview[key]) return null;
            const display = (v: string | number | null | undefined) => key === 'groupId' ? catalog.sections.flatMap(s => s.groups).find(g => g.id === v)?.name ?? '—' : typeof v === 'number' ? `${formatFee(v)}원` : v || '—';
            return <tr key={key} className="border-t"><th className="p-2 font-medium">{feeFieldLabels[key]}</th><td className="max-w-60 break-words p-2 text-slate-500">{display(original?.[key])}</td><td className="max-w-60 break-words bg-yellow-50 p-2">{display(preview[key])}</td></tr>;
          })}
        </tbody></table></div>
        <div className="mt-6 flex justify-end gap-2"><button disabled={busy} onClick={() => setPreview(null)} className={buttonStyle}>계속 수정</button><button disabled={busy} onClick={() => save({ type: 'saveItem', id: editor.id, item: preview })} className={primaryStyle}>{busy ? '저장 중…' : '저장하고 홈페이지 반영'}</button></div>
      </> : <form onSubmit={e => {
        e.preventDefault(); setError('');
        try { setPreview(validateFeeDraft({ ...editor.values, cost: parseFee(editor.values.cost), minCost: parseFee(editor.values.minCost), maxCost: parseFee(editor.values.maxCost) }, catalog)); }
        catch (e) { setError(e instanceof Error ? e.message : '입력 내용을 확인해주세요.'); }
      }}>
        <div className="grid gap-4 sm:grid-cols-2">
          {(Object.keys(feeFieldLabels) as (keyof FeeDraft)[]).map(key => <label key={key} className={`text-sm font-semibold ${['name', 'note'].includes(key) ? 'sm:col-span-2' : ''}`}>{feeFieldLabels[key]}{['groupId', 'name'].includes(key) ? ' *' : ''}
            {key === 'groupId' ? <select required value={editor.values[key]} onChange={e => setEditor({ ...editor, values: { ...editor.values, [key]: e.target.value } })} className={fieldStyle}><option value="">분류 선택</option>{catalog.sections.map(s => <optgroup key={s.id} label={s.title}>{s.groups.map(g => <option key={g.id} value={g.id}>{g.name}</option>)}</optgroup>)}</select>
              : key === 'note' ? <textarea rows={3} maxLength={2000} value={editor.values[key]} onChange={e => setEditor({ ...editor, values: { ...editor.values, [key]: e.target.value } })} className={fieldStyle} />
              : <input type={key === 'updateDate' ? 'date' : 'text'} inputMode={['cost', 'minCost', 'maxCost'].includes(key) ? 'numeric' : undefined} required={key === 'name'} maxLength={key === 'name' ? 300 : 100} value={editor.values[key]} onChange={e => setEditor({ ...editor, values: { ...editor.values, [key]: e.target.value } })} onBlur={() => {
                if (['cost', 'minCost', 'maxCost'].includes(key)) { try { setEditor({ ...editor, values: { ...editor.values, [key]: formatFee(parseFee(editor.values[key])) } }); } catch { /* Validation on review retains the original input. */ } }
              }} className={fieldStyle} placeholder={['materialIncluded', 'drugIncluded'].includes(key) ? '예: O, X, 포함' : undefined} />}
          </label>)}
        </div>
        <p className="mt-4 text-xs text-slate-500">금액 단위는 원입니다. 빈 금액과 0원은 구분됩니다. 변경일은 오늘 날짜가 기본값이며 필요하면 수정할 수 있습니다.</p>
        <div className="mt-6 flex justify-end"><button className={primaryStyle}>변경 내용 확인</button></div>
      </form>}
    </Modal>}
    {confirmation && <Modal title={confirmation.title} busy={busy} close={() => { setConfirmation(null); setError(''); }}>{alert}<p className="text-sm leading-relaxed">{confirmation.message}</p><div className="mt-6 flex justify-end gap-2"><button className={buttonStyle} disabled={busy} onClick={() => setConfirmation(null)}>취소</button><button className={primaryStyle} disabled={busy} onClick={() => save(confirmation.command)}>{busy ? '저장 중…' : '확인하고 반영'}</button></div></Modal>}
  </div>;
}
