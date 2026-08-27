import React from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Home, ChevronRight, ArrowLeft } from 'lucide-react';
import { getHospitalNewsItem } from '@/lib/hospitalNews';
import { createPageMetadata, summarizeForMetadata } from '@/lib/seo';

type DetailPageProps = { params: Promise<{ id: string }> };

function getYoutubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const { item } = await getHospitalNewsItem(id, 'youtube');

  if (!item) {
    return createPageMetadata({
      title: '유튜브 의학소식을 찾을 수 없습니다',
      description: '요청하신 유튜브 의학소식을 찾을 수 없습니다.',
      path: `/news/youtube/${id}`,
      noIndex: true,
    });
  }

  const youtubeId = item.video_url ? getYoutubeId(item.video_url) : null;

  return createPageMetadata({
    title: item.title,
    description: summarizeForMetadata(
      item.content,
      '연세척병원 의료진이 영상으로 전하는 척추·관절 건강 정보입니다.',
    ),
    path: `/news/youtube/${id}`,
    image: item.image_urls?.[0] || (youtubeId ? `https://i.ytimg.com/vi/${youtubeId}/maxresdefault.jpg` : undefined),
    type: 'article',
  });
}

export default async function YoutubeDetailPage({ params }: DetailPageProps) {
  const { id } = await params;

  const { item, error } = await getHospitalNewsItem(id, 'youtube');

  if (error || !item) return notFound();

  const youtubeId = item.video_url ? getYoutubeId(item.video_url) : null;

  return (
    <main className="min-h-screen bg-white pt-0 md:pt-[96px]">
      <section className="bg-slate-50 border-b border-slate-100">
        <div className="mx-auto flex max-w-7xl items-center gap-1.5 overflow-hidden px-4 py-4 text-[12px] font-bold tracking-tight text-ink-muted sm:gap-2 sm:px-7 sm:py-6 sm:text-[13px] xl:px-10">
          <Link href="/" className="hover:text-primary transition-colors"><Home size={14} /></Link>
          <ChevronRight size={12} strokeWidth={3} />
          <Link href="/news/youtube" className="hover:text-primary transition-colors">병원소식</Link>
          <ChevronRight size={12} strokeWidth={3} />
          <Link href="/news/youtube" className="hover:text-primary transition-colors">유튜브 의학소식</Link>
          <ChevronRight size={12} strokeWidth={3} />
          <span className="min-w-0 flex-1 truncate text-ink">{item.title}</span>
        </div>
      </section>

      <div className="mx-auto max-w-[1000px] px-4 py-10 sm:px-6 sm:py-14 md:py-24">
        <div className="mb-8 border-b border-slate-100 pb-8 sm:mb-12 sm:pb-12">
          <h1 className="break-keep text-h2 tracking-tight text-ink">{item.title}</h1>
        </div>

        {/* YouTube Video Player */}
        {youtubeId ? (
          <div className="mb-12 aspect-video overflow-hidden rounded-2xl border-4 border-slate-50 bg-black shadow-xl sm:mb-20 sm:rounded-[2.5rem] sm:border-8 sm:shadow-2xl">
            <iframe 
              width="100%" 
              height="100%" 
              src={`https://www.youtube.com/embed/${youtubeId}?autoplay=0&rel=0`}
              title={item.title}
              frameBorder="0" 
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
              allowFullScreen
            ></iframe>
          </div>
        ) : item.image_urls?.[0] && (
          <div className="mb-12 overflow-hidden rounded-2xl sm:mb-20 sm:rounded-[2rem]">
             <img src={item.image_urls[0]} alt={item.title} className="w-full h-auto" />
          </div>
        )}

        <div className="prose prose-slate mb-14 max-w-none sm:mb-20 md:mb-24">
          <p className="whitespace-pre-wrap break-keep text-[16px] font-medium leading-[1.8] tracking-tight text-ink-sub sm:text-[18px] sm:leading-[1.9] md:text-[20px]">{item.content}</p>
        </div>

        <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Link href="/news/youtube" className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-5 py-4 text-[16px] font-bold text-ink-sub transition-all hover:bg-slate-200 active:scale-95 sm:w-auto sm:rounded-[1.25rem] sm:px-10 sm:py-5 sm:text-[17px]">
            <ArrowLeft size={20} strokeWidth={2.5} /> 목록으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}
