'use client';

import { useCallback, useEffect, useId, useRef, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowDown, ArrowLeft, ArrowUp, Check, Eye, Plus, Trash2, UploadCloud, X } from 'lucide-react';
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
import { MAX_NEWS_IMAGE_SIZE, validateUploadFiles } from '@/lib/imageUploadRules';

// 관리자가 건강정보 글을 칸별로 채워 쓰는 화면입니다.
// 글은 화면·구조화 데이터가 같은 틀을 쓰므로 자유 서식 대신 정해진 칸(요약·단락·표·FAQ)으로 받습니다.

const inputClass = 'w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50';
const cardClass = 'space-y-5 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-8';
const labelClass = 'mb-2 block text-sm font-bold';
const hintClass = 'mt-1.5 text-xs leading-5 text-slate-500';

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
    return <label className={`flex cursor-pointer items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-5 text-sm font-bold text-slate-600 ${disabled ? 'pointer-events-none opacity-50' : 'hover:border-blue-300 hover:bg-blue-50'}`}>
      <UploadCloud size={20} />{uploading ? '올리는 중…' : `${label} 올리기`}{fileInput}
    </label>;
  }
  return <div className="grid gap-4 sm:grid-cols-[220px_minmax(0,1fr)]">
    {/* eslint-disable-next-line @next/next/no-img-element */}
    <img src={image.src} alt="" className="aspect-[16/9] w-full rounded-lg bg-slate-100 object-cover" style={{ objectPosition: image.position }} />
    <div className="space-y-3">
      <div>
        <label htmlFor={`${idPrefix}-alt`} className="mb-1.5 block text-xs font-bold text-slate-600">이미지 설명 (alt) <span className="text-rose-500">*</span></label>
        <input id={`${idPrefix}-alt`} required maxLength={150} value={image.alt} onChange={(event) => onChange({ alt: event.target.value })} placeholder="예: 허리 통증으로 진료 상담을 받는 중년 남성" className={inputClass} />
      </div>
      <label className="flex items-center gap-2 text-xs font-bold text-slate-600"><input type="checkbox" checked={image.position === 'right'} onChange={(event) => onChange({ position: event.target.checked ? 'right' : 'center' })} className="h-4 w-4 accent-blue-700" /> 오른쪽 부분을 보여 주기</label>
      <div className="flex gap-2">
        <label className={`inline-flex cursor-pointer items-center gap-1 rounded-lg bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700 ${disabled ? 'pointer-events-none opacity-50' : ''}`}><UploadCloud size={14} /> 바꾸기{fileInput}</label>
        <button type="button" onClick={onRemove} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-bold text-rose-600 hover:bg-rose-50"><X size={14} /> 빼기</button>
      </div>
    </div>
  </div>;
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
      try { localStorage.setItem(draftKey, JSON.stringify({ version: 1, savedAt: new Date().toISOString(), baseUpdatedAt, form } satisfies Draft)); }
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
  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked) return;
    setPending(true);
    setError('');
    try {
      const result = await saveAdminHealthArticle(JSON.stringify({ article: healthFormToArticle(form), ...healthFormPublish(form) }), initialArticle?.slug ?? null, initialArticle?.updatedAt ?? null);
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

  return <>
    <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-5 md:px-10">
      <div><p className="mb-1 text-xs font-bold text-primary">건강정보 관리</p><h1 className="text-xl font-black text-slate-900 md:text-2xl">{editing ? '글 수정' : '새 글 쓰기'}</h1></div>
      <button type="button" onClick={() => { setPreviewOpen(true); preview.current?.showModal(); }} className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700"><Eye size={17} /> 미리보기</button>
    </header>
    <div className="mx-auto w-full max-w-5xl space-y-5 p-5 md:p-8">
      <Link href="/admin/health" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary"><ArrowLeft size={17} /> 글 목록으로</Link>
      {recoverable && <div role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-5"><p className="font-bold text-amber-900">임시보관한 글이 있습니다.</p><p className="mt-1 text-sm text-amber-800">{new Date(recoverable.savedAt).toLocaleString('ko-KR')}에 이 브라우저에서 작성하던 내용입니다.</p><div className="mt-3 flex gap-2"><button type="button" onClick={restore} className="rounded-lg bg-amber-900 px-4 py-2 text-sm font-bold text-white">이어서 작성</button><button type="button" onClick={discardDraft} className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-amber-900">임시보관 버리기</button></div></div>}

      <form onSubmit={submit} className="space-y-6">
        <fieldset disabled={locked} className={cardClass}>
          <legend className="sr-only">기본 정보</legend>
          <h2 className="font-bold text-slate-900">기본 정보</h2>
          <div>
            <label htmlFor="health-title" className={labelClass}>제목 <span className="text-rose-500">*</span></label>
            <input id="health-title" required maxLength={120} value={form.title} onChange={(event) => change({ title: event.target.value })} placeholder="예: 무릎이 붓고 계단 내려갈 때 아프면 연골 문제일까요?" className={inputClass} />
            <p className={hintClass}>환자가 실제로 검색하거나 묻는 질문 형태로 쓰면 검색에 잘 노출됩니다.</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="health-slug" className={labelClass}>주소 (영문) <span className="text-rose-500">*</span></label>
              <div className="flex items-center rounded-lg border border-slate-200 bg-slate-50 pl-3 text-sm text-slate-500 focus-within:border-blue-400 focus-within:ring-2 focus-within:ring-blue-100">
                /health/
                <input id="health-slug" required readOnly={editing} maxLength={80} pattern="[a-z0-9]+(-[a-z0-9]+)*" value={form.slug} onChange={(event) => change({ slug: event.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })} placeholder="knee-swelling-cartilage" className="min-w-0 flex-1 rounded-r-lg bg-white px-2 py-3 text-slate-900 outline-none read-only:bg-slate-50 read-only:text-slate-500" />
              </div>
              <p className={hintClass}>{editing ? '등록한 글의 주소는 바꿀 수 없습니다.' : '영문 소문자·숫자·하이픈(-)만 씁니다. 등록 후에는 바꿀 수 없습니다.'}</p>
            </div>
            <div>
              <label htmlFor="health-category" className={labelClass}>분류 <span className="text-rose-500">*</span></label>
              <select id="health-category" value={form.category} onChange={(event) => change({ category: event.target.value as HealthCategoryId })} className={inputClass}>
                {Object.entries(HEALTH_CATEGORIES).map(([id, category]) => <option key={id} value={id}>{category.name} 건강</option>)}
              </select>
            </div>
          </div>
          <div>
            <label htmlFor="health-description" className={labelClass}>목록 설명 <span className="text-rose-500">*</span></label>
            <textarea id="health-description" required rows={2} maxLength={300} value={form.description} onChange={(event) => change({ description: event.target.value })} className={inputClass} />
            <p className={hintClass}>건강정보 목록과 검색 결과에 보이는 설명입니다. 80~120자가 알맞습니다. ({form.description.trim().length}자)</p>
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <div>
              <label htmlFor="health-keywords" className={labelClass}>검색어</label>
              <input id="health-keywords" value={form.keywords} onChange={(event) => change({ keywords: event.target.value })} placeholder="무릎 연골, 무릎 붓기, 연골연화증" className={inputClass} />
              <p className={hintClass}>쉼표(,)로 구분합니다. 띄어쓰기·의학 용어가 다른 표현도 넣어 주세요.</p>
            </div>
            <div>
              <label htmlFor="health-seo-title" className={labelClass}>검색 결과 제목 (선택)</label>
              <input id="health-seo-title" maxLength={120} value={form.seoTitle} onChange={(event) => change({ seoTitle: event.target.value })} placeholder="비워 두면 제목을 그대로 씁니다" className={inputClass} />
            </div>
          </div>
          <div className="space-y-4 rounded-lg border border-slate-200 bg-slate-50/60 p-4">
            <label className="flex items-center gap-3 text-sm font-bold text-slate-800"><input type="checkbox" checked={form.reviewed} onChange={(event) => change({ reviewed: event.target.checked })} className="h-4 w-4 accent-blue-700" /> 의료진 검토 완료</label>
            <p className="-mt-2 text-xs leading-5 text-slate-500">실제로 의료진이 내용을 확인했을 때만 체크하세요. 체크하면 글에 &quot;○○○ 원장 검토&quot;가 표시되고, 체크하지 않으면 &quot;연세척병원&quot; 이름으로 표시됩니다.</p>
            {form.reviewed && <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label htmlFor="health-reviewer" className={labelClass}>검토 의료진</label>
                <select id="health-reviewer" value={form.reviewerId} onChange={(event) => change({ reviewerId: event.target.value })} className={inputClass}>
                  {Object.values(HEALTH_REVIEWERS).map((reviewer) => <option key={reviewer.id} value={reviewer.id}>{reviewer.name} {reviewer.jobTitle} ({reviewer.specialty})</option>)}
                </select>
              </div>
              <div>
                <label htmlFor="health-reviewed" className={labelClass}>검토일</label>
                <input id="health-reviewed" type="date" required value={form.reviewedAt} onChange={(event) => change({ reviewedAt: event.target.value })} className={inputClass} />
              </div>
            </div>}
          </div>
          <p className="text-xs leading-5 text-slate-500">치료 효과를 보장하거나 다른 병원과 비교하는 표현, 출처 없는 수치는 의료법상 쓸 수 없습니다.</p>
        </fieldset>

        <fieldset disabled={locked} className={cardClass}>
          <legend className="sr-only">이미지</legend>
          <h2 className="font-bold text-slate-900">대표 이미지</h2>
          <ImageField idPrefix={`${formId}-hero`} label="대표 이미지" image={form.heroImage} uploading={uploading > 0} disabled={locked}
            onUpload={(file) => void uploadHero(file)}
            onChange={(patch) => change({ heroImage: { ...form.heroImage, ...patch } })}
            onRemove={() => { releaseUpload(form.heroImage.src); change({ heroImage: { src: '', alt: '', position: 'center' } }); }} />
          <h2 className="pt-2 font-bold text-slate-900">목록 썸네일</h2>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
            <button type="button" aria-pressed={!form.thumbnail} onClick={() => choosePreset('', 'center')} className={`overflow-hidden rounded-lg border text-left text-xs font-bold ${!form.thumbnail ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200 hover:border-blue-300'}`}>
              {form.heroImage.src
                // eslint-disable-next-line @next/next/no-img-element
                ? <img src={form.heroImage.src} alt="" className="aspect-[168/140] w-full object-cover" style={{ objectPosition: form.heroImage.position }} />
                : <span className="flex aspect-[168/140] items-center justify-center bg-slate-50 text-slate-400">대표 이미지 없음</span>}
              <span className="block px-3 py-2 text-slate-600">대표 이미지 사용</span>
            </button>
            {HEALTH_THUMBNAIL_PRESETS.map((preset) => <button key={preset.src} type="button" aria-pressed={form.thumbnail === preset.src} onClick={() => choosePreset(preset.src, preset.position)} className={`overflow-hidden rounded-lg border text-left text-xs font-bold ${form.thumbnail === preset.src ? 'border-blue-500 ring-2 ring-blue-100' : 'border-slate-200 hover:border-blue-300'}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={preset.src} alt="" className="aspect-[168/140] w-full object-cover" style={{ objectPosition: preset.position }} />
              <span className="block px-3 py-2 text-slate-600">{preset.label}</span>
            </button>)}
            {form.thumbnail && !isPreset && <div className="overflow-hidden rounded-lg border border-blue-500 text-xs font-bold ring-2 ring-blue-100">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={form.thumbnail} alt="" className="aspect-[168/140] w-full object-cover" style={{ objectPosition: form.thumbnailPosition }} />
              <span className="block px-3 py-2 text-slate-600">직접 올린 이미지</span>
            </div>}
            <label className={`flex aspect-[168/140] cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-3 text-center text-xs font-bold text-slate-600 ${locked ? 'pointer-events-none opacity-50' : 'hover:border-blue-300 hover:bg-blue-50'}`}>
              <UploadCloud size={22} />{uploading ? '올리는 중…' : '이미지 직접 올리기'}
              <input type="file" aria-label="썸네일 이미지 파일" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={(event) => { const file = event.target.files?.[0]; if (file) void uploadThumbnail(file); event.target.value = ''; }} />
            </label>
          </div>
          {form.thumbnail && !isPreset && <label className="flex items-center gap-3 text-sm font-bold text-slate-700"><input type="checkbox" checked={form.thumbnailPosition === 'right'} onChange={(event) => change({ thumbnailPosition: event.target.checked ? 'right' : 'center' })} className="h-4 w-4 accent-blue-700" /> 이미지 오른쪽 부분을 보여 주기 (가로로 긴 배너 이미지일 때)</label>}
        </fieldset>

        <fieldset disabled={locked} className={cardClass}>
          <legend className="sr-only">핵심 요약</legend>
          <div>
            <label htmlFor="health-summary" className="mb-2 block font-bold text-slate-900">핵심 요약 <span className="text-rose-500">*</span></label>
            <textarea id="health-summary" required rows={5} value={form.summary} onChange={(event) => change({ summary: event.target.value })} placeholder={'질문에 대한 답을 2~4문장으로 먼저 적어 주세요.'} className={inputClass} />
            <p className={hintClass}>글 맨 위에 보이는 요약입니다. 한 문단으로 쓰면 문단으로, 줄을 바꾸면 목록으로 보입니다. 검색엔진과 AI 답변에 가장 많이 인용되는 자리입니다.</p>
          </div>
        </fieldset>

        <section aria-labelledby="sections-heading" className="space-y-4">
          <div className="flex items-center justify-between gap-3"><h2 id="sections-heading" className="font-bold text-slate-900">본문 단락 <span className="text-rose-500">*</span></h2><span className="text-xs text-slate-500">단락마다 목차에 소제목이 들어갑니다.</span></div>
          {form.sections.map((section, index) => <fieldset key={section.key} disabled={locked} className={cardClass}>
            <legend className="sr-only">{index + 1}번째 단락</legend>
            <div className="flex items-center justify-between gap-3">
              <h3 className="text-sm font-black text-primary">단락 {index + 1}</h3>
              <div className="flex gap-1">
                <button type="button" aria-label={`${index + 1}번째 단락 위로`} disabled={index === 0} onClick={() => change({ sections: move(form.sections, index, -1) })} className="rounded p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-25"><ArrowUp size={16} /></button>
                <button type="button" aria-label={`${index + 1}번째 단락 아래로`} disabled={index === form.sections.length - 1} onClick={() => change({ sections: move(form.sections, index, 1) })} className="rounded p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-25"><ArrowDown size={16} /></button>
                <button type="button" disabled={form.sections.length === 1} onClick={() => { if (window.confirm(`${index + 1}번째 단락을 지울까요?`)) change({ sections: form.sections.filter((item) => item.key !== section.key) }); }} className="inline-flex items-center gap-1 rounded px-2 text-xs font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-25"><Trash2 size={14} /> 삭제</button>
              </div>
            </div>
            <div>
              <label htmlFor={`${formId}-s${index}-heading`} className={labelClass}>소제목 <span className="text-rose-500">*</span></label>
              <input id={`${formId}-s${index}-heading`} required maxLength={120} value={section.heading} onChange={(event) => changeSection(section.key, { heading: event.target.value })} placeholder="예: 증상으로 보는 차이" className={inputClass} />
            </div>
            <div>
              <label htmlFor={`${formId}-s${index}-lead`} className={labelClass}>핵심 한 문장 (선택)</label>
              <input id={`${formId}-s${index}-lead`} maxLength={300} value={section.lead} onChange={(event) => changeSection(section.key, { lead: event.target.value })} placeholder="소제목 바로 아래 굵게 보이는 답입니다" className={inputClass} />
            </div>
            <div>
              <label htmlFor={`${formId}-s${index}-paragraphs`} className={labelClass}>본문</label>
              <textarea id={`${formId}-s${index}-paragraphs`} rows={7} value={section.paragraphs} onChange={(event) => changeSection(section.key, { paragraphs: event.target.value })} className={inputClass} />
              <p className={hintClass}>빈 줄을 하나 넣으면 문단이 나뉩니다.</p>
            </div>
            <div>
              <label htmlFor={`${formId}-s${index}-bullets`} className={labelClass}>목록 (선택)</label>
              <textarea id={`${formId}-s${index}-bullets`} rows={3} value={section.bullets} onChange={(event) => changeSection(section.key, { bullets: event.target.value })} placeholder={'한 줄에 한 항목씩 적습니다.'} className={inputClass} />
            </div>
            <details open={Boolean(section.table)} className="rounded-lg border border-slate-200 bg-slate-50/60 p-4">
              <summary className="cursor-pointer text-sm font-bold text-slate-700">비교표 넣기 (선택)</summary>
              <div className="mt-4 space-y-4">
                <div>
                  <label htmlFor={`${formId}-s${index}-table-caption`} className={labelClass}>표 제목</label>
                  <input id={`${formId}-s${index}-table-caption`} maxLength={120} value={section.tableCaption} onChange={(event) => changeSection(section.key, { tableCaption: event.target.value })} placeholder="예: 허리디스크와 척추관협착증의 일반적인 차이" className={inputClass} />
                </div>
                <div>
                  <label htmlFor={`${formId}-s${index}-table`} className={labelClass}>표 내용</label>
                  <textarea id={`${formId}-s${index}-table`} rows={5} value={section.table} onChange={(event) => changeSection(section.key, { table: event.target.value })} placeholder={'구분 | 허리디스크 | 척추관협착증\n잘 생기는 나이 | 20~50대 | 50~60대 이후'} className={`${inputClass} font-mono`} />
                  <p className={hintClass}>첫 줄은 머리글입니다. 칸은 세로줄( | )로 나누고, 줄마다 칸 수를 같게 맞춰 주세요.</p>
                </div>
              </div>
            </details>
            <div>
              <p className={labelClass}>단락 이미지 (선택)</p>
              <ImageField idPrefix={`${formId}-s${index}-image`} label={`${index + 1}번째 단락 이미지`} image={section.image} uploading={uploading > 0} disabled={locked}
                onUpload={(file) => void uploadSectionImage(section.key, file)}
                onChange={(patch) => changeSection(section.key, { image: { ...section.image, ...patch } })}
                onRemove={() => { releaseUpload(section.image.src); changeSection(section.key, { image: { src: '', alt: '', position: 'center' } }); }} />
            </div>
          </fieldset>)}
          <button type="button" disabled={locked || form.sections.length >= 20} onClick={() => change({ sections: [...form.sections, emptySection()] })} className="flex w-full items-center justify-center gap-2 rounded-xl border-2 border-dashed border-slate-200 bg-white p-4 text-sm font-bold text-slate-600 hover:border-blue-300 hover:bg-blue-50 disabled:opacity-50"><Plus size={18} /> 단락 추가</button>
        </section>

        <fieldset disabled={locked} className={cardClass}>
          <legend className="sr-only">바로 진료가 필요한 신호</legend>
          <div>
            <label htmlFor="health-warning" className="mb-2 block font-bold text-slate-900">이럴 때는 바로 진료를 받으세요 (선택)</label>
            <textarea id="health-warning" rows={4} value={form.warningSigns} onChange={(event) => change({ warningSigns: event.target.value })} placeholder={'한 줄에 한 항목씩 적습니다.\n예: 소변이나 대변을 보기 어렵거나 참기 어려울 때'} className={inputClass} />
          </div>
        </fieldset>

        <fieldset disabled={locked} className={cardClass}>
          <legend className="sr-only">자주 묻는 질문</legend>
          <h2 className="font-bold text-slate-900">자주 묻는 질문 (선택)</h2>
          <p className="-mt-3 text-xs leading-5 text-slate-500">화면에 보이는 문구 그대로 검색엔진에도 FAQ로 알려집니다.</p>
          {form.faq.map((item, index) => <div key={item.key} className="space-y-3 rounded-lg border border-slate-200 p-4">
            <div className="flex items-center justify-between"><span className="text-xs font-black text-primary">Q{index + 1}</span><div className="flex gap-1">
              <button type="button" aria-label={`${index + 1}번째 질문 위로`} disabled={index === 0} onClick={() => change({ faq: move(form.faq, index, -1) })} className="rounded p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-25"><ArrowUp size={15} /></button>
              <button type="button" aria-label={`${index + 1}번째 질문 아래로`} disabled={index === form.faq.length - 1} onClick={() => change({ faq: move(form.faq, index, 1) })} className="rounded p-1.5 text-slate-600 hover:bg-slate-100 disabled:opacity-25"><ArrowDown size={15} /></button>
              <button type="button" aria-label={`${index + 1}번째 질문 삭제`} onClick={() => change({ faq: form.faq.filter((faq) => faq.key !== item.key) })} className="rounded p-1.5 text-rose-600 hover:bg-rose-50"><X size={15} /></button>
            </div></div>
            <input aria-label={`${index + 1}번째 질문`} maxLength={200} value={item.question} onChange={(event) => changeFaq(item.key, { question: event.target.value })} placeholder="질문" className={inputClass} />
            <textarea aria-label={`${index + 1}번째 질문의 답변`} rows={3} maxLength={2000} value={item.answer} onChange={(event) => changeFaq(item.key, { answer: event.target.value })} placeholder="답변" className={inputClass} />
          </div>)}
          <button type="button" disabled={form.faq.length >= 20} onClick={() => change({ faq: [...form.faq, { key: newKey(), question: '', answer: '' }] })} className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-700 disabled:opacity-50"><Plus size={16} /> 질문 추가</button>
        </fieldset>

        <fieldset disabled={locked} className={cardClass}>
          <legend className="sr-only">연결 페이지</legend>
          <div>
            <h2 className="mb-3 font-bold text-slate-900">연세척병원 진료 안내 연결</h2>
            <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
              {HEALTH_TREATMENT_LINKS.map((link) => <label key={link.path} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 has-[:checked]:border-blue-400 has-[:checked]:bg-blue-50"><input type="checkbox" checked={form.relatedTreatments.includes(link.path)} onChange={() => change({ relatedTreatments: toggle(form.relatedTreatments, link.path) })} className="h-4 w-4 accent-blue-700" />{link.name}</label>)}
            </div>
          </div>
          {otherArticles.length > 0 && <div>
            <h2 className="mb-3 font-bold text-slate-900">함께 읽으면 좋은 글 <span className="text-xs font-medium text-slate-500">(최대 6개)</span></h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {otherArticles.map((article) => <label key={article.slug} className="flex items-center gap-2 rounded-lg border border-slate-200 px-3 py-2.5 text-sm font-medium text-slate-700 has-[:checked]:border-blue-400 has-[:checked]:bg-blue-50"><input type="checkbox" checked={form.relatedSlugs.includes(article.slug)} disabled={!form.relatedSlugs.includes(article.slug) && form.relatedSlugs.length >= 6} onChange={() => change({ relatedSlugs: toggle(form.relatedSlugs, article.slug) })} className="h-4 w-4 shrink-0 accent-blue-700" /><span className="line-clamp-1">{article.title}</span></label>)}
            </div>
          </div>}
        </fieldset>

        <fieldset disabled={locked} className={cardClass}>
          <legend className="sr-only">참고문헌</legend>
          <h2 className="font-bold text-slate-900">참고문헌 (선택)</h2>
          {form.references.map((item, index) => <div key={item.key} className="flex flex-col gap-2 sm:flex-row">
            <input aria-label={`${index + 1}번째 참고문헌`} maxLength={400} value={item.label} onChange={(event) => changeReference(item.key, { label: event.target.value })} placeholder="저자. 제목. 학술지. 연도." className={`${inputClass} sm:flex-[2]`} />
            <input aria-label={`${index + 1}번째 참고문헌 링크`} type="url" value={item.url} onChange={(event) => changeReference(item.key, { url: event.target.value })} placeholder="https://… (선택)" className={`${inputClass} sm:flex-1`} />
            <button type="button" aria-label={`${index + 1}번째 참고문헌 삭제`} onClick={() => change({ references: form.references.filter((reference) => reference.key !== item.key) })} className="self-end rounded p-2.5 text-rose-600 hover:bg-rose-50 sm:self-center"><X size={16} /></button>
          </div>)}
          <button type="button" disabled={form.references.length >= 20} onClick={() => change({ references: [...form.references, { key: newKey(), label: '', url: '' }] })} className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-700 disabled:opacity-50"><Plus size={16} /> 참고문헌 추가</button>
        </fieldset>

        {error && <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-700">{error}</div>}
        <div className="sticky bottom-0 z-20 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur">
          <fieldset disabled={locked} className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <legend className="sr-only">공개 방식</legend>
            {([['draft', '임시저장'], ['now', editing && initialArticle?.isPublished ? '공개 유지' : '지금 공개'], ['schedule', '예약 발행']] as const).map(([mode, label]) => <label key={mode} className="flex items-center gap-2 text-sm font-bold text-slate-800"><input type="radio" name="publish-mode" checked={form.publishMode === mode} onChange={() => change({ publishMode: mode })} className="h-4 w-4 accent-emerald-600" />{label}</label>)}
            {form.publishMode === 'schedule' && <span className="flex flex-wrap items-center gap-2">
              <input type="date" aria-label="예약 날짜" required value={form.publishDate} onChange={(event) => change({ publishDate: event.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm" />
              <select aria-label="예약 시간" value={form.publishTime} onChange={(event) => change({ publishTime: event.target.value })} className="rounded-lg border border-slate-200 px-3 py-2 text-sm">
                {[...new Set([...HEALTH_PUBLISH_SLOTS, form.publishTime])].sort().map((time) => <option key={time} value={time}>{time}</option>)}
              </select>
            </span>}
            <span className="w-full text-xs font-medium text-slate-500">{form.publishMode === 'draft' ? '관리자만 볼 수 있습니다.' : form.publishMode === 'now' ? '저장하면 바로 홈페이지에 보입니다.' : '정한 시각이 지나면 10분 안에 홈페이지에 올라갑니다.'}</span>
          </fieldset>
          <div className="flex gap-2"><Link href="/admin/health" className="rounded-lg bg-slate-100 px-5 py-3 text-sm font-bold text-slate-600">취소</Link><button type="submit" disabled={locked} className="inline-flex items-center gap-2 rounded-lg bg-navy-950 px-6 py-3 text-sm font-bold text-white disabled:opacity-50"><Check size={17} />{pending ? '저장 중…' : editing ? '수정 저장' : '글 등록'}</button></div>
        </div>
      </form>
    </div>
    <dialog ref={preview} aria-labelledby="health-preview-title" onClose={() => setPreviewOpen(false)} className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-5xl overflow-y-auto rounded-2xl border border-slate-200 bg-white p-0 shadow-2xl backdrop:bg-slate-950/50">
      <div className="sticky top-0 z-10 flex items-center justify-between gap-3 border-b border-slate-200 bg-white p-4"><h2 id="health-preview-title" className="font-bold text-slate-900">저장 전 미리보기</h2><button type="button" aria-label="미리보기 닫기" onClick={() => preview.current?.close()} className="rounded-lg p-2 hover:bg-slate-100"><X size={20} /></button></div>
      {previewOpen && <div className="py-3"><HealthArticleView article={previewArticle} relatedArticles={otherArticles.filter((article) => form.relatedSlugs.includes(article.slug))} /></div>}
    </dialog>
  </>;
}
