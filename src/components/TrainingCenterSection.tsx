'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Plus, ArrowUpRight } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type TrainingCard = {
  id: string;
  title: string;
  meta: string;
  image: string;
  href: string;
};

// DB에 트레이닝 소식이 없을 때 항상 노출되는 기본 카드 (트레이닝 테마 이미지)
const FALLBACK_CARDS: TrainingCard[] = [
  {
    id: 'fb-ube',
    title: '양방향 척추내시경(UBE) 실전 트레이닝',
    meta: 'GLOBAL TRAINING',
    image: '/ube_training.jpg',
    href: '/news/training',
  },
  {
    id: 'fb-workshop',
    title: '국내외 의료진 대상 술기 워크숍',
    meta: 'MEDICAL WORKSHOP',
    image: '/generated/hero-medical-conference.png',
    href: '/news/training',
  },
  {
    id: 'fb-livesurgery',
    title: '척추내시경 라이브 서저리 교육',
    meta: 'LIVE SURGERY',
    image: '/generated/hero-spine-endoscopy.png',
    href: '/news/training',
  },
  {
    id: 'fb-network',
    title: '글로벌 척추 연구 네트워크 교류',
    meta: 'RESEARCH NETWORK',
    image: '/generated/hero-research-network.png',
    href: '/news/training',
  },
];

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

const STEP_INTERVAL = 4200; // 약 4.2초마다 한 칸씩 이동
const TRANSITION = { duration: 1.05, ease: [0.16, 1, 0.3, 1] as const };

export default function TrainingCenterSection() {
  const [cards, setCards] = useState<TrainingCard[]>(FALLBACK_CARDS);

  // 병원 소식(국제 트레이닝 센터) 데이터가 있으면 우선 사용, 부족하면 기본 카드로 채움
  useEffect(() => {
    let active = true;
    (async () => {
      const { data } = await supabase
        .from('hospital_news')
        .select('id, title, image_urls, created_at')
        .eq('type', 'training')
        .order('created_at', { ascending: false })
        .limit(8);

      if (!active || !data) return;

      const mapped: TrainingCard[] = data
        .filter((row) => Array.isArray(row.image_urls) && row.image_urls[0])
        .map((row) => ({
          id: row.id,
          title: row.title,
          meta: formatDate(row.created_at),
          image: row.image_urls[0] as string,
          href: `/news/training/${row.id}`,
        }));

      if (mapped.length === 0) return;

      const merged =
        mapped.length >= 4 ? mapped : [...mapped, ...FALLBACK_CARDS].slice(0, 4);
      setCards(merged);
    })();

    return () => {
      active = false;
    };
  }, []);

  const len = cards.length;
  // 끊김 없는 무한 루프를 위해 카드 세트를 3번 반복 렌더링
  const loopCards = useMemo(() => [...cards, ...cards, ...cards], [cards]);

  const trackRef = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [index, setIndex] = useState(0);
  const [animate, setAnimate] = useState(true);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  // 한 칸 이동 거리(카드 너비 + gap) 측정 — 반응형 대응
  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      const first = track?.children?.[0] as HTMLElement | undefined;
      if (!track || !first) return;
      const styles = window.getComputedStyle(track);
      const gap = parseFloat(styles.columnGap || styles.gap || '0') || 0;
      setStep(first.getBoundingClientRect().width + gap);
    };

    measure();
    window.addEventListener('resize', measure);
    return () => window.removeEventListener('resize', measure);
  }, [cards]);

  // 모션 최소화 설정 존중
  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  // 자동 넘김 (오른쪽 → 왼쪽)
  useEffect(() => {
    if (paused || reduced || step === 0 || len === 0) return;
    const timer = window.setInterval(() => {
      setIndex((i) => i + 1);
    }, STEP_INTERVAL);
    return () => window.clearInterval(timer);
  }, [paused, reduced, step, len]);

  // 마지막 세트 끝에서 처음으로 순간 이동(무한 루프)
  useEffect(() => {
    if (animate) return;
    const raf = window.requestAnimationFrame(() => setAnimate(true));
    return () => window.cancelAnimationFrame(raf);
  }, [animate]);

  return (
    <section className="relative overflow-hidden bg-white py-16 md:py-32">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="relative z-10 mx-auto max-w-7xl px-5 sm:px-7 xl:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-start justify-between gap-4 md:gap-6"
        >
          <div className="min-w-0 space-y-3 md:space-y-4">
            <h2 className="break-keep text-h2 tracking-tight text-ink">
              국제 척추내시경 <span className="text-primary">트레이닝 센터</span>
            </h2>
            <p className="break-keep text-body-lg text-ink-sub">
              의사가 의사를 가르치는 병원, 국내외 의료진이 연세척의 술기를 배우러 옵니다.
            </p>
          </div>

          <Link
            href="/news/training"
            aria-label="국제 척추내시경 트레이닝 센터 전체보기"
            className="group inline-flex shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white p-3 text-ink-sub shadow-[0_14px_36px_-28px_rgba(15,29,54,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary hover:text-white md:mt-1 md:p-4"
          >
            <Plus size={20} strokeWidth={2.75} className="transition-transform duration-300 group-hover:rotate-90" />
          </Link>
        </motion.div>

        {/* Carousel */}
        <div
          className="relative mt-10 md:mt-16"
          onMouseEnter={() => setPaused(true)}
          onMouseLeave={() => setPaused(false)}
          onTouchStart={() => setPaused(true)}
          onTouchEnd={() => setPaused(false)}
        >
          {/* py/-my: 호버 시 카드가 위로 떠도(-y) 상단·그림자가 잘리지 않도록 세로 여백 확보 */}
          <div className="overflow-hidden py-10 -my-10">
            <motion.div
              ref={trackRef}
              className="flex gap-5 md:gap-6"
              animate={{ x: -index * step }}
              transition={animate ? TRANSITION : { duration: 0 }}
              onAnimationComplete={() => {
                if (index >= len) {
                  setAnimate(false);
                  setIndex(0);
                }
              }}
            >
              {loopCards.map((card, i) => (
                <div
                  key={`${card.id}-${i}`}
                  className="w-[80%] shrink-0 sm:w-[46%] md:w-[34%] lg:w-[calc((100%_-_4.5rem)/4)]"
                >
                  <Link href={card.href} className="group block">
                    <motion.div
                      whileHover={{ y: -12 }}
                      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
                    >
                      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-slate-100 shadow-[0_22px_55px_-30px_rgba(15,29,54,0.45)] ring-1 ring-slate-900/5 transition-shadow duration-500 group-hover:shadow-[0_40px_80px_-32px_rgba(40,74,165,0.55)] sm:aspect-[3/4] sm:rounded-[1.5rem]">
                        <img
                          src={card.image}
                          alt={card.title}
                          className="absolute inset-0 h-full w-full object-cover transition-transform duration-[900ms] ease-out group-hover:scale-[1.07]"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-navy-950/55 via-navy-950/5 to-transparent" />
                        <ArrowUpRight
                          size={18}
                          className="absolute right-4 top-4 text-white/0 transition-all duration-300 group-hover:text-white/80"
                        />
                      </div>

                      <div className="px-1 pt-4 md:pt-5">
                        <h3 className="line-clamp-2 break-keep text-body font-semibold leading-snug tracking-tight text-ink transition-colors duration-300 group-hover:text-primary">
                          {card.title}
                        </h3>
                      </div>
                    </motion.div>
                  </Link>
                </div>
              ))}
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
