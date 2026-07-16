'use client';

import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';

type ReviewTone = 'navy' | 'mist' | 'amber' | 'paper';

type ReviewItem = {
  category: string;
  title: string;
  author: string;
  date: string;
};

const reviews: ReviewItem[] = [
  {
    category: '도수재활 클리닉',
    title: '발목 통증으로 방문해서 2달 간 체외충격파, 도수치료 꾸준히 받고 있어요.',
    author: 'G*H',
    date: '2025.09.01',
  },
  {
    category: '무릎 통증 클리닉',
    title: '무리해서 뛰다가 무릎 붓고 통증으로 한달 이상 참았어요.',
    author: 'Cr****IW',
    date: '2025.09.01',
  },
  {
    category: '도수재활 클리닉',
    title: '작년에 운동을 하다가 예상치 못한 부상을 입었습니다.',
    author: '구**5',
    date: '2025.09.01',
  },
  {
    category: '어깨 통증 클리닉',
    title: '지난 10월부터 다니는 병원입니다. 원장님이 너무 친절하시고 잘 치료해주세요.',
    author: '숲속**향기',
    date: '2025.09.01',
  },
  {
    category: '허리 통증 클리닉',
    title: '처음 방문했습니다. 다른 병원보다 상세하게 진료봐주시네요.',
    author: '테***쉬',
    date: '2025.08.06',
  },
  {
    category: '손발 통증 클리닉',
    title: '잦은 발목 부상으로 찾게 되었어요!',
    author: 'ho***17',
    date: '2025.08.04',
  },
  {
    category: '목 통증 클리닉',
    title: '평소 자세가 안 좋아 목과 어깨 통증이 심했는데 꼼꼼하게 봐주셨어요.',
    author: '바***늘',
    date: '2025.07.22',
  },
  {
    category: '무릎 통증 클리닉',
    title: '계단 오를 때마다 시큰했던 무릎이 치료 후 훨씬 편해졌습니다.',
    author: '산***길',
    date: '2025.07.14',
  },
  {
    category: '허리 통증 클리닉',
    title: '허리디스크 진단 후 비수술 치료로 일상생활이 많이 편해졌어요.',
    author: 'm***2',
    date: '2025.06.30',
  },
  {
    category: '어깨 통증 클리닉',
    title: '팔을 들기 힘들었는데 치료와 재활을 병행하면서 움직임이 좋아졌습니다.',
    author: '오***봄',
    date: '2025.06.12',
  },
  {
    category: '도수재활 클리닉',
    title: '야간 진료가 가능해서 퇴근 후에도 꾸준히 치료받을 수 있어 좋았습니다.',
    author: 'r***7',
    date: '2025.05.28',
  },
  {
    category: '손발 통증 클리닉',
    title: '발목을 자주 접질렀는데 원인을 자세히 설명해주셔서 안심이 됐어요.',
    author: '초***록',
    date: '2025.05.09',
  },
];

const toneStyles: Record<ReviewTone, { card: string; chip: string; body: string; meta: string }> = {
  navy: {
    card: 'bg-[#10346f] text-white shadow-[0_26px_60px_-34px_rgba(16,52,111,0.72)]',
    chip: 'bg-white text-ink',
    body: 'text-white',
    meta: 'text-white/88',
  },
  mist: {
    card: 'bg-[#dfe6f5] text-ink shadow-[0_26px_60px_-42px_rgba(15,29,54,0.45)]',
    chip: 'bg-white text-ink',
    body: 'text-ink',
    meta: 'text-ink/84',
  },
  amber: {
    card: 'bg-[#f6bd00] text-ink shadow-[0_26px_60px_-38px_rgba(159,111,0,0.5)]',
    chip: 'bg-white text-ink',
    body: 'text-ink',
    meta: 'text-ink/84',
  },
  paper: {
    card: 'bg-[#e8eaee] text-ink shadow-[0_26px_60px_-42px_rgba(15,29,54,0.38)]',
    chip: 'bg-white text-ink',
    body: 'text-ink',
    meta: 'text-ink/84',
  },
};

const toneCycle: ReviewTone[] = ['navy', 'mist', 'amber', 'paper', 'navy', 'mist'];

const STEP_INTERVAL_MS = 3600;
const SLIDE_DURATION_MS = 1100;
const LOWER_OFFSET_PX = 58;
const SLIDE_EASING = 'cubic-bezier(0.45, 0.05, 0.15, 1)';

export default function ReviewsShowcaseSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [slotWidth, setSlotWidth] = useState(344);
  const [animated, setAnimated] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const total = reviews.length;

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
    if (isPaused || shouldReduceMotion) return;

    const interval = window.setInterval(() => {
      setStep((current) => current + 1);
    }, STEP_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [isPaused, shouldReduceMotion]);

  useEffect(() => {
    if (step < total) return;

    const timer = window.setTimeout(() => {
      setAnimated(false);
      setStep((current) => current - total);
    }, SLIDE_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [step, total]);

  useEffect(() => {
    if (animated) return;

    const raf = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setAnimated(true));
    });

    return () => window.cancelAnimationFrame(raf);
  }, [animated]);

  const cards = [...reviews, ...reviews];
  const transition = animated && !shouldReduceMotion ? `transform ${SLIDE_DURATION_MS}ms ${SLIDE_EASING}` : 'none';

  return (
    <section className="overflow-hidden bg-[#edf2fa] py-16 md:py-32" aria-labelledby="reviews-showcase-title">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-7 xl:px-10">
        <div className="grid grid-cols-1 items-start gap-10 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="space-y-6">
            <h2
              id="reviews-showcase-title"
              className="break-keep text-h2 tracking-normal text-black"
            >
              끄덕임으로 전해지는
              <br />
              환자들의 치료후기
            </h2>
            <p className="break-keep text-body-lg text-ink">
              수술 후 통증에서 벗어난 환자분들이 직접 남겨주신 생생한 회복 이야기를 만나보세요.
            </p>
            <p className="inline-flex max-w-full break-keep rounded-xl bg-[#dbe8ff] px-3.5 py-2 text-caption font-semibold leading-relaxed text-primary sm:rounded-full">
              ※ 의료법 규정에 따라 자세한 내용은 로그인 후 확인할 수 있습니다.
            </p>
          </div>

          <Link
            href="/board/reviews"
            className="group inline-flex w-fit items-center gap-3 rounded-full border border-ink/45 px-6 py-3.5 text-body font-bold text-ink transition-all duration-300 hover:border-primary hover:bg-primary hover:text-white sm:gap-4 sm:px-8 sm:py-4 lg:mt-[108px]"
          >
            자세히보기
            <ArrowRight size={21} className="transition-transform duration-300 group-hover:translate-x-1" />
          </Link>
        </div>
      </div>

      <div
        className="mt-10 overflow-hidden md:mt-16"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        <div
          ref={trackRef}
          className="ml-5 flex h-[380px] w-max items-start gap-4 sm:ml-7 sm:gap-7 md:-ml-44 md:h-[420px]"
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
                key={`${review.title}-${index}`}
                aria-hidden={index >= total}
                className={`flex h-[300px] w-[calc(100vw-40px)] max-w-[286px] shrink-0 flex-col rounded-[22px] px-5 py-6 sm:h-[342px] sm:rounded-[28px] sm:px-7 sm:py-8 md:w-[320px] md:max-w-none ${tone.card}`}
                style={{
                  transform: `translateY(${isLower ? LOWER_OFFSET_PX : 0}px)`,
                  transition,
                }}
              >
                <span className={`inline-flex w-fit rounded-full px-4 py-2.5 text-caption font-bold leading-none sm:px-5 sm:py-3 ${tone.chip}`}>
                  {review.category}
                </span>
                <p className={`mt-5 line-clamp-4 break-keep text-h4 font-bold leading-[1.55] tracking-normal sm:mt-6 ${tone.body}`}>
                  {review.title}
                </p>
                <div className={`mt-auto flex items-center justify-between gap-4 pt-7 text-body font-medium tracking-normal sm:pt-10 ${tone.meta}`}>
                  <span>{review.author}</span>
                  <time dateTime={review.date.replaceAll('.', '-')}>{review.date}</time>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <div className="mx-auto mt-4 flex w-full max-w-7xl justify-center px-5 sm:px-7 md:mt-8 xl:px-10">
        <div className="flex items-center">
          <span className="h-1.5 w-[62px] rounded-full bg-[#10346f]" />
          <span className="h-1.5 w-[110px] rounded-full bg-white/70" />
        </div>
      </div>
    </section>
  );
}
