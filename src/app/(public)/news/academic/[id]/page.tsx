import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Home, ChevronRight, ArrowLeft, Calendar, GraduationCap, Microscope } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

export default async function AcademicDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  const { data: item, error } = await supabase
    .from('hospital_news')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !item) return notFound();

  return (
    <main className="min-h-screen bg-white pt-[96px]">
      <section className="bg-slate-50 border-b border-slate-100">
        <div className="max-w-[1200px] mx-auto px-6 py-6 flex items-center gap-2 text-[13px] text-ink-muted font-bold tracking-tight">
          <Link href="/" className="hover:text-primary transition-colors"><Home size={14} /></Link>
          <ChevronRight size={12} strokeWidth={3} />
          <Link href="/news/academic" className="hover:text-primary transition-colors">병원소식</Link>
          <ChevronRight size={12} strokeWidth={3} />
          <Link href="/news/academic" className="hover:text-primary transition-colors">학술소식</Link>
          <ChevronRight size={12} strokeWidth={3} />
          <span className="text-ink truncate max-w-[200px]">{item.title}</span>
        </div>
      </section>

      <div className="max-w-[1000px] mx-auto px-6 py-16 md:py-24">
        <div className="mb-12 border-b border-slate-100 pb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/10 rounded-full text-primary text-[13px] font-black tracking-tight mb-6 font-montserrat uppercase">
            <GraduationCap size={12} /> Academic Detail
          </div>
          <h1 className="text-[32px] md:text-[44px] font-black text-ink tracking-tighter leading-[1.2] mb-8">{item.title}</h1>
          <div className="flex flex-wrap items-center gap-6 text-[15px] font-bold text-ink-muted tracking-tight">
            <div className="flex items-center gap-2"><Calendar size={18} className="text-slate-300" />{new Date(item.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div className="flex items-center gap-2"><Microscope size={18} className="text-slate-300" />연구 활동 기록</div>
          </div>
        </div>

        {item.image_urls && item.image_urls.length > 0 && (
          <div className="mb-20 flex flex-col items-center gap-10">
            {item.image_urls.map((url: string, index: number) => (
              <div key={index} className="w-full max-w-[720px] rounded-[1.5rem] overflow-hidden border border-slate-100 shadow-xl bg-slate-50 group hover:shadow-2xl transition-shadow duration-500">
                <img src={url} alt={`${item.title} 학술 자료 이미지 ${index + 1}`} className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-700" />
              </div>
            ))}
          </div>
        )}

        <div className="prose prose-slate max-w-none mb-24">
          <p className="text-[18px] md:text-[20px] font-medium text-ink-sub leading-[1.9] tracking-tight whitespace-pre-wrap">{item.content}</p>
        </div>

        <div className="flex justify-center items-center gap-4">
          <Link href="/news/academic" className="flex items-center gap-2 px-10 py-5 bg-slate-100 hover:bg-slate-200 text-ink-sub font-black rounded-[1.25rem] transition-all active:scale-95 text-[17px]">
            <ArrowLeft size={20} strokeWidth={2.5} /> 목록으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}
