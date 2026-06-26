'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, ChevronRight, UploadCloud, X, ArrowLeft, Send, Newspaper, Link as LinkIcon } from 'lucide-react';
import { createNews } from '../../actions';

export default function MediaWritePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [sourceName, setSourceName] = useState('');
  const [sourceUrl, setSourceUrl] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDragOver = (e: React.DragEvent) => e.preventDefault();
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };
  const removeFile = (index: number) => setFiles((prev) => prev.filter((_, i) => i !== index));
  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFiles((prev) => [...prev, ...Array.from(e.target.files!)]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('제목과 내용을 입력해 주세요.');
      return;
    }

    setIsSubmitting(true);
    setErrorVisible(false);

    try {
      const formData = new FormData();
      formData.append('type', 'media');
      formData.append('title', title);
      formData.append('content', content);
      formData.append('source_name', sourceName);
      formData.append('source_url', sourceUrl);
      files.forEach((file) => formData.append('files', file));

      const result = await createNews(formData);
      if (result.success) {
        alert('보도 자료가 성공적으로 등록 되었습니다.');
        window.location.href = '/news/media';
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      setErrorMessage(err.message || '저장 중 오류가 발생했습니다.');
      setErrorVisible(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pt-[96px]">
      <div className="max-w-[1000px] mx-auto px-6 py-16">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-[14px] text-ink-muted font-bold mb-10 tracking-tight">
          <Link href="/" className="hover:text-primary transition-colors">
            <Home size={16} strokeWidth={2.5} />
          </Link>
          <ChevronRight size={14} strokeWidth={2.5} />
          <Link href="/news/media" className="text-ink-muted">병원소식 / 방송보도</Link>
          <ChevronRight size={14} strokeWidth={2.5} />
          <span className="text-ink">보도자료 등록</span>
        </div>

        <Link href="/news/media" className="inline-flex items-center gap-2 text-ink font-black text-[24px] tracking-tight hover:text-primary transition-colors mb-12">
          <ArrowLeft size={28} strokeWidth={2.5} />
          새 보도자료 작성
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[2rem] p-10 md:p-14 shadow-sm border border-slate-100"
        >
          <div className="mb-12">
            <h2 className="text-[32px] md:text-[40px] font-black text-ink tracking-tighter mb-4">
              언론 보도 소식을 기록합니다
            </h2>
            <p className="text-ink-muted text-[16px] md:text-[18px] font-bold tracking-tight">
              연세척병원의 대외적인 활동과 언론 보도를 체계적으로 관리하세요.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {errorVisible && (
              <div className="p-4 bg-red-50 text-red-500 font-bold rounded-xl text-center border border-red-100">
                {errorMessage}
              </div>
            )}

            {/* Media Info Section */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <label className="block text-[16px] font-black text-ink tracking-tight flex items-center gap-2">
                  <Newspaper size={18} className="text-primary" /> 언론사명
                </label>
                <input 
                  type="text" 
                  value={sourceName}
                  onChange={(e) => setSourceName(e.target.value)}
                  placeholder="예: KBS 뉴스, 동아일보 등"
                  className="w-full px-6 py-5 rounded-[1.25rem] border-2 border-slate-100 bg-white font-bold text-ink outline-none focus:border-primary transition-all"
                />
              </div>
              <div className="space-y-4">
                <label className="block text-[16px] font-black text-ink tracking-tight flex items-center gap-2">
                  <LinkIcon size={18} className="text-primary" /> 기사 원문 URL
                </label>
                <input 
                  type="url" 
                  value={sourceUrl}
                  onChange={(e) => setSourceUrl(e.target.value)}
                  placeholder="https://..."
                  className="w-full px-6 py-5 rounded-[1.25rem] border-2 border-slate-100 bg-white font-bold text-ink outline-none focus:border-primary transition-all"
                />
              </div>
            </div>

            {/* Title */}
            <div className="space-y-4">
              <label className="block text-[16px] font-black text-ink tracking-tight">보도 제목 <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="w-full px-6 py-5 rounded-[1.25rem] border-2 border-slate-100 bg-white font-bold text-ink text-[18px] outline-none focus:border-primary transition-all"
              />
            </div>

            {/* Content Container */}
            <div className="space-y-4">
              <label className="block text-[16px] font-black text-ink tracking-tight">보도 내용 / 요약 <span className="text-red-500">*</span></label>
              <textarea 
                rows={10}
                required
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full px-8 py-7 rounded-[1.5rem] border-2 border-slate-100 bg-white font-bold text-ink text-[17px] leading-[1.8] outline-none focus:border-primary transition-all resize-none"
              />
            </div>

            {/* Photos */}
            <div className="space-y-4">
              <label className="block text-[16px] font-black text-ink tracking-tight">이미지 첨부 (보도 스크린샷 등)</label>
              <div 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className="border-2 border-dashed rounded-[2rem] p-12 flex flex-col items-center justify-center bg-slate-50 hover:bg-primary/5 transition-all group relative"
              >
                <input type="file" multiple onChange={handleFileSelect} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer" accept="image/*" />
                <div className="w-16 h-16 bg-white shadow-sm rounded-full flex items-center justify-center text-ink-muted group-hover:text-primary mb-4 transition-all">
                  <UploadCloud size={30} />
                </div>
                <p className="font-bold text-ink text-[18px] mb-1">드래그하거나 클릭하여 업로드</p>
                <p className="text-ink-muted text-[14px]">JPG, PNG, WEBP 지원</p>
              </div>

              {files.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-6">
                  {files.map((file, idx) => (
                    <div key={idx} className="relative group rounded-[1rem] overflow-hidden border border-slate-200 bg-white flex items-center p-3 pr-5 min-w-[200px]">
                      <div className="flex-1 truncate text-[14px] font-bold text-ink">{file.name}</div>
                      <button onClick={() => removeFile(idx)} className="ml-3 p-1 text-slate-300 hover:text-red-500"><X size={16} /></button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Submit */}
            <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row gap-4">
              <Link href="/news/media" className="flex-[1] flex justify-center items-center py-5 rounded-[1.25rem] bg-slate-100 font-black text-ink-muted">취소</Link>
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="flex-[2] flex justify-center items-center gap-3 py-5 rounded-[1.25rem] bg-navy-950 hover:bg-primary text-white font-black text-[19px] transition-all disabled:opacity-50"
              >
                {isSubmitting ? <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" /> : <><Send size={20} /> 보도자료 등록하기</>}
              </button>
            </div>
          </form>
        </motion.div>
      </div>
    </main>
  );
}
