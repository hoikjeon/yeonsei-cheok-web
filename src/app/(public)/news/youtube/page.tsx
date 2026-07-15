import Link from 'next/link';
import { Search, PenSquare, Play, Video } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import SubHero from '@/components/SubHero';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface HospitalNews {
  id: string;
  title: string;
  image_urls?: string[];
  video_url?: string;
  created_at: string;
}

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
    <main className="min-h-screen bg-slate-50">
      <SubHero
        title="유튜브 의학소식"
        subtitle={'영상으로 만나는 건강 정보\n연세척병원이 전하는 유익하고 정확한 의학 지식입니다.'}
        path={[{ name: '병원소식' }, { name: '유튜브 의학소식' }]}
        bgImage="/hero-bg.png"
      />

      <section className="bg-white">
        <div className="mx-auto min-h-0 max-w-[1440px] border-x border-slate-50 px-4 py-14 sm:px-6 sm:py-16 md:min-h-[800px] lg:px-10 lg:py-24">
          <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col items-stretch gap-4 border-b-2 border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="text-[16px] font-bold text-ink-muted">총 <strong className="text-ink font-black text-[18px]">{newsCount}</strong>건</div>
              <div className="group relative w-full sm:max-w-[340px]">
                <input type="text" placeholder="영상을 검색하세요." className="w-full pl-4 pr-12 py-3 border-b-2 border-slate-200 bg-transparent text-[15px] outline-none focus:border-primary transition-colors font-medium" />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-ink-muted"><Search size={22} strokeWidth={2.5} /></button>
              </div>
            </div>

            {newsCount > 0 ? (
              <div className="grid grid-cols-1 gap-6 py-6 sm:gap-8 sm:py-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10 lg:py-10">
                {news?.map((item: HospitalNews) => {
                  const youtubeId = item.video_url ? getYoutubeId(item.video_url) : null;
                  const thumbUrl = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/maxresdefault.jpg` : item.image_urls?.[0];

                  return (
                    <Link href={`/news/youtube/${item.id}`} key={item.id} className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all duration-500 hover:border-primary/20 md:rounded-[2rem]">
                      <div className="aspect-video bg-slate-100 relative overflow-hidden">
                        {thumbUrl ? (
                           <img src={youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : thumbUrl} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-300"><Video size={60} strokeWidth={1} /></div>
                        )}
                        <div className="absolute inset-0 flex items-center justify-center bg-black/10 opacity-100 transition-opacity md:bg-black/20 md:opacity-0 md:group-hover:opacity-100">
                          <div className="flex h-14 w-14 scale-100 items-center justify-center rounded-full bg-white/90 text-primary shadow-2xl backdrop-blur-md transition-transform md:h-16 md:w-16 md:scale-75 md:group-hover:scale-100">
                            <Play size={28} fill="currentColor" />
                          </div>
                        </div>
                        <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-red-600/90 px-3 py-1.5 font-montserrat text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md sm:left-6 sm:top-6 sm:px-4"><Play size={10} fill="white" />YouTube</div>
                      </div>
                      <div className="flex flex-1 flex-col p-5 sm:p-6 md:p-8">
                        <h3 className="mb-5 line-clamp-2 break-keep text-[19px] font-black leading-[1.45] tracking-tight text-ink transition-colors group-hover:text-primary sm:text-[20px] md:mb-6">{item.title}</h3>
                        <div className="mt-auto flex items-center justify-between text-[14px] font-bold text-ink-muted">
                          <span>{new Date(item.created_at).toLocaleDateString('ko-KR')}</span>
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            ) : (
              <div className="py-20 text-center font-bold text-slate-300 sm:py-32">등록된 영상 소식이 없습니다.</div>
            )}

            <div className="flex justify-center pt-10 border-t border-slate-100">
              <Link href="/news/youtube/write" className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-navy-950 px-5 py-4 text-[16px] font-black text-white shadow-lg shadow-navy-950/20 transition-all hover:bg-primary sm:w-auto sm:rounded-[1.25rem] sm:px-12 sm:py-5 sm:text-[18px]">
                <PenSquare size={20} strokeWidth={2.5} /> 유튜브 소식 등록하기
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
