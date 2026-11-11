'use client';

import { useCallback, useEffect, useId, useLayoutEffect, useRef, useState, type ReactNode, type TextareaHTMLAttributes } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Check, ChevronDown, ChevronUp, CircleHelp, Eye, Heading, Image as ImageIcon, ImagePlus, List, BookOpen, Plus, Quote, Table, Trash2, TriangleAlert, UploadCloud, X } from 'lucide-react';
import { discardAdminHealthUpload, saveAdminHealthArticle } from '@/app/admin/(dashboard)/health/actions';
import HealthArticleView from '@/components/HealthArticleView';
import {
  HEALTH_CATEGORIES,
  HEALTH_PUBLISH_SLOTS,
  HEALTH_REVIEWERS,
  HEALTH_THUMBNAIL_PRESETS,
  HEALTH_TREATMENT_LINKS,
  type HealthCategoryId,
  type HealthThumbnailPosition,
} from '@/lib/healthArticles';
import type { AdminHealthArticle } from '@/lib/healthArticleRecord';
import {
  emptySection,
  healthFormPublish,
  healthFormToArticle,
  newKey,
  toHealthForm,
  type FaqForm,
  type FormState,
  type ImageForm,
  type ReferenceForm,
  type SectionForm,
} from '@/lib/healthArticleForm';
import { isGeneratedHealthSlug, suggestHealthSlug } from '@/lib/healthSlug';
import { MAX_NEWS_IMAGE_SIZE, validateUploadFiles } from '@/lib/imageUploadRules';

// 관리자가 건강정보 글을 쓰는 화면입니다. 네이버 블로그 글쓰기처럼 흰 종이에 제목과 본문을 바로 적고,
// 주소·분류·썸네일 같은 설정은 '발행' 버튼을 눌렀을 때 나오는 창에서 정합니다.
// 저장되는 글의 틀(요약·단락·표·FAQ)은 그대로라서 홈페이지 화면과 검색용 데이터는 바뀌지 않습니다.

const inputClass = 'w-full rounded-lg border border-slate-200 bg-white px-3.5 py-2.5 text-sm outline-none transition focus:border-emerald-500 focus:ring-2 focus:ring-emerald-100 disabled:bg-slate-50';
const labelClass = 'mb-1.5 block text-[13px] font-bold text-slate-800';
const hintClass = 'mt-1.5 text-xs leading-5 text-slate-500';
// 종이 위에 바로 쓰는 칸: 테두리 없이 글자만 보입니다.
const bareClass = 'block w-full resize-none border-0 bg-transparent p-0 outline-none placeholder:text-slate-300 focus:ring-0';
const blockLabelClass = 'mb-2 flex items-center justify-between text-xs font-bold text-slate-400';

/** 내용 길이에 맞춰 스스로 늘어나는 입력 칸 (스크롤 막대 없이 종이처럼 씁니다) */
function AutoTextarea({ value, className = '', ...props }: TextareaHTMLAttributes<HTMLTextAreaElement> & { value: string }) {
  const ref = useRef<HTMLTextAreaElement>(null);
  useLayoutEffect(() => {
    const element = ref.current;
    if (!element) return;
    element.style.height = 'auto';
    element.style.height = `${element.scrollHeight}px`;
  }, [value]);
  return <textarea ref={ref} rows={1} value={value} className={`${bareClass} overflow-hidden ${className}`} {...props} />;
}

/** 위쪽 도구 모음 단추 (아이콘 + 이름) */
function ToolButton({ label, hint, disabled, onClick, children }: { label: string; hint: string; disabled?: boolean; onClick: () => void; children: ReactNode }) {
  // onMouseDown 을 막아 두어, 단추를 눌러도 쓰던 칸의 커서가 사라지지 않습니다.
  return <button type="button" title={hint} disabled={disabled} onMouseDown={(event) => event.preventDefault()} onClick={onClick} className="flex min-w-[52px] shrink-0 flex-col items-center gap-1 rounded-lg px-2 py-1.5 text-[11px] font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-900 disabled:opacity-40">{children}<span>{label}</span></button>;
}

// 표는 '칸 | 칸' 한 줄씩 저장합니다. 화면에서는 실제 표 모양 칸으로 보여 줍니다.
const parseTable = (value: string) => value.split('\n').map((line) => (line.includes(' | ') || !line.includes('|') ? line.split(' | ') : line.split('|').map((cell) => cell.trim())));
const joinTable = (rows: string[][]) => rows.map((row) => row.join(' | ')).join('\n');
const EMPTY_TABLE = joinTable([['', '', ''], ['', '', ''], ['', '', '']]);

function TableGrid({ value, onChange }: { value: string; onChange: (next: string) => void }) {
  const parsed = parseTable(value);
  const width = Math.max(2, ...parsed.map((row) => row.length));
  const rows = parsed.map((row) => [...row, ...Array<string>(width - row.length).fill('')]);
  const update = (next: string[][]) => onChange(joinTable(next));
  const small = 'rounded-md bg-slate-100 px-2.5 py-1.5 text-xs font-bold text-slate-600 hover:bg-slate-200 disabled:opacity-40';
  return <div>
    <div className="overflow-x-auto">
      <table className="w-full border-collapse text-sm">
        <tbody>
          {rows.map((row, r) => <tr key={r}>
            {row.map((cell, c) => <td key={c} className={`border border-slate-200 p-0 ${r === 0 ? 'bg-slate-50' : 'bg-white'}`}>
              <input aria-label={`${r + 1}번째 줄 ${c + 1}번째 칸`} value={cell} maxLength={r === 0 ? 60 : 300}
                onChange={(event) => update(rows.map((line, i) => i === r ? line.map((item, j) => j === c ? event.target.value.replace(/\|/g, '') : item) : line))}
                placeholder={r === 0 ? '머리글' : ''} className={`w-full min-w-[90px] bg-transparent px-3 py-2.5 outline-none focus:bg-emerald-50/60 ${r === 0 ? 'font-bold' : ''}`} />
            </td>)}
          </tr>)}
        </tbody>
      </table>
    </div>
    <div className="mt-2 flex flex-wrap gap-1.5">
      <button type="button" disabled={rows.length >= 31} onClick={() => update([...rows, Array<string>(width).fill('')])} className={small}>+ 줄</button>
      <button type="button" disabled={rows.length <= 2} onClick={() => update(rows.slice(0, -1))} className={small}>− 줄</button>
      <button type="button" disabled={width >= 6} onClick={() => update(rows.map((row) => [...row, '']))} className={small}>+ 칸</button>
      <button type="button" disabled={width <= 2} onClick={() => update(rows.map((row) => row.slice(0, -1)))} className={small}>− 칸</button>
      <span className="self-center text-xs text-slate-400">첫 줄은 머리글입니다. 빈 칸 없이 채워 주세요.</span>
    </div>
  </div>;
}

type Draft = { version: 1; savedAt: string; baseUpdatedAt: string; form: FormState };

function readDraft(raw: string | null, baseUpdatedAt: string): Draft | null {
  if (!raw || raw.length > 400_000) return null;
  try {
    const draft = JSON.parse(raw) as Draft;
    if (draft.version !== 1 || draft.baseUpdatedAt !== baseUpdatedAt || !Array.isArray(draft.form?.sections) || !draft.form.heroImage) return null;
    return draft;
  } catch { return null; }
}

/** 이미지 한 장(대표·단락)을 올리고, 설명(alt)과 보여 줄 부분을 정하는 칸 */
function ImageField({ idPrefix, label, image, uploading, disabled, onUpload, onChange, onRemove }: {
  idPrefix: string; label: string; image: ImageForm; uploading: boolean; disabled: boolean;
  onUpload: (file: File) => void; onChange: (patch: Partial<ImageForm>) => void; onRemove: () => void;
}) {
  const fileInput = <input type="file" aria-label={`${label} 파일`} accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) onUpload(file); event.target.value = ''; }} />;
  if (!image.src) {
    return <label className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-8 text-sm font-bold text-slate-500 ${disabled ? 'pointer-events-none opacity-50' : 'hover:border-emerald-300 hover:bg-emerald-50/50'}`}>
      <UploadCloud size={20} />{uploading ? '올리는 중…' : `${label} 올리기`}{fileInput}
    </label>;
  }
  return <figure className="space-y-3">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={image.src} alt="" className="aspect-[16/9] w-full rounded-lg bg-slate-100 object-cover" style={{ objectPosition: image.position }} />
    <input id={`${idPrefix}-alt`} aria-label={`${label} 설명`} maxLength={150} value={image.alt} onChange={(event) => onChange({ alt: event.target.value })} placeholder="사진 설명을 적어 주세요 (필수) 예: 허리 통증으로 진료 상담을 받는 중년 남성" className="w-full border-0 border-b border-slate-200 bg-transparent px-0 py-2 text-center text-sm text-slate-600 outline-none placeholder:text-slate-300 focus:border-emerald-500" />
    <div className="flex flex-wrap items-center justify-center gap-2">
      <label className="flex items-center gap-2 text-xs font-bold text-slate-500"><input type="checkbox" checked={image.position === 'right'} onChange={(event) => onChange({ position: event.target.checked ? 'right' : 'center' })} className="h-4 w-4 accent-emerald-600" /> 오른쪽 부분을 보여 주기</label>
      <label className={`inline-flex cursor-pointer items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-xs font-bold text-slate-700 ${disabled ? 'pointer-events-none opacity-50' : ''}`}><UploadCloud size={14} /> 바꾸기{fileInput}</label>
      <button type="button" onClick={onRemove} className="inline-flex items-center gap-1 rounded-lg px-3 py-1.5 text-xs font-bold text-rose-600 hover:bg-rose-50"><X size={14} /> 빼기</button>
    </div>
  </figure>;
}

function move<T>(items: T[], index: number, delta: number) {
  const next = [...items];
  const to = index + delta;
  if (to < 0 || to >= next.length) return items;
  [next[index], next[to]] = [next[to], next[index]];
  return next;
}

export default function AdminHealthEditor({ initialArticle, otherArticles }: {
  initialArticle?: AdminHealthArticle;
  otherArticles: Array<{ slug: string; title: string }>;
}) {
  const router = useRouter();
  const formId = useId();
  const editing = Boolean(initialArticle);
  const draftKey = `ys-health-draft:${initialArticle?.slug ?? 'new'}`;
  const baseUpdatedAt = initialArticle?.updatedAt ?? '';
  const [form, setForm] = useState<FormState>(() => toHealthForm(initialArticle));
  const latest = useRef(form);
  useEffect(() => { latest.current = form; }, [form]);
  const dirty = useRef(false);
  const saved = useRef(false);
  const [recoverable, setRecoverable] = useState<Draft | null>(null);
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [uploading, setUploading] = useState(0);
  const preview = useRef<HTMLDialogElement>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  // '발행' 창(주소·분류·썸네일·공개 방식)
  const [panelOpen, setPanelOpen] = useState(false);
  const [draftSavedAt, setDraftSavedAt] = useState('');
  // 도구 모음의 강조 문장·목록·표·사진은 마지막으로 쓰던 단락에 들어갑니다.
  const [activeKey, setActiveKey] = useState(() => form.sections[0]?.key ?? '');
  // 내용이 없어도 화면에 꺼내 둔 선택 칸들 (예: '단락키:lead', 'hero', 'faq')
  const [opened, setOpened] = useState<string[]>([]);
  const heroInput = useRef<HTMLInputElement>(null);
  const sectionImageInput = useRef<HTMLInputElement>(null);
  const open = (name: string) => setOpened((current) => (current.includes(name) ? current : [...current, name]));
  const close = (name: string) => setOpened((current) => current.filter((item) => item !== name));

  const change = useCallback((patch: Partial<FormState>) => {
    dirty.current = true;
    setForm((current) => ({ ...current, ...patch }));
  }, []);
  const changeSection = (key: string, patch: Partial<SectionForm>) => change({ sections: form.sections.map((section) => section.key === key ? { ...section, ...patch } : section) });
  const changeFaq = (key: string, patch: Partial<FaqForm>) => change({ faq: form.faq.map((item) => item.key === key ? { ...item, ...patch } : item) });
  const changeReference = (key: string, patch: Partial<ReferenceForm>) => change({ references: form.references.map((item) => item.key === key ? { ...item, ...patch } : item) });
  const toggle = (list: string[], value: string) => list.includes(value) ? list.filter((item) => item !== value) : [...list, value];

  useEffect(() => {
    let draft: Draft | null = null;
    try { draft = readDraft(localStorage.getItem(draftKey), baseUpdatedAt); } catch { /* Storage can be disabled. */ }
    // 서버에서 받은 글을 몰래 덮어쓰지 않도록, 임시보관 글은 관리자가 고를 때만 불러옵니다.
    setRecoverable(draft);
  }, [draftKey, baseUpdatedAt]);
  useEffect(() => {
    if (!dirty.current || saved.current) return;
    const timeout = window.setTimeout(() => {
      try {
        localStorage.setItem(draftKey, JSON.stringify({ version: 1, savedAt: new Date().toISOString(), baseUpdatedAt, form } satisfies Draft));
        setDraftSavedAt(new Date().toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' }));
      }
      catch { /* The editor still works without a draft. */ }
    }, 700);
    return () => window.clearTimeout(timeout);
  }, [form, draftKey, baseUpdatedAt]);
  useEffect(() => {
    const unload = (event: BeforeUnloadEvent) => { if (dirty.current && !saved.current) { event.preventDefault(); event.returnValue = ''; } };
    window.addEventListener('beforeunload', unload);
    return () => window.removeEventListener('beforeunload', unload);
  }, []);

  function restore() {
    if (!recoverable) return;
    dirty.current = true;
    setForm(recoverable.form);
    setRecoverable(null);
  }
  function discardDraft() {
    if (!window.confirm('이 브라우저에 임시보관한 작성 내용을 버릴까요?')) return;
    try { localStorage.removeItem(draftKey); } catch { /* Keep editing available. */ }
    for (const url of recoverable?.form.uploadedUrls ?? []) void discardAdminHealthUpload(url);
    setRecoverable(null);
  }

  /** 이미지를 Storage에 올리고 주소를 돌려줍니다. 실패하면 화면에 오류를 띄우고 null 입니다. */
  async function uploadImage(file: File): Promise<string | null> {
    const problem = validateUploadFiles([file], MAX_NEWS_IMAGE_SIZE);
    if (problem || !file.size) { setError(problem || '빈 이미지 파일은 올릴 수 없습니다.'); return null; }
    setUploading((n) => n + 1);
    setError('');
    try {
      const response = await fetch('/api/admin/health/images', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ mime: file.type, size: file.size }) });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '이미지 업로드를 시작하지 못했습니다.');
      const body = new FormData();
      body.append('cacheControl', '3600');
      body.append('', file);
      const upload = await fetch(data.uploadUrl, { method: 'PUT', headers: { 'x-upsert': 'false' }, body });
      if (!upload.ok) throw new Error('이미지 업로드에 실패했습니다. 다시 시도해주세요.');
      change({ uploadedUrls: [...latest.current.uploadedUrls, data.publicUrl] });
      return data.publicUrl as string;
    } catch (err) {
      setError(err instanceof Error ? err.message : '이미지 업로드에 실패했습니다.');
      return null;
    } finally { setUploading((n) => n - 1); }
  }
  /** 저장 전에 다시 바꾼 업로드 파일은 바로 정리합니다. */
  function releaseUpload(url: string) {
    if (url && latest.current.uploadedUrls.includes(url)) void discardAdminHealthUpload(url);
  }
  async function uploadHero(file: File) {
    const url = await uploadImage(file);
    if (!url) return;
    releaseUpload(latest.current.heroImage.src);
    change({ heroImage: { ...latest.current.heroImage, src: url, position: 'center' } });
  }
  async function uploadThumbnail(file: File) {
    const url = await uploadImage(file);
    if (!url) return;
    releaseUpload(latest.current.thumbnail);
    change({ thumbnail: url, thumbnailPosition: 'center' });
  }
  async function uploadSectionImage(key: string, file: File) {
    const url = await uploadImage(file);
    if (!url) return;
    const target = latest.current.sections.find((section) => section.key === key);
    if (target) releaseUpload(target.image.src);
    change({ sections: latest.current.sections.map((section) => section.key === key ? { ...section, image: { ...section.image, src: url, position: 'center' } } : section) });
  }
  function choosePreset(src: string, position: HealthThumbnailPosition) {
    releaseUpload(form.thumbnail);
    change({ thumbnail: src, thumbnailPosition: position });
  }

  const locked = pending || uploading > 0;
  const takenSlugs = otherArticles.map((article) => article.slug);
  const activeSection = form.sections.find((section) => section.key === activeKey) ?? form.sections[form.sections.length - 1];
  const activeId = `${formId}-s${activeSection ? form.sections.indexOf(activeSection) : 0}`;

  /** 선택 칸을 꺼내고, 그 칸으로 커서를 옮깁니다. */
  function reveal(name: string, focusId?: string) {
    open(name);
    if (focusId) window.setTimeout(() => document.getElementById(focusId)?.focus(), 0);
  }
  function addSection() {
    const section = emptySection();
    change({ sections: [...form.sections, section] });
    setActiveKey(section.key);
    window.setTimeout(() => document.getElementById(`${formId}-s${form.sections.length}-heading`)?.focus(), 0);
  }

  /** 저장 직전에 비워 둔 칸을 채웁니다: 내용 없는 단락은 빼고, 주소·목록 설명은 자동으로 정합니다. */
  function prepare(current: FormState): FormState | string {
    if (!current.title.trim()) return '제목을 입력해주세요.';
    const summary = current.summary.split('\n').map((line) => line.trim()).filter(Boolean);
    if (!summary.length) return '핵심 요약을 입력해주세요. 제목 바로 아래 칸입니다.';
    const filled = current.sections.filter((section) => section.heading.trim() || section.lead.trim() || section.paragraphs.trim() || section.bullets.trim() || section.table.replace(/[|\s]/g, '') || section.image.src);
    const sections = filled.length ? filled : current.sections.slice(0, 1);
    const missing = sections.findIndex((section) => !section.heading.trim());
    if (missing >= 0) return `${missing + 1}번째 단락의 소제목을 입력해주세요.`;
    const stamp = new Date().toISOString().slice(0, 10).replace(/-/g, '');
    return {
      ...current,
      sections,
      // 주소를 비워 두면 제목에서 영문 주소를 추천해 쓰고, 알아볼 낱말이 없을 때만 날짜 주소를 씁니다.
      slug: current.slug.trim() || suggestHealthSlug(current.title, current.keywords, takenSlugs) || `health-${stamp}-${Math.random().toString(36).slice(2, 6)}`,
      description: current.description.trim() || summary.join(' ').slice(0, 150),
    };
  }

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked) return;
    const ready = prepare(latest.current);
    if (typeof ready === 'string') { setError(ready); return; }
    // 자동으로 정한 주소는 화면에도 넣어 두어, 저장에 실패해 다시 눌러도 같은 주소를 씁니다.
    if (ready.slug !== latest.current.slug) change({ slug: ready.slug });
    setPending(true);
    setError('');
    try {
      const result = await saveAdminHealthArticle(JSON.stringify({ article: healthFormToArticle(ready), ...healthFormPublish(ready) }), initialArticle?.slug ?? null, initialArticle?.updatedAt ?? null);
      if (!result.success) { setError(result.error); return; }
      saved.current = true;
      dirty.current = false;
      try { localStorage.removeItem(draftKey); } catch { /* Successful server save is authoritative. */ }
      router.push(`/admin/health?saved=${result.slug}${result.warning ? '&cleanup=pending' : ''}`);
      router.refresh();
    } catch { setError('저장 요청에 실패했습니다. 연결 상태를 확인하고 다시 시도해주세요.'); }
    finally { setPending(false); }
  }

  const previewArticle = healthFormToArticle(form);
  const isPreset = HEALTH_THUMBNAIL_PRESETS.some((preset) => preset.src === form.thumbnail);
  const showHero = Boolean(form.heroImage.src) || opened.includes('hero');
  const showWarning = Boolean(form.warningSigns.trim()) || opened.includes('warning');
  const showFaq = form.faq.some((item) => item.question.trim() || item.answer.trim()) || opened.includes('faq');
  const showReferences = form.references.some((item) => item.label.trim()) || opened.includes('references');
  const submitLabel = pending ? '저장 중…' : form.publishMode === 'draft' ? '임시저장' : form.publishMode === 'schedule' ? '예약 발행' : editing && initialArticle?.isPublished ? '수정 저장' : '발행';
  // 발행 전에 스스로 확인하는 검색 노출 점검표입니다. 저장을 막지는 않습니다.
  const titleLength = form.title.trim().length;
  const descriptionLength = form.description.trim().length;
  const keywordList = form.keywords.split(/[,\n]/).map((item) => item.trim()).filter(Boolean);
  const squash = (value: string) => value.replace(/\s+/g, '').toLowerCase();
  const seoChecks: Array<{ ok: boolean; label: string; tip: string }> = [
    { ok: titleLength >= 15 && titleLength <= 40, label: `제목 15~40자 (지금 ${titleLength}자)`, tip: '너무 짧으면 검색어가 부족하고, 길면 검색 결과에서 잘립니다.' },
    { ok: descriptionLength >= 60 && descriptionLength <= 130, label: `목록 설명 80~120자 (지금 ${descriptionLength}자)`, tip: descriptionLength ? '검색 결과 제목 아래에 보이는 문구입니다.' : '비워 두면 핵심 요약 앞부분이 들어갑니다. 직접 쓰면 더 좋습니다.' },
    { ok: keywordList.length >= 3, label: `검색어 3개 이상 (지금 ${keywordList.length}개)`, tip: '환자가 실제로 검색할 표현을 띄어쓰기·의학 용어를 달리해 적어 주세요.' },
    // '무릎 연골'처럼 여러 낱말이면 낱말이 모두 제목에 있으면 됩니다(붙어 있지 않아도 됩니다).
    { ok: keywordList.length > 0 && keywordList[0].split(/\s+/).every((word) => squash(form.title).includes(squash(word))), label: '첫 번째 검색어가 제목에 들어 있음', tip: '가장 중요한 검색어를 맨 앞에 적고, 그 낱말을 제목에도 넣어 주세요.' },
    { ok: Boolean(form.slug) && !isGeneratedHealthSlug(form.slug), label: '내용이 드러나는 영문 주소', tip: "'제목으로 추천'을 누르거나 직접 적어 주세요. 등록 후에는 바꿀 수 없습니다." },
    { ok: form.sections.filter((section) => section.heading.trim()).length >= 3, label: '소제목 3개 이상', tip: '소제목은 목차가 되고, 검색엔진이 글의 짜임을 읽는 기준이 됩니다.' },
    { ok: Boolean(form.heroImage.src && form.heroImage.alt.trim()), label: '대표사진과 사진 설명', tip: '검색 결과와 공유 미리보기에 큰 사진이 나옵니다.' },
    { ok: form.faq.filter((item) => item.question.trim() && item.answer.trim()).length >= 2, label: '질문답변 2개 이상', tip: 'AI 검색과 네이버가 답변으로 인용하기 좋은 형식입니다.' },
    { ok: form.relatedTreatments.length > 0, label: '진료 안내 연결 1개 이상', tip: '글에서 병원 진료 페이지로 이어지는 링크가 생깁니다.' },
    ...(otherArticles.length ? [{ ok: form.relatedSlugs.length > 0, label: '함께 읽으면 좋은 글 1개 이상', tip: '글끼리 이어져 있으면 검색엔진이 더 잘 찾아 읽습니다.' }] : []),
    { ok: form.reviewed, label: '의료진 검토 완료', tip: '건강 글은 누가 검토했는지가 신뢰도에 크게 반영됩니다. 실제로 검토했을 때만 체크하세요.' },
  ];
  const seoPassed = seoChecks.filter((check) => check.ok).length;
  const removeButton = 'rounded p-1 text-slate-400 hover:bg-rose-50 hover:text-rose-600';

  // 한 줄 칸에서 Enter 를 눌러도 글이 저장되지 않게 합니다. 저장은 발행 창의 단추로만 합니다.
  return <form onSubmit={submit} onKeyDown={(event) => { if (event.key === 'Enter' && event.target instanceof HTMLInputElement) event.preventDefault(); }} className="flex min-h-full flex-col bg-[#f5f6f8]">
    {/* 맨 위 줄: 목록으로 · 자동 임시보관 · 미리보기 · 발행 */}
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white">
      <div className="flex items-center justify-between gap-3 px-4 py-3 md:px-6">
        <div className="flex min-w-0 items-center gap-3">
          <Link href="/admin/health" aria-label="글 목록으로" className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 hover:text-slate-900"><ArrowLeft size={20} /></Link>
          <h1 className="truncate text-base font-black text-slate-900 md:text-lg">{editing ? '건강정보 글 수정' : '건강정보 글쓰기'}</h1>
        </div>
        <div className="flex shrink-0 items-center gap-2">
          {draftSavedAt && <span className="hidden text-xs text-slate-400 sm:inline">{draftSavedAt} 자동 임시보관</span>}
          <button type="button" onClick={() => { setPreviewOpen(true); preview.current?.showModal(); }} className="inline-flex items-center gap-1.5 rounded-md border border-slate-200 bg-white px-3.5 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50"><Eye size={16} /> 미리보기</button>
          <button type="button" onClick={() => setPanelOpen(true)} className="inline-flex items-center gap-1.5 rounded-md bg-[#03c75a] px-5 py-2 text-sm font-bold text-white hover:bg-[#02b351]">발행</button>
        </div>
      </div>
      {/* 도구 모음: 본문에 넣을 것을 고릅니다. */}
      <div className="flex items-center gap-0.5 overflow-x-auto border-t border-slate-100 px-3 py-1.5 md:px-5">
        <ToolButton label="대표사진" hint="글 맨 위에 보이는 큰 사진을 올립니다" disabled={locked} onClick={() => heroInput.current?.click()}><ImageIcon size={20} /></ToolButton>
        <ToolButton label="소제목" hint="새 단락(소제목 + 본문)을 맨 아래에 추가합니다" disabled={locked || form.sections.length >= 20} onClick={addSection}><Heading size={20} /></ToolButton>
        <span className="mx-1.5 h-8 w-px shrink-0 bg-slate-200" />
        <ToolButton label="강조문장" hint="쓰고 있는 단락의 소제목 아래에 굵은 한 문장을 넣습니다" disabled={locked || !activeSection} onClick={() => activeSection && reveal(`${activeSection.key}:lead`, `${activeId}-lead`)}><Quote size={20} /></ToolButton>
        <ToolButton label="목록" hint="쓰고 있는 단락에 글머리 목록을 넣습니다" disabled={locked || !activeSection} onClick={() => activeSection && reveal(`${activeSection.key}:bullets`, `${activeId}-bullets`)}><List size={20} /></ToolButton>
        <ToolButton label="표" hint="쓰고 있는 단락에 비교표를 넣습니다" disabled={locked || !activeSection} onClick={() => { if (!activeSection) return; if (!activeSection.table) changeSection(activeSection.key, { table: EMPTY_TABLE }); reveal(`${activeSection.key}:table`, `${activeId}-table-caption`); }}><Table size={20} /></ToolButton>
        <ToolButton label="사진" hint="쓰고 있는 단락에 사진을 넣습니다" disabled={locked || !activeSection} onClick={() => sectionImageInput.current?.click()}><ImagePlus size={20} /></ToolButton>
        <span className="mx-1.5 h-8 w-px shrink-0 bg-slate-200" />
        <ToolButton label="주의신호" hint="'이럴 때는 바로 진료를 받으세요' 목록을 넣습니다" disabled={locked} onClick={() => reveal('warning', 'health-warning')}><TriangleAlert size={20} /></ToolButton>
        <ToolButton label="질문답변" hint="자주 묻는 질문(FAQ)을 넣습니다" disabled={locked} onClick={() => reveal('faq', `${formId}-faq-0`)}><CircleHelp size={20} /></ToolButton>
        <ToolButton label="참고문헌" hint="참고한 논문·자료를 적습니다" disabled={locked} onClick={() => reveal('references', `${formId}-reference-0`)}><BookOpen size={20} /></ToolButton>
        {uploading > 0 && <span className="ml-3 shrink-0 text-xs font-bold text-emerald-600">사진 올리는 중…</span>}
        <input ref={heroInput} type="file" aria-label="대표 사진 파일" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadHero(file); event.target.value = ''; }} />
        <input ref={sectionImageInput} type="file" aria-label="단락 사진 파일" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file && activeSection) void uploadSectionImage(activeSection.key, file); event.target.value = ''; }} />
      </div>
    </header>

    <div className="mx-auto w-full max-w-[900px] flex-1 px-0 pb-24 sm:px-6">
      {recoverable && <div role="status" className="mx-4 mt-5 rounded-xl border border-amber-200 bg-amber-50 p-4 sm:mx-0"><p className="text-sm font-bold text-amber-900">쓰다 만 글이 있습니다. ({new Date(recoverable.savedAt).toLocaleString('ko-KR')})</p><div className="mt-2.5 flex gap-2"><button type="button" onClick={restore} className="rounded-lg bg-amber-900 px-4 py-2 text-sm font-bold text-white">이어서 쓰기</button><button type="button" onClick={discardDraft} className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-amber-900">버리기</button></div></div>}
      {error && !panelOpen && <div role="alert" className="mx-4 mt-5 rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-700 sm:mx-0">{error}</div>}

      {/* 글을 쓰는 흰 종이 */}
      <fieldset disabled={locked} className="mt-5 min-h-[70vh] min-w-0 bg-white px-6 py-10 shadow-sm ring-1 ring-slate-200/70 sm:rounded-sm sm:px-16 sm:py-14">
        <legend className="sr-only">글 내용</legend>
        <AutoTextarea id="health-title" aria-label="제목" maxLength={120} value={form.title} onChange={(event) => change({ title: event.target.value.replace(/\n/g, '') })} placeholder="제목" className="text-[28px] font-bold leading-snug text-slate-900 sm:text-[34px]" />
        <p className="mt-2 text-xs text-slate-400">환자가 실제로 검색하는 질문 형태로 쓰면 좋습니다. 예: 무릎이 붓고 계단 내려갈 때 아프면 연골 문제일까요?</p>
        <hr className="my-7 border-slate-200" />

        {showHero && <div className="mb-9">
          <ImageField idPrefix={`${formId}-hero`} label="대표 사진" image={form.heroImage} uploading={uploading > 0} disabled={locked}
            onUpload={(file) => void uploadHero(file)}
            onChange={(patch) => change({ heroImage: { ...form.heroImage, ...patch } })}
            onRemove={() => { releaseUpload(form.heroImage.src); change({ heroImage: { src: '', alt: '', position: 'center' } }); close('hero'); }} />
        </div>}

        <div className="rounded-lg bg-[#f3f8f5] px-5 py-4">
          <p className="mb-1.5 text-xs font-bold text-emerald-700">핵심 요약</p>
          <AutoTextarea id="health-summary" aria-label="핵심 요약" value={form.summary} onChange={(event) => change({ summary: event.target.value })} placeholder="질문에 대한 답을 2~4문장으로 먼저 적어 주세요. 줄을 바꾸면 목록으로 보입니다." className="text-[15px] leading-7 text-slate-800" />
        </div>

        {form.sections.map((section, index) => {
          // 칸 이름은 순서 번호로 짓습니다. (단락 키는 서버와 브라우저에서 서로 달라 이름으로 쓸 수 없습니다.)
          const id = `${formId}-s${index}`;
          const showLead = Boolean(section.lead) || opened.includes(`${section.key}:lead`);
          const showBullets = Boolean(section.bullets) || opened.includes(`${section.key}:bullets`);
          const showTable = Boolean(section.table);
          const isActive = activeSection?.key === section.key;
          return <section key={section.key} aria-label={`${index + 1}번째 단락`} onFocusCapture={() => setActiveKey(section.key)} className={`group relative mt-10 border-l-2 pl-5 transition-colors ${isActive ? 'border-emerald-400' : 'border-transparent'}`}>
            <div className="flex items-start gap-2">
              <input id={`${id}-heading`} aria-label={`${index + 1}번째 소제목`} maxLength={120} value={section.heading} onChange={(event) => changeSection(section.key, { heading: event.target.value })} placeholder="소제목" className={`${bareClass} text-[22px] font-bold leading-snug text-slate-900`} />
              <div className="flex shrink-0 gap-0.5 opacity-40 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
                <button type="button" aria-label={`${index + 1}번째 단락 위로`} disabled={index === 0} onClick={() => change({ sections: move(form.sections, index, -1) })} className="rounded p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-25"><ChevronUp size={17} /></button>
                <button type="button" aria-label={`${index + 1}번째 단락 아래로`} disabled={index === form.sections.length - 1} onClick={() => change({ sections: move(form.sections, index, 1) })} className="rounded p-1.5 text-slate-500 hover:bg-slate-100 disabled:opacity-25"><ChevronDown size={17} /></button>
                <button type="button" aria-label={`${index + 1}번째 단락 삭제`} disabled={form.sections.length === 1} onClick={() => { if (window.confirm(`${index + 1}번째 단락을 지울까요?`)) { releaseUpload(section.image.src); change({ sections: form.sections.filter((item) => item.key !== section.key) }); } }} className="rounded p-1.5 text-slate-500 hover:bg-rose-50 hover:text-rose-600 disabled:opacity-25"><Trash2 size={16} /></button>
              </div>
            </div>

            {showLead && <div className="mt-3 flex items-start gap-2 border-l-4 border-slate-300 pl-3">
              <AutoTextarea id={`${id}-lead`} aria-label={`${index + 1}번째 단락 강조 문장`} maxLength={300} value={section.lead} onChange={(event) => changeSection(section.key, { lead: event.target.value.replace(/\n/g, '') })} placeholder="소제목 바로 아래 굵게 보이는 한 문장" className="text-[16px] font-bold leading-7 text-slate-800" />
              <button type="button" aria-label="강조 문장 빼기" onClick={() => { changeSection(section.key, { lead: '' }); close(`${section.key}:lead`); }} className={removeButton}><X size={15} /></button>
            </div>}

            <AutoTextarea id={`${id}-paragraphs`} aria-label={`${index + 1}번째 단락 본문`} value={section.paragraphs} onChange={(event) => changeSection(section.key, { paragraphs: event.target.value })} placeholder="내용을 입력하세요. 빈 줄을 하나 넣으면 문단이 나뉩니다." className="mt-3 min-h-[84px] text-[16px] leading-8 text-slate-800" />

            {showBullets && <div className="mt-4 rounded-lg border border-slate-200 p-4">
              <p className={blockLabelClass}><span>목록 · 한 줄에 한 항목</span><button type="button" aria-label="목록 빼기" onClick={() => { changeSection(section.key, { bullets: '' }); close(`${section.key}:bullets`); }} className={removeButton}><X size={15} /></button></p>
              <AutoTextarea id={`${id}-bullets`} aria-label={`${index + 1}번째 단락 목록`} value={section.bullets} onChange={(event) => changeSection(section.key, { bullets: event.target.value })} placeholder={'첫 번째 항목\n두 번째 항목'} className="min-h-[56px] text-[15px] leading-7 text-slate-800" />
            </div>}

            {showTable && <div className="mt-4 rounded-lg border border-slate-200 p-4">
              <p className={blockLabelClass}><span>표</span><button type="button" aria-label="표 빼기" onClick={() => { if (window.confirm('표를 지울까요?')) { changeSection(section.key, { table: '', tableCaption: '' }); close(`${section.key}:table`); } }} className={removeButton}><X size={15} /></button></p>
              <input id={`${id}-table-caption`} aria-label={`${index + 1}번째 단락 표 제목`} maxLength={120} value={section.tableCaption} onChange={(event) => changeSection(section.key, { tableCaption: event.target.value })} placeholder="표 제목 (필수) 예: 허리디스크와 척추관협착증의 일반적인 차이" className={`${bareClass} mb-3 text-sm font-bold text-slate-800`} />
              <TableGrid value={section.table} onChange={(table) => changeSection(section.key, { table })} />
            </div>}

            {section.image.src && <div className="mt-5">
              <ImageField idPrefix={`${id}-image`} label={`${index + 1}번째 단락 사진`} image={section.image} uploading={uploading > 0} disabled={locked}
                onUpload={(file) => void uploadSectionImage(section.key, file)}
                onChange={(patch) => changeSection(section.key, { image: { ...section.image, ...patch } })}
                onRemove={() => { releaseUpload(section.image.src); changeSection(section.key, { image: { src: '', alt: '', position: 'center' } }); }} />
            </div>}
          </section>;
        })}

        <button type="button" disabled={form.sections.length >= 20} onClick={addSection} className="mt-10 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-slate-300 py-3 text-sm font-bold text-slate-400 transition hover:border-emerald-400 hover:text-emerald-600 disabled:opacity-40"><Plus size={16} /> 소제목 추가</button>

        {showWarning && <div className="mt-10 rounded-lg border border-rose-100 bg-rose-50/50 p-5">
          <p className={`${blockLabelClass} !text-rose-500`}><span>이럴 때는 바로 진료를 받으세요 · 한 줄에 한 항목</span><button type="button" aria-label="주의 신호 빼기" onClick={() => { change({ warningSigns: '' }); close('warning'); }} className={removeButton}><X size={15} /></button></p>
          <AutoTextarea id="health-warning" aria-label="바로 진료가 필요한 신호" value={form.warningSigns} onChange={(event) => change({ warningSigns: event.target.value })} placeholder="예: 소변이나 대변을 보기 어렵거나 참기 어려울 때" className="min-h-[56px] text-[15px] leading-7 text-slate-800" />
        </div>}

        {showFaq && <div className="mt-10">
          <p className={blockLabelClass}><span>자주 묻는 질문</span><button type="button" aria-label="자주 묻는 질문 빼기" onClick={() => { if (window.confirm('자주 묻는 질문을 모두 지울까요?')) { change({ faq: [{ key: newKey(), question: '', answer: '' }] }); close('faq'); } }} className={removeButton}><X size={15} /></button></p>
          <div className="divide-y divide-slate-200 border-y border-slate-200">
            {form.faq.map((item, index) => <div key={item.key} className="flex gap-3 py-4">
              <span className="pt-0.5 text-[17px] font-black text-emerald-600">Q</span>
              <div className="min-w-0 flex-1 space-y-1.5">
                <input id={`${formId}-faq-${index}`} aria-label={`${index + 1}번째 질문`} maxLength={200} value={item.question} onChange={(event) => changeFaq(item.key, { question: event.target.value })} placeholder="질문" className={`${bareClass} text-[16px] font-bold text-slate-900`} />
                <AutoTextarea aria-label={`${index + 1}번째 질문의 답변`} maxLength={2000} value={item.answer} onChange={(event) => changeFaq(item.key, { answer: event.target.value })} placeholder="답변" className="text-[15px] leading-7 text-slate-700" />
              </div>
              <div className="flex shrink-0 flex-col gap-0.5">
                <button type="button" aria-label={`${index + 1}번째 질문 위로`} disabled={index === 0} onClick={() => change({ faq: move(form.faq, index, -1) })} className="rounded p-1 text-slate-400 hover:bg-slate-100 disabled:opacity-25"><ChevronUp size={15} /></button>
                <button type="button" aria-label={`${index + 1}번째 질문 아래로`} disabled={index === form.faq.length - 1} onClick={() => change({ faq: move(form.faq, index, 1) })} className="rounded p-1 text-slate-400 hover:bg-slate-100 disabled:opacity-25"><ChevronDown size={15} /></button>
                <button type="button" aria-label={`${index + 1}번째 질문 삭제`} disabled={form.faq.length === 1} onClick={() => change({ faq: form.faq.filter((faq) => faq.key !== item.key) })} className={`${removeButton} disabled:opacity-25`}><X size={15} /></button>
              </div>
            </div>)}
          </div>
          <button type="button" disabled={form.faq.length >= 20} onClick={() => change({ faq: [...form.faq, { key: newKey(), question: '', answer: '' }] })} className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-emerald-600 disabled:opacity-40"><Plus size={15} /> 질문 추가</button>
        </div>}

        {showReferences && <div className="mt-10">
          <p className={blockLabelClass}><span>참고문헌</span><button type="button" aria-label="참고문헌 빼기" onClick={() => { change({ references: [{ key: newKey(), label: '', url: '' }] }); close('references'); }} className={removeButton}><X size={15} /></button></p>
          <div className="space-y-2">
            {form.references.map((item, index) => <div key={item.key} className="flex flex-col gap-2 sm:flex-row sm:items-center">
              <input id={`${formId}-reference-${index}`} aria-label={`${index + 1}번째 참고문헌`} maxLength={400} value={item.label} onChange={(event) => changeReference(item.key, { label: event.target.value })} placeholder="저자. 제목. 학술지. 연도." className={`${inputClass} sm:flex-[2]`} />
              <input aria-label={`${index + 1}번째 참고문헌 링크`} type="url" value={item.url} onChange={(event) => changeReference(item.key, { url: event.target.value })} placeholder="https://… (선택)" className={`${inputClass} sm:flex-1`} />
              <button type="button" aria-label={`${index + 1}번째 참고문헌 삭제`} disabled={form.references.length === 1} onClick={() => change({ references: form.references.filter((reference) => reference.key !== item.key) })} className={`${removeButton} self-end disabled:opacity-25 sm:self-center`}><X size={15} /></button>
            </div>)}
          </div>
          <button type="button" disabled={form.references.length >= 20} onClick={() => change({ references: [...form.references, { key: newKey(), label: '', url: '' }] })} className="mt-3 inline-flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-emerald-600 disabled:opacity-40"><Plus size={15} /> 참고문헌 추가</button>
        </div>}
      </fieldset>
      <p className="mx-4 mt-4 text-xs leading-5 text-slate-400 sm:mx-0">치료 효과를 보장하거나 다른 병원과 비교하는 표현, 출처 없는 수치는 의료법상 쓸 수 없습니다.</p>
    </div>

    {/* 발행 창: 글 내용 말고 정해야 하는 것들을 모았습니다. */}
    {panelOpen && <div className="fixed inset-0 z-40 bg-slate-950/40" onClick={() => setPanelOpen(false)} aria-hidden />}
    <aside aria-label="발행 설정" className={`fixed inset-y-0 right-0 z-50 flex w-full max-w-[460px] flex-col bg-white shadow-2xl transition-transform duration-300 ${panelOpen ? 'translate-x-0' : 'pointer-events-none invisible translate-x-full'}`}>
      <div className="flex items-center justify-between border-b border-slate-200 px-5 py-4"><h2 className="font-black text-slate-900">발행 설정</h2><button type="button" aria-label="발행 설정 닫기" onClick={() => setPanelOpen(false)} className="rounded-lg p-2 text-slate-500 hover:bg-slate-100"><X size={20} /></button></div>
      <fieldset disabled={locked} className="min-w-0 flex-1 space-y-6 overflow-y-auto px-5 py-5">
        <legend className="sr-only">발행 설정</legend>
        <div>
          <p className={labelClass}>공개 방식</p>
          <div className="grid grid-cols-3 gap-2">
            {([['draft', '임시저장'], ['now', editing && initialArticle?.isPublished ? '공개 유지' : '지금 공개'], ['schedule', '예약 발행']] as const).map(([mode, label]) => <label key={mode} className="cursor-pointer rounded-lg border border-slate-200 py-2.5 text-center text-sm font-bold text-slate-600 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50 has-[:checked]:text-emerald-700"><input type="radio" name="publish-mode" checked={form.publishMode === mode} onChange={() => change({ publishMode: mode })} className="sr-only" />{label}</label>)}
          </div>
          {form.publishMode === 'schedule' && <div className="mt-2 flex gap-2">
            <input type="date" aria-label="예약 날짜" value={form.publishDate} onChange={(event) => change({ publishDate: event.target.value })} className={inputClass} />
            <select aria-label="예약 시간" value={form.publishTime} onChange={(event) => change({ publishTime: event.target.value })} className={`${inputClass} w-32`}>
              {[...new Set([...HEALTH_PUBLISH_SLOTS, form.publishTime])].sort().map((time) => <option key={time} value={time}>{time}</option>)}
            </select>
          </div>}
          <p className={hintClass}>{form.publishMode === 'draft' ? '관리자만 볼 수 있습니다.' : form.publishMode === 'now' ? '저장하면 바로 홈페이지에 보입니다.' : '정한 시각이 지나면 10분 안에 홈페이지에 올라갑니다.'}</p>
        </div>
        <div>
          <label htmlFor="health-category" className={labelClass}>분류</label>
          <select id="health-category" value={form.category} onChange={(event) => change({ category: event.target.value as HealthCategoryId })} className={inputClass}>
            {Object.entries(HEALTH_CATEGORIES).map(([id, category]) => <option key={id} value={id}>{category.name} 건강</option>)}
          </select>
        </div>

        <div>
          <p className={labelClass}>목록 썸네일</p>
          <div className="grid grid-cols-3 gap-2">
            <button type="button" aria-pressed={!form.thumbnail} onClick={() => choosePreset('', 'center')} className={`overflow-hidden rounded-lg border text-left text-[11px] font-bold ${!form.thumbnail ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200 hover:border-emerald-300'}`}>
              {form.heroImage.src
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={form.heroImage.src} alt="" className="aspect-[168/140] w-full object-cover" style={{ objectPosition: form.heroImage.position }} />
                : <span className="flex aspect-[168/140] items-center justify-center bg-slate-50 text-slate-400">대표사진 없음</span>}
              <span className="block truncate px-2 py-1.5 text-slate-600">대표사진 사용</span>
            </button>
            {HEALTH_THUMBNAIL_PRESETS.map((preset) => <button key={preset.src} type="button" aria-pressed={form.thumbnail === preset.src} onClick={() => choosePreset(preset.src, preset.position)} className={`overflow-hidden rounded-lg border text-left text-[11px] font-bold ${form.thumbnail === preset.src ? 'border-emerald-500 ring-2 ring-emerald-100' : 'border-slate-200 hover:border-emerald-300'}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preset.src} alt="" className="aspect-[168/140] w-full object-cover" style={{ objectPosition: preset.position }} />
              <span className="block truncate px-2 py-1.5 text-slate-600">{preset.label}</span>
            </button>)}
            {form.thumbnail && !isPreset && <div className="overflow-hidden rounded-lg border border-emerald-500 text-[11px] font-bold ring-2 ring-emerald-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.thumbnail} alt="" className="aspect-[168/140] w-full object-cover" style={{ objectPosition: form.thumbnailPosition }} />
              <span className="block truncate px-2 py-1.5 text-slate-600">직접 올린 사진</span>
            </div>}
            <label className={`flex aspect-[168/140] cursor-pointer flex-col items-center justify-center gap-1.5 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-2 text-center text-[11px] font-bold text-slate-500 ${locked ? 'pointer-events-none opacity-50' : 'hover:border-emerald-300 hover:bg-emerald-50/50'}`}>
              <UploadCloud size={20} />{uploading ? '올리는 중…' : '직접 올리기'}
              <input type="file" aria-label="썸네일 이미지 파일" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadThumbnail(file); event.target.value = ''; }} />
            </label>
          </div>
          {form.thumbnail && !isPreset && <label className="mt-2 flex items-center gap-2 text-xs font-bold text-slate-600"><input type="checkbox" checked={form.thumbnailPosition === 'right'} onChange={(event) => change({ thumbnailPosition: event.target.checked ? 'right' : 'center' })} className="h-4 w-4 accent-emerald-600" /> 사진의 오른쪽 부분을 보여 주기</label>}
        </div>

        <div className="space-y-3 rounded-lg border border-slate-200 bg-slate-50/60 p-4">
          <label className="flex items-center gap-2.5 text-sm font-bold text-slate-800"><input type="checkbox" checked={form.reviewed} onChange={(event) => change({ reviewed: event.target.checked })} className="h-4 w-4 accent-emerald-600" /> 의료진 검토 완료</label>
          <p className="text-xs leading-5 text-slate-500">실제로 의료진이 내용을 확인했을 때만 체크하세요. 체크하면 글에 &quot;○○○ 원장 검토&quot;가 표시됩니다.</p>
          {form.reviewed && <div className="grid grid-cols-2 gap-3">
            <div>
              <label htmlFor="health-reviewer" className={labelClass}>검토 의료진</label>
              <select id="health-reviewer" value={form.reviewerId} onChange={(event) => change({ reviewerId: event.target.value })} className={inputClass}>
                {Object.values(HEALTH_REVIEWERS).map((reviewer) => <option key={reviewer.id} value={reviewer.id}>{reviewer.name} {reviewer.jobTitle} ({reviewer.specialty})</option>)}
              </select>
            </div>
            <div>
              <label htmlFor="health-reviewed" className={labelClass}>검토일</label>
              <input id="health-reviewed" type="date" value={form.reviewedAt} onChange={(event) => change({ reviewedAt: event.target.value })} className={inputClass} />
            </div>
          </div>}
        </div>

        <div>
          <p className={labelClass}>연세척병원 진료 안내 연결</p>
          <div className="flex flex-wrap gap-1.5">
            {HEALTH_TREATMENT_LINKS.map((link) => <label key={link.path} className="cursor-pointer rounded-full border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-600 has-[:checked]:border-emerald-500 has-[:checked]:bg-emerald-50 has-[:checked]:text-emerald-700"><input type="checkbox" checked={form.relatedTreatments.includes(link.path)} onChange={() => change({ relatedTreatments: toggle(form.relatedTreatments, link.path) })} className="sr-only" />{link.name}</label>)}
          </div>
        </div>

        {otherArticles.length > 0 && <div>
          <p className={labelClass}>함께 읽으면 좋은 글 <span className="font-medium text-slate-400">(최대 6개)</span></p>
          <div className="max-h-48 space-y-1 overflow-y-auto rounded-lg border border-slate-200 p-2">
            {otherArticles.map((article) => <label key={article.slug} className="flex items-center gap-2 rounded px-2 py-1.5 text-sm text-slate-700 hover:bg-slate-50"><input type="checkbox" checked={form.relatedSlugs.includes(article.slug)} disabled={!form.relatedSlugs.includes(article.slug) && form.relatedSlugs.length >= 6} onChange={() => change({ relatedSlugs: toggle(form.relatedSlugs, article.slug) })} className="h-4 w-4 shrink-0 accent-emerald-600" /><span className="line-clamp-1">{article.title}</span></label>)}
          </div>
        </div>}

        <div className="rounded-lg border border-slate-200 p-4">
          <p className="flex items-center justify-between text-sm font-bold text-slate-800"><span>검색 노출 점검</span><span className={seoPassed === seoChecks.length ? 'text-emerald-600' : 'text-slate-400'}>{seoPassed} / {seoChecks.length}</span></p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-slate-100"><div className="h-full rounded-full bg-[#03c75a] transition-[width] duration-300" style={{ width: `${(seoPassed / seoChecks.length) * 100}%` }} /></div>
          <ul className="mt-3 space-y-2">
            {seoChecks.map((check) => <li key={check.label} className="flex items-start gap-2 text-[13px] leading-5">
              <span aria-hidden className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full ${check.ok ? 'bg-[#03c75a] text-white' : 'border border-slate-300'}`}>{check.ok && <Check size={11} strokeWidth={3} />}</span>
              <span className={check.ok ? 'text-slate-500' : 'text-slate-800'}><span className={check.ok ? '' : 'font-bold'}>{check.label}</span><span className="sr-only">{check.ok ? ' (완료)' : ' (확인 필요)'}</span>{!check.ok && <span className="block text-xs text-slate-500">{check.tip}</span>}</span>
            </li>)}
          </ul>
          <p className="mt-3 text-xs text-slate-400">채우지 않아도 저장할 수 있습니다. 많이 채울수록 검색에 유리합니다.</p>
        </div>

        <details className="rounded-lg border border-slate-200 p-4" open>
          <summary className="cursor-pointer text-sm font-bold text-slate-800">검색 노출 설정 <span className="font-medium text-slate-400">(비워 두면 자동)</span></summary>
          <div className="mt-4 space-y-4">
            <div>
              <div className="flex items-center justify-between"><label htmlFor="health-slug" className={labelClass}>주소 (영문)</label>{!editing && <button type="button" onClick={() => { const slug = suggestHealthSlug(form.title, form.keywords, takenSlugs); if (slug) change({ slug }); else setError('제목에서 영문으로 바꿀 낱말을 찾지 못했습니다. 주소를 직접 적어 주세요.'); }} className="mb-1.5 text-xs font-bold text-emerald-600 hover:underline">제목으로 추천</button>}</div>
              <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 pl-3 text-sm text-slate-500 focus-within:border-emerald-500 focus-within:ring-2 focus-within:ring-emerald-100">
                /health/
                <input id="health-slug" readOnly={editing} maxLength={80} value={form.slug} onChange={(event) => change({ slug: event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })} placeholder="knee-swelling-cartilage" className="min-w-0 flex-1 rounded-r-lg bg-white px-2 py-2.5 text-slate-900 outline-none read-only:bg-slate-50 read-only:text-slate-500" />
              </div>
              <p className={hintClass}>{editing ? '등록한 글의 주소는 바꿀 수 없습니다.' : '영문 소문자·숫자·하이픈(-)만 씁니다. 비워 두면 제목에서 자동으로 추천해 정합니다. 등록 후에는 바꿀 수 없으니 발행 전에 확인해 주세요.'}</p>
            </div>
            <div>
              <label htmlFor="health-description" className={labelClass}>목록 설명</label>
              <textarea id="health-description" rows={3} maxLength={300} value={form.description} onChange={(event) => change({ description: event.target.value })} placeholder="비워 두면 핵심 요약 앞부분을 씁니다" className={inputClass} />
              <p className={hintClass}>건강정보 목록과 검색 결과에 보이는 설명입니다. 80~120자가 알맞습니다. ({form.description.trim().length}자)</p>
            </div>
            <div>
              <label htmlFor="health-keywords" className={labelClass}>검색어</label>
              <input id="health-keywords" value={form.keywords} onChange={(event) => change({ keywords: event.target.value })} placeholder="무릎 연골, 무릎 붓기, 연골연화증" className={inputClass} />
              <p className={hintClass}>쉼표(,)로 구분합니다.</p>
            </div>
            <div>
              <label htmlFor="health-seo-title" className={labelClass}>검색 결과 제목</label>
              <input id="health-seo-title" maxLength={120} value={form.seoTitle} onChange={(event) => change({ seoTitle: event.target.value })} placeholder="비워 두면 제목을 그대로 씁니다" className={inputClass} />
            </div>
          </div>
        </details>

      </fieldset>
      <div className="space-y-3 border-t border-slate-200 px-5 py-4">
        {error && <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-3 text-sm leading-6 text-rose-700">{error}</div>}
        <button type="submit" disabled={locked} className="flex w-full items-center justify-center gap-2 rounded-lg bg-[#03c75a] py-3.5 text-sm font-bold text-white hover:bg-[#02b351] disabled:opacity-50"><Check size={17} />{submitLabel}</button>
      </div>
    </aside>

    <dialog ref={preview} aria-labelledby="health-preview-title" onClose={() => setPreviewOpen(false)} className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-5xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl backdrop:bg-slate-950/50">
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-200 bg-white p-4"><h2 id="health-preview-title" className="font-bold text-slate-900">저장 전 미리보기</h2><button type="button" aria-label="미리보기 닫기" onClick={() => preview.current?.close()} className="rounded-lg p-2 hover:bg-slate-100"><X size={20} /></button></div>
      {previewOpen && <div className="py-3"><HealthArticleView article={previewArticle} relatedArticles={otherArticles.filter((article) => form.relatedSlugs.includes(article.slug))} /></div>}
    </dialog>
  </form>;
}
