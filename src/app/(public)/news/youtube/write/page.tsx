'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ChevronRight, UploadCloud, X, ArrowLeft, Send, Video, Play } from 'lucide-react';
import { createNews } from '../../actions';

export default function YoutubeWritePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [videoUrl, setVideoUrl] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !videoUrl.trim()) {
      alert('제목과 유튜브 링크를 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);
    try {
      const formData = new FormData();
      formData.append('type', 'youtube');
      formData.append('title', title);
      formData.append('content', content);
      formData.append('video_url', videoUrl);

      const result = await createNews(formData);
      if (result.success) {
        alert('유튜브 소식이 성공적으로 등록되었습니다.');
        window.location.href = '/news/youtube';
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
          <Link href="/news/youtube" className="text-ink-muted">병원소식 / 유튜브</Link>
          <ChevronRight size={14} strokeWidth={2.5} />
          <span className="text-ink">영상 소식 등록</span>
        </div>

        <Link href="/news/youtube" className="mb-8 inline-flex items-center gap-2 text-[20px] font-black tracking-tight text-ink transition-colors hover:text-primary sm:mb-12 sm:text-[24px]">
          <ArrowLeft size={28} strokeWidth={2.5} /> 유튜브 소식 작성
        </Link>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6 md:rounded-[2rem] md:p-14">
          <h2 className="mb-7 flex items-center gap-3 break-keep text-[26px] font-black leading-[1.3] tracking-tight text-ink sm:mb-8 sm:gap-4 sm:text-[32px] md:text-[40px]">
             <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-red-600 text-white sm:h-16 sm:w-16"><Play size={26} fill="white" /></div>
             새로운 영상 공유
          </h2>

          <form onSubmit={handleSubmit} className="space-y-7 sm:space-y-10">
            <div className="space-y-4">
              <label className="block text-[16px] font-black text-ink tracking-tight flex items-center gap-2">
                <Video size={18} className="text-red-500" /> 유튜브 영상 링크 (URL) <span className="text-red-500">*</span>
              </label>
              <input type="url" required value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." className="w-full rounded-xl border-2 border-slate-100 bg-slate-50 px-4 py-4 text-[16px] font-bold text-ink transition-all focus:border-red-500 focus:bg-white focus:outline-none sm:rounded-[1.25rem] sm:px-6 sm:py-5 sm:text-[18px]" />
            </div>

            <div className="space-y-4">
              <label className="block text-[16px] font-black text-ink tracking-tight">영상 제목 <span className="text-red-500">*</span></label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full rounded-xl border-2 border-slate-100 px-4 py-4 text-[16px] font-bold text-ink transition-all focus:border-primary focus:outline-none sm:rounded-[1.25rem] sm:px-6 sm:py-5 sm:text-[18px]" />
            </div>

            <div className="space-y-4">
              <label className="block text-[16px] font-black text-ink tracking-tight">영상 요약 및 설명</label>
              <textarea rows={6} value={content} onChange={(e) => setContent(e.target.value)} className="w-full resize-none rounded-xl border-2 border-slate-100 px-4 py-4 text-[16px] font-bold leading-[1.75] text-ink transition-all focus:border-primary focus:outline-none sm:rounded-[1.5rem] sm:px-8 sm:py-7 sm:text-[17px] sm:leading-[1.8]" />
            </div>

            <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row gap-4">
              <Link href="/news/youtube" className="flex-[1] flex justify-center items-center py-5 rounded-[1.25rem] bg-slate-100 font-black text-ink-muted">취소</Link>
              <button type="submit" disabled={isSubmitting} className="flex-[2] flex justify-center items-center gap-3 py-5 rounded-[1.25rem] bg-red-600 hover:bg-red-700 text-white font-black text-[19px] transition-all disabled:opacity-50">
                {isSubmitting ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={20} /> 유튜브 소식 등록하기</>}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
