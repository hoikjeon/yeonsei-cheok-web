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
        <div className="max-w-[1440px] mx-auto px-10 py-24 border-x border-slate-50 min-h-[800px] shadow-sm">
          <div className="space-y-8">
            {/* Search & Tool Bar */}
            <div className="flex justify-between items-end border-b-2 border-slate-200 pb-5">
              <div className="text-[16px] font-bold text-ink-muted tracking-tight">
                총 <strong className="text-ink font-black text-[18px]">{newsCount}</strong>건
              </div>
              <div className="relative group w-full max-w-[340px]">
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
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 py-10">
                {news?.map((item: HospitalNews) => (
                  <Link 
                    href={`/news/media/${item.id}`} 
                    key={item.id}
                    className="group flex flex-col bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/10 transition-all duration-500"
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
                      <div className="absolute top-6 left-6 px-4 py-1.5 bg-navy-950/80 backdrop-blur-md rounded-full text-white text-[11px] font-black font-montserrat uppercase tracking-widest flex items-center gap-1.5">
                        <Newspaper size={12} />
                        Media News
                      </div>
                    </div>

                    {/* Text Body */}
                    <div className="p-8 flex flex-col flex-1">
                      <div className="flex-1 space-y-4 mb-8">
                        <div className="text-primary font-black text-[13px] tracking-tight">{item.source_name || '언론보도'}</div>
                        <h3 className="text-[22px] font-black text-ink leading-[1.4] tracking-tighter group-hover:text-primary transition-colors line-clamp-2">
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
              <div className="py-32 text-center">
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
                className="inline-flex items-center gap-3 px-12 py-5 bg-navy-950 text-white rounded-[1.25rem] hover:bg-primary font-black shadow-lg hover:shadow-blue-glow transition-all active:scale-95 text-[18px] tracking-tight"
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
