import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import ScrollReveal from '@/components/ScrollReveal';

interface UbeReferralCalloutProps {
  title: string;
  paragraphs: string[];
}

// 척추 질환 페이지에서 양방향 척추내시경(UBE) 페이지로 이어 주는 안내 블록입니다.
// 문구에는 UBE 페이지에 이미 적힌 사실만 씁니다.
export default function UbeReferralCallout({ title, paragraphs }: UbeReferralCalloutProps) {
  return (
    <section className="px-5 py-12 sm:px-6 md:py-20">
      <ScrollReveal className="mx-auto grid max-w-7xl grid-cols-1 overflow-hidden rounded-[1.25rem] bg-slate-50 ring-1 ring-slate-200/70 sm:rounded-[1.75rem] lg:grid-cols-[minmax(0,1fr)_auto] lg:items-center">
        <div className="space-y-4 p-6 sm:space-y-5 sm:p-10 md:p-12">
          <span className="block font-montserrat text-xs font-bold uppercase tracking-widest text-primary">
            UBE · Biportal Endoscopy
          </span>
          <h2 className="break-keep text-h3 leading-tight text-ink">{title}</h2>
          <div className="max-w-3xl space-y-3 break-keep text-base font-medium leading-[1.8] text-ink-sub md:text-lg md:leading-relaxed">
            {paragraphs.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </div>
        <div className="border-t border-slate-200 p-6 sm:p-10 md:p-12 lg:border-l lg:border-t-0">
          <Link
            href="/treatments/spine/ube"
            className="inline-flex w-full items-center justify-center gap-2 break-keep rounded-full bg-primary px-6 py-4 text-center text-[15px] font-bold text-white shadow-blue-glow transition-all hover:bg-primary-dark sm:w-auto sm:px-8 sm:text-base"
          >
            양방향 척추내시경(UBE) 알아보기
            <ArrowRight size={18} strokeWidth={2.4} aria-hidden />
          </Link>
        </div>
      </ScrollReveal>
    </section>
  );
}
