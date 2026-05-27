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
    <main className="min-h-screen bg-slate-50 pt-[96px]">
      <div className="max-w-[1000px] mx-auto px-6 py-16">
        <div className="flex items-center gap-2 text-[14px] text-slate-500 font-bold mb-10 tracking-tight">
          <Link href="/" className="hover:text-primary transition-colors"><Home size={16} strokeWidth={2.5} /></Link>
          <ChevronRight size={14} strokeWidth={2.5} />
          <Link href="/news/youtube" className="text-slate-400">병원소식 / 유튜브</Link>
          <ChevronRight size={14} strokeWidth={2.5} />
          <span className="text-navy-950">영상 소식 등록</span>
        </div>

        <Link href="/news/youtube" className="inline-flex items-center gap-2 text-navy-950 font-black text-[24px] tracking-tight hover:text-primary transition-colors mb-12">
          <ArrowLeft size={28} strokeWidth={2.5} /> 유튜브 소식 작성
        </Link>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2rem] p-10 md:p-14 shadow-sm border border-slate-100">
          <h2 className="text-[32px] md:text-[40px] font-black text-navy-950 tracking-tighter mb-8 flex items-center gap-4">
             <div className="w-16 h-16 bg-red-600 rounded-full flex items-center justify-center text-white"><Play size={30} fill="white" /></div> 
             새로운 영상 공유
          </h2>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-4">
              <label className="block text-[16px] font-black text-navy-950 tracking-tight flex items-center gap-2">
                <Video size={18} className="text-red-500" /> 유튜브 영상 링크 (URL) <span className="text-red-500">*</span>
              </label>
              <input type="url" required value={videoUrl} onChange={(e) => setVideoUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." className="w-full px-6 py-5 rounded-[1.25rem] border-2 border-slate-100 font-bold text-navy-950 text-[18px] outline-none focus:border-red-500 transition-all bg-slate-50 focus:bg-white" />
            </div>

            <div className="space-y-4">
              <label className="block text-[16px] font-black text-navy-950 tracking-tight">영상 제목 <span className="text-red-500">*</span></label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-6 py-5 rounded-[1.25rem] border-2 border-slate-100 font-bold text-navy-950 text-[18px] outline-none focus:border-primary transition-all" />
            </div>

            <div className="space-y-4">
              <label className="block text-[16px] font-black text-navy-950 tracking-tight">영상 요약 및 설명</label>
              <textarea rows={6} value={content} onChange={(e) => setContent(e.target.value)} className="w-full px-8 py-7 rounded-[1.5rem] border-2 border-slate-100 font-bold text-navy-950 text-[17px] leading-[1.8] outline-none focus:border-primary transition-all resize-none" />
            </div>

            <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row gap-4">
              <Link href="/news/youtube" className="flex-[1] flex justify-center items-center py-5 rounded-[1.25rem] bg-slate-100 font-black text-slate-500">취소</Link>
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
