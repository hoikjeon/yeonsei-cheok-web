'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Home, ChevronRight, UploadCloud, X, ArrowLeft, Send } from 'lucide-react';
import { createReview } from '../actions';

const CATEGORIES = [
  '목',
  '허리',
  '무릎',
  '어깨',
  '손발'
];

export default function ReviewWritePage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorVisible, setErrorVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files) {
      setFiles((prev) => [...prev, ...Array.from(e.dataTransfer.files)]);
    }
  };

  const removeFile = (index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  };

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
      formData.append('title', title);
      formData.append('content', content);
      formData.append('category', category);
      files.forEach((file) => {
        formData.append('files', file);
      });

      const result = await createReview(formData);
      if (result.success) {
        alert('후기가 성공적으로 등록되었습니다.');
        window.location.href = '/board/reviews';
      } else {
        throw new Error(result.error);
      }
    } catch (err: any) {
      console.error('Submission error:', err);
      setErrorMessage(err.message || '저장 중 오류가 발생했습니다.');
      setErrorVisible(true);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-slate-50 pt-0 md:pt-[96px]">
      <div className="mx-auto max-w-[1000px] px-4 py-10 sm:px-6 sm:py-14 md:py-16">
        
        {/* Breadcrumb */}
        <div className="mb-6 flex flex-wrap items-center gap-1.5 text-[12px] font-bold tracking-tight text-ink-muted sm:mb-10 sm:gap-2 sm:text-[14px]">
          <Link href="/" className="hover:text-primary transition-colors">
            <Home size={16} strokeWidth={2.5} />
          </Link>
          <ChevronRight size={14} strokeWidth={2.5} />
          <Link href="/board/reviews" className="hover:text-primary transition-colors cursor-pointer">커뮤니티</Link>
          <ChevronRight size={14} strokeWidth={2.5} />
          <Link href="/board/reviews" className="hover:text-primary transition-colors cursor-pointer">치료체험후기</Link>
        </div>

        {/* Back navigation */}
        <Link href="/board/reviews" className="mb-8 inline-flex items-center gap-2 text-[20px] font-black tracking-tight text-ink transition-colors hover:text-primary sm:mb-12 sm:text-[24px]">
          <ArrowLeft size={28} strokeWidth={2.5} />
          새로운 후기 작성
        </Link>
        
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm sm:p-6 md:rounded-[2rem] md:p-14"
        >
          {/* Header */}
          <div className="mb-8 text-center sm:mb-12 md:text-left">
            <h2 className="mb-4 break-keep text-[26px] font-black leading-[1.3] tracking-tight text-ink sm:text-[32px] md:text-[40px]">
              회복의 이야기를 들려주세요
            </h2>
            <p className="break-keep text-[15px] font-bold leading-[1.75] tracking-tight text-ink-muted sm:text-[16px] md:text-[18px] md:leading-relaxed">
              환자분의 소중한 경험이 다른 분들께 큰 희망이 됩니다.<br className="hidden md:block"/>
              사진과 함께 상세한 이야기를 적어주시면 더욱 좋습니다.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-7 sm:space-y-10">
            {/* Error Message */}
            {errorVisible && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="p-4 bg-red-50 border border-red-100 text-red-500 font-bold rounded-xl text-center">
                {errorMessage}
              </motion.div>
            )}

            {/* Category selection */}
            <div className="space-y-4 relative">
              <label className="block text-[16px] font-black text-ink tracking-tight text-center md:text-left">진료 과목 <span className="text-red-500">*</span></label>
              <div className="relative">
                <button 
                  type="button" 
                  disabled={isSubmitting}
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex w-full items-center justify-between rounded-xl border-2 border-slate-100 bg-slate-50 px-4 py-4 text-left text-[16px] font-bold text-ink-sub transition-all focus:border-primary focus:outline-none active:scale-[0.99] sm:rounded-[1.25rem] sm:px-6 sm:py-5 sm:text-[17px]"
                >
                  {category}
                  <ChevronRight size={20} className={`transform transition-transform ${isDropdownOpen ? 'rotate-90 text-primary' : 'text-ink-muted'}`} />
                </button>
                
                <AnimatePresence>
                  {isDropdownOpen && (
                    <motion.ul 
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute z-10 top-full left-0 right-0 mt-3 bg-white rounded-[1.25rem] shadow-2xl border border-slate-100 overflow-hidden max-h-60 overflow-y-auto"
                    >
                      {CATEGORIES.map(cat => (
                        <li 
                          key={cat} 
                          onClick={() => { setCategory(cat); setIsDropdownOpen(false); }}
                          className="px-6 py-5 hover:bg-slate-50 font-bold tracking-tight text-ink-sub cursor-pointer transition-colors"
                        >
                          {cat}
                        </li>
                      ))}
                    </motion.ul>
                  )}
                </AnimatePresence>
              </div>
            </div>

            {/* Title */}
            <div className="space-y-4">
              <label className="block text-[16px] font-black text-ink tracking-tight text-center md:text-left">제목 <span className="text-red-500">*</span></label>
              <input 
                type="text" 
                required
                disabled={isSubmitting}
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="어떤 치료를 받으셨나요? (예: 허리 디스크 비수술 치료 후기)"
                className="w-full rounded-xl border-2 border-slate-100 bg-white px-4 py-4 text-[16px] font-bold tracking-tight text-ink placeholder:text-ink-muted transition-all focus:border-primary focus:bg-primary/5 focus:outline-none sm:rounded-[1.25rem] sm:px-6 sm:py-5 sm:text-[17px]"
              />
            </div>

            {/* Photo Attachment (Drag & Drop) */}
            <div className="space-y-4">
              <label className="block text-[16px] font-black text-ink tracking-tight flex items-center justify-center md:justify-start gap-2">
                사진 첨부
                <span className="text-[14px] font-medium text-ink-muted bg-slate-100 px-3 py-1 rounded-full">선택사항</span>
              </label>
              <div 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                className={`group relative flex flex-col items-center justify-center rounded-2xl border-2 border-dashed bg-slate-50 p-6 text-center transition-all sm:p-8 md:rounded-[2rem] md:p-12 ${isSubmitting ? 'opacity-50 pointer-events-none' : 'hover:bg-primary/5 hover:border-primary/30'}`}
              >
                <input 
                  type="file" 
                  multiple 
                  disabled={isSubmitting}
                  onChange={handleFileSelect}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  accept="image/png, image/jpeg, image/webp"
                />
                <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-white text-ink-muted shadow-sm transition-all group-hover:scale-110 group-hover:text-primary sm:h-20 sm:w-20">
                  <UploadCloud size={32} strokeWidth={2.5} />
                </div>
                <p className="mb-2 break-keep text-[17px] font-black tracking-tight text-ink transition-colors group-hover:text-primary sm:text-[20px]">
                  사진을 여기에 드래그하거나 클릭하세요
                </p>
                <p className="text-ink-muted font-bold text-[15px] tracking-tight">
                  최대 5장 (JPG, PNG, WEBP 지원)
                </p>
              </div>

              {/* Uploaded Files Preview */}
              {files.length > 0 && (
                <div className="flex flex-wrap gap-4 mt-6 justify-center md:justify-start">
                  {files.map((file, idx) => (
                    <div key={idx} className="group relative flex w-full min-w-0 items-center overflow-hidden rounded-[1.25rem] border border-slate-200 bg-white p-3 pr-4 shadow-sm sm:w-auto sm:min-w-[240px] sm:pr-5">
                      <div className="w-14 h-14 bg-slate-50 rounded-xl flex-shrink-0 mr-4 flex items-center justify-center">
                        <span className="text-[11px] font-black text-ink-muted font-montserrat uppercase tracking-widest">{file.name.split('.').pop()}</span>
                      </div>
                      <div className="flex-1 truncate space-y-1">
                        <p className="text-[14px] font-bold text-ink truncate tracking-tight">{file.name}</p>
                        <p className="text-[12px] font-bold text-ink-muted">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                      {!isSubmitting && (
                        <button 
                          onClick={() => removeFile(idx)}
                          className="p-2 text-slate-300 hover:text-red-500 hover:bg-red-50 rounded-full transition-colors shrink-0 ml-2"
                        >
                          <X size={18} strokeWidth={3} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Content Textarea */}
            <div className="space-y-4">
              <label className="block text-[16px] font-black text-ink tracking-tight text-center md:text-left">치료 후기 <span className="text-red-500">*</span></label>
              <textarea 
                rows={12}
                disabled={isSubmitting}
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder={'치료 전/후의 변화, 의료진의 친절도, 병원 시설 등 자유롭게 적어주세요!\n\n(예: 허리 통증으로 고생하다가 내시경 치료를 받았는데 다음날 바로 걸어서 퇴원했습니다...)'}
                className="w-full resize-none rounded-xl border-2 border-slate-100 bg-white px-4 py-4 text-[16px] font-bold leading-[1.75] tracking-tight text-ink placeholder:text-slate-300 transition-all focus:border-primary focus:bg-primary/5 focus:outline-none sm:rounded-[1.5rem] sm:px-8 sm:py-7 sm:text-[17px] sm:leading-[1.8]"
              />
            </div>

            {/* Actions */}
            <div className="pt-8 border-t border-slate-100 flex flex-col md:flex-row gap-4">
              <Link 
                href="/board/reviews"
                className="flex-[1] flex justify-center items-center py-5 rounded-[1.25rem] bg-slate-100 hover:bg-slate-200 text-ink-sub font-black text-[18px] transition-colors"
              >
                취소하기
              </Link>
              <button 
                type="submit"
                disabled={isSubmitting}
                className="flex-[2] flex justify-center items-center gap-3 py-5 rounded-[1.25rem] bg-navy-950 hover:bg-primary hover:shadow-blue-glow text-white font-black text-[19px] transition-all disabled:opacity-50 disabled:cursor-not-allowed group"
              >
                {isSubmitting ? (
                  <div className="w-6 h-6 border-4 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send size={20} strokeWidth={2.5} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                    작성 완료하기
                  </>
                )}
              </button>
            </div>
            
          </form>
        </motion.div>
      </div>
    </main>
  );
}
