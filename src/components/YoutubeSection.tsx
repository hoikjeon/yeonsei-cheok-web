'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { Play, Plus } from 'lucide-react';
import { supabase } from '@/lib/supabase';

type YoutubeCard = {
  id: string;
  /** 유튜브 11자리 영상 ID. 없으면 인라인 재생 대신 상세 페이지로 이동합니다. */
  videoId: string | null;
  title: string;
  tags: string[];
  date: string;
  featuredImage: string;
  featuredImageFallbacks: string[];
  image: string;
  imageFallbacks: string[];
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

const FALLBACK_IMG = '/generated/hero-university-doctors.png';

// 고해상도 썸네일부터 순서대로 시도하고, 없는 경우 다음 해상도로 교체합니다.
function handleImgError(fallbacks: string[]) {
  return (e: React.SyntheticEvent<HTMLImageElement>) => {
    const img = e.currentTarget;
    const fallbackIndex = Number(img.dataset.fallbackIndex ?? '0');
    const fallback = fallbacks[fallbackIndex];

    if (!fallback) return;

    img.dataset.fallbackIndex = String(fallbackIndex + 1);
    img.src = fallback;
  };
}

export default function YoutubeSection() {
  const router = useRouter();
  const [cards, setCards] = useState<YoutubeCard[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  // 재생 중인 카드 id. null이면 썸네일을 보여줍니다.
  const [playingId, setPlayingId] = useState<string | null>(null);
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
        const featuredImage = ytId
          ? `https://img.youtube.com/vi/${ytId}/maxresdefault.jpg`
          : firstImage ?? FALLBACK_IMG;
        const featuredImageFallbacks = ytId
          ? [
              `https://img.youtube.com/vi/${ytId}/sddefault.jpg`,
              `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`,
              `https://img.youtube.com/vi/${ytId}/mqdefault.jpg`,
              FALLBACK_IMG,
            ]
          : firstImage
            ? [FALLBACK_IMG]
            : [];
        const image = ytId
          ? `https://img.youtube.com/vi/${ytId}/hqdefault.jpg`
          : firstImage ?? FALLBACK_IMG;
        const imageFallbacks = ytId
          ? [`https://img.youtube.com/vi/${ytId}/mqdefault.jpg`, FALLBACK_IMG]
          : firstImage
            ? [FALLBACK_IMG]
            : [];

        return {
          id: row.id,
          videoId: ytId,
          title: row.title,
          tags: extractTags(row.content),
          date: formatDate(row.created_at),
          featuredImage,
          featuredImageFallbacks,
          image,
          imageFallbacks,
          href: `/news/youtube/${row.id}`,
        };
      });

      setCards(mapped);
    })();

    return () => {
      alive = false;
    };
  }, []);

  // 불러오기 전이거나 등록된 영상이 없으면 섹션을 감춥니다(가짜 카드를 띄우지 않음).
  if (!active) return null;

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
              척추·관절 <span className="text-primary">연세척TV</span>
            </h2>
            <p className="break-keep text-body-lg text-ink-sub">
              척추·관절 정확히 알고 회복할 수 있도록, 신경외과·정형외과 전문의에게 듣는 의학 정보
            </p>
          </div>

          <Link
            href="/news/youtube"
            aria-label="척추·관절 연세척TV 전체보기"
            className="group inline-flex shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white p-3 text-ink-sub shadow-[0_14px_36px_-28px_rgba(15,29,54,0.5)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/30 hover:bg-primary hover:text-white md:mt-1 md:p-4"
          >
            <Plus size={20} strokeWidth={2.75} className="transition-transform duration-300 group-hover:rotate-90" />
          </Link>
        </motion.div>

        {/* Featured + List */}
        <div className="mt-10 grid grid-cols-1 gap-6 md:mt-16 lg:grid-cols-[1.4fr_1fr] lg:items-stretch lg:gap-8">
          {/* Featured (latest / selected) */}
          <div>
            <div className="relative aspect-video overflow-hidden rounded-2xl bg-slate-900 shadow-[0_28px_70px_-38px_rgba(15,29,54,0.55)] ring-1 ring-slate-900/5 md:rounded-[1.5rem]">
              {playingId === active.id && active.videoId ? (
                <iframe
                  key={active.videoId}
                  src={`https://www.youtube-nocookie.com/embed/${active.videoId}?autoplay=1&rel=0&modestbranding=1`}
                  title={active.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                  className="absolute inset-0 h-full w-full border-0"
                />
              ) : (
                <button
                  type="button"
                  // 영상 ID를 못 읽은 경우에만 상세 페이지로 넘깁니다.
                  onClick={() =>
                    active.videoId ? setPlayingId(active.id) : router.push(active.href)
                  }
                  aria-label={`${active.title} 재생`}
                  className="group absolute inset-0 block h-full w-full"
                >
                  <AnimatePresence mode="wait">
                    <motion.img
                      key={active.id}
                      src={active.featuredImage}
                      alt={active.title}
                      onError={handleImgError(active.featuredImageFallbacks)}
                      initial={{ opacity: 0, scale: 1.04 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0 }}
                      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
                      className="absolute inset-0 h-full w-full object-cover"
                    />
                  </AnimatePresence>
                  <span className="absolute inset-0 bg-gradient-to-t from-navy-950/45 via-transparent to-transparent" />

                  {/* 중앙 유튜브 재생 버튼 */}
                  <span className="absolute left-1/2 top-1/2 flex h-[54px] w-[76px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-[16px] bg-[#FF0000] shadow-[0_10px_30px_-8px_rgba(255,0,0,0.6)] transition-transform duration-300 group-hover:scale-110 md:h-16 md:w-[92px]">
                    <Play size={30} fill="#fff" strokeWidth={0} className="ml-0.5" />
                  </span>
                </button>
              )}
            </div>

            <div className="mt-6 space-y-3">
              {active.tags.length > 0 && (
                <div className="flex flex-wrap gap-x-3 gap-y-1">
                  {active.tags.map((tag) => (
                    <span key={tag} className="text-caption font-semibold text-ink-muted">
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
              <Link href={active.href} className="group block">
                <h3 className="break-keep text-h4 leading-snug tracking-tight text-ink transition-colors duration-300 group-hover:text-primary">
                  {active.title}
                </h3>
              </Link>
            </div>
          </div>

          {/* Scrollable list */}
          <div className="relative min-h-0 lg:min-h-[360px]">
            <div className="space-y-2.5 lg:absolute lg:inset-0 lg:overflow-y-auto lg:pr-2 lg:[scrollbar-color:#cbd5e1_transparent] lg:[scrollbar-width:thin] lg:[&::-webkit-scrollbar-thumb]:rounded-full lg:[&::-webkit-scrollbar-thumb]:bg-slate-300 lg:[&::-webkit-scrollbar]:w-1.5">
              {cards.map((card, index) => {
                const isActive = card.id === active.id;
                return (
                  <button
                    key={card.id}
                    type="button"
                    onClick={() => {
                      setActiveId(card.id);
                      // 이미 재생 중이었다면 새 영상도 바로 이어서 재생합니다.
                      setPlayingId(playingId && card.videoId ? card.id : null);
                    }}
                    className={`group w-full items-center gap-3 rounded-xl border p-2 text-left transition-all duration-300 sm:gap-4 sm:rounded-2xl sm:p-2.5 ${
                      index >= 3 ? 'hidden lg:flex' : 'flex'
                    } ${
                      isActive
                        ? 'border-primary/25 bg-primary-light/60'
                        : 'border-transparent hover:border-slate-100 hover:bg-slate-50'
                    }`}
                  >
                    <div className="relative aspect-video w-[42%] shrink-0 overflow-hidden rounded-xl bg-slate-100">
                      <img
                        src={card.image}
                        alt={card.title}
                        onError={handleImgError(card.imageFallbacks)}
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
                        className={`line-clamp-2 text-body font-semibold leading-snug tracking-tight transition-colors duration-300 ${
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
