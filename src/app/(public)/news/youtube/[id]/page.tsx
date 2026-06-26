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
    <main className="min-h-screen bg-white pt-[96px]">
      <section className="bg-slate-50 border-b border-slate-100">
        <div className="max-w-[1200px] mx-auto px-6 py-6 flex items-center gap-2 text-[13px] text-ink-muted font-bold tracking-tight">
          <Link href="/" className="hover:text-primary transition-colors"><Home size={14} /></Link>
          <ChevronRight size={12} strokeWidth={3} />
          <Link href="/news/youtube" className="hover:text-primary transition-colors">병원소식</Link>
          <ChevronRight size={12} strokeWidth={3} />
          <Link href="/news/youtube" className="hover:text-primary transition-colors">유튜브 의학소식</Link>
          <ChevronRight size={12} strokeWidth={3} />
          <span className="text-ink truncate max-w-[200px]">{item.title}</span>
        </div>
      </section>

      <div className="max-w-[1000px] mx-auto px-6 py-16 md:py-24">
        <div className="mb-12 border-b border-slate-100 pb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-red-50 border border-red-100 rounded-full text-red-600 text-[13px] font-black tracking-tight mb-6 font-montserrat uppercase">
            <Play size={12} fill="currentColor" /> YouTube Channel
          </div>
          <h1 className="text-[32px] md:text-[44px] font-black text-ink tracking-tighter leading-[1.2] mb-8">{item.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-[15px] font-bold text-ink-muted tracking-tight">
            <div className="flex items-center gap-2"><Calendar size={18} className="text-slate-300" />{new Date(item.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div className="flex items-center gap-2"><Video size={18} className="text-slate-300" />영상 지식 나눔</div>
          </div>
        </div>

        {/* YouTube Video Player */}
        {youtubeId ? (
          <div className="mb-20 rounded-[2.5rem] overflow-hidden shadow-2xl border-8 border-slate-50 aspect-video bg-black">
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
          <div className="mb-20 rounded-[2rem] overflow-hidden">
             <img src={item.image_urls[0]} alt={item.title} className="w-full h-auto" />
          </div>
        )}

        <div className="prose prose-slate max-w-none mb-24">
          <p className="text-[18px] md:text-[20px] font-medium text-ink-sub leading-[1.9] tracking-tight whitespace-pre-wrap">{item.content}</p>
        </div>

        <div className="flex justify-center items-center gap-4">
          <Link href="/news/youtube" className="flex items-center gap-2 px-10 py-5 bg-slate-100 hover:bg-slate-200 text-ink-sub font-black rounded-[1.25rem] transition-all active:scale-95 text-[17px]">
            <ArrowLeft size={20} strokeWidth={2.5} /> 목록으로 돌아가기
          </Link>
          {item.video_url && (
             <a href={item.video_url} target="_blank" rel="noreferrer" className="flex items-center gap-2 px-10 py-5 bg-red-600 text-white font-black rounded-[1.25rem] transition-all active:scale-95 text-[17px] shadow-lg shadow-red-600/20">
               유튜브에서 직접 보기
             </a>
          )}
        </div>
      </div>
    </main>
  );
}
