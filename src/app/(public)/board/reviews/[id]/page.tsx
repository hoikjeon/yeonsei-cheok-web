import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Home, ChevronRight, ArrowLeft, Calendar, User, Tag } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// 서버 사이드 Supabase 클라이언트 설정
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface Review {
  id: string;
  category: string;
  title: string;
  content: string;
  image_urls: string[];
  created_at: string;
}

export default async function ReviewDetailPage({ params }: { params: { id: string } }) {
  const { id } = await params;

  // 1. 단일 후기 데이터 가져오기
  const { data: review, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !review) {
    console.error('Error fetching review:', error);
    return notFound();
  }

  return (
    <main className="min-h-screen bg-white pt-0 md:pt-[96px]">
      {/* 🔹 Breadcrumb Section */}
      <section className="bg-slate-50 border-b border-slate-100">
        <div className="mx-auto flex max-w-[1200px] items-center gap-1.5 overflow-hidden px-4 py-4 text-[12px] font-bold tracking-tight text-ink-muted sm:gap-2 sm:px-6 sm:py-6 sm:text-[13px]">
          <Link href="/" className="hover:text-primary transition-colors">
            <Home size={14} strokeWidth={2.5} />
          </Link>
          <ChevronRight size={12} strokeWidth={3} />
          <Link href="/board/reviews" className="hover:text-primary transition-colors">커뮤니티</Link>
          <ChevronRight size={12} strokeWidth={3} />
          <Link href="/board/reviews" className="hover:text-primary transition-colors hover:bg-slate-200">치료체험후기</Link>
          <ChevronRight size={12} strokeWidth={3} />
          <span className="min-w-0 flex-1 truncate text-ink">{review.title}</span>
        </div>
      </section>

      <div className="mx-auto max-w-[1000px] px-4 py-10 sm:px-6 sm:py-14 md:py-24">
        {/* 🔹 Detail Header */}
        <div className="mb-8 border-b border-slate-100 pb-8 sm:mb-12 sm:pb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/10 rounded-full text-primary text-[13px] font-bold tracking-tight mb-6">
            <Tag size={12} />
            {review.category}
          </div>
          <h1 className="mb-6 break-keep text-h2 tracking-tight text-ink sm:mb-8">
            {review.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] font-bold tracking-tight text-ink-muted sm:gap-6 sm:text-[15px]">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-slate-300" />
              {new Date(review.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
            <div className="flex items-center gap-2">
              <User size={18} className="text-slate-300" />
              익명 환자분
            </div>
            <div className="text-slate-200">|</div>
            <div className="text-ink-muted">조회수 124</div>
          </div>
        </div>

        {/* 🔹 Image Content (Top Gallery) */}
        {review.image_urls && review.image_urls.length > 0 && (
          <div className="mb-12 flex flex-col items-center gap-6 sm:mb-20 sm:gap-10">
            {review.image_urls.map((url: string, index: number) => (
              <div 
                key={index} 
                className="w-full max-w-[720px] rounded-[1.5rem] overflow-hidden border border-slate-100 shadow-xl bg-slate-50 group hover:shadow-2xl transition-shadow duration-500"
              >
                <img 
                  src={url} 
                  alt={`${review.title} 첨부 이미지 ${index + 1}`} 
                  className="w-full h-auto object-cover group-hover:scale-[1.02] transition-transform duration-700"
                />
                <div className="px-6 py-4 bg-white/80 backdrop-blur-md border-t border-slate-50 flex justify-between items-center">
                  <span className="text-[13px] font-bold text-ink-muted italic">Photo {index + 1}</span>
                  <span className="text-[12px] font-bold text-primary/40 tracking-widest font-montserrat uppercase">Yonsei Cheok</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 🔹 Text Content */}
        <div className="prose prose-slate mb-14 max-w-none sm:mb-20 md:mb-24">
          <p className="whitespace-pre-wrap break-keep text-[16px] font-medium leading-[1.8] tracking-tight text-ink-sub sm:text-[18px] sm:leading-[1.9] md:text-[20px]">
            {review.content}
          </p>
        </div>

        {/* 🔹 Medical Law Notice (Floating style) */}
        <div className="mb-14 rounded-2xl border border-slate-100 bg-slate-50 p-5 text-center sm:mb-20 sm:rounded-[1.5rem] sm:p-8">
          <p className="break-keep text-[14px] font-bold leading-[1.7] tracking-tight text-ink-muted sm:text-[15px]">
            <strong className="text-ink font-bold">※ 안내사항</strong><br className="md:hidden"/>
            본 후기는 의료법 제56조 및 동법 시행령을 준수하여 환자가 직접 작성한 실제 사례입니다.
          </p>
        </div>

        {/* 🔹 Bottom Actions */}
        <div className="flex flex-col items-stretch justify-center gap-3 sm:flex-row sm:items-center sm:gap-4">
          <Link 
            href="/board/reviews"
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-slate-100 px-5 py-4 text-[16px] font-bold text-ink-sub transition-all hover:bg-slate-200 active:scale-95 sm:w-auto sm:rounded-[1.25rem] sm:px-10 sm:py-5 sm:text-[17px]"
          >
            <ArrowLeft size={20} strokeWidth={2.5} />
            목록으로 돌아가기
          </Link>
          {/* 이전글/다음글 같은 기능은 추후 추가 가능 */}
        </div>
      </div>
    </main>
  );
}
