import Link from 'next/link';
import { ChevronRight, Search, PenSquare, GraduationCap, Microscope } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import SubHero from '@/components/SubHero';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface HospitalNews {
  id: string;
  title: string;
  image_urls?: string[];
  created_at: string;
}

export default async function AcademicPage() {
  const { data: news, error } = await supabase
    .from('hospital_news')
    .select('*')
    .eq('type', 'academic')
    .order('created_at', { ascending: false });

  if (error) console.error('Error fetching academic news:', error);
  const newsCount = news?.length || 0;

  return (
    <main className="min-h-screen bg-slate-50">
      <SubHero
        title="연세척 학술소식"
        subtitle={'끊임없이 연구하는 의료진\n최신 의료 기술을 선도하며 환자분들께 최선의 치료를 드립니다.'}
        path={[{ name: '병원소식' }, { name: '연세척 학술소식' }]}
        bgImage="/hero-bg.png"
      />

      <section className="bg-white">
        <div className="mx-auto min-h-0 max-w-[1440px] border-x border-slate-50 px-4 py-14 sm:px-6 sm:py-16 md:min-h-[800px] lg:px-10 lg:py-24">
          <div className="space-y-6 sm:space-y-8">
            <div className="flex flex-col items-stretch gap-4 border-b-2 border-slate-200 pb-5 sm:flex-row sm:items-end sm:justify-between">
              <div className="text-[16px] font-bold text-ink-muted">총 <strong className="text-ink font-black text-[18px]">{newsCount}</strong>건</div>
              <div className="group relative w-full sm:max-w-[340px]">
                <input type="text" placeholder="소식을 검색하세요." className="w-full pl-4 pr-12 py-3 border-b-2 border-slate-200 bg-transparent text-[15px] outline-none focus:border-primary transition-colors font-medium" />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-ink-muted"><Search size={22} strokeWidth={2.5} /></button>
              </div>
            </div>

            {newsCount > 0 ? (
              <div className="grid grid-cols-1 gap-6 py-6 sm:gap-8 sm:py-8 md:grid-cols-2 lg:grid-cols-3 lg:gap-10 lg:py-10">
                {news?.map((item: HospitalNews) => (
                  <Link href={`/news/academic/${item.id}`} key={item.id} className="group flex flex-col overflow-hidden rounded-2xl border border-slate-100 bg-white transition-all duration-500 hover:border-primary/20 hover:shadow-2xl md:rounded-[2rem]">
                    <div className="aspect-square bg-slate-100 relative overflow-hidden">
                      {item.image_urls?.[0] ? <img src={item.image_urls[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><Microscope size={60} strokeWidth={1} /></div>}
                      <div className="absolute left-4 top-4 flex items-center gap-1.5 rounded-full bg-navy-950/80 px-3 py-1.5 font-montserrat text-[10px] font-black uppercase tracking-widest text-white backdrop-blur-md sm:left-6 sm:top-6 sm:px-4 sm:text-[11px]"><GraduationCap size={12} />Academic</div>
                    </div>
                    <div className="flex flex-1 flex-col p-5 sm:p-6 md:p-8">
                      <h3 className="mb-5 line-clamp-2 break-keep text-[19px] font-black leading-[1.45] tracking-tight text-ink transition-colors group-hover:text-primary sm:text-[20px] md:mb-6 md:text-[22px]">{item.title}</h3>
                      <div className="mt-auto flex items-center justify-between text-[14px] font-bold text-ink-muted">
                        <span>{new Date(item.created_at).toLocaleDateString('ko-KR')}</span>
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-20 text-center font-bold text-slate-300 sm:py-32">등록된 학술 소식이 없습니다.</div>
            )}

            <div className="flex justify-center pt-10 border-t border-slate-100">
              <Link href="/news/academic/write" className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-navy-950 px-5 py-4 text-[16px] font-black text-white shadow-lg shadow-navy-950/20 transition-all hover:bg-primary sm:w-auto sm:rounded-[1.25rem] sm:px-12 sm:py-5 sm:text-[18px]">
                <PenSquare size={20} strokeWidth={2.5} /> 학술소식 등록하기
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
