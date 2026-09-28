import type { NonCoveredSection } from '@/app/(public)/non-covered/data';

export interface FeeGroup { id: string; name: string }
export interface FeeSection { id: string; title: string; groups: FeeGroup[] }
export interface FeeItem {
  id: string; groupId: string; name: string; code: string; division: string;
  cost: number | null; minCost: number | null; maxCost: number | null;
  materialIncluded: string; drugIncluded: string; note: string; updateDate: string;
  deletedAt: string | null;
}
export type FeeDraft = Omit<FeeItem, 'id' | 'deletedAt'>;
export interface FeeCatalog { sections: FeeSection[]; items: FeeItem[]; publishedDate: string }
export interface FeeSnapshot { version: number; content: FeeCatalog }
export interface FeeHistory {
  id: number; version: number; action: string; label: string;
  before_value: unknown; after_value: unknown; created_at: string;
}
export type FeeCommand =
  | { type: 'saveItem'; id?: string; item: FeeDraft }
  | { type: 'deleteItem' | 'restoreItem'; id: string }
  | { type: 'moveItem' | 'moveSection' | 'moveGroup'; id: string; direction: -1 | 1 }
  | { type: 'saveSection'; id?: string; title: string }
  | { type: 'saveGroup'; id?: string; sectionId: string; name: string };

export const feeFieldLabels: Record<keyof FeeDraft, string> = {
  groupId: '분류', name: '명칭', code: '코드', division: '구분', cost: '비용',
  minCost: '최저비용', maxCost: '최고비용', materialIncluded: '치료재료대 포함여부',
  drugIncluded: '약제비 포함여부', note: '특이사항', updateDate: '변경일',
};
export function koreaDate(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Seoul', year: 'numeric', month: '2-digit', day: '2-digit' }).format(now);
}
export function formatFee(value: number | null) { return value === null ? '' : value.toLocaleString('ko-KR'); }
export function parseFee(value: string): number | null {
  const plain = value.trim();
  if (!plain) return null;
  if (!/^\d+$/.test(plain) && !/^\d{1,3}(,\d{3})+$/.test(plain)) throw new Error('금액은 0 이상의 정수로 입력해주세요.');
  const number = Number(plain.replaceAll(',', ''));
  if (!Number.isSafeInteger(number) || number > 999_999_999) throw new Error('금액은 999,999,999원 이하로 입력해주세요.');
  return number;
}
function text(value: unknown, label: string, max: number, required = false) {
  if (typeof value !== 'string') throw new Error(`${label} 입력을 확인해주세요.`);
  const result = value.trim();
  if ((required && !result) || result.length > max) throw new Error(`${label}은 ${required ? '1~' : ''}${max}자 이내로 입력해주세요.`);
  return result;
}
export function validateFeeDraft(input: FeeDraft, catalog: FeeCatalog): FeeDraft {
  if (!input || typeof input !== 'object') throw new Error('항목 내용을 확인해주세요.');
  const groupId = text(input.groupId, '분류', 100, true);
  if (!catalog.sections.some(s => s.groups.some(g => g.id === groupId))) throw new Error('분류를 선택해주세요.');
  const result: FeeDraft = {
    groupId, name: text(input.name, '명칭', 300, true), code: text(input.code, '코드', 100),
    division: text(input.division, '구분', 100), note: text(input.note, '특이사항', 2000),
    materialIncluded: text(input.materialIncluded, '치료재료대 포함여부', 100),
    drugIncluded: text(input.drugIncluded, '약제비 포함여부', 100),
    updateDate: text(input.updateDate, '변경일', 10), cost: null, minCost: null, maxCost: null,
  };
  for (const key of ['cost', 'minCost', 'maxCost'] as const) {
    const value = input[key];
    if (value !== null && (typeof value !== 'number' || !Number.isSafeInteger(value) || value < 0 || value > 999_999_999)) throw new Error(`${feeFieldLabels[key]}을 확인해주세요.`);
    result[key] = value;
  }
  if (result.cost === null && result.minCost === null && result.maxCost === null) throw new Error('비용 또는 최저·최고비용을 입력해주세요.');
  if (result.minCost !== null && result.maxCost !== null && result.minCost > result.maxCost) throw new Error('최저비용은 최고비용보다 클 수 없습니다.');
  if (result.updateDate && (!/^\d{4}-\d{2}-\d{2}$/.test(result.updateDate) || Number.isNaN(Date.parse(result.updateDate)) || new Date(result.updateDate).toISOString().slice(0, 10) !== result.updateDate)) throw new Error('올바른 변경일을 입력해주세요.');
  return result;
}
export function orderedFeeItems(catalog: FeeCatalog, includeDeleted = false) {
  return catalog.sections.flatMap(section => section.groups.flatMap(group =>
    catalog.items.filter(item => item.groupId === group.id && (includeDeleted || !item.deletedAt))
      .map(item => ({ ...item, sectionTitle: section.title, categoryName: group.name }))));
}
export function publicFeeSections(catalog: FeeCatalog): NonCoveredSection[] {
  return catalog.sections.map(section => ({ title: section.title, groups: section.groups.map(group => ({
    categoryName: group.name,
    items: catalog.items.filter(i => i.groupId === group.id && !i.deletedAt).map(i => ({
      name: i.name, code: i.code, division: i.division, cost: formatFee(i.cost), minCost: formatFee(i.minCost), maxCost: formatFee(i.maxCost),
      materialIncluded: i.materialIncluded, drugIncluded: i.drugIncluded, note: i.note, updateDate: i.updateDate.replaceAll('-', '.'),
    })),
  })).filter(group => group.items.length > 0) }));
}

/** One versioned catalogue write also creates the audit record in the database transaction. */
export function applyFeeCommand(catalog: FeeCatalog, command: FeeCommand, newId: string, now = new Date()) {
  const next = structuredClone(catalog);
  let action = '', label = '';
  let before: unknown = null, after: unknown = null;
  if (!command || typeof command !== 'object') throw new Error('요청을 확인해주세요.');
  const move = <T extends { id: string }>(list: T[], id: string, direction: -1 | 1) => {
    if (direction !== -1 && direction !== 1) throw new Error('이동 방향을 확인해주세요.');
    const index = list.findIndex(i => i.id === id), target = index + direction;
    if (index < 0 || target < 0 || target >= list.length) throw new Error('더 이상 이동할 수 없습니다.');
    [list[index], list[target]] = [list[target], list[index]];
  };
  if (command.type === 'saveItem') {
    const draft = validateFeeDraft(command.item, next);
    const existing = command.id ? next.items.find(i => i.id === command.id && !i.deletedAt) : undefined;
    if (command.id && !existing) throw new Error('수정할 항목을 찾을 수 없습니다.');
    before = existing ? structuredClone(existing) : null;
    const item: FeeItem = { ...draft, id: existing?.id ?? newId, deletedAt: null };
    if (existing) next.items[next.items.indexOf(existing)] = item; else next.items.push(item);
    after = item; label = item.name; action = existing ? '수정' : '추가';
  } else if (command.type === 'deleteItem' || command.type === 'restoreItem' || command.type === 'moveItem') {
    const item = next.items.find(i => i.id === command.id);
    if (!item) throw new Error('항목을 찾을 수 없습니다.');
    label = item.name; before = structuredClone(item);
    if (command.type === 'moveItem') {
      if (item.deletedAt) throw new Error('삭제한 항목은 이동할 수 없습니다.');
      const siblings = next.items.filter(i => i.groupId === item.groupId && !i.deletedAt);
      before = siblings.map(i => ({ id: i.id, name: i.name }));
      move(siblings, item.id, command.direction);
      let n = 0;
      next.items = next.items.map(i => i.groupId === item.groupId && !i.deletedAt ? siblings[n++] : i);
      after = siblings.map(i => ({ id: i.id, name: i.name })); action = '순서 변경';
    } else {
      if (command.type === 'deleteItem' && item.deletedAt) throw new Error('이미 삭제된 항목입니다.');
      if (command.type === 'restoreItem' && !item.deletedAt) throw new Error('이미 공개 중인 항목입니다.');
      item.deletedAt = command.type === 'deleteItem' ? now.toISOString() : null;
      after = structuredClone(item); action = command.type === 'deleteItem' ? '삭제' : '복원';
    }
  } else if (command.type === 'saveSection') {
    const title = text(command.title, '대분류 이름', 150, true);
    const section = next.sections.find(s => s.id === command.id);
    if (command.id && !section) throw new Error('대분류를 찾을 수 없습니다.');
    before = section ? structuredClone(section) : null;
    if (section) section.title = title;
    else next.sections.push({ id: newId, title, groups: [] });
    after = section ?? next.sections.at(-1); label = title; action = '분류 수정';
  } else if (command.type === 'saveGroup') {
    const section = next.sections.find(s => s.id === command.sectionId);
    if (!section) throw new Error('대분류를 선택해주세요.');
    const name = text(command.name, '분류 이름', 150, true);
    const group = section.groups.find(g => g.id === command.id);
    if (command.id && !group) throw new Error('분류를 찾을 수 없습니다.');
    before = group ? structuredClone(group) : null;
    if (group) group.name = name; else section.groups.push({ id: newId, name });
    after = group ?? section.groups.at(-1); label = `${section.title} / ${name}`; action = '분류 수정';
  } else if (command.type === 'moveSection') {
    before = next.sections.map(s => ({ id: s.id, title: s.title }));
    label = next.sections.find(s => s.id === command.id)?.title ?? '';
    move(next.sections, command.id, command.direction);
    after = next.sections.map(s => ({ id: s.id, title: s.title })); action = '순서 변경';
  } else if (command.type === 'moveGroup') {
    const section = next.sections.find(s => s.groups.some(g => g.id === command.id));
    if (!section) throw new Error('분류를 찾을 수 없습니다.');
    before = structuredClone(section.groups); label = section.groups.find(g => g.id === command.id)!.name;
    move(section.groups, command.id, command.direction); after = structuredClone(section.groups); action = '순서 변경';
  } else throw new Error('지원하지 않는 요청입니다.');
  if (JSON.stringify(before) === JSON.stringify(after)) throw new Error('변경된 내용이 없습니다.');
  next.publishedDate = koreaDate(now);
  const describeGroup = (value: unknown) => {
    if (!value || typeof value !== 'object' || !('groupId' in value)) return value;
    const section = next.sections.find(s => s.groups.some(g => g.id === value.groupId));
    const group = section?.groups.find(g => g.id === value.groupId);
    return { ...value, categoryName: section && group ? `${section.title} / ${group.name}` : '' };
  };
  return { content: next, action, label, before: describeGroup(before), after: describeGroup(after) };
}

export function historyDescription(value: unknown): string {
  if (value === null || value === undefined) return '없음';
  if (Array.isArray(value)) return value.map(v => historyDescription(v)).join(' → ');
  if (typeof value !== 'object') return String(value);
  const data = value as Record<string, unknown>;
  return Object.entries(data).filter(([key]) => !['id', 'groupId', 'groups'].includes(key)).map(([key, val]) => {
    const label = feeFieldLabels[key as keyof FeeDraft] || ({ deletedAt: '삭제일', title: '대분류', categoryName: '분류' } as Record<string, string>)[key] || key;
    return `${label}: ${val === null || val === '' ? '—' : typeof val === 'number' ? formatFee(val) : String(val)}`;
  }).join(' / ');
}
