import React, { cache } from 'react';
import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import Image from 'next/image';
import { Home, ChevronRight, ArrowLeft, Calendar } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { createPageMetadata, summarizeForMetadata } from '@/lib/seo';

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

type DetailPageProps = { params: Promise<{ id: string }> };

const getReview = cache(async (id: string) => {
  const { data: review, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('id', id)
    .single();

  return { review: review as Review | null, error };
});

export async function generateMetadata({ params }: DetailPageProps): Promise<Metadata> {
  const { id } = await params;
  const { review } = await getReview(id);

  if (!review) {
    return createPageMetadata({
      title: '치료체험후기를 찾을 수 없습니다',
      description: '요청하신 치료체험후기를 찾을 수 없습니다.',
      path: `/board/reviews/${id}`,
      noIndex: true,
    });
  }

  return createPageMetadata({
    title: review.title,
    description: summarizeForMetadata(
      review.content,
      '연세척병원 이용자가 직접 작성한 치료체험후기입니다.',
    ),
    path: `/board/reviews/${id}`,
    image: review.image_urls?.[0],
    noIndex: true,
  });
}

export default async function ReviewDetailPage({ params }: DetailPageProps) {
  const { id } = await params;

  // 1. 단일 후기 데이터 가져오기
  const { review, error } = await getReview(id);

  if (error || !review) {
    console.error('Error fetching review:', error);
    return notFound();
  }

  return (
    <main className="min-h-screen bg-white pt-0 md:pt-[96px]">
      {/* 🔹 Breadcrumb Section */}
      <section className="bg-slate-50 border-b border-slate-100">
        <div className="mx-auto flex max-w-7xl items-center gap-1.5 overflow-hidden px-4 py-4 text-[12px] font-bold tracking-tight text-ink-muted sm:gap-2 sm:px-7 sm:py-6 sm:text-[13px] xl:px-10">
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
          <h1 className="mb-6 break-keep text-h2 tracking-tight text-ink sm:mb-8">
            {review.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-[14px] font-bold tracking-tight text-ink-muted sm:gap-6 sm:text-[15px]">
            <div className="flex items-center gap-2">
              <Calendar size={18} className="text-slate-300" />
              {new Date(review.created_at).toLocaleDateString('ko-KR', { year: 'numeric', month: 'long', day: 'numeric' })}
            </div>
          </div>
        </div>

        {/* 🔹 Image Content (Top Gallery) */}
        {review.image_urls && review.image_urls.length > 0 && (
          <div className="mb-12 flex flex-col items-center gap-6 sm:mb-20 sm:gap-10">
            {review.image_urls.map((url: string, index: number) => (
              <Image
                key={index}
                src={url}
                alt={`${review.title} 첨부 이미지 ${index + 1}`}
                width={1200}
                height={900}
                sizes="(min-width: 768px) 720px, 100vw"
                priority={index === 0}
                className="h-auto w-full max-w-[720px]"
              />
            ))}
          </div>
        )}

        {/* 🔹 Text Content */}
        <div className="prose prose-slate mb-14 max-w-none sm:mb-20 md:mb-24">
          <p className="whitespace-pre-wrap break-keep text-[16px] font-medium leading-[1.8] tracking-tight text-ink-sub sm:text-[18px] sm:leading-[1.9] md:text-[20px]">
            {review.content}
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
