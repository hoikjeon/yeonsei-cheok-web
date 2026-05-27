import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ChevronRight, Search, PenSquare } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';

// 서버 사이드에서 데이터 페칭을 위해 클라이언트 생성
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

export default async function ReviewsPage() {
  // 1. Supabase에서 데이터 가져오기 (최신순)
  const { data: reviews, error } = await supabase
    .from('reviews')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching reviews:', error);
  }

  const reviewsCount = reviews?.length || 0;

  return (
    <main className="min-h-screen bg-slate-50 pt-[96px]">
      {/* 🔹 Top Hero / Breadcrumb Section */}
      <section className="bg-slate-50 border-b border-slate-200">
        <div className="max-w-[1440px] mx-auto px-10 py-16">
          {/* Breadcrumb */}
          <div className="flex items-center gap-2 text-[14px] text-slate-500 font-bold tracking-tight mb-10">
            <Link href="/" className="hover:text-primary transition-colors">
              <Home size={16} strokeWidth={2.5} />
            </Link>
            <ChevronRight size={14} strokeWidth={2.5} />
            <span className="hover:text-primary transition-colors cursor-pointer">커뮤니티</span>
            <ChevronRight size={14} strokeWidth={2.5} />
            <span className="text-navy-950">치료체험후기</span>
          </div>

          <h1 className="text-[48px] md:text-[56px] font-black text-navy-950 tracking-tighter">
            치료체험후기
          </h1>
        </div>
      </section>

      {/* 🔹 Main Content Area */}
      <section className="bg-white">
        <div className="max-w-[1440px] mx-auto px-10 py-24 border-x border-slate-50 min-h-[800px] shadow-sm">
          {/* Main Title & Login Notice */}
          <div className="mb-24">
            <h2 className="text-[40px] font-black leading-[1.3] text-navy-950 tracking-tighter whitespace-pre-line mb-6">
              {'환자분들이 써주신\n회복의 기록'}
            </h2>
            <p className="text-slate-600 text-[18px] font-bold tracking-tight">
              고객님이 직접 참여하시고 작성하신 100% 리얼 후기입니다.
            </p>
            
            <div className="mt-12 flex items-center gap-5">
              <span className="text-[15px] font-bold text-slate-500 flex items-center gap-1.5 tracking-tight">
                <strong className="text-navy-950 text-[16px]">※</strong> 의료법 규정에 따라 자세한 내용은 로그인 후 확인할 수 있습니다.
              </span>
              <Link 
                href="/login"
                className="inline-flex flex-shrink-0 items-center justify-center px-7 py-2 bg-primary/10 text-primary hover:bg-primary hover:text-white font-black rounded-full transition-colors text-[14px]"
              >
                로그인하기
              </Link>
            </div>
          </div>

          {/* List Area */}
          <div className="space-y-6">
            <div className="flex justify-between items-end border-b-2 border-slate-200 pb-4">
              <div className="text-[16px] font-bold text-slate-500 tracking-tight">
                총 <strong className="text-navy-950 font-black text-[18px]">{reviewsCount}</strong>건
              </div>
              <div className="relative group w-full max-w-[340px]">
                <input
                  type="text"
                  placeholder="검색어를 입력해주세요."
                  className="w-full pl-4 pr-12 py-3 border-b-2 border-slate-200 bg-transparent text-[15px] outline-none focus:border-primary transition-colors placeholder:text-slate-400 font-medium"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-slate-400 group-focus-within:text-primary transition-colors hover:text-primary">
                  <Search size={22} strokeWidth={2.5} />
                </button>
              </div>
            </div>

            {/* List */}
            <div className="divide-y divide-slate-100/80 min-h-[200px] flex flex-col items-stretch">
              {reviewsCount > 0 ? (
                reviews?.map((review: Review) => (
                  <Link
                    href={`/board/reviews/${review.id}`}
                    key={review.id}
                    className="group py-8 flex flex-col md:flex-row md:items-center gap-10 hover:bg-slate-50/50 transition-colors px-6 -mx-6 rounded-[2rem] border border-transparent hover:border-slate-100"
                  >
                    {/* Thumbnail */}
                    <div className="w-full md:w-48 aspect-[4/3] rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
                      {review.image_urls && review.image_urls.length > 0 ? (
                        <img 
                          src={review.image_urls[0]} 
                          alt={review.title} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 shadow-inner"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <PenSquare size={40} strokeWidth={1.5} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1 space-y-3">
                      <div className="flex items-center gap-3">
                        <span className="text-[13px] font-black text-primary tracking-tight px-3 py-1 bg-primary/5 rounded-full inline-block border border-primary/10">
                          {review.category}
                        </span>
                        <span className="text-[14px] font-bold text-slate-400">#{review.id.slice(0, 8)}</span>
                      </div>
                      <h3 className="text-[22px] font-bold text-navy-950 group-hover:text-primary transition-colors tracking-tight line-clamp-2 block">
                        {review.title}
                      </h3>
                      <p className="text-slate-400 text-[15px] font-medium tracking-tight">
                        의료법 규정에 따라 상세 내용은 로그인 후 보실 수 있습니다.
                      </p>
                    </div>
                    <div className="text-[15px] font-bold text-slate-400 shrink-0 md:w-32 md:text-right tracking-tight">
                      {new Date(review.created_at).toLocaleDateString('ko-KR')}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-20 text-center space-y-2 flex flex-col justify-center items-center h-full">
                  <p className="text-[18px] font-bold text-slate-400 tracking-tight">등록된 치료체험후기가 없습니다.</p>
                  <p className="text-[15px] font-medium text-slate-300">직접 첫 번째 후기를 작성해 보세요.</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end pt-12 border-t border-slate-100">
              <Link 
                href="/board/reviews/write"
                className="inline-flex items-center gap-3 px-8 py-5 bg-navy-950 text-white rounded-[1.25rem] hover:bg-primary font-black shadow-lg hover:shadow-blue-glow transition-all active:scale-95 text-[17px] tracking-tight"
              >
                <PenSquare size={20} strokeWidth={2.5} />
                리뷰 작성하기
              </Link>
            </div>
          </div>

        </div>
      </section>
    </main>
  );
}
