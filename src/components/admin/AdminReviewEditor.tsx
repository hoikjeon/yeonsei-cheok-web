'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import type { Editor } from '@tiptap/react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { ArrowDown, ArrowLeft, ArrowUp, Check, Eye, FileImage, Monitor, Smartphone, UploadCloud, X } from 'lucide-react';
import { createAdminReview, discardAdminReviewUploads, updateAdminReview } from '@/app/admin/(dashboard)/reviews/actions';
import { isReviewCategory, reviewCategories, safeReviewReturnTo, validReviewId, type ReviewCategory, type ReviewRecord } from '@/lib/adminReviews';
import { MAX_IMAGE_COUNT, MAX_IMAGE_SIZE, validateUploadFiles } from '@/lib/imageUploadRules';
import { documentImages, documentText, newsDocumentForEditor, newsGalleryImages, normalizeNewsDocument, safeNewsImage, serializeNewsDocument, type NewsNode } from '@/lib/newsContent';
import NewsRichEditor from '@/components/admin/NewsRichEditor';
import ReviewArticlePreview from '@/components/admin/ReviewArticlePreview';

interface ReviewFormState {
  id: string;
  category: ReviewCategory;
  title: string;
  document: NewsNode;
  gallery: string[];
  cover: string;
  uploadedUrls: string[];
  original: string;
}

interface ReviewDraft { version: 1; savedAt: string; form: ReviewFormState }

const inputClass = 'w-full rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm outline-none transition focus:border-blue-400 focus:ring-2 focus:ring-blue-100 disabled:bg-slate-50';

function readDraft(raw: string | null, existingId?: string): ReviewDraft | null {
  if (!raw || raw.length > 600_000) return null;
  try {
    const data = JSON.parse(raw) as ReviewDraft;
    const form = data.form;
    if (data.version !== 1 || !validReviewId(form?.id) || !isReviewCategory(form?.category) || (existingId && form.id !== existingId)) return null;
    if (['title', 'cover', 'original'].some((key) => typeof form[key as keyof ReviewFormState] !== 'string')) return null;
    if (!Array.isArray(form.gallery) || !Array.isArray(form.uploadedUrls) || [...form.gallery, ...form.uploadedUrls].some((url) => !safeNewsImage(url))) return null;
    form.document = normalizeNewsDocument(form.document);
    if (!Number.isFinite(new Date(data.savedAt).getTime())) return null;
    return data;
  } catch { return null; }
}

export default function AdminReviewEditor({ postId, initialReview, returnTo = '/admin/reviews' }: {
  postId: string; initialReview?: ReviewRecord; returnTo?: string;
}) {
  const router = useRouter();
  const baseline = useRef<ReviewFormState>({
    id: postId,
    category: isReviewCategory(initialReview?.category) ? initialReview.category : reviewCategories[0],
    title: initialReview?.title || '',
    document: newsDocumentForEditor(initialReview?.content || ''),
    gallery: newsGalleryImages(initialReview?.content || '', initialReview?.image_urls || []),
    cover: initialReview?.image_urls?.[0] || '',
    uploadedUrls: [],
    original: initialReview ? JSON.stringify(initialReview) : '',
  });
  const [form, setForm] = useState<ReviewFormState>(baseline.current);
  const current = useRef(form);
  const dirty = useRef(false);
  const draftReady = useRef(false);
  const saved = useRef(false);
  const draftKey = `ys-review-draft:${initialReview?.id || 'new'}`;
  const [recoverable, setRecoverable] = useState<ReviewDraft | null>(null);
  const [checked, setChecked] = useState(false);
  const [epoch, setEpoch] = useState(0);
  const [lastSaved, setLastSaved] = useState('');
  const [storageError, setStorageError] = useState('');
  const [error, setError] = useState('');
  const [pending, setPending] = useState(false);
  const [activeUploads, setActiveUploads] = useState(0);
  const uploadCount = useRef(0);
  const [galleryProgress, setGalleryProgress] = useState(0);
  const [galleryUploading, setGalleryUploading] = useState(false);
  const [failedFiles, setFailedFiles] = useState<File[]>([]);
  const [galleryError, setGalleryError] = useState('');
  const [mobilePreview, setMobilePreview] = useState(false);
  const preview = useRef<HTMLDialogElement>(null);
  const editor = useRef<Editor | null>(null);
  const back = safeReviewReturnTo(returnTo);

  const change = useCallback((patch: Partial<ReviewFormState>) => {
    current.current = { ...current.current, ...patch };
    dirty.current = true;
    setForm(current.current);
  }, []);

  const persistDraft = useCallback(() => {
    if (!dirty.current || !draftReady.current || saved.current) return;
    try {
      const savedAt = new Date().toISOString();
      localStorage.setItem(draftKey, JSON.stringify({ version: 1, savedAt, form: current.current } satisfies ReviewDraft));
      setLastSaved(savedAt);
      setStorageError('');
    } catch { setStorageError('이 브라우저에서는 임시보관을 사용할 수 없습니다. 화면을 나가기 전에 후기를 저장해주세요.'); }
  }, [draftKey]);

  useEffect(() => {
    let draft: ReviewDraft | null = null;
    try { draft = readDraft(localStorage.getItem(draftKey), initialReview?.id); }
    catch { /* The editor still works when browser storage is unavailable. */ }
    draftReady.current = !draft;
    setRecoverable(draft);
    setChecked(true);
  }, [draftKey, initialReview?.id]);
  useEffect(() => {
    const timeout = window.setTimeout(persistDraft, 700);
    return () => window.clearTimeout(timeout);
  }, [form, persistDraft]);
  useEffect(() => {
    const unload = (event: BeforeUnloadEvent) => {
      persistDraft();
      if (dirty.current && !saved.current) { event.preventDefault(); event.returnValue = ''; }
    };
    const leave = (event: MouseEvent) => {
      const anchor = (event.target as Element)?.closest?.('a');
      if (!anchor || anchor.target === '_blank' || anchor.hasAttribute('download') || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || !dirty.current || saved.current) return;
      const target = new URL(anchor.href, window.location.href);
      if (target.pathname === window.location.pathname && target.search === window.location.search) return;
      persistDraft();
      if (!window.confirm('저장하지 않은 변경 내용이 있습니다. 후기를 게시하지 않고 이 화면을 나갈까요?')) { event.preventDefault(); event.stopPropagation(); }
    };
    window.addEventListener('beforeunload', unload);
    window.addEventListener('pagehide', persistDraft);
    window.addEventListener('popstate', persistDraft);
    document.addEventListener('click', leave, true);
    return () => {
      window.removeEventListener('beforeunload', unload);
      window.removeEventListener('pagehide', persistDraft);
      window.removeEventListener('popstate', persistDraft);
      document.removeEventListener('click', leave, true);
    };
  }, [persistDraft]);

  function restore() {
    if (!recoverable) return;
    draftReady.current = true;
    change(recoverable.form);
    setLastSaved(recoverable.savedAt);
    setRecoverable(null);
    setEpoch((value) => value + 1);
  }

  async function discard() {
    if (!window.confirm('이 브라우저에 임시보관한 작성 내용을 버릴까요?')) return;
    const abandoned = recoverable?.form || current.current;
    try { localStorage.removeItem(draftKey); } catch { /* Keep editing available. */ }
    current.current = baseline.current;
    dirty.current = false;
    draftReady.current = true;
    setForm(baseline.current);
    setRecoverable(null);
    setLastSaved('');
    setEpoch((value) => value + 1);
    if (abandoned.uploadedUrls.length) {
      const result = await discardAdminReviewUploads(abandoned.id, abandoned.uploadedUrls);
      if (!result.success) setError('임시보관은 비웠지만 일부 이미지 파일을 정리하지 못했습니다.');
    }
  }

  const uploadImage = useCallback(async (file: File, onProgress: (value: number) => void): Promise<string> => {
    const problem = validateUploadFiles([file], MAX_IMAGE_SIZE);
    if (problem || !file.size) throw new Error(problem || '빈 이미지 파일은 업로드할 수 없습니다.');
    const count = new Set([...current.current.gallery, ...documentImages(current.current.document)]).size;
    if (count + uploadCount.current >= MAX_IMAGE_COUNT) throw new Error(`본문과 첨부 이미지는 합쳐서 최대 ${MAX_IMAGE_COUNT}개입니다.`);
    uploadCount.current += 1;
    setActiveUploads(uploadCount.current);
    try {
      const response = await fetch('/api/admin/reviews/images', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: current.current.id, mime: file.type, size: file.size }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.error || '이미지 업로드를 시작하지 못했습니다.');
      change({ uploadedUrls: [...new Set([...current.current.uploadedUrls, data.publicUrl])] });
      await new Promise<void>((resolve, reject) => {
        const request = new XMLHttpRequest();
        request.open('PUT', data.uploadUrl);
        request.timeout = 120_000;
        request.setRequestHeader('x-upsert', 'false');
        const body = new FormData();
        body.append('cacheControl', '3600');
        body.append('', file);
        request.upload.onprogress = (event) => { if (event.lengthComputable) onProgress(Math.round(event.loaded / event.total * 100)); };
        request.onload = () => request.status >= 200 && request.status < 300 ? resolve() : reject(new Error('이미지 업로드에 실패했습니다. 다시 시도해주세요.'));
        request.onerror = () => reject(new Error('네트워크 연결을 확인한 뒤 이미지를 다시 업로드해주세요.'));
        request.ontimeout = () => reject(new Error('이미지 업로드 시간이 초과되었습니다. 다시 시도해주세요.'));
        request.send(body);
      });
      return data.publicUrl;
    } finally {
      uploadCount.current -= 1;
      setActiveUploads(uploadCount.current);
    }
  }, [change]);

  async function uploadGallery(files: File[]) {
    if (pending || activeUploads || galleryUploading) return;
    setGalleryUploading(true);
    setGalleryError('');
    setFailedFiles([]);
    const failed: File[] = [];
    for (const file of files) {
      setGalleryProgress(0);
      try {
        const url = await uploadImage(file, setGalleryProgress);
        change({ gallery: [...current.current.gallery, url] });
      } catch (uploadError) {
        failed.push(file);
        setGalleryError(uploadError instanceof Error ? uploadError.message : '이미지 업로드에 실패했습니다.');
      }
    }
    setFailedFiles(failed);
    setGalleryUploading(false);
  }

  function removeImage(url: string) {
    const remove = (node: NewsNode): NewsNode => ({ ...node, ...(node.content ? { content: node.content.filter((child) => child.type !== 'image' || child.attrs?.src !== url).map(remove) } : {}) });
    const next = remove(current.current.document);
    editor.current?.commands.setContent(next);
    change({ gallery: current.current.gallery.filter((item) => item !== url), document: next, cover: current.current.cover === url ? '' : current.current.cover });
  }

  function moveGallery(url: string, delta: number) {
    const next = [...current.current.gallery];
    const index = next.indexOf(url);
    const destination = index + delta;
    if (index < 0 || destination < 0 || destination >= next.length) return;
    [next[index], next[destination]] = [next[destination], next[index]];
    change({ gallery: next });
  }

  const inlineImages = documentImages(form.document);
  const allImages = [...new Set([...form.gallery, ...inlineImages])];
  const cover = allImages.includes(form.cover) ? form.cover : allImages[0];
  const orderedImages = cover ? [cover, ...allImages.filter((url) => url !== cover)] : [];
  const textLength = documentText(form.document).trim().length;
  const locked = pending || activeUploads > 0 || galleryUploading || !checked || Boolean(recoverable);

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (locked) return;
    setPending(true);
    setError('');
    persistDraft();
    try {
      const data = new FormData();
      for (const [key, value] of Object.entries({
        id: form.id,
        category: form.category,
        title: form.title,
        content: serializeNewsDocument(form.document, form.gallery),
        image_urls: JSON.stringify(orderedImages),
        uploaded_urls: JSON.stringify(form.uploadedUrls),
        original: form.original,
      })) data.set(key, value);
      const result = await (initialReview ? updateAdminReview(data) : createAdminReview(data));
      if (!result.success) { setError(result.error); return; }
      saved.current = true;
      dirty.current = false;
      try { localStorage.removeItem(draftKey); } catch { /* Successful server save is authoritative. */ }
      const target = new URL(initialReview ? back : '/admin/reviews', window.location.origin);
      target.searchParams.set('saved', result.id);
      if (result.warning) target.searchParams.set('cleanup', 'pending');
      router.push(target.pathname + target.search + `#review-${result.id}`);
      router.refresh();
    } catch {
      setError('저장 요청에 실패했습니다. 연결 상태를 확인하고 다시 시도해주세요.');
    } finally { setPending(false); }
  }

  return <>
    <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-5 md:px-10">
      <div><p className="mb-1 text-xs font-bold text-primary">치료체험후기 관리</p><h1 className="text-xl font-black text-slate-900 md:text-2xl">치료체험후기 {initialReview ? '수정' : '등록'}</h1></div>
      <button type="button" onClick={() => preview.current?.showModal()} className="inline-flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700"><Eye size={17} /> 미리보기</button>
    </header>
    <div className="mx-auto w-full max-w-6xl space-y-5 p-5 md:p-8">
      <Link href={back} className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary"><ArrowLeft size={17} /> 후기 목록으로</Link>
      {recoverable && <div role="status" className="rounded-xl border border-amber-200 bg-amber-50 p-5"><p className="font-bold text-amber-900">임시보관한 후기가 있습니다.</p><p className="mt-1 text-sm text-amber-800">{new Date(recoverable.savedAt).toLocaleString('ko-KR')}에 이 브라우저에서 작성한 내용입니다.</p><div className="mt-3 flex gap-2"><button type="button" onClick={restore} className="rounded-lg bg-amber-900 px-4 py-2 text-sm font-bold text-white">이어서 작성</button><button type="button" onClick={() => void discard()} className="rounded-lg bg-white px-4 py-2 text-sm font-bold text-amber-900">임시보관 버리기</button></div></div>}
      <form onSubmit={submit} className="space-y-6">
        <fieldset disabled={locked} className="space-y-6 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
          <div><label htmlFor="review-category" className="mb-2 block text-sm font-bold">진료 과목 <span className="text-rose-500">*</span></label><select id="review-category" value={form.category} onChange={(event) => change({ category: event.target.value as ReviewCategory })} className={inputClass}>{reviewCategories.map((category) => <option key={category}>{category}</option>)}</select></div>
          <div><label htmlFor="review-title" className="mb-2 block text-sm font-bold">제목 <span className="text-rose-500">*</span></label><input id="review-title" required minLength={2} maxLength={100} value={form.title} onChange={(event) => change({ title: event.target.value })} placeholder="치료체험후기 제목을 입력해주세요" className={inputClass} /></div>
        </fieldset>
        <section className="space-y-3" aria-label="후기 작성">
          <div className="flex items-center justify-between gap-3"><h2 className="text-sm font-bold">치료 후기 <span className="text-rose-500">*</span></h2><span className={`text-xs ${textLength > 5_000 ? 'text-rose-600' : 'text-slate-500'}`}>{textLength.toLocaleString()} / 5,000자</span></div>
          <NewsRichEditor key={epoch} initialDocument={form.document} onChange={(document) => change({ document })} uploadImage={uploadImage} disabled={locked} allowedImages={allImages} onReady={(instance) => { editor.current = instance; }} ariaLabel="치료 후기 본문" placeholder="치료 전후의 변화와 회복 경험을 작성해주세요. 복사한 이미지는 Ctrl+V / ⌘+V로 넣을 수 있습니다." />
          <p className="text-xs leading-5 text-slate-500">글자를 선택해 크기와 색을 바꿀 수 있습니다. 캡처한 이미지는 본문에 붙여넣거나 끌어놓으세요.</p>
        </section>
        <fieldset disabled={locked} className="space-y-4 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
          <div className="flex flex-wrap items-center justify-between gap-3"><h2 className="flex items-center gap-2 font-bold"><FileImage size={18} /> 첨부·대표 이미지</h2><span className="text-xs text-slate-500">본문 포함 {allImages.length}/{MAX_IMAGE_COUNT}개 · 파일당 10MB</span></div>
          <p className="text-sm leading-6 text-slate-500">대표 이미지는 후기 목록에 표시됩니다. 본문에 넣지 않은 이미지는 후기 상단에 표시됩니다.</p>
          <label className={`flex cursor-pointer items-center justify-center gap-3 rounded-lg border-2 border-dashed border-slate-200 bg-slate-50 p-6 text-sm font-bold text-slate-600 ${locked ? 'pointer-events-none opacity-50' : 'hover:border-blue-300 hover:bg-blue-50'}`}><UploadCloud size={22} /> 이미지 파일 추가<input type="file" aria-label="후기 첨부 이미지 파일" accept="image/jpeg,image/png,image/webp,image/gif" multiple className="hidden" onChange={(event) => { void uploadGallery(Array.from(event.target.files || [])); event.target.value = ''; }} /></label>
          {galleryUploading && <p role="status" className="text-sm text-primary">첨부 이미지 업로드 중… {galleryProgress}%</p>}
          {galleryError && <div role="alert" className="rounded-lg bg-rose-50 p-3 text-sm text-rose-700">{galleryError}{failedFiles.length > 0 && <button type="button" onClick={() => void uploadGallery(failedFiles)} className="ml-3 font-bold underline">실패한 이미지 재시도</button>}</div>}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">{allImages.map((url) => <div key={url} className={`overflow-hidden rounded-lg border ${cover === url ? 'border-blue-400 ring-1 ring-blue-100' : 'border-slate-200'}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt="후기 첨부 이미지 미리보기" className="aspect-video w-full bg-slate-50 object-contain" />
            <div className="space-y-2 p-3"><div className="flex items-center justify-between"><label className="flex cursor-pointer items-center gap-2 text-xs font-bold"><input type="radio" name="cover" checked={cover === url} onChange={() => change({ cover: url })} />{cover === url ? '대표 이미지' : '대표로 지정'}</label><span className="text-xs text-slate-500">{inlineImages.includes(url) ? '본문 이미지' : '상단 첨부'}</span></div><div className="flex justify-end gap-1">{!inlineImages.includes(url) && <><button type="button" aria-label="후기 첨부 이미지 앞으로" disabled={form.gallery.indexOf(url) === 0} onClick={() => moveGallery(url, -1)} className="rounded p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-25"><ArrowUp size={15} /></button><button type="button" aria-label="후기 첨부 이미지 뒤로" disabled={form.gallery.indexOf(url) === form.gallery.length - 1} onClick={() => moveGallery(url, 1)} className="rounded p-2 text-slate-600 hover:bg-slate-100 disabled:opacity-25"><ArrowDown size={15} /></button></>}<button type="button" onClick={() => removeImage(url)} className="inline-flex items-center gap-1 rounded px-2 py-1 text-xs font-bold text-rose-600 hover:bg-rose-50"><X size={14} /> 제거</button></div></div>
          </div>)}</div>
        </fieldset>
        {error && <div role="alert" className="rounded-lg border border-rose-200 bg-rose-50 p-4 text-sm leading-6 text-rose-700">{error}</div>}
        <div className="sticky bottom-0 z-20 flex flex-wrap items-center justify-between gap-4 rounded-xl border border-slate-200 bg-white/95 p-4 shadow-lg backdrop-blur">
          <div className="text-xs leading-5 text-slate-500"><p role="status">{storageError || (lastSaved ? `이 브라우저에 ${new Date(lastSaved).toLocaleTimeString('ko-KR')} 임시보관됨` : '작성 내용은 이 브라우저에 자동 임시보관됩니다.')}</p>{lastSaved && !recoverable && <button type="button" disabled={locked} onClick={() => void discard()} className="mt-1 underline">임시보관 버리기</button>}</div>
          <div className="flex gap-2"><Link href={back} className="rounded-lg bg-slate-100 px-5 py-3 text-sm font-bold text-slate-600">취소</Link><button type="submit" disabled={locked} className="inline-flex items-center gap-2 rounded-lg bg-navy-950 px-6 py-3 text-sm font-bold text-white disabled:opacity-50"><Check size={17} />{pending ? '저장 중…' : initialReview ? '수정 저장' : '후기 등록'}</button></div>
        </div>
      </form>
    </div>
    <dialog ref={preview} aria-labelledby="review-preview-title" className="m-auto max-h-[90dvh] w-[calc(100%-2rem)] max-w-5xl overflow-y-auto rounded-2xl border border-slate-200 bg-slate-100 p-0 shadow-2xl backdrop:bg-slate-950/50">
      <div className="sticky top-0 z-10 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white p-4"><h2 id="review-preview-title" className="font-bold text-slate-900">게시 전 미리보기</h2><div className="flex items-center gap-2"><button type="button" aria-pressed={!mobilePreview} onClick={() => setMobilePreview(false)} className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm ${!mobilePreview ? 'bg-navy-950 text-white' : 'bg-slate-100'}`}><Monitor size={16} /> PC</button><button type="button" aria-pressed={mobilePreview} onClick={() => setMobilePreview(true)} className={`inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm ${mobilePreview ? 'bg-navy-950 text-white' : 'bg-slate-100'}`}><Smartphone size={16} /> 모바일</button><button type="button" aria-label="미리보기 닫기" onClick={() => preview.current?.close()} className="rounded-lg p-2 hover:bg-slate-100"><X size={20} /></button></div></div>
      <div className="p-3 sm:p-6"><ReviewArticlePreview category={form.category} title={form.title} content={serializeNewsDocument(form.document, form.gallery)} images={orderedImages} mobile={mobilePreview} /></div>
    </dialog>
  </>;
}
