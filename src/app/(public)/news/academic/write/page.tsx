'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ChevronRight, UploadCloud, X, ArrowLeft, Send, GraduationCap } from 'lucide-react';
import { createNews } from '../../actions';

export default function AcademicWritePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('type', 'academic');
      formData.append('title', title);
      formData.append('content', content);
      files.forEach((file) => formData.append('files', file));

      const result = await createNews(formData);
      if (result.success) {
        alert('학술 소식이 성공적으로 등록되었습니다.');
        window.location.href = '/news/academic';
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      alert(err.message || '저장 중 오류가 발생했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pt-0 md:pt-[96px]">
      <div className="mx-auto max-w-[1000px] px-4 py-10 sm:px-6 sm:py-14 md:py-16">
        <div className="mb-6 flex flex-wrap items-center gap-1.5 text-[12px] font-bold tracking-tight text-ink-muted sm:mb-10 sm:gap-2 sm:text-[14px]">
          <Link href="/" className="hover:text-primary transition-colors"><Home size={16} strokeWidth={2.5} /></Link>
          <ChevronRight size={14} strokeWidth={2.5} />
          <Link href="/news/academic" className="text-ink-muted">병원소식 / 학술소식</Link>
          <ChevronRight size={14} strokeWidth={2.5} />
          <span className="text-ink">학술 소식 등록</span>
        </div>

        <Link href="/news/academic" className="mb-8 inline-flex items-center gap-2 text-h4 tracking-tight text-ink transition-colors hover:text-primary sm:mb-12">
          <ArrowLeft size={28} strokeWidth={2.5} /> 학술 소식 작성
        </Link>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6 md:rounded-[2rem] md:p-14">
          <h2 className="mb-7 flex items-center gap-3 break-keep text-h2 tracking-tight text-ink sm:mb-8 sm:gap-4">
            <GraduationCap size={34} className="shrink-0 text-primary sm:h-10 sm:w-10" /> 연구 활동 기록
          </h2>

          <form onSubmit={handleSubmit} className="space-y-7 sm:space-y-10">
            <div className="space-y-4">
              <label className="block text-[16px] font-bold text-ink tracking-tight">소식 제목 <span className="text-red-500">*</span></label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border-2 border-slate-100 px-4 py-4 text-[16px] font-bold text-ink transition-all focus:border-primary focus:outline-none sm:rounded-[1.25rem] sm:px-6 sm:py-5 sm:text-[18px]" />
            </div>

            <div className="space-y-4">
              <label className="block text-[16px] font-bold text-ink tracking-tight">연구 내용 및 상세 소식 <span className="text-red-500">*</span></label>
              <textarea rows={10} required value={content} onChange={(e) => setContent(e.target.value)} className="w-full resize-none rounded-xl border-2 border-slate-100 px-4 py-4 text-[16px] font-bold leading-[1.75] text-ink transition-all focus:border-primary focus:outline-none sm:rounded-[1.5rem] sm:px-8 sm:py-7 sm:text-[17px] sm:leading-[1.8]" />
            </div>

            <div className="space-y-4">
              <label className="block text-[16px] font-bold text-ink tracking-tight">관련 이미지 (논문 표지, 학회 사진 등)</label>
              <div className="group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-slate-50 p-6 text-center transition-all hover:bg-primary/5 sm:p-8 md:rounded-[2rem] md:p-12">
                <input type="file" multiple onChange={(e) => e.target.files && setFiles((prev) => [...prev, ...Array.from(e.target.files!)])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
                <UploadCloud size={40} className="text-slate-300 group-hover:text-primary mb-4 transition-all" />
                <p className="font-bold text-ink text-[18px]">클릭하여 이미지를 추가하세요</p>
              </div>
              {files.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-6">
                  {files.map((file, idx) => (
                    <div key={idx} className="group relative flex w-full min-w-0 items-center overflow-hidden rounded-[1rem] border border-slate-200 bg-white p-3 pr-5 sm:w-auto sm:min-w-[200px]">
                      <span className="flex-1 truncate text-[14px] font-bold text-ink">{file.name}</span>
                      <button type="button" onClick={() => setFiles((prev) => prev.filter((_, i) => i !== idx))} className="ml-3 p-1 text-slate-300 hover:text-red-500"><X size={16} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row gap-4">
              <Link href="/news/academic" className="flex-[1] flex justify-center items-center py-5 rounded-[1.25rem] bg-slate-100 font-bold text-ink-muted">취소</Link>
              <button type="submit" disabled={isSubmitting} className="flex-[2] flex justify-center items-center gap-3 py-5 rounded-[1.25rem] bg-navy-950 hover:bg-primary text-white font-bold text-[19px] transition-all disabled:opacity-50">
                {isSubmitting ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={20} /> 학술소식 등록하기</>}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
