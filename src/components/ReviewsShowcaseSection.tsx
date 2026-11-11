'use client';

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FocusEvent as ReactFocusEvent,
  type MouseEvent as ReactMouseEvent,
  type PointerEvent as ReactPointerEvent,
} from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { useReducedMotion } from 'framer-motion';
import type { HomeReview } from '@/lib/adminReviews';

// 한 번에 한 장씩 넘기고 잠시 머뭅니다.
const STEP_INTERVAL_MS = 3800;
const SLIDE_DURATION_MS = 650;
const SLIDE_EASING = 'cubic-bezier(0.22, 1, 0.36, 1)';
// 이 수보다 많아야 무한히 넘어가는 슬라이드가 됩니다. (PC 에서 한 화면에 보이는 장 수)
const DESKTOP_PER_VIEW = 4;
// 이만큼 옆으로 움직여야 끌기로 봅니다. 그보다 짧으면 카드 클릭으로 둡니다.
const DRAG_START_PX = 6;
// 이보다 길게 끌거나 빠르게 넘기면 최소 한 장은 넘어갑니다.
const SWIPE_MIN_PX = 40;
const FLICK_MIN_VELOCITY = 0.45;

// 손글씨 후기 양식은 위쪽 약 1/4 에 이름·나이·주치의 칸이 있습니다.
// 메인에서는 그 부분을 잘라내고 '1. 어떤 증상으로…' 본문부터 보여줍니다.
const FORM_HEADER_CROP = '-27.5%';

// 화면 폭마다 한 화면에 보이는 장 수(--per)와 카드 사이 간격(--gap)입니다.
// 모바일은 다음 카드가 살짝 보이도록 1.15 장으로 둡니다.
const TRACK_VARS = '[--gap:16px] [--per:1.15] sm:[--per:2] md:[--per:3] md:[--gap:20px] lg:[--per:4] lg:[--gap:24px]';
const CARD_BASIS = 'basis-[calc((100%-(var(--per)-1)*var(--gap))/var(--per))]';

type DragState = {
  pointerId: number;
  startX: number;
  startY: number;
  active: boolean;
  slotPx: number;
  samples: { x: number; t: number }[];
};

function monthLabel(value: string) {
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? '치료후기' : `${date.getMonth() + 1}월 치료후기`;
}

function ReviewCard({
  review,
  hidden = false,
  className = '',
  onFocus,
}: {
  review: HomeReview;
  hidden?: boolean;
  className?: string;
  onFocus?: (event: ReactFocusEvent<HTMLAnchorElement>) => void;
}) {
  return (
    <Link
      href={`/board/reviews/${review.id}`}
      aria-hidden={hidden || undefined}
      tabIndex={hidden ? -1 : undefined}
      draggable={false}
      onFocus={onFocus}
      className={`group flex shrink-0 grow-0 flex-col rounded-xl focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/40 ${CARD_BASIS} ${className}`}
    >
      <div className="overflow-hidden rounded-xl bg-white shadow-[0_12px_30px_-24px_rgba(15,29,54,0.4)]">
      {/* 남색 띠에 월별 후기만 표시합니다. 따옴표와 부위 배지는 사용하지 않습니다. */}
      <div className="bg-[#10346f] px-5 py-3">
        <span className="text-[14px] font-semibold tracking-normal text-white">
          {monthLabel(review.created_at)}
        </span>
      </div>

      {/* 손글씨 후기지 미리보기: 이름 칸은 잘라냅니다. */}
      <div className="relative mx-4 mb-4 mt-5 aspect-[10/11] overflow-hidden bg-white">
        {review.image_url ? (
          <div className="origin-top transition-transform duration-500 ease-out group-hover:scale-[1.04]">
            <Image
              src={review.image_url}
              alt=""
              width={1640}
              height={2320}
              sizes="(min-width: 1280px) 290px, (min-width: 1024px) 23vw, (min-width: 768px) 31vw, (min-width: 640px) 48vw, 85vw"
              draggable={false}
              className="pointer-events-none h-auto w-full select-none"
              style={{ transform: `translateY(${FORM_HEADER_CROP})` }}
            />
          </div>
        ) : (
          <div className="flex h-full items-center justify-center text-sm text-ink-muted">
            손글씨 후기
          </div>
        )}
      </div>
      </div>

      {/* 이미지 아래에는 후기 제목만 표시합니다. */}
      <div className="px-1 pt-3">
        <p className="line-clamp-2 break-keep text-[16px] font-semibold leading-[1.5] tracking-normal text-ink transition-colors group-hover:text-primary md:text-[17px]">
          {review.title}
        </p>
      </div>
    </Link>
  );
}

export default function ReviewsShowcaseSection({ reviews }: { reviews: HomeReview[] }) {
  const shouldReduceMotion = useReducedMotion();
  const total = reviews.length;
  const loops = total > DESKTOP_PER_VIEW;

  // 목록을 세 벌로 이어 붙이고 평소에는 가운데 벌을 봅니다.
  // 가운데 벌을 벗어나면 미끄러짐이 끝난 직후 한 벌만큼 되감아 이음새 없이 계속 돕니다.
  const cards = loops ? [...reviews, ...reviews, ...reviews] : reviews;

  const [index, setIndex] = useState(loops ? total : 0);
  const [animated, setAnimated] = useState(true);
  const [dragPx, setDragPx] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [hasFocus, setHasFocus] = useState(false);
  const [isTabHidden, setIsTabHidden] = useState(false);
  const viewportRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const dragRef = useRef<DragState | null>(null);
  const suppressClickRef = useRef(false);

  const current = loops ? (((index - total) % total) + total) % total : 0;
  const autoplay = loops && !shouldReduceMotion && !isHovered && !hasFocus && !isDragging && !isTabHidden;

  const go = useCallback((delta: number) => {
    setAnimated(true);
    setIndex((value) => value + delta);
  }, []);

  useEffect(() => {
    const onVisibility = () => setIsTabHidden(document.hidden);
    document.addEventListener('visibilitychange', onVisibility);
    return () => document.removeEventListener('visibilitychange', onVisibility);
  }, []);

  // 위치가 바뀔 때마다 새로 재므로, 화살표로 넘긴 직후에 곧바로 또 넘어가지 않습니다.
  useEffect(() => {
    if (!autoplay) return;
    const timer = window.setTimeout(() => go(1), STEP_INTERVAL_MS);
    return () => window.clearTimeout(timer);
  }, [autoplay, index, go]);

  // 가운데 벌을 벗어났으면 미끄러짐이 끝난 뒤 전환 없이 한 벌만큼 되감습니다.
  useEffect(() => {
    if (!loops || isDragging || (index >= total && index < total * 2)) return;
    const timer = window.setTimeout(() => {
      setAnimated(false);
      setIndex((value) => ((((value - total) % total) + total) % total) + total);
    }, shouldReduceMotion ? 0 : SLIDE_DURATION_MS);
    return () => window.clearTimeout(timer);
  }, [loops, isDragging, index, total, shouldReduceMotion]);

  // 되감은 위치가 그려진 다음 프레임에 전환을 다시 켭니다.
  useEffect(() => {
    if (animated) return;
    let inner = 0;
    const outer = window.requestAnimationFrame(() => {
      inner = window.requestAnimationFrame(() => setAnimated(true));
    });
    return () => {
      window.cancelAnimationFrame(outer);
      window.cancelAnimationFrame(inner);
    };
  }, [animated]);

  const measureSlot = () => {
    const track = trackRef.current;
    const first = track?.firstElementChild as HTMLElement | null;
    if (!track || !first) return 0;
    return first.getBoundingClientRect().width + (parseFloat(getComputedStyle(track).columnGap) || 0);
  };

  const handlePointerDown = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (!loops || (event.pointerType === 'mouse' && event.button !== 0)) return;
    suppressClickRef.current = false;
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      active: false,
      slotPx: 0,
      samples: [],
    };
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
      if (dx < DRAG_START_PX) return;
      const slotPx = measureSlot();
      if (!slotPx) return;

      drag.active = true;
      drag.slotPx = slotPx;
      drag.startX = event.clientX;
      suppressClickRef.current = true;
      event.currentTarget.setPointerCapture(event.pointerId);
      // 끌기 전에 가운데 벌로 옮겨 두어 양쪽 어느 방향으로 끌어도 빈칸이 보이지 않게 합니다.
      setAnimated(false);
      setIndex((value) => ((((value - total) % total) + total) % total) + total);
      setIsDragging(true);
    }

    drag.samples.push({ x: event.clientX, t: event.timeStamp });
    if (drag.samples.length > 6) drag.samples.shift();
    const limit = drag.slotPx * (total - DESKTOP_PER_VIEW);
    setDragPx(Math.max(-limit, Math.min(limit, event.clientX - drag.startX)));
  };

  const handlePointerEnd = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current;
    if (!drag || drag.pointerId !== event.pointerId) return;
    dragRef.current = null;
    if (!drag.active) return;

    const recent = drag.samples.filter((sample) => event.timeStamp - sample.t <= 100);
    const first = recent[0];
    const last = recent[recent.length - 1];
    const elapsed = first && last ? last.t - first.t : 0;
    const velocity = event.type === 'pointerup' && elapsed > 0 ? (last.x - first.x) / elapsed : 0;

    let delta = -Math.round(dragPx / drag.slotPx);
    if (delta === 0 && (Math.abs(dragPx) > SWIPE_MIN_PX || Math.abs(velocity) > FLICK_MIN_VELOCITY)) {
      delta = (velocity || dragPx) < 0 ? 1 : -1;
    }

    setIsDragging(false);
    setDragPx(0);
    go(delta);
  };

  // 키보드(Tab)로 화면 밖 카드에 들어오면 브라우저가 감춰진 영역을 스크롤해 위치가 어긋나므로,
  // 스크롤은 되돌리고 그 카드를 맨 앞으로 데려옵니다. 마우스 클릭으로 생긴 포커스는 무시합니다.
  const handleCardFocus = (i: number, element: HTMLElement) => {
    if (!loops || !element.matches(':focus-visible')) return;
    if (viewportRef.current) viewportRef.current.scrollLeft = 0;
    setAnimated(true);
    setIndex(i);
  };

  // 끌고 난 뒤 손을 뗄 때 카드 링크가 눌려 후기 페이지로 넘어가지 않게 막습니다.
  const handleClickCapture = (event: ReactMouseEvent<HTMLDivElement>) => {
    if (!suppressClickRef.current) return;
    suppressClickRef.current = false;
    event.preventDefault();
    event.stopPropagation();
  };

  const trackStyle: CSSProperties = loops
    ? {
        transform: `translateX(calc(${-index} * ((100% - (var(--per) - 1) * var(--gap)) / var(--per) + var(--gap)) + ${dragPx}px))`,
        transition:
          animated && !isDragging && !shouldReduceMotion ? `transform ${SLIDE_DURATION_MS}ms ${SLIDE_EASING}` : 'none',
        willChange: 'transform',
      }
    : {};

  const navButton =
    'flex size-11 items-center justify-center rounded-full border border-slate-200 bg-white text-ink transition-colors duration-200 hover:border-primary hover:bg-primary hover:text-white focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-primary/30 md:size-12';

  return (
    <section
      className="overflow-hidden bg-[#f5f5f2] py-10 md:py-16"
      aria-labelledby="reviews-showcase-title"
      aria-roledescription={loops ? '캐러셀' : undefined}
    >
      <div className="mx-auto w-full max-w-7xl px-5 sm:px-7 xl:px-10">
        <div className="flex flex-col gap-6 md:gap-8 lg:flex-row lg:items-end lg:justify-between">
          <div className="space-y-3 md:space-y-4">
            <h2
              id="reviews-showcase-title"
              className="break-keep text-[24px] font-extrabold leading-[1.25] tracking-normal text-black md:text-h2"
            >
              진솔함으로 전해지는
              <br />
              생생한 <span className="text-[#10346f]">환자 후기</span>
            </h2>
            <p className="break-keep text-body-lg text-ink">
              수술 후 통증에서 벗어난 환자분들이 직접 손으로 써 주신 회복 이야기를 만나보세요.
            </p>
            <p className="max-w-full break-keep text-caption leading-relaxed text-ink-muted">
              ※ 자세한 내용은 로그인 후 확인할 수 있습니다.
            </p>
          </div>

          <div className="flex items-center gap-3">
            {loops ? (
              <>
                <button type="button" onClick={() => go(-1)} className={navButton} aria-label="이전 후기">
                  <ChevronLeft size={20} aria-hidden />
                </button>
                <button type="button" onClick={() => go(1)} className={navButton} aria-label="다음 후기">
                  <ChevronRight size={20} aria-hidden />
                </button>
              </>
            ) : null}
            <Link
              href="/board/reviews"
              className="group ml-auto inline-flex w-fit items-center gap-2.5 border-b border-[#10346f] py-2 text-[14px] font-semibold text-[#10346f] transition-colors duration-300 hover:text-primary sm:gap-3 sm:text-body lg:ml-5"
            >
              후기 전체보기
              <ArrowRight size={20} className="transition-transform duration-300 group-hover:translate-x-1" />
            </Link>
          </div>
        </div>

        {total > 0 ? (
          <>
            <div
              ref={viewportRef}
              // 카드의 키보드 포커스 표시가 잘리지 않도록 여백을 둡니다.
              className={`-mx-3 mt-5 px-3 py-3 md:mt-7 ${
                loops
                  ? `overflow-hidden touch-pan-y select-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'}`
                  : ''
              }`}
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              onFocusCapture={() => setHasFocus(true)}
              onBlurCapture={(event) => {
                if (!event.currentTarget.contains(event.relatedTarget as Node | null)) setHasFocus(false);
              }}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerEnd}
              onPointerCancel={handlePointerEnd}
              onClickCapture={handleClickCapture}
              onDragStart={(event) => event.preventDefault()}
            >
              <div
                ref={trackRef}
                className={`flex ${TRACK_VARS} gap-[var(--gap)] ${
                  loops
                    ? ''
                    : // 4장 이하일 때: PC 는 그대로 나란히, 좁은 화면은 손으로 옆으로 넘겨 봅니다.
                      '-my-3 snap-x snap-mandatory overflow-x-auto py-3 [scrollbar-width:none] lg:overflow-visible [&::-webkit-scrollbar]:hidden'
                }`}
                style={trackStyle}
              >
                {cards.map((review, i) => (
                  <ReviewCard
                    key={`${review.id}-${i}`}
                    review={review}
                    // 가운데 벌만 실제 목록으로 두고, 앞뒤 복제본은 보조기기와 키보드 이동에서 제외합니다.
                    hidden={loops && (i < total || i >= total * 2)}
                    className={loops ? '' : 'snap-start'}
                    onFocus={(event) => handleCardFocus(i, event.currentTarget)}
                  />
                ))}
              </div>
            </div>

            {loops ? (
              <div className="mt-3 flex items-center justify-center gap-4 md:mt-4">
                <span className="w-7 text-right text-[14px] font-extrabold tabular-nums text-[#10346f]">
                  {String(current + 1).padStart(2, '0')}
                </span>
                <div className="relative h-1 w-40 overflow-hidden rounded-full bg-[#10346f]/12 md:w-56" aria-hidden>
                  <span
                    className="absolute inset-y-0 left-0 rounded-full bg-[#10346f] transition-[width] duration-500 ease-out"
                    style={{ width: `${((current + 1) / total) * 100}%` }}
                  />
                </div>
                <span className="w-7 text-[14px] font-semibold tabular-nums text-ink-muted">
                  {String(total).padStart(2, '0')}
                </span>
              </div>
            ) : null}
          </>
        ) : (
          <div className="mt-10 text-center text-sm font-semibold text-ink-muted md:mt-16">등록된 치료체험후기가 없습니다.</div>
        )}
      </div>
    </section>
  );
}
