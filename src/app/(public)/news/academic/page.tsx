import React from 'react';
import Link from 'next/link';
import { Home, ChevronRight, Search, PenSquare, GraduationCap, Microscope } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function AcademicPage() {
  const { data: news, error } = await supabase
    .from('hospital_news')
    .select('*')
    .eq('type', 'academic')
    .order('created_at', { ascending: false });

  if (error) console.error('Error fetching academic news:', error);
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
            <span className="text-navy-950">연세척 학술소식</span>
          </div>
          <h1 className="text-[48px] md:text-[56px] font-black text-navy-950 tracking-tighter">연세척 학술소식</h1>
        </div>
      </section>

      <section className="bg-white">
        <div className="max-w-[1440px] mx-auto px-10 py-24 border-x border-slate-50 min-h-[800px]">
          <div className="mb-20">
            <h2 className="text-[36px] font-black leading-[1.3] text-navy-950 tracking-tighter mb-4">끊임없이 연구하는 의료진</h2>
            <p className="text-slate-500 text-[18px] font-bold tracking-tight">최신 의료 기술을 선도하며 환자분들께 최선의 치료를 드립니다.</p>
          </div>

          <div className="space-y-8">
            <div className="flex justify-between items-end border-b-2 border-slate-200 pb-5">
              <div className="text-[16px] font-bold text-slate-500">총 <strong className="text-navy-950 font-black text-[18px]">{newsCount}</strong>건</div>
              <div className="relative group w-full max-w-[340px]">
                <input type="text" placeholder="소식을 검색하세요." className="w-full pl-4 pr-12 py-3 border-b-2 border-slate-200 bg-transparent text-[15px] outline-none focus:border-primary transition-colors font-medium" />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400"><Search size={22} strokeWidth={2.5} /></button>
              </div>
            </div>

            {newsCount > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 py-10">
                {news?.map((item: any) => (
                  <Link href={`/news/academic/${item.id}`} key={item.id} className="group flex flex-col bg-white rounded-[2rem] overflow-hidden border border-slate-100 hover:border-primary/20 hover:shadow-2xl transition-all duration-500">
                    <div className="aspect-square bg-slate-100 relative overflow-hidden">
                      {item.image_urls?.[0] ? <img src={item.image_urls[0]} alt={item.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform" /> : <div className="w-full h-full flex items-center justify-center text-slate-300"><Microscope size={60} strokeWidth={1} /></div>}
                      <div className="absolute top-6 left-6 px-4 py-1.5 bg-navy-950/80 backdrop-blur-md rounded-full text-white text-[11px] font-black uppercase tracking-widest flex items-center gap-1.5"><GraduationCap size={12} />Academic</div>
                    </div>
                    <div className="p-8 flex flex-col flex-1">
                      <h3 className="text-[22px] font-black text-navy-950 leading-[1.4] tracking-tighter group-hover:text-primary transition-colors line-clamp-2 mb-6">{item.title}</h3>
                      <div className="mt-auto flex items-center justify-between text-[14px] font-bold text-slate-400">
                        <span>{new Date(item.created_at).toLocaleDateString('ko-KR')}</span>
                        <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="py-32 text-center text-slate-300 font-bold">등록된 학술 소식이 없습니다.</div>
            )}

            <div className="flex justify-center pt-10 border-t border-slate-100">
              <Link href="/news/academic/write" className="inline-flex items-center gap-3 px-12 py-5 bg-navy-950 text-white rounded-[1.25rem] hover:bg-primary font-black shadow-lg shadow-navy-950/20 transition-all text-[18px]">
                <PenSquare size={20} strokeWidth={2.5} /> 학술소식 등록하기
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
