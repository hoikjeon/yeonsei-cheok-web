import React from 'react';
import Link from 'next/link';
import { Home, ChevronRight, Search, PenSquare, Play, Video } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 유튜브 URL에서 ID 추출 함수 (Shorts, Mobile, Watch 등 대응)
function getYoutubeId(url: string) {
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=|\/shorts\/)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? match[2] : null;
}

export default async function YoutubePage() {
  const { data: news, error } = await supabase
    .from('hospital_news')
    .select('*')
    .eq('type', 'youtube')
    .order('created_at', { ascending: false });

  if (error) console.error('Error fetching youtube news:', error);
  const newsCount = news?.length || 0;

  return (
    <main className="min-h-screen bg-slate-50 pt-[96px]">
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-10 py-16">
          <div className="flex items-center gap-2 text-[14px] text-slate-500 font-bold tracking-tight mb-10">
            <Link href="/" className="hover:text-primary transition-colors"><Home size={16} strokeWidth={2.5} /></Link>
            <ChevronRight size={14} strokeWidth={2.5} />
            <span className="text-slate-400">병원소식</span>
            <ChevronRight size={14} strokeWidth={2.5} />
            <span className="text-navy-950">유튜브 의학소식</span>
          </div>
          <h1 className="text-[48px] md:text-[56px] font-black text-navy-950 tracking-tighter">유튜브 의학소식</h1>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-[1440px] mx-auto px-10 py-24 border-x border-slate-50 min-h-[800px]">
          <div className="mb-20">
            <h2 className="text-[36px] font-black leading-[1.3] text-navy-950 tracking-tighter mb-4">영상으로 만나는 건강 정보</h2>
            <p className="text-slate-500 text-[18px] font-bold tracking-tight">연세척병원이 전하는 유익하고 정확한 의학 지식입니다.</p>
          </div>

          <div className="space-y-8">
            <div className="flex justify-between items-end border-b-2 border-slate-200 pb-5">
              <div className="text-[16px] font-bold text-slate-500">총 <strong className="text-navy-950 font-black text-[18px]">{newsCount}</strong>건</div>
              <div className="relative group w-full max-w-[340px]">
                <input type="text" placeholder="영상을 검색하세요." className="w-full pl-4 pr-12 py-3 border-b-2 border-slate-200 bg-transparent text-[15px] outline-none focus:border-primary transition-colors font-medium" />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400"><Search size={22} strokeWidth={2.5} /></button>
              </div>
            </div>

            {newsCount > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 py-10">
                {news?.map((item: any) => {
                  const youtubeId = item.video_url ? getYoutubeId(item.video_url) : null;
                  const thumbUrl = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : item.image_urls?.[0];

                  return (
                    <Link href={`/news/youtube/${item.id}`} key={item.id} className="group flex flex-col bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:border-primary/20 transition-all duration-500">
                      <div className="aspect-video bg-slate-100 relative overflow-hidden">
                        {thumbUrl ? (
                           <img src={youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : thumbUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300"><Video size={60} strokeWidth={1} /></div>
                        )}
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <div className="w-16 h-16 bg-white/90 backdrop-blur-md rounded-full flex items-center justify-center text-primary shadow-2xl scale-75 group-hover:scale-100 transition-transform">
                            <Play size={28} fill="currentColor" />
                          </div>
                        </div>
                        <div className="absolute top-6 left-6 px-4 py-1.5 bg-red-600/90 backdrop-blur-md rounded-full text-white text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5"><Play size={10} fill="white" />YouTube</div>
                      </div>
                      <div className="p-8 flex flex-col flex-1">
                        <h3 className="text-[20px] font-black text-navy-950 leading-[1.4] tracking-tighter group-hover:text-primary transition-colors line-clamp-2 mb-6">{item.title}</h3>
                        <div className="mt-auto flex items-center justify-between text-[14px] font-bold text-slate-400">
                          <span>{new Date(item.created_at).toLocaleDateString('ko-KR')}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="py-32 text-center text-slate-300 font-bold">등록된 영상 소식이 없습니다.</div>
            )}

            <div className="flex justify-center pt-10 border-t border-slate-100">
              <Link href="/news/youtube/write" className="inline-flex items-center gap-3 px-12 py-5 bg-navy-950 text-white rounded-[1.25rem] hover:bg-primary font-black shadow-lg shadow-navy-950/20 transition-all text-[18px]">
                <PenSquare size={20} strokeWidth={2.5} /> 유튜브 소식 등록하기
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
