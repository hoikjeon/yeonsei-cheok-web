import Link from 'next/link';
import { ChevronRight, Search, Globe2, GraduationCap } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import SubHero from '@/components/SubHero';
import Pagination from '@/components/Pagination';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: '국제 척추내시경 트레이닝 센터',
  description:
    '연세척병원의 국내외 의료진 대상 척추내시경 교육, 술기 교류와 트레이닝 소식을 전합니다.',
  path: '/news/training',
  image: '/generated/hero-medical-conference.png',
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 한 페이지 노출 수. 1/2/3열 그리드라 2와 3으로 나누어떨어지는 값이어야 마지막 줄이 비지 않습니다.
const PAGE_SIZE = 12;

// 관리자에서 글을 올리면 최대 60초 안에 목록에 반영됩니다.
// 이 값이 없으면 빌드 시점 데이터로 굳어 재배포 전까지 새 글이 보이지 않습니다.
export const revalidate = 60;

interface HospitalNews {
  id: string;
  title: string;
  image_urls?: string[];
  created_at: string;
}

export default async function TrainingPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam || '1', 10) || 1);

  const { data: news, count, error } = await supabase
    .from('hospital_news')
    .select('*', { count: 'exact' })
    .eq('type', 'training')
    .order('created_at', { ascending: false })
    .range((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE - 1);

  if (error) console.error('Error fetching training news:', error);
  const newsCount = count || 0;
  const totalPages = Math.max(1, Math.ceil(newsCount / PAGE_SIZE));

  return (
    <main className="min-h-screen bg-slate-50">
      <SubHero
        title="국제 척추내시경 트레이닝 센터"
        subtitle={'세계로 뻗어나가는 연세척의 의료 기술\n국내외 의료진을 대상으로 한 척추 내시경 교육 및 교류 소식입니다.'}
        path={[{ name: '병원소식' }, { name: '국제 척추내시경 트레이닝 센터' }]}
        bgImage="/hero-bg.png"
      />

      <section className="bg-white">
        <div className="mx-auto min-h-0 max-w-7xl border-x border-slate-50 px-4 py-14 sm:px-6 sm:py-16 md:min-h-[800px] lg:px-10 lg:py-24">
          <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col items-stretch gap-4 border-b-2 border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="text-[16px] font-bold text-ink-muted">총 <strong className="text-ink font-bold text-[18px]">{newsCount}</strong>건</div>
              <div className="group relative w-full sm:max-w-[340px]">
                <input type="text" placeholder="트레이닝 소식을 검색하세요." className="w-full pl-4 pr-12 py-3 border-b-2 border-slate-200 bg-transparent text-[15px] outline-none focus:border-primary transition-colors font-medium" />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-ink-muted"><Search size={22} strokeWidth={2.5} /></button>
              </div>
            </div>

            {newsCount > 0 ? (
              <div className="grid grid-cols-1 gap-6 py-6 sm:gap-8 sm:py-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10 lg:py-10">
                {news?.map((item: HospitalNews) => (
                  <Link href={`/news/training/${item.id}`} key={item.id} className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all duration-500 hover:border-primary/20 hover:shadow-2xl md:rounded-[2rem]">
                    <div className="aspect-[4/3] bg-slate-100 relative overflow-hidden">
                      {item.image_urls?.[0] ? <img src={item.image_urls[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><Globe2 size={60} strokeWidth={1} /></div>}
                      <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-blue-600/90 px-3 py-1.5 font-montserrat text-[10px] font-bold uppercase tracking-widest text-white backdrop-blur-md sm:left-6 sm:top-6 sm:px-4 sm:text-[11px]"><GraduationCap size={12} /> Training Center</div>
                    </div>
                    <div className="flex flex-1 flex-col p-5 sm:p-6 md:p-8">
                      <h3 className="mb-5 line-clamp-3 break-keep text-h4 tracking-tight text-ink transition-colors group-hover:text-primary md:mb-6">{item.title}</h3>
                      <div className="mt-auto flex items-center justify-between text-[14px] font-bold text-ink-muted">
                        <span>{new Date(item.created_at).toLocaleDateString('ko-KR')}</span>
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center font-bold tracking-tight text-slate-300 sm:py-32">등록된 트레이닝 센터 소식이 없습니다.</div>
            )}

            <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/news/training" />

          </div>
        </div>
      </section>
    </main>
  );
}
