import Link from 'next/link';
import { ChevronRight, Search, PenSquare, PlayCircle, Newspaper } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import SubHero from '@/components/SubHero';

// 서버 사이드 Supabase 클라이언트
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface HospitalNews {
  id: string;
  type: string;
  title: string;
  content: string;
  image_urls: string[];
  source_name?: string;
  created_at: string;
}

export default async function MediaPage() {
  // 1. 'media' 타입의 뉴스 데이터 가져오기
  const { data: news, error } = await supabase
    .from('hospital_news')
    .select('*')
    .eq('type', 'media')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching media news:', error);
  }

  const newsCount = news?.length || 0;

  return (
    <main className="min-h-screen bg-slate-50">
      <SubHero
        title="방송보도 및 언론기사"
        subtitle={'언론이 주목하는 연세척병원\n연세척병원의 전문성과 진심 어린 진료 소식을 전합니다.'}
        path={[{ name: '병원소식' }, { name: '방송보도 및 언론기사' }]}
        bgImage="/hero-bg.png"
      />

      {/* 🔹 List Area */}
      <section className="bg-white">
        <div className="mx-auto min-h-0 max-w-[1440px] border-x border-slate-50 px-4 py-14 shadow-sm sm:px-6 sm:py-16 md:min-h-[800px] lg:px-10 lg:py-24">
          <div className="space-y-6 sm:space-y-8">
            {/* Search & Tool Bar */}
            <div className="flex flex-col items-stretch gap-4 border-b-2 border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="text-[16px] font-bold text-ink-muted tracking-tight">
                총 <strong className="text-ink font-black text-[18px]">{newsCount}</strong>건
              </div>
              <div className="group relative w-full sm:max-w-[340px]">
                <input
                  type="text"
                  placeholder="검색어를 입력해주세요."
                  className="w-full pl-4 pr-12 py-3 border-b-2 border-slate-200 bg-transparent text-[15px] outline-none focus:border-primary transition-colors placeholder:text-ink-muted font-medium"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-ink-muted group-focus-within:text-primary transition-colors">
                  <Search size={22} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* Content Cards Grid */}
            {newsCount > 0 ? (
              <div className="grid grid-cols-1 gap-6 py-6 sm:gap-8 sm:py-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10 lg:py-10">
                {news?.map((item: HospitalNews) => (
                  <Link 
                    href={`/news/media/${item.id}`} 
                    key={item.id}
                    className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all duration-500 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/10 md:rounded-[2rem]"
                  >
                    {/* Thumbnail */}
                    <div className="aspect-[16/10] bg-slate-100 relative overflow-hidden shrink-0">
                      {item.image_urls && item.image_urls.length > 0 ? (
                        <img 
                          src={item.image_urls[0]} 
                          alt={item.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                           <PlayCircle size={60} strokeWidth={1} />
                        </div>
                      )}
                      {/* Category Badge Over Thumbnail */}
                      <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-navy-950/80 px-3 py-1.5 font-montserrat text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md sm:left-6 sm:top-6 sm:px-4 sm:text-[11px]">
                        <Newspaper size={12} />
                        Media News
                      </div>
                    </div>

                    {/* Text Body */}
                    <div className="flex flex-1 flex-col p-5 sm:p-6 md:p-8">
                      <div className="flex-1 space-y-4 mb-8">
                        <div className="text-primary font-black text-[13px] tracking-tight">{item.source_name || '언론보도'}</div>
                        <h3 className="line-clamp-2 break-keep text-[19px] font-black leading-[1.45] tracking-tight text-ink transition-colors group-hover:text-primary sm:text-[20px] md:text-[22px]">
                          {item.title}
                        </h3>
                      </div>
                      <div className="flex items-center justify-between text-[14px] font-bold text-ink-muted">
                        <span>{new Date(item.created_at).toLocaleDateString('ko-KR')}</span>
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform text-primary/50" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center sm:py-32">
                <p className="text-[20px] font-bold text-slate-300 tracking-tight">등록된 보도 자료가 없습니다.</p>
                <div className="mt-8 flex justify-center">
                   <div className="w-16 h-1 bg-slate-100 rounded-full" />
                </div>
              </div>
            )}

            {/* Admin Action */}
            <div className="flex justify-center pt-10 border-t border-slate-100">
              <Link 
                href="/news/media/write"
                className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-navy-950 px-5 py-4 text-[16px] font-black tracking-tight text-white shadow-lg transition-all hover:bg-primary hover:shadow-blue-glow active:scale-95 sm:w-auto sm:rounded-[1.25rem] sm:px-12 sm:py-5 sm:text-[18px]"
              >
                <PenSquare size={20} strokeWidth={2.5} />
                새로운 보도자료 등록
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
