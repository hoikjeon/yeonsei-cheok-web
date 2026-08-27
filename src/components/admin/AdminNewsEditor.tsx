'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, ExternalLink, FileImage, Pin, Send, UploadCloud, X } from 'lucide-react';
import { createAdminNews } from '@/app/admin/(dashboard)/news/actions';
import { adminNewsConfig, type AdminNewsType } from '@/lib/adminNews';

export default function AdminNewsEditor({ type }: { type: AdminNewsType }) {
  const config = adminNewsConfig[type];
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [sourceName, setSourceName] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [isPinned, setIsPinned] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addFiles = (selectedFiles: FileList | null) => {
    if (!selectedFiles) return;
    setFiles((current) => [...current, ...Array.from(selectedFiles)].slice(0, 10));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!title.trim() || (type !== 'youtube' && !content.trim())) {
      alert('필수 항목을 모두 입력해주세요.');
      return;
    }

    if (type === 'youtube' && !videoUrl.trim()) {
      alert('유튜브 링크를 입력해주세요.');
      return;
    }

    setIsSubmitting(true);

    try {
      const formData = new FormData();
      formData.append('type', type);
      formData.append('title', title);
      formData.append('content', content);
      formData.append('video_url', videoUrl);
      formData.append('source_name', sourceName);
      formData.append('source_url', sourceUrl);
      formData.append('is_pinned', String(isPinned));
      files.forEach((file) => formData.append('files', file));

      const result = await createAdminNews(formData);
      if (!result.success) throw new Error(result.error);

      alert(`${config.label} 글이 등록되었습니다.`);
      window.location.href = '/admin/news';
    } catch (error: unknown) {
      alert(error instanceof Error ? error.message : '저장 중 오류가 발생했습니다.');
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <header className="sticky top-0 z-50 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-5 shadow-sm md:px-10 md:py-6">
        <div>
          <p className="mb-1 text-xs font-bold text-primary">병원소식 관리</p>
          <h1 className="text-xl font-black tracking-tight text-ink md:text-2xl">{config.label} 등록</h1>
        </div>
        <Link
          href={config.publicPath}
          target="_blank"
          className="inline-flex items-center gap-2 rounded-xl bg-slate-100 px-4 py-3 text-sm font-bold text-ink-muted transition-colors hover:bg-primary/10 hover:text-primary"
        >
          게시판 보기 <ExternalLink size={16} />
        </Link>
      </header>

      <div className="mx-auto w-full max-w-5xl p-5 md:p-10">
        <Link href="/admin/news" className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-ink-muted hover:text-primary">
          <ArrowLeft size={18} /> 병원소식 관리로 돌아가기
        </Link>

        <form onSubmit={handleSubmit} className="space-y-8 rounded-3xl border border-slate-200 bg-white p-5 shadow-sm md:p-10">
          <div>
            <h2 className="text-xl font-black text-ink">{config.label}</h2>
            <p className="mt-2 text-sm font-medium leading-6 text-ink-muted">{config.description}</p>
          </div>

          {type === 'youtube' && (
            <div className="space-y-2">
              <label htmlFor="video-url" className="text-sm font-black text-ink">유튜브 영상 링크 <span className="text-red-500">*</span></label>
              <input
                id="video-url"
                type="url"
                required
                value={videoUrl}
                onChange={(event) => setVideoUrl(event.target.value)}
                placeholder="https://www.youtube.com/watch?v=..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-bold text-ink outline-none transition focus:border-primary focus:bg-white"
              />
            </div>
          )}

          <div className="space-y-2">
            <label htmlFor="news-title" className="text-sm font-black text-ink">{config.titleLabel} <span className="text-red-500">*</span></label>
            <input
              id="news-title"
              type="text"
              required
              maxLength={150}
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-bold text-ink outline-none transition focus:border-primary focus:bg-white"
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="news-content" className="text-sm font-black text-ink">
              {config.contentLabel} {type !== 'youtube' && <span className="text-red-500">*</span>}
            </label>
            <textarea
              id="news-content"
              required={type !== 'youtube'}
              maxLength={20_000}
              rows={12}
              value={content}
              onChange={(event) => setContent(event.target.value)}
              className="w-full resize-y rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-medium leading-7 text-ink outline-none transition focus:border-primary focus:bg-white"
            />
          </div>

          {type === 'notice' && (
            <label className="flex cursor-pointer items-start gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-5">
              <input
                type="checkbox"
                checked={isPinned}
                onChange={(event) => setIsPinned(event.target.checked)}
                className="mt-0.5 h-5 w-5 accent-primary"
              />
              <span>
                <span className="flex items-center gap-2 text-sm font-black text-ink"><Pin size={16} className="text-primary" /> 공지사항 상단 고정</span>
                <span className="mt-1 block text-xs font-medium leading-5 text-ink-muted">중요한 공지를 목록 상단에 고정합니다.</span>
              </span>
            </label>
          )}

          {type === 'media' && (
            <div className="grid gap-5 md:grid-cols-2">
              <div className="space-y-2">
                <label htmlFor="source-name" className="text-sm font-black text-ink">언론사명</label>
                <input id="source-name" type="text" value={sourceName} onChange={(event) => setSourceName(event.target.value)} className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-bold text-ink outline-none transition focus:border-primary focus:bg-white" />
              </div>
              <div className="space-y-2">
                <label htmlFor="source-url" className="text-sm font-black text-ink">보도 원문 링크</label>
                <input id="source-url" type="url" value={sourceUrl} onChange={(event) => setSourceUrl(event.target.value)} placeholder="https://..." className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-4 text-sm font-bold text-ink outline-none transition focus:border-primary focus:bg-white" />
              </div>
            </div>
          )}

          {type !== 'youtube' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between gap-4">
                <label htmlFor="news-files" className="flex items-center gap-2 text-sm font-black text-ink"><FileImage size={17} /> 첨부 이미지</label>
                <span className="text-xs font-bold text-ink-muted">{files.length}/10개 · 파일당 10MB</span>
              </div>
              <label htmlFor="news-files" className="flex cursor-pointer flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 px-5 py-9 text-center transition hover:border-primary/40 hover:bg-primary/5">
                <UploadCloud size={34} className="mb-3 text-primary" />
                <span className="text-sm font-black text-ink">이미지 선택</span>
                <span className="mt-1 text-xs font-medium text-ink-muted">JPG, PNG, WEBP, GIF</span>
              </label>
              <input id="news-files" type="file" multiple accept="image/jpeg,image/png,image/webp,image/gif" onChange={(event) => addFiles(event.target.files)} className="sr-only" />

              {files.length > 0 && (
                <div className="grid gap-2 sm:grid-cols-2">
                  {files.map((file, index) => (
                    <div key={`${file.name}-${file.lastModified}-${index}`} className="flex min-w-0 items-center gap-3 rounded-xl border border-slate-200 bg-white p-3">
                      <FileImage size={18} className="shrink-0 text-primary" />
                      <span className="min-w-0 flex-1 truncate text-xs font-bold text-ink">{file.name}</span>
                      <button type="button" aria-label={`${file.name} 제거`} onClick={() => setFiles((current) => current.filter((_, fileIndex) => fileIndex !== index))} className="rounded-lg p-1.5 text-ink-muted hover:bg-red-50 hover:text-red-500">
                        <X size={16} />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col-reverse gap-3 border-t border-slate-100 pt-7 sm:flex-row sm:justify-end">
            <Link href="/admin/news" className="inline-flex items-center justify-center rounded-xl bg-slate-100 px-6 py-4 text-sm font-black text-ink-muted hover:bg-slate-200">취소</Link>
            <button type="submit" disabled={isSubmitting} className="inline-flex min-w-48 items-center justify-center gap-2 rounded-xl bg-navy-950 px-7 py-4 text-sm font-black text-white transition hover:bg-primary disabled:cursor-not-allowed disabled:opacity-50">
              <Send size={18} /> {isSubmitting ? '등록 중...' : `${config.label} 등록`}
            </button>
          </div>
        </form>
      </div>
    </>
  );
}
