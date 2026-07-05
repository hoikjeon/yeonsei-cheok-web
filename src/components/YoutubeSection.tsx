'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Play, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type YoutubeCard = {
  id: string;
  title: string;
  tags: string[];
  date: string;
  image: string;
  imageFallback: string;
  href: string;
};

// 유튜브 URL에서 11자리 영상 ID 추출 (watch, youtu.be, shorts, embed 등 대응)
function getYoutubeId(url: string): string | null {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=|\/shorts\/)([^#&?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

// 설명(content)에서 해시태그 추출 → 최대 3개, '#' 제거
function extractTags(content?: string | null): string[] {
  if (!content) return [];
  const matches = content.match(/#[^\s#]+/g);
  if (!matches) return [];
  return matches.map((t) => t.replace(/^#/, '')).slice(0, 3);
}

function formatDate(value: string) {
  const d = new Date(value);
  if (Number.isNaN(d.getTime())) return '';
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
}

// DB에 연세척TV 소식이 없을 때 노출되는 기본(더미) 카드
const FALLBACK_IMG = '/generated/hero-university-doctors.png';
const DUMMY_CARDS: YoutubeCard[] = [
  {
    id: 'yt-1',
    title: '민원장에게 무엇이든 물어보닥 1부 | 이런 증상, 병원 가야 하나요?',
    tags: ['척추질환', '통증진단', '연세척TV'],
    date: '2026-06-18',
    image: '/generated/hero-university-doctors.png',
    imageFallback: FALLBACK_IMG,
    href: '/news/youtube',
  },
  {
    id: 'yt-2',
    title: '척추와 관절의 경고, 무너진 몸의 신호 — 방치하면 안 되는 질환 TOP 6',
    tags: ['신경외과', '정형외과', '척추센터'],
    date: '2026-05-30',
    image: '/generated/hero-spine-endoscopy.png',
    imageFallback: FALLBACK_IMG,
    href: '/news/youtube',
  },
  {
    id: 'yt-3',
    title: '통증 원인이 다른데 운동은 왜 똑같이 하세요? 맞춤 재활의 중요성',
    tags: ['재활치료', '운동치료', '통증관리'],
    date: '2026-05-12',
    image: '/generated/hero-knee-oneday.png',
    imageFallback: FALLBACK_IMG,
    href: '/news/youtube',
  },
  {
    id: 'yt-4',
    title: '통증치료, 염증만 잡으면 끝일까요? 통증 치료 3단계 완벽 정리',
    tags: ['신경차단술', '도수치료', '체외충격파'],
    date: '2026-04-24',
    image: '/generated/hero-medical-conference.png',
    imageFallback: FALLBACK_IMG,
    href: '/news/youtube',
  },
  {
    id: 'yt-5',
    title: '무릎에서 소리가 나요, 수술해야 하나요? 관절내시경 진단 이야기',
    tags: ['무릎통증', '관절내시경', '연골손상'],
    date: '2026-04-10',
    image: '/generated/specialty-knee-arthroscopy.png',
    imageFallback: FALLBACK_IMG,
    href: '/news/youtube',
  },
  {
    id: 'yt-6',
    title: '양방향 척추내시경(UBE), 절개 부담을 낮추는 최소침습 치료란?',
    tags: ['양방향내시경', '최소침습', '비수술치료'],
    date: '2026-03-22',
    image: '/generated/specialty-spine-endoscopy.png',
    imageFallback: FALLBACK_IMG,
    href: '/news/youtube',
  },
];

// 썸네일 로드 실패 시 폴백 이미지로 1회 교체
function handleImgError(fallback: string) {
  return (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    if (img.dataset.fb || !fallback) return;
    img.dataset.fb = '1';
    img.src = fallback;
  };
}

export default function YoutubeSection() {
  const [cards, setCards] = useState<YoutubeCard[]>(DUMMY_CARDS);
  const [activeId, setActiveId] = useState<string | null>(null);
  const active = cards.find((c) => c.id === activeId) ?? cards[0];

  // 병원소식 > 연세척TV(hospital_news, type='youtube') 데이터가 있으면 우선 사용
  useEffect(() => {
    let alive = true;
    (async () => {
      const { data } = await supabase
        .from('hospital_news')
        .select('id, title, content, image_urls, video_url, created_at')
        .eq('type', 'youtube')
        .order('created_at', { ascending: false })
        .limit(12);

      if (!alive || !data || data.length === 0) return;

      const mapped: YoutubeCard[] = data.map((row) => {
        const ytId = row.video_url ? getYoutubeId(row.video_url) : null;
        const firstImage = Array.isArray(row.image_urls) ? (row.image_urls[0] as string | undefined) : undefined;
        // hqdefault은 모든 유튜브 영상에 항상 존재(200). maxresdefault은 HD 업로드가 아니면 404가 나서 사용하지 않음.
        // 4:3(480x360) 썸네일이지만 aspect-video + object-cover로 레터박스가 잘려 깔끔한 16:9로 표시됨.
        const image = ytId
          ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
          : firstImage ?? FALLBACK_IMG;
        const imageFallback = ytId
          ? `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`
          : firstImage ?? FALLBACK_IMG;

        return {
          id: row.id,
          title: row.title,
          tags: extractTags(row.content),
          date: formatDate(row.created_at),
          image,
          imageFallback,
          href: `/news/youtube/${row.id}`,
        };
      });

      setCards(mapped);
    })();

    return () => {
      alive = false;
    };
  }, []);

  return (
    <section className="relative overflow-hidden bg-white py-24 md:py-32">
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
          className="flex items-start justify-between gap-6"
        >
          <div className="space-y-4">
            <h2 className="text-[32px] font-black leading-[1.1] tracking-tight text-ink md:text-[48px]">
              척추·관절 <span className="text-primary">연세척TV</span>
            </h2>
            <p className="text-[16px] font-bold leading-[1.85] text-[#1f2937] md:text-[18px]">
              척추·관절 정확히 알고 회복할 수 있도록, 신경외과·정형외과 전문의에게 듣는 의학 정보
            </p>
          </div>

          <Link
            href="/news/youtube"
            aria-label="척추·관절 연세척TV 전체보기"
            className="group mt-1 inline-flex shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white p-4 text-ink-sub shadow-[0_14px_36px_-28px_rgba(15,29,54,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary hover:text-white"
          >
            <Plus size={20} strokeWidth={2.75} className="transition-transform duration-300 group-hover:rotate-90" />
          </Link>
        </motion.div>

        {/* Featured + List */}
        <div className="mt-12 grid grid-cols-1 gap-6 md:mt-16 lg:grid-cols-[1.72fr_1fr] lg:items-stretch lg:gap-8">
          {/* Featured (latest / selected) */}
          <div>
            <Link href={active.href} className="group block">
              <div className="relative aspect-video overflow-hidden rounded-[1.5rem] bg-slate-900 shadow-[0_28px_70px_-38px_rgba(15,29,54,0.55)] ring-1 ring-slate-900/5">
                <AnimatePresence mode="wait">
                  <motion.img
                    key={active.id}
                    src={active.image}
                    alt={active.title}
                    onError={handleImgError(active.imageFallback)}
                    initial={{ opacity: 0, scale: 1.04 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                </AnimatePresence>
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/45 via-transparent to-transparent" />

                {/* 중앙 유튜브 재생 버튼 */}
                <span className="absolute left-1/2 top-1/2 flex h-[54px] w-[76px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[16px] bg-[#FF0000] shadow-[0_10px_30px_-8px_rgba(255,0,0,0.6)] transition-transform duration-300 group-hover:scale-110 md:h-16 md:w-[92px]">
                  <Play size={30} fill="#fff" strokeWidth={0} className="ml-0.5" />
                </span>
              </div>
            </Link>

            <div className="mt-6 space-y-3">
              {active.tags.length > 0 && (
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {active.tags.map((tag) => (
                    <span key={tag} className="text-[13px] font-bold text-ink-muted md:text-[14px]">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <Link href={active.href} className="group block">
                <h3 className="text-[20px] font-black leading-snug tracking-tight text-ink transition-colors duration-300 group-hover:text-primary md:text-[24px]">
                  {active.title}
                </h3>
              </Link>
            </div>
          </div>

          {/* Scrollable list */}
          <div className="relative min-h-[360px]">
            <div className="space-y-2.5 lg:absolute lg:inset-0 lg:overflow-y-auto lg:pr-2 lg:[scrollbar-color:#cbd5e1_transparent] lg:[scrollbar-width:thin] lg:[&::-webkit-scrollbar-thumb]:rounded-full lg:[&::-webkit-scrollbar-thumb]:bg-slate-300 lg:[&::-webkit-scrollbar]:w-1.5">
              {cards.map((card) => {
                const isActive = card.id === active.id;
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => setActiveId(card.id)}
                    className={`group flex w-full items-center gap-4 rounded-2xl border p-2.5 text-left transition-all duration-300 ${
                      isActive
                        ? 'border-primary/25 bg-primary-light/60'
                        : 'border-transparent hover:border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <div className="relative aspect-video w-[42%] shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      <img
                        src={card.image}
                        alt={card.title}
                        onError={handleImgError(card.imageFallback)}
                        className="absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <span className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/95 text-[#FF0000]">
                          <Play size={14} fill="currentColor" strokeWidth={0} className="ml-0.5" />
                        </span>
                      </span>
                    </div>

                    <div className="min-w-0 flex-1 space-y-1.5 py-0.5">
                      {card.tags.length > 0 && (
                        <div className="flex flex-wrap gap-x-2 gap-y-0.5">
                          {card.tags.slice(0, 2).map((tag) => (
                            <span key={tag} className="text-[11px] font-bold text-ink-muted">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      )}
                      <h4
                        className={`line-clamp-2 text-[14px] font-bold leading-snug tracking-tight transition-colors duration-300 md:text-[15px] ${
                          isActive ? 'text-primary' : 'text-ink group-hover:text-primary'
                        }`}
                      >
                        {card.title}
                      </h4>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
