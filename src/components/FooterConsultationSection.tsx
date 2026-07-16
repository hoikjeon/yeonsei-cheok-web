'use client';

import { useEffect, useMemo, useRef, useState, type FormEvent, type ReactNode } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Check, ChevronDown, MessageCircle, MessageSquare, Pencil, X } from 'lucide-react';
import ConsultationDatePicker from '@/components/ConsultationDatePicker';
import { createClient } from '@/utils/supabase/client';
import {
  CONSULTATION_TOPICS,
  MARKETING_CONSENT_TEXT,
  PRIVACY_CONSENT_TEXT,
} from '@/lib/consultationForm';
import { submitConsultation } from '@/lib/submitConsultation';

type PolicyType = 'privacy' | 'marketing';

const NAVER_TALK_URL = '#';
const KAKAO_TALK_URL = '#';

const CONTACT_CHANNELS = [
  {
    label: '온라인상담',
    href: '/consultation',
    icon: <Pencil size={28} strokeWidth={1.8} />,
  },
  {
    label: '카카오톡 상담',
    href: KAKAO_TALK_URL,
    icon: <MessageCircle size={27} strokeWidth={1.8} />,
  },
  {
    label: '네이버톡톡 상담',
    href: NAVER_TALK_URL,
    icon: <MessageSquare size={27} strokeWidth={1.8} />,
  },
];

const ConsentCheckbox = ({
  checked,
  onChange,
  required,
  children,
}: {
  checked: boolean;
  onChange: (checked: boolean) => void;
  required?: boolean;
  children: ReactNode;
}) => (
  <label className="flex min-w-0 items-start gap-2.5 leading-relaxed">
    <input
      type="checkbox"
      checked={checked}
      onChange={(event) => onChange(event.target.checked)}
      className="peer sr-only"
      required={required}
    />
    <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-[3px] border border-white/75 bg-transparent transition-colors peer-focus-visible:ring-2 peer-focus-visible:ring-white/40">
      {checked ? <Check size={15} strokeWidth={3} className="text-white" /> : null}
    </span>
    <span className="min-w-0 flex-1">{children}</span>
  </label>
);

const PolicyModal = ({
  type,
  onClose,
}: {
  type: PolicyType;
  onClose: () => void;
}) => {
  const title = type === 'privacy' ? '개인정보 수집 · 이용 동의' : '마케팅 정보 수신 및 활용 동의';
  const content = type === 'privacy' ? PRIVACY_CONSENT_TEXT : MARKETING_CONSENT_TEXT;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center bg-navy-950/55 px-4 py-[calc(1rem_+_env(safe-area-inset-top))] backdrop-blur-sm sm:px-5">
      <div className="max-h-[calc(100dvh_-_2rem_-_env(safe-area-inset-top)_-_env(safe-area-inset-bottom))] w-full max-w-3xl overflow-hidden rounded-lg bg-white shadow-[0_30px_90px_-50px_rgba(10,20,40,0.75)]">
        <div className="flex items-center justify-between gap-3 border-b border-slate-100 px-4 py-4 sm:px-6 sm:py-5">
          <h3 className="break-keep text-h4 leading-snug tracking-tight text-ink">{title}</h3>
          <button
            type="button"
            onClick={onClose}
            className="flex h-10 w-10 items-center justify-center rounded-lg text-ink-muted transition-colors hover:bg-slate-100 hover:text-ink"
            aria-label="약관 닫기"
          >
            <X size={22} />
          </button>
        </div>
        <div className="max-h-[calc(100dvh_-_8rem_-_env(safe-area-inset-top)_-_env(safe-area-inset-bottom))] overflow-y-auto whitespace-pre-line px-4 py-5 text-[14px] font-medium leading-relaxed text-ink-sub sm:max-h-[64vh] sm:px-6 sm:py-6">
          {content}
        </div>
      </div>
    </div>
  );
};

export default function FooterConsultationSection() {
  const pathname = usePathname();
  const supabase = useMemo(() => createClient(), []);
  const selectRef = useRef<HTMLDivElement>(null);
  const [isSelectOpen, setIsSelectOpen] = useState(false);
  const [activePolicy, setActivePolicy] = useState<PolicyType | null>(null);
  const [isPrivacyAgreed, setIsPrivacyAgreed] = useState(true);
  const [isMarketingAgreed, setIsMarketingAgreed] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    consultationType: '',
    preferredDate: '',
    name: '',
    phone: '',
  });

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (!selectRef.current?.contains(event.target as Node)) {
        setIsSelectOpen(false);
      }
    };

    window.addEventListener('pointerdown', handlePointerDown);
    return () => window.removeEventListener('pointerdown', handlePointerDown);
  }, []);

  if (pathname.startsWith('/admin')) return null;

  const updateField = (name: keyof typeof formData, value: string) => {
    setFormData((current) => ({ ...current, [name]: value }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!formData.consultationType || !formData.preferredDate || !formData.name || !formData.phone) {
      alert('상담내용, 희망 날짜, 성함, 연락처를 모두 입력해 주세요.');
      return;
    }

    if (!isPrivacyAgreed) {
      alert('개인정보 수집 및 이용에 동의해 주세요.');
      return;
    }

    setIsSubmitting(true);

    const { error } = await submitConsultation(supabase, {
      name: formData.name,
      phone: formData.phone,
      consultationType: formData.consultationType,
      preferredDate: formData.preferredDate,
      marketingAgreed: isMarketingAgreed,
      message: '푸터 빠른 상담 신청입니다.',
    });

    setIsSubmitting(false);

    if (error) {
      alert(`상담 신청 중 오류가 발생했습니다: ${error}`);
      return;
    }

    alert('상담 신청이 완료되었습니다. 확인 후 빠르게 연락드리겠습니다.');
    setFormData({
      consultationType: '',
      preferredDate: '',
      name: '',
      phone: '',
    });
    setIsPrivacyAgreed(true);
    setIsMarketingAgreed(true);
  };

  return (
    <section className="relative z-20 overflow-visible bg-[linear-gradient(135deg,#162d5f_0%,#122951_100%)] px-5 pb-20 pt-16 text-white sm:px-6 md:pb-24 md:pt-20 lg:pb-40 lg:pt-32">
      {activePolicy ? <PolicyModal type={activePolicy} onClose={() => setActivePolicy(null)} /> : null}

      <div className="relative z-10 mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="break-keep text-h2 tracking-tight">
            회복을 위한 가장 빠른 시작
            <br />
            예약·상담은 기다림 없이 편하게
          </h2>
        </div>

        <div className="mx-auto mt-10 grid max-w-6xl grid-cols-1 gap-10 md:mt-12 lg:mt-16 lg:grid-cols-[minmax(0,560px)_minmax(420px,1fr)] lg:items-start lg:gap-16">
          <form onSubmit={handleSubmit} className="relative z-30 grid grid-cols-1 gap-2.5 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)_140px] md:gap-3">
            <div ref={selectRef} className="relative md:col-span-1">
              <button
                type="button"
                onClick={() => setIsSelectOpen((current) => !current)}
                className="flex h-12 w-full items-center justify-between rounded-md border border-white/50 bg-transparent px-4 text-left text-[16px] font-medium text-white transition-colors hover:border-white focus:outline-none focus:ring-2 focus:ring-white/30 md:px-5 md:text-[15px]"
                aria-expanded={isSelectOpen}
              >
                <span className={formData.consultationType ? 'text-white' : 'text-white/92'}>
                  {formData.consultationType || '상담내용 *'}
                </span>
                <ChevronDown size={19} className={`transition-transform ${isSelectOpen ? 'rotate-180' : ''}`} />
              </button>

              {isSelectOpen ? (
                <div className="absolute left-0 top-[calc(100%+1px)] z-[90] max-h-[314px] w-full overflow-y-auto rounded-md border border-slate-200 bg-white py-2 text-[#0B3470] shadow-[0_18px_44px_-30px_rgba(10,20,40,0.65)]">
                  <div className="px-4 py-3 text-[15px] font-bold">상담내용</div>
                  {CONSULTATION_TOPICS.map((topic) => (
                    <button
                      key={topic}
                      type="button"
                      onClick={() => {
                        updateField('consultationType', topic);
                        setIsSelectOpen(false);
                      }}
                      className={`block w-full px-4 py-3 text-left text-[15px] font-medium transition-colors hover:bg-slate-100 ${
                        formData.consultationType === topic ? 'bg-slate-50 text-primary' : ''
                      }`}
                    >
                      {topic}
                    </button>
                  ))}
                </div>
              ) : null}
            </div>

            <div className="min-w-0 [&_button]:text-[16px] md:[&_button]:text-[15px]">
              <ConsultationDatePicker
                value={formData.preferredDate}
                onChange={(value) => updateField('preferredDate', value)}
                variant="dark"
                placeholder="희망 날짜 *"
              />
            </div>

            <input
              type="text"
              value={formData.name}
              onChange={(event) => updateField('name', event.target.value)}
              className="h-12 min-w-0 rounded-md border border-white/50 bg-transparent px-4 text-[16px] font-medium text-white placeholder:text-white/92 focus:outline-none focus:ring-2 focus:ring-white/30 md:px-5 md:text-[15px]"
              placeholder="성함 *"
              required
            />

            <input
              type="tel"
              value={formData.phone}
              onChange={(event) => updateField('phone', event.target.value)}
              className="h-12 min-w-0 rounded-md border border-white/50 bg-transparent px-4 text-[16px] font-medium text-white placeholder:text-white/92 focus:outline-none focus:ring-2 focus:ring-white/30 md:px-5 md:text-[15px]"
              placeholder="연락처 *"
              required
            />

            <div className="mt-2 space-y-2 text-[13px] font-medium sm:text-[14px] md:col-span-2 md:mt-3">
              <ConsentCheckbox checked={isPrivacyAgreed} onChange={setIsPrivacyAgreed} required>
                (필수) 개인정보 수집 · 이용 동의
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    setActivePolicy('privacy');
                  }}
                  className="ml-2 font-bold underline-offset-4 hover:underline"
                >
                  [보기]
                </button>
              </ConsentCheckbox>

              <ConsentCheckbox checked={isMarketingAgreed} onChange={setIsMarketingAgreed}>
                (선택) 마케팅 정보 수신 및 활용 동의
                <button
                  type="button"
                  onClick={(event) => {
                    event.preventDefault();
                    setActivePolicy('marketing');
                  }}
                  className="ml-2 font-bold underline-offset-4 hover:underline"
                >
                  [보기]
                </button>
              </ConsentCheckbox>
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="min-h-12 rounded-md bg-white/16 px-6 text-[16px] font-bold text-white transition-all hover:bg-primary disabled:cursor-not-allowed disabled:bg-white/10 md:col-start-3 md:row-span-2 md:row-start-1 md:min-h-[108px]"
            >
              {isSubmitting ? '신청 중' : '신청하기'}
            </button>
          </form>

          <div className="grid grid-cols-3 gap-2 text-center sm:gap-5 lg:self-start lg:gap-7 lg:pt-4">
            {CONTACT_CHANNELS.map((channel) => (
              <Link
                key={channel.label}
                href={channel.href}
                className="group flex min-w-0 flex-col items-center gap-3 text-white sm:gap-5"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-white/12 transition-all duration-300 group-hover:scale-105 group-hover:bg-white/20 sm:h-16 sm:w-16 md:h-[74px] md:w-[74px]">
                  {channel.icon}
                </span>
                <span className="break-keep text-[13px] font-bold leading-[1.35] tracking-tight transition-colors group-hover:text-white/75 sm:text-[14px] md:text-[15px]">
                  {channel.label}
                </span>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
