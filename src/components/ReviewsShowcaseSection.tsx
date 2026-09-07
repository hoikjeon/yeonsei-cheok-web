'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import type { HomeReview } from '@/lib/adminReviews';

type ReviewTone = 'navy' | 'mist' | 'amber' | 'paper';

const toneStyles: Record<ReviewTone, { card: string; body: string; meta: string; badge: string }> = {
  navy: {
    card: 'bg-[#10346f] text-white shadow-[0_26px_60px_-34px_rgba(16,52,111,0.72)]',
    body: 'text-white',
    meta: 'text-white/88',
    badge: 'bg-white text-[#10346f]',
  },
  mist: {
    card: 'bg-[#dfe6f5] text-ink shadow-[0_26px_60px_-42px_rgba(15,29,54,0.45)]',
    body: 'text-ink',
    meta: 'text-ink/84',
    badge: 'bg-white text-ink',
  },
  amber: {
    card: 'bg-[#f6bd00] text-ink shadow-[0_26px_60px_-38px_rgba(159,111,0,0.5)]',
    body: 'text-ink',
    meta: 'text-ink/84',
    badge: 'bg-white text-ink',
  },
  paper: {
    card: 'bg-[#e8eaee] text-ink shadow-[0_26px_60px_-42px_rgba(15,29,54,0.38)]',
    body: 'text-ink',
    meta: 'text-ink/84',
    badge: 'bg-white text-ink',
  },
};

const toneCycle: ReviewTone[] = ['navy', 'mist', 'amber', 'paper', 'navy', 'mist'];

// 한 칸을 짧고 빠르게 밀고 나서 길게 쉽니다. '탁 … 탁 …' 하는 리듬을 만드는 값들입니다.
const STEP_INTERVAL_MS = 3300;
const SLIDE_DURATION_MS = 750;
// 끝에서 강하게 감속해 카드가 자리에 꽂히는 느낌을 줍니다.
const SLIDE_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

export default function ReviewsShowcaseSection({ reviews }: { reviews: HomeReview[] }) {
  const [step, setStep] = useState(0);
  const [animated, setAnimated] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const shouldReduceMotion = useReducedMotion();
  const total = reviews.length;
  const loops = total >= 5;
  const isMoving = loops && !shouldReduceMotion;

  // 한 바퀴의 카드 수는 짝수여야 합니다. 홀수면 되감기는 순간 위아래 지그재그가 뒤집혀 튑니다.
  const unit = total % 2 === 0 ? total : total * 2;
  // 트랙을 정확히 두 벌로 채워두면, 한 바퀴 끝에서 처음으로 되감아도 화면이 똑같아 이음새가 보이지 않습니다.
  const cards = loops
    ? Array.from({ length: unit * 2 }, (_, index) => reviews[index % total])
    : reviews;

  // 트랙(가로)과 카드(세로)가 이 값을 그대로 나눠 쓰므로 두 움직임은 같은 순간에 시작하고 끝납니다.
  // translate 를 반드시 함께 적어야 합니다. Tailwind v4의 translate-y-* 는 transform 이 아니라
  // 독립된 translate 속성으로 컴파일되므로, transform 만 지정하면 세로가 전환 없이 순간이동합니다.
  const slideTransition =
    animated && isMoving
      ? `transform ${SLIDE_DURATION_MS}ms ${SLIDE_EASING}, translate ${SLIDE_DURATION_MS}ms ${SLIDE_EASING}`
      : 'none';
  // 카드는 위 전환에 더해 마우스를 올렸을 때의 확대만 짧게 따로 겁니다.
  // (scale 은 translate 와 별개 속성이라 지그재그 이동과 서로 간섭하지 않습니다.)
  const cardTransition = slideTransition === 'none' ? 'scale 200ms ease-out' : `${slideTransition}, scale 200ms ease-out`;

  useEffect(() => {
    if (isPaused || !isMoving) return;

    const interval = window.setInterval(() => {
      setStep((current) => current + 1);
    }, STEP_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [isPaused, isMoving]);

  // 두 벌 중 첫 벌을 다 지나가면, 미끄러짐이 끝난 직후 전환 없이 처음으로 되감습니다.
  useEffect(() => {
    if (!isMoving || step < unit) return;

    const timer = window.setTimeout(() => {
      setAnimated(false);
      setStep(0);
    }, SLIDE_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [isMoving, step, unit]);

  // 되감은 좌표가 화면에 반영된 다음 프레임에 전환을 다시 켭니다.
  useEffect(() => {
    if (animated) return;

    const raf = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setAnimated(true));
    });

    return () => window.cancelAnimationFrame(raf);
  }, [animated]);

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
          // --slot 은 '카드 너비 + 오른쪽 여백'입니다. 카드 크기를 바꾸면 이 값도 같이 맞춰야
          // 한 스텝이 정확히 한 칸이 됩니다. (164+8 / 286+28 / 320+28)
          // 간격을 gap 대신 카드의 오른쪽 여백으로 준 것도 이 계산을 어긋나지 않게 하기 위해서입니다.
          className={`${loops ? 'ml-4 w-max sm:ml-7 md:-ml-44' : 'mx-auto -mr-2 w-fit max-w-full justify-center px-4 sm:-mr-7 sm:px-7'} flex h-[206px] items-start [--slot:172px] sm:h-[330px] sm:[--slot:314px] md:h-[386px] md:[--slot:348px]`}
          style={{
            transform: `translateX(calc(var(--slot) * ${-step}))`,
            transition: slideTransition,
            willChange: 'transform',
          }}
        >
          {cards.map((review, index) => {
            const tone = toneStyles[toneCycle[index % toneCycle.length]];
            // 위아래는 카드가 아니라 '자리'에 붙어 있습니다. 한 칸 밀릴 때마다 카드가
            // 반대편 높이의 자리로 옮겨가므로, 옆으로 미는 동안 위아래도 같이 바뀝니다.
            // 트랙과 완전히 같은 시간·같은 이징을 쓰기 때문에 카드는 대각선 한 번으로 이동합니다.
            const isLower = (((index - step) % 2) + 2) % 2 === 0;

            // 두 번째 벌은 화면을 채우기 위한 복제본이라 보조기기와 키보드 이동에서 제외합니다.
            const isDuplicate = index >= total;

            return (
              <Link
                key={`${review.id}-${index}`}
                href={`/board/reviews/${review.id}`}
                aria-hidden={isDuplicate}
                tabIndex={isDuplicate ? -1 : undefined}
                className={`mr-2 flex size-[164px] shrink-0 flex-col rounded-[9px] px-3 py-3.5 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40 sm:mr-7 sm:size-[286px] sm:rounded-[14px] sm:px-5 sm:py-6 md:size-[320px] md:px-7 md:py-7 ${tone.card} ${isLower ? 'translate-y-9 md:translate-y-[58px]' : 'translate-y-0'}`}
                style={{ transition: cardTransition }}
              >
                {review.category ? (
                  <span className={`mb-2 inline-flex w-fit shrink-0 rounded-full px-2.5 py-1 text-[10px] font-bold tracking-normal sm:mb-4 sm:px-4 sm:py-1.5 sm:text-[13px] ${tone.badge}`}>
                    {review.category}
                  </span>
                ) : null}
                <p className={`line-clamp-3 break-keep text-[13px] font-bold leading-[1.4] tracking-normal sm:line-clamp-4 sm:text-h4 sm:leading-[1.55] ${tone.body}`}>
                  {review.title}
                </p>
                <div className={`mt-auto flex items-center justify-end pt-3 text-[11px] font-medium tracking-normal sm:pt-6 sm:text-body ${tone.meta}`}>
                  <time dateTime={review.created_at}>{formatDate(review.created_at)}</time>
                </div>
              </Link>
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
