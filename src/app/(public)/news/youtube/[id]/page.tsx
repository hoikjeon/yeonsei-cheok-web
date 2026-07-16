import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Home, ChevronRight, ArrowLeft, Calendar, Play, Video } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

function getYoutubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default async function YoutubeDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  const { data: item, error } = await supabase
    .from('hospital_news')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !item) return notFound();

  const youtubeId = item.video_url ? getYoutubeId(item.video_url) : null;

  return (
    <main className="min-h-screen bg-white pt-0 md:pt-[96px]">
      <section className="bg-slate-50 border-b border-slate-100">
        <div className="mx-auto flex max-w-[1200px] items-center gap-1.5 overflow-hidden px-4 py-4 text-[12px] font-bold tracking-tight text-ink-muted sm:gap-2 sm:px-6 sm:py-6 sm:text-[13px]">
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
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-100 rounded-full text-red-600 text-[13px] font-bold tracking-tight mb-6 font-montserrat uppercase">
            <Play size={12} fill="currentColor" /> YouTube Channel
          </div>
          <h1 className="mb-6 break-keep text-h2 tracking-tight text-ink sm:mb-8">{item.title}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] font-bold tracking-tight text-ink-muted sm:gap-6 sm:text-[15px]">
            <div className="flex items-center gap-2"><Calendar size={18} className="text-slate-300" />{new Date(item.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div className="flex items-center gap-2"><Video size={18} className="text-slate-300" />영상 지식 나눔</div>
          </div>
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
          {item.video_url && (
             <a href={item.video_url} target="_blank" rel="noreferrer" className="flex w-full items-center justify-center gap-2 rounded-xl bg-red-600 px-5 py-4 text-[16px] font-bold text-white shadow-lg shadow-red-600/20 transition-all active:scale-95 sm:w-auto sm:rounded-[1.25rem] sm:px-10 sm:py-5 sm:text-[17px]">
               유튜브에서 직접 보기
             </a>
          )}
        </div>
      </div>
    </main>
  );
}
