'use client';

import SubHero from '@/components/SubHero';
import ConsultationDatePicker from '@/components/ConsultationDatePicker';
import { useState } from 'react';
import { supabase } from '@/lib/supabase';
import {
  CONSULTATION_TOPICS,
  MARKETING_CONSENT_TEXT,
  PRIVACY_CONSENT_TEXT,
} from '@/lib/consultationForm';
import { submitConsultation } from '@/lib/submitConsultation';

export default function ConsultationPage() {
  const [formData, setFormData] = useState({
    consultationType: '',
    preferredDate: '',
    name: '',
    phone: '',
    message: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isAgreed, setIsAgreed] = useState(true);
  const [isMarketingAgreed, setIsMarketingAgreed] = useState(true);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.consultationType || !formData.preferredDate || !formData.name || !formData.phone || !formData.message) {
      alert('필수 정보(상담내용, 희망 날짜, 이름, 연락처, 상담 내용)를 모두 입력해 주세요.');
      return;
    }

    if (!isAgreed) {
      alert('개인정보 수집 및 이용에 동의해 주세요.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await submitConsultation(supabase, {
        name: formData.name,
        phone: formData.phone,
        message: formData.message,
        consultationType: formData.consultationType,
        preferredDate: formData.preferredDate,
        marketingAgreed: isMarketingAgreed,
      });

      if (error) {
        throw new Error(error);
      }

      setFormData({ 
        consultationType: '',
        preferredDate: '',
        name: '', 
        phone: '', 
        message: ''
      });
      setIsAgreed(true);
      setIsMarketingAgreed(true);
      alert('상담 신청이 완료되었습니다. 전문 상담사 확인 후 성심성의껏 답변드리겠습니다.');
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : '알 수 없는 오류';
      console.error('Error submitting consultation:', message);
      alert('상담 등록 중 오류가 발생했습니다. 다시 시도해 주시기 바랍니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SubHero 
        title="온라인 상담" 
        subtitle="증상에 대한 궁금증을 전문 상담사가 직접 명확하고 친절하게 상담해 드립니다."
        path={[{ name: '커뮤니티' }, { name: '온라인 상담' }]}
        bgImage="/hero-bg.png"
      />

      <section className="flex-grow bg-white py-14 sm:py-16 md:py-24">
        <div className="mx-auto w-full max-w-4xl px-4 sm:px-6">
          <div className="space-y-8 rounded-2xl border border-slate-200 bg-white p-4 shadow-premium sm:space-y-10 sm:p-6 md:space-y-12 md:rounded-[2rem] md:p-16">
            
            <div className="text-center space-y-4">
              <h2 className="break-keep text-[26px] font-black tracking-tight text-ink sm:text-3xl">전문 상담사 1:1 상담</h2>
              <p className="break-keep text-[15px] font-medium leading-[1.75] text-ink-muted sm:text-base">
                현재 겪고 계시는 통증이나 증상을 자세히 적어주시면, 전문 상담사가 직접 답변을 드립니다.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-7 sm:space-y-8 md:space-y-10">
              <div className="space-y-6 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:p-6 md:space-y-8 md:p-8">
                <h3 className="text-lg font-bold text-ink border-b border-slate-200 pb-3">상담 정보</h3>

                <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 md:gap-8">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-ink-sub">상담내용 <span className="text-red-500">*</span></label>
                    <select
                      name="consultationType"
                      value={formData.consultationType}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 font-medium text-ink transition-all focus:border-primary focus:outline-none sm:px-5 sm:py-4"
                      required
                    >
                      <option value="">상담내용을 선택해 주세요</option>
                      {CONSULTATION_TOPICS.map((topic) => (
                        <option key={topic} value={topic}>{topic}</option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-3">
                    <label className="text-sm font-bold text-ink-sub">희망 날짜 <span className="text-red-500">*</span></label>
                    <ConsultationDatePicker
                      value={formData.preferredDate}
                      onChange={(value) => setFormData((prev) => ({ ...prev, preferredDate: value }))}
                      variant="light"
                      placeholder="희망 날짜를 선택해 주세요"
                    />
                  </div>
                </div>
              </div>
              
              {/* === 기본 정보 입력 === */}
              <div className="space-y-6 rounded-2xl border border-slate-100 bg-slate-50 p-4 sm:p-6 md:space-y-8 md:p-8">
                <h3 className="text-lg font-bold text-ink border-b border-slate-200 pb-3">환자 기본 정보</h3>
                
                <div className="grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2 md:gap-8">
                  {/* 이름 & 연락처 */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-ink-sub">이름 <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 font-medium text-ink transition-all focus:border-primary focus:outline-none sm:px-5 sm:py-4"
                      placeholder="이름을 입력해 주세요"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-ink-sub">연락처 <span className="text-red-500">*</span></label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full rounded-xl border border-slate-200 bg-white px-4 py-3.5 font-medium text-ink transition-all focus:border-primary focus:outline-none sm:px-5 sm:py-4"
                      placeholder="010-0000-0000"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* === 상담 내용 === */}
              <div className="space-y-3">
                <label className="text-sm font-bold text-ink-sub">상담 내용 <span className="text-red-500">*</span></label>
                <textarea 
                  name="message"
                  value={formData.message}
                  onChange={handleInputChange}
                  rows={8}
                  className="w-full resize-y rounded-xl border border-slate-200 bg-white px-4 py-3.5 font-medium text-ink transition-all focus:border-primary focus:outline-none sm:px-5 sm:py-4"
                  placeholder={`예) 허리 통증이 심한데 디스크일까요? 
과거 수술 이력이 있는데도 상담을 받고 싶습니다. 등 증상과 궁금한 점을 최대한 자세하게 적어주시면 정확한 상담이 가능합니다.`}
                  required
                />
              </div>

              {/* === 개인정보 처리방침 === */}
              <div className="space-y-4 pt-4 border-t border-slate-100">
                <label className="text-sm font-bold text-ink-sub">개인정보 수집 및 이용 동의 <span className="text-red-500">*</span></label>
                <div className="h-48 overflow-y-auto whitespace-pre-line rounded-xl border border-slate-200 bg-slate-50 p-4 text-[13px] font-medium leading-[1.7] text-ink-sub sm:p-5">
                  {PRIVACY_CONSENT_TEXT}
                </div>
                
                <div className="flex items-start gap-3 pt-2">
                  <input 
                    type="checkbox" 
                    id="privacy-agree" 
                    checked={isAgreed}
                    onChange={(e) => setIsAgreed(e.target.checked)}
                    className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-slate-300 text-primary focus:ring-primary"
                    required 
                  />
                  <label htmlFor="privacy-agree" className="text-[15px] font-bold text-ink cursor-pointer select-none">
                    개인정보 수집 및 이용 목적에 동의합니다.
                  </label>
                </div>

                <label className="text-sm font-bold text-ink-sub block pt-5">마케팅 정보 수신 및 활용 동의 <span className="text-ink-muted">(선택)</span></label>
                <div className="h-40 overflow-y-auto whitespace-pre-line rounded-xl border border-slate-200 bg-slate-50 p-4 text-[13px] font-medium leading-[1.7] text-ink-sub sm:p-5">
                  {MARKETING_CONSENT_TEXT}
                </div>

                <div className="flex items-start gap-3 pt-2">
                  <input
                    type="checkbox"
                    id="marketing-agree"
                    checked={isMarketingAgreed}
                    onChange={(e) => setIsMarketingAgreed(e.target.checked)}
                    className="mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  <label htmlFor="marketing-agree" className="text-[15px] font-bold text-ink cursor-pointer select-none">
                    마케팅 정보 수신 및 활용에 동의합니다.
                  </label>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`flex w-full items-center justify-center gap-2 rounded-xl py-4 text-base font-black text-white shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 sm:rounded-[1.5rem] sm:py-5 sm:text-lg ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark active:scale-[0.98]'}`}
                >
                  {isSubmitting ? '상담 등록 중...' : '전문 상담사에게 상담 접수하기'}
                </button>
              </div>
              
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
