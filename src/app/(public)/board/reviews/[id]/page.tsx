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
    <main className="min-h-screen bg-white pt-[96px]">
      {/* 🔹 Breadcrumb Section */}
      <section className="bg-slate-50 border-b border-slate-100">
        <div className="max-w-[1200px] mx-auto px-6 py-6 flex items-center gap-2 text-[13px] text-ink-muted font-bold tracking-tight">
          <Link href="/" className="hover:text-primary transition-colors">
            <Home size={14} strokeWidth={2.5} />
          </Link>
          <ChevronRight size={12} strokeWidth={3} />
          <Link href="/board/reviews" className="hover:text-primary transition-colors">커뮤니티</Link>
          <ChevronRight size={12} strokeWidth={3} />
          <Link href="/board/reviews" className="hover:text-primary transition-colors hover:bg-slate-200">치료체험후기</Link>
          <ChevronRight size={12} strokeWidth={3} />
          <span className="text-ink truncate max-w-[200px]">{review.title}</span>
        </div>
      </section>

      <div className="max-w-[1000px] mx-auto px-6 py-16 md:py-24">
        {/* 🔹 Detail Header */}
        <div className="mb-12 border-b border-slate-100 pb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-primary/5 border border-primary/10 rounded-full text-primary text-[13px] font-black tracking-tight mb-6">
            <Tag size={12} />
            {review.category}
          </div>
          <h1 className="text-[32px] md:text-[44px] font-black text-ink tracking-tighter leading-[1.2] mb-8">
            {review.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-6 text-[15px] font-bold text-ink-muted tracking-tight">
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
          <div className="mb-20 flex flex-col items-center gap-10">
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
                  <span className="text-[12px] font-black text-primary/40 tracking-widest font-montserrat uppercase">Yonsei Cheok</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* 🔹 Text Content */}
        <div className="prose prose-slate max-w-none mb-24">
          <p className="text-[18px] md:text-[20px] font-medium text-ink-sub leading-[1.9] tracking-tight whitespace-pre-wrap">
            {review.content}
          </p>
        </div>

        {/* 🔹 Medical Law Notice (Floating style) */}
        <div className="bg-slate-50 border border-slate-100 rounded-[1.5rem] p-8 mb-20 text-center">
          <p className="text-[15px] font-bold text-ink-muted tracking-tight">
            <strong className="text-ink font-black">※ 안내사항</strong><br className="md:hidden"/>
            본 후기는 의료법 제56조 및 동법 시행령을 준수하여 환자가 직접 작성한 실제 사례입니다.
          </p>
        </div>

        {/* 🔹 Bottom Actions */}
        <div className="flex justify-center items-center gap-4">
          <Link 
            href="/board/reviews"
            className="flex items-center gap-2 px-10 py-5 bg-slate-100 hover:bg-slate-200 text-ink-sub font-black rounded-[1.25rem] transition-all active:scale-95 text-[17px]"
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
