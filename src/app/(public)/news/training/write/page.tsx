'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ChevronRight, UploadCloud, X, ArrowLeft, Send, Globe2 } from 'lucide-react';
import { createNews } from '../../actions';

export default function TrainingWritePage() {
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
      formData.append('type', 'training');
      formData.append('title', title);
      formData.append('content', content);
      files.forEach((file) => formData.append('files', file));

      const result = await createNews(formData);
      if (result.success) {
        alert('트레이닝 소식이 성공적으로 등록되었습니다.');
        window.location.href = '/news/training';
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
          <Link href="/news/training" className="text-slate-400">병원소식 / 트레이닝 센터</Link>
          <ChevronRight size={14} strokeWidth={2.5} />
          <span className="text-navy-950">트레이닝 소식 등록</span>
        </div>

        <Link href="/news/training" className="inline-flex items-center gap-2 text-navy-950 font-black text-[24px] tracking-tight hover:text-primary transition-colors mb-12">
          <ArrowLeft size={28} strokeWidth={2.5} /> 트레이닝 소식 작성
        </Link>
        
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-[2rem] p-10 md:p-14 shadow-sm border border-slate-100">
          <h2 className="text-[32px] md:text-[40px] font-black text-navy-950 tracking-tighter mb-8 flex items-center gap-4">
            <Globe2 size={40} className="text-blue-600" /> 글로벌 교육 활동 기록
          </h2>

          <form onSubmit={handleSubmit} className="space-y-10">
            <div className="space-y-4">
              <label className="block text-[16px] font-black text-navy-950 tracking-tight">소식 제목 <span className="text-red-500">*</span></label>
              <input type="text" required value={title} onChange={(e) => setTitle(e.target.value)} className="w-full px-6 py-5 rounded-[1.25rem] border-2 border-slate-100 font-bold text-navy-950 text-[18px] outline-none focus:border-primary transition-all" />
            </div>

            <div className="space-y-4">
              <label className="block text-[16px] font-black text-navy-950 tracking-tight">활동 내용 및 상세 정보 <span className="text-red-500">*</span></label>
              <textarea rows={10} required value={content} onChange={(e) => setContent(e.target.value)} className="w-full px-8 py-7 rounded-[1.5rem] border-2 border-slate-100 font-bold text-navy-950 text-[17px] leading-[1.8] outline-none focus:border-primary transition-all resize-none" />
            </div>

            <div className="space-y-4">
              <label className="block text-[16px] font-black text-navy-950 tracking-tight">첨부 이미지 (교육 현장 사진 등)</label>
              <div className="border-2 border-dashed rounded-[2rem] p-12 flex flex-col items-center justify-center bg-slate-50 hover:bg-primary/5 transition-all group relative">
                <input type="file" multiple onChange={(e) => e.target.files && setFiles((prev) => [...prev, ...Array.from(e.target.files!)])} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
                <UploadCloud size={40} className="text-slate-300 group-hover:text-primary mb-4 transition-all" />
                <p className="font-bold text-navy-950 text-[18px]">클릭하여 이미지를 업로드하세요</p>
              </div>
              {files.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-6">
                  {files.map((file, idx) => (
                    <div key={idx} className="relative group rounded-[1rem] overflow-hidden border border-slate-200 bg-white flex items-center p-3 pr-5 min-w-[200px]">
                      <span className="flex-1 truncate text-[14px] font-bold text-navy-950">{file.name}</span>
                      <button type="button" onClick={() => setFiles((prev) => prev.filter((_, i) => i !== idx))} className="ml-3 p-1 text-slate-300 hover:text-red-500"><X size={16} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row gap-4">
              <Link href="/news/training" className="flex-[1] flex justify-center items-center py-5 rounded-[1.25rem] bg-slate-100 font-black text-slate-500">취소</Link>
              <button type="submit" disabled={isSubmitting} className="flex-[2] flex justify-center items-center gap-3 py-5 rounded-[1.25rem] bg-navy-950 hover:bg-primary text-white font-black text-[19px] transition-all disabled:opacity-50">
                {isSubmitting ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={20} /> 트레이닝 소식 등록하기</>}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
