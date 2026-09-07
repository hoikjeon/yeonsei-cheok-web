'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import type { HomeReview } from '@/lib/adminReviews';

type ReviewTone = 'navy' | 'mist' | 'amber' | 'paper';

const toneStyles: Record<ReviewTone, { card: string; body: string; meta: string }> = {
  navy: {
    card: 'bg-[#10346f] text-white shadow-[0_26px_60px_-34px_rgba(16,52,111,0.72)]',
    body: 'text-white',
    meta: 'text-white/88',
  },
  mist: {
    card: 'bg-[#dfe6f5] text-ink shadow-[0_26px_60px_-42px_rgba(15,29,54,0.45)]',
    body: 'text-ink',
    meta: 'text-ink/84',
  },
  amber: {
    card: 'bg-[#f6bd00] text-ink shadow-[0_26px_60px_-38px_rgba(159,111,0,0.5)]',
    body: 'text-ink',
    meta: 'text-ink/84',
  },
  paper: {
    card: 'bg-[#e8eaee] text-ink shadow-[0_26px_60px_-42px_rgba(15,29,54,0.38)]',
    body: 'text-ink',
    meta: 'text-ink/84',
  },
};

const toneCycle: ReviewTone[] = ['navy', 'mist', 'amber', 'paper', 'navy', 'mist'];

const STEP_INTERVAL_MS = 3600;
const SLIDE_DURATION_MS = 1100;
const SLIDE_EASING = 'cubic-bezier(0.45, 0.05, 0.15, 1)';

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

export default function ReviewsShowcaseSection({ reviews }: { reviews: HomeReview[] }) {
  const trackRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [slotWidth, setSlotWidth] = useState(344);
  const [animated, setAnimated] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const total = reviews.length;
  const loops = total >= 5;

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track || track.children.length < 2) return;

      const first = track.children[0] as HTMLElement;
      const second = track.children[1] as HTMLElement;
      setSlotWidth(second.offsetLeft - first.offsetLeft);
    };

    measure();
    window.addEventListener('resize', measure);

    return () => window.removeEventListener('resize', measure);
  }, []);

  useEffect(() => {
    if (isPaused || shouldReduceMotion || !loops) return;

    const interval = window.setInterval(() => {
      setStep((current) => current + 1);
    }, STEP_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [isPaused, loops, shouldReduceMotion]);

  useEffect(() => {
    if (!loops || step < total) return;

    const timer = window.setTimeout(() => {
      setAnimated(false);
      setStep((current) => current - total);
    }, SLIDE_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [loops, step, total]);

  useEffect(() => {
    if (animated) return;

    const raf = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setAnimated(true));
    });

    return () => window.cancelAnimationFrame(raf);
  }, [animated]);

  const cards = loops ? [...reviews, ...reviews] : reviews;
  const transition = animated && !shouldReduceMotion ? `transform ${SLIDE_DURATION_MS}ms ${SLIDE_EASING}` : 'none';

  return (
    <section className="overflow-hidden bg-[#edf2fa] py-10 md:py-32" aria-labelledby="reviews-showcase-title">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-7 xl:px-10">
        <div className="grid grid-cols-1 items-start gap-6 md:gap-10 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="space-y-3.5 md:space-y-6">
            <h2
              id="reviews-showcase-title"
              className="break-keep text-[24px] font-extrabold leading-[1.25] tracking-normal text-black md:text-h2"
            >
              끄덕임으로 전해지는
              <br />
              환자들의 치료후기
            </h2>
            <p className="break-keep text-body-lg text-ink">
              수술 후 통증에서 벗어난 환자분들이 직접 남겨주신 생생한 회복 이야기를 만나보세요.
            </p>
            <p className="inline-flex max-w-full break-keep rounded-xl bg-[#dbe8ff] px-3.5 py-2 text-caption font-semibold leading-relaxed text-primary sm:rounded-full">
              ※ 자세한 내용은 로그인 후 확인할 수 있습니다.
            </p>
          </div>

          <Link
            href="/board/reviews"
            className="group inline-flex w-fit items-center gap-2.5 rounded-full border border-ink/45 px-4 py-2.5 text-[14px] font-bold text-ink transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white sm:gap-4 sm:px-8 sm:py-4 sm:text-body lg:mt-[108px]"
          >
            자세히보기
            <ArrowRight size={21} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      {reviews.length > 0 ? <div
        className="mt-6 overflow-hidden md:mt-16"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div
          ref={trackRef}
          className={`${loops ? 'ml-4 w-max sm:ml-7 md:-ml-44' : 'mx-auto w-fit max-w-full justify-center px-4 sm:px-7'} flex h-[252px] items-start gap-2 sm:h-[400px] sm:gap-7 md:h-[420px]`}
          style={{
            transform: `translateX(${-step * slotWidth}px)`,
            transition,
          }}
        >
          {cards.map((review, index) => {
            const tone = toneStyles[toneCycle[index % toneCycle.length]];
            const isLower = (((index - step) % 2) + 2) % 2 === 0;

            return (
              <article
                key={`${review.id}-${index}`}
                aria-hidden={index >= total}
                className={`flex h-[210px] w-[164px] shrink-0 flex-col rounded-[9px] px-3 py-3.5 sm:h-[342px] sm:w-[286px] sm:rounded-[14px] sm:px-7 sm:py-8 md:w-[320px] ${isLower ? 'translate-y-9 md:translate-y-[58px]' : 'translate-y-0'} ${tone.card}`}
                style={{
                  transition,
                }}
              >
                <p className={`line-clamp-4 break-keep text-[13px] font-bold leading-[1.4] tracking-normal sm:text-h4 sm:leading-[1.55] ${tone.body}`}>
                  {review.title}
                </p>
                <div className={`mt-auto flex items-center justify-end pt-3 text-[11px] font-medium tracking-normal sm:pt-10 sm:text-body ${tone.meta}`}>
                  <time dateTime={review.created_at}>{formatDate(review.created_at)}</time>
                </div>
              </article>
            );
          })}
        </div>
      </div> : <div className="mx-auto mt-10 max-w-7xl px-5 text-center text-sm font-semibold text-ink-muted sm:px-7 md:mt-16 xl:px-10">등록된 치료체험후기가 없습니다.</div>}

      {reviews.length > 0 && <div className="mx-auto mt-2.5 flex w-full max-w-7xl justify-center px-5 sm:px-7 md:mt-8 xl:px-10">
        <div className="flex items-center">
          <span className="h-[5px] w-11 rounded-full bg-[#10346f] md:h-1.5 md:w-[62px]" />
          <span className="h-[5px] w-[76px] rounded-full bg-white/70 md:h-1.5 md:w-[110px]" />
        </div>
      </div>}
    </section>
  );
}
