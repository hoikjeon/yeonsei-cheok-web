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
    <main className="min-h-screen bg-white pt-0 md:pt-[96px]">
      <section className="bg-slate-50 border-b border-slate-100">
        <div className="mx-auto flex max-w-[1200px] items-center gap-1.5 overflow-hidden px-4 py-4 text-[12px] font-bold tracking-tight text-ink-muted sm:gap-2 sm:px-6 sm:py-6 sm:text-[13px]">
          <Link href="/" className="hover:text-primary transition-colors"><Home size={14} /></Link>
          <ChevronRight size={12} strokeWidth={3} />
          <Link href="/news/academic" className="hover:text-primary transition-colors">병원소식</Link>
          <ChevronRight size={12} strokeWidth={3} />
          <Link href="/news/academic" className="hover:text-primary transition-colors">학술소식</Link>
          <ChevronRight size={12} strokeWidth={3} />
          <span className="min-w-0 flex-1 truncate text-ink">{item.title}</span>
        </div>
      </section>

      <div className="mx-auto max-w-[1000px] px-4 py-10 sm:px-6 sm:py-14 md:py-24">
        <div className="mb-8 border-b border-slate-100 pb-8 sm:mb-12 sm:pb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/10 rounded-full text-primary text-[13px] font-bold tracking-tight mb-6 font-montserrat uppercase">
            <GraduationCap size={12} /> Academic Detail
          </div>
          <h1 className="mb-6 break-keep text-h2 tracking-tight text-ink sm:mb-8">{item.title}</h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] font-bold tracking-tight text-ink-muted sm:gap-6 sm:text-[15px]">
            <div className="flex items-center gap-2"><Calendar size={18} className="text-slate-300" />{new Date(item.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}</div>
            <div className="flex items-center gap-2"><Microscope size={18} className="text-slate-300" />연구 활동 기록</div>
          </div>
        </div>

        {item.image_urls && item.image_urls.length > 0 && (
          <div className="mb-12 flex flex-col items-center gap-6 sm:mb-20 sm:gap-10">
            {item.image_urls.map((url: string, index: number) => (
              <div key={index} className="w-full max-w-[720px] rounded-[1.5rem] overflow-hidden border border-slate-100 shadow-xl bg-slate-50 group hover:shadow-2xl transition-shadow duration-500">
                <img src={url} alt={`${item.title} 학술 자료 이미지 ${index + 1}`} className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-700" />
              </div>
            ))}
          </div>
        )}

        <div className="prose prose-slate mb-14 max-w-none sm:mb-20 md:mb-24">
          <p className="whitespace-pre-wrap break-keep text-[16px] font-medium leading-[1.8] tracking-tight text-ink-sub sm:text-[18px] sm:leading-[1.9] md:text-[20px]">{item.content}</p>
        </div>

        <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Link href="/news/academic" className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-5 py-4 text-[16px] font-bold text-ink-sub transition-all hover:bg-slate-200 active:scale-95 sm:w-auto sm:rounded-[1.25rem] sm:px-10 sm:py-5 sm:text-[17px]">
            <ArrowLeft size={20} strokeWidth={2.5} /> 목록으로 돌아가기
          </Link>
        </div>
      </div>
    </main>
  );
}
