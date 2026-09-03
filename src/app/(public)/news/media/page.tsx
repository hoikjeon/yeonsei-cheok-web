import Link from 'next/link';
import { ChevronRight, Search, PlayCircle } from 'lucide-react';
import SubHero from '@/components/SubHero';
import Pagination from '@/components/Pagination';
import { getHospitalNewsList } from '@/lib/hospitalNews';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: '방송보도·언론기사',
  description: '연세척병원의 방송 출연, 언론 보도와 주요 의료 활동 소식을 확인하세요.',
  path: '/news/media',
});

// 한 페이지 노출 수. 1/2/3열 그리드라 2와 3으로 나누어떨어지는 값이어야 마지막 줄이 비지 않습니다.
const PAGE_SIZE = 12;

export default async function MediaPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam || '1', 10) || 1);

  const { news, count: newsCount } = await getHospitalNewsList('media', currentPage, PAGE_SIZE);
  const totalPages = Math.max(1, Math.ceil(newsCount / PAGE_SIZE));

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
        <div className="mx-auto min-h-0 max-w-7xl border-x border-slate-50 px-4 py-14 shadow-sm sm:px-6 sm:py-16 md:min-h-[800px] lg:px-10 lg:py-24">
          <div className="space-y-6 sm:space-y-8">
            {/* Search & Tool Bar */}
            <div className="flex flex-col items-stretch gap-4 border-b-2 border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="text-[16px] font-bold text-ink-muted tracking-tight">
                총 <strong className="text-ink font-bold text-[18px]">{newsCount}</strong>건
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
                {news.map((item) => (
                  <Link 
                    href={`/news/media/${item.id}`} 
                    key={item.id}
                    className="group flex flex-col overflow-hidden rounded-xl border border-slate-100 bg-white transition-all duration-500 hover:border-primary/20 hover:shadow-2xl hover:shadow-primary/10 md:rounded-[1rem]"
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
                    </div>

                    {/* Text Body */}
                    <div className="flex flex-1 flex-col p-5 sm:p-6 md:p-8">
                      <div className="flex-1 space-y-4 mb-8">
                        <div className="text-primary font-bold text-[13px] tracking-tight">{item.source_name || '언론보도'}</div>
                        <h3 className="line-clamp-2 break-keep text-h4 tracking-tight text-ink transition-colors group-hover:text-primary">
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

            <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/news/media" />

          </div>
        </div>
      </section>
    </main>
  );
}
