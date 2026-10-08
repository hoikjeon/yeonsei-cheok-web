'use client';

import { useEffect, useRef, useState, type MouseEvent as ReactMouseEvent, type PointerEvent as ReactPointerEvent } from 'react';
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
// 이만큼 옆으로 움직여야 끌기로 봅니다. 그보다 짧으면 카드 클릭으로 둡니다.
const DRAG_START_PX = 6;
// 놓는 순간의 속도를 이 시간(ms)만큼 더 미끄러진 것으로 쳐서, 휙 넘기면 한두 칸 더 갑니다.
const FLICK_PROJECTION_MS = 200;
// 짧게 끌어도 이보다 빠르게(px/ms) 넘기면 최소 한 칸은 넘어갑니다.
const FLICK_MIN_VELOCITY = 0.4;

type DragState = {
  pointerId: number;
  startX: number;
  startY: number;
  active: boolean;
  slotPx: number;
  basePos: number;
  samples: { x: number; t: number }[];
};

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return '';
  return `${date.getFullYear()}.${String(date.getMonth() + 1).padStart(2, '0')}.${String(date.getDate()).padStart(2, '0')}`;
}

export default function ReviewsShowcaseSection({ reviews }: { reviews: HomeReview[] }) {
  const shouldReduceMotion = useReducedMotion();
  const total = reviews.length;
  const loops = total >= 5;
  const isMoving = loops && !shouldReduceMotion;

  // 한 바퀴의 카드 수는 짝수여야 합니다. 홀수면 되감기는 순간 위아래 지그재그가 뒤집혀 튑니다.
  const unit = total % 2 === 0 ? total : total * 2;
  // 트랙을 네 벌로 채우고 평소에는 두 번째 벌(step: unit ~ 2·unit) 위치에 둡니다.
  // 양옆에 한 벌씩 여유가 있어 앞뒤 어느 쪽으로 끌어도 빈칸이 보이지 않고,
  // 범위를 벗어나면 한 벌만큼 되감아도 화면이 똑같아 이음새가 보이지 않습니다.
  const cards = loops
    ? Array.from({ length: unit * 4 }, (_, index) => reviews[index % total])
    : reviews;

  const [step, setStep] = useState(loops ? unit : 0);
  // 끄는 동안 정수 칸(step)에서 얼마나 벗어났는지를 '칸' 단위로 담습니다. (+ 는 앞으로)
  const [dragPos, setDragPos] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [animated, setAnimated] = useState(true);
  const [isPaused, setIsPaused] = useState(false);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const suppressClickRef = useRef(false);

  const position = step + dragPos;

  // 트랙(가로)과 카드(세로)가 이 값을 그대로 나눠 쓰므로 두 움직임은 같은 순간에 시작하고 끝납니다.
  // 카드의 세로 이동은 transform 이 아니라 독립된 translate 속성이라 둘 다 적어야 합니다.
  const slideTransition =
    animated && !isDragging && !shouldReduceMotion
      ? `transform ${SLIDE_DURATION_MS}ms ${SLIDE_EASING}, translate ${SLIDE_DURATION_MS}ms ${SLIDE_EASING}`
      : 'none';
  // 카드는 위 전환에 더해 마우스를 올렸을 때의 확대만 짧게 따로 겁니다.
  // (scale 은 translate 와 별개 속성이라 지그재그 이동과 서로 간섭하지 않습니다.)
  const cardTransition = slideTransition === 'none' ? 'scale 200ms ease-out' : `${slideTransition}, scale 200ms ease-out`;

  useEffect(() => {
    if (isPaused || isDragging || !isMoving) return;

    const interval = window.setInterval(() => {
      setStep((current) => current + 1);
    }, STEP_INTERVAL_MS);

    return () => window.clearInterval(interval);
  }, [isPaused, isDragging, isMoving]);

  // 두 번째 벌 범위를 벗어나면, 미끄러짐이 끝난 직후 전환 없이 한 벌만큼 되감습니다.
  useEffect(() => {
    if (!loops || isDragging || (step >= unit && step < unit * 2)) return;

    const timer = window.setTimeout(() => {
      setAnimated(false);
      setStep((current) => (((current - unit) % unit) + unit) % unit + unit);
    }, SLIDE_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [loops, isDragging, step, unit]);

  // 되감은 좌표가 화면에 반영된 다음 프레임에 전환을 다시 켭니다.
  useEffect(() => {
    if (animated) return;

    const raf = window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => setAnimated(true));
    });

    return () => window.cancelAnimationFrame(raf);
  }, [animated]);

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!loops || (event.pointerType === 'mouse' && event.button !== 0)) return;
    suppressClickRef.current = false;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      active: false,
      slotPx: 0,
      basePos: 0,
      samples: [],
    };
  };

  // 끌기 시작 순간 화면에 보이는 위치를 그대로 이어받습니다. 자동으로 미끄러지는 도중에 잡아도
  // 목표 칸으로 튀지 않도록, 전환 중인 실제 좌표(computed transform)에서 위치를 읽습니다.
  const beginDrag = (drag: DragState, event: ReactPointerEvent<HTMLDivElement>) => {
    const track = trackRef.current;
    if (!track) return false;
    const slotPx = parseFloat(getComputedStyle(track).getPropertyValue('--slot'));
    if (!slotPx) return false;

    const currentPos = -new DOMMatrixReadOnly(getComputedStyle(track).transform).m41 / slotPx;
    const nearest = Math.round(currentPos);
    // 가장 가까운 칸을 두 번째 벌 범위로 옮깁니다. 한 벌(짝수 칸) 단위라 화면은 그대로입니다.
    const normalized = (((nearest - unit) % unit) + unit) % unit + unit;

    drag.active = true;
    drag.slotPx = slotPx;
    drag.basePos = currentPos - nearest;
    drag.startX = event.clientX;
    drag.samples = [{ x: event.clientX, t: event.timeStamp }];
    suppressClickRef.current = true;
    event.currentTarget.setPointerCapture(event.pointerId);

    setStep(normalized);
    setDragPos(drag.basePos);
    setIsDragging(true);
    return true;
  };

  const handlePointerMove = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;

    if (!drag.active) {
      const dx = Math.abs(event.clientX - drag.startX);
      const dy = Math.abs(event.clientY - drag.startY);
      // 세로로 먼저 움직이면 페이지 스크롤로 보고 끌기를 포기합니다.
      if (dy > DRAG_START_PX && dy >= dx) {
        dragRef.current = null;
        return;
      }
      if (dx < DRAG_START_PX || !beginDrag(drag, event)) return;
    }

    drag.samples.push({ x: event.clientX, t: event.timeStamp });
    if (drag.samples.length > 6) drag.samples.shift();

    // 한 번에 한 벌 넘게는 끌리지 않게 막습니다. 그 밖에는 준비된 카드가 없습니다.
    const next = drag.basePos - (event.clientX - drag.startX) / drag.slotPx;
    setDragPos(Math.max(-(unit - 1), Math.min(unit - 1, next)));
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (!drag.active) return;

    // 놓기 직전 0.1초 동안의 움직임으로 속도를 구합니다. 끌다가 멈춘 뒤 놓으면 던지지 않고,
    // 취소된 경우(예: 브라우저가 스크롤로 가져감)에도 던지지 않습니다.
    const recent = drag.samples.filter((sample) => event.timeStamp - sample.t <= 100);
    const first = recent[0];
    const last = recent[recent.length - 1];
    const elapsed = first && last ? last.t - first.t : 0;
    const velocity = event.type === 'pointerup' && elapsed > 0 ? (last.x - first.x) / elapsed : 0;

    const projected = dragPos - (velocity * FLICK_PROJECTION_MS) / drag.slotPx;
    let delta = Math.round(projected);
    if (delta === 0 && Math.abs(velocity) > FLICK_MIN_VELOCITY) delta = velocity < 0 ? 1 : -1;
    delta = Math.max(-(unit - 1), Math.min(unit - 1, delta));

    setAnimated(true);
    setIsDragging(false);
    setDragPos(0);
    setStep((current) => current + delta);
  };

  // 끌고 난 뒤 손을 뗄 때 카드 링크가 눌려 후기 페이지로 넘어가지 않게 막습니다.
  const handleClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) return;
    suppressClickRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  return (
    <section className="overflow-hidden bg-[#edf2fa] py-10 md:py-32" aria-labelledby="reviews-showcase-title">
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-7 xl:px-10">
        <div className="grid grid-cols-1 items-start gap-6 md:gap-10 lg:grid-cols-[minmax(0,1fr)_auto]">
          <div className="space-y-3.5 md:space-y-6">
            <h2
              id="reviews-showcase-title"
              className="break-keep text-[24px] font-extrabold leading-[1.25] tracking-normal text-black md:text-h2"
            >
              진솔함으로 전해지는
              <br />
              생생한 환자 후기
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
        // touch-pan-y: 세로 스크롤은 브라우저에 맡기고 가로 움직임만 끌기로 받습니다.
        className={`mt-6 overflow-hidden md:mt-16 ${loops ? `touch-pan-y select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}` : ''}`}
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
        onTouchCancel={() => setIsPaused(false)}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerEnd}
        onPointerCancel={handlePointerEnd}
        onClickCapture={handleClickCapture}
        // 링크를 끌면 브라우저가 '링크 끌어다 놓기'를 시작해 끌기가 끊기므로 막습니다.
        onDragStart={(event) => event.preventDefault()}
      >
        <div
          ref={trackRef}
          // --slot 은 '카드 너비 + 오른쪽 여백'입니다. 카드 크기를 바꾸면 이 값도 같이 맞춰야
          // 한 스텝이 정확히 한 칸이 됩니다. (164+8 / 286+28 / 320+28)
          // 간격을 gap 대신 카드의 오른쪽 여백으로 준 것도 이 계산을 어긋나지 않게 하기 위해서입니다.
          // --lower 는 아래쪽 자리 카드가 내려가는 거리입니다.
          className={`${loops ? 'ml-4 w-max sm:ml-7 md:-ml-44' : 'mx-auto -mr-2 w-fit max-w-full justify-center px-4 sm:-mr-7 sm:px-7'} flex h-[206px] items-start [--lower:36px] [--slot:172px] sm:h-[330px] sm:[--slot:314px] md:h-[386px] md:[--lower:58px] md:[--slot:348px]`}
          style={{
            transform: `translateX(calc(var(--slot) * ${-position}))`,
            transition: slideTransition,
            willChange: 'transform',
          }}
        >
          {cards.map((review, index) => {
            const tone = toneStyles[toneCycle[index % toneCycle.length]];
            // 위아래는 카드가 아니라 '자리'에 붙어 있습니다. 한 칸 밀릴 때마다 카드가
            // 반대편 높이의 자리로 옮겨가므로, 옆으로 미는 동안 위아래도 같이 바뀝니다.
            // 트랙과 완전히 같은 시간·같은 이징을 쓰기 때문에 카드는 대각선 한 번으로 이동합니다.
            // 끄는 중에는 칸 사이 어중간한 위치이므로 두 높이 사이를 부드럽게 오갑니다.
            const lowered = (1 + Math.cos(Math.PI * (index - position))) / 2;

            // 두 번째 벌만 실제 목록으로 두고, 나머지는 화면을 채우는 복제본이라 보조기기와 키보드 이동에서 제외합니다.
            const isDuplicate = loops && (index < unit || index >= unit + total);

            return (
              <Link
                key={`${review.id}-${index}`}
                href={`/board/reviews/${review.id}`}
                aria-hidden={isDuplicate}
                tabIndex={isDuplicate ? -1 : undefined}
                draggable={false}
                className={`mr-2 flex size-[164px] shrink-0 flex-col rounded-[9px] px-3 py-3.5 hover:scale-[1.03] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40 sm:mr-7 sm:size-[286px] sm:rounded-[14px] sm:px-5 sm:py-6 md:size-[320px] md:px-7 md:py-7 ${tone.card}`}
                style={{
                  translate: `0 calc(var(--lower) * ${lowered.toFixed(3)})`,
                  transition: cardTransition,
                }}
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
