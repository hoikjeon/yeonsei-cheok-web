import Link from 'next/link';
import { Search, PenSquare } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import SubHero from '@/components/SubHero';

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
    <main className="min-h-screen bg-slate-50">
      <SubHero
        title="치료체험후기"
        subtitle={'환자분들이 써주신 회복의 기록\n고객님이 직접 참여하시고 작성하신 100% 리얼 후기입니다.'}
        path={[{ name: '커뮤니티' }, { name: '치료체험후기' }]}
        bgImage="/hero-bg.png"
      />

      {/* 🔹 Main Content Area */}
      <section className="bg-white">
        <div className="mx-auto min-h-0 max-w-7xl border-x border-slate-50 px-4 py-14 shadow-sm sm:px-6 sm:py-16 md:min-h-[800px] lg:px-10 lg:py-24">
          <div className="mb-10 sm:mb-16">
            <div className="flex flex-col items-start gap-3 sm:flex-row sm:items-center sm:gap-5">
              <span className="flex break-keep text-[14px] font-bold leading-[1.7] tracking-tight text-ink-muted sm:items-center sm:gap-1.5 sm:text-[15px]">
                <strong className="text-ink text-[16px] font-bold">※</strong> 의료법 규정에 따라 자세한 내용은 로그인 후 확인할 수 있습니다.
              </span>
              <Link 
                href="/login"
                className="inline-flex flex-shrink-0 items-center justify-center rounded-full bg-primary/10 px-5 py-2 text-[14px] font-bold text-primary transition-colors hover:bg-primary hover:text-white sm:px-7"
              >
                로그인하기
              </Link>
            </div>
          </div>

          {/* List Area */}
          <div className="space-y-5 sm:space-y-6">
            <div className="flex flex-col items-stretch gap-4 border-b-2 border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="text-[16px] font-bold text-ink-muted tracking-tight">
                총 <strong className="text-ink font-bold text-[18px]">{reviewsCount}</strong>건
              </div>
              <div className="group relative w-full sm:max-w-[340px]">
                <input
                  type="text"
                  placeholder="검색어를 입력해주세요."
                  className="w-full pl-4 pr-12 py-3 border-b-2 border-slate-200 bg-transparent text-[15px] outline-none focus:border-primary transition-colors placeholder:text-ink-muted font-medium"
                />
                <button className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-ink-muted group-focus-within:text-primary transition-colors hover:text-primary">
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
                    className="group flex flex-col gap-5 rounded-xl border border-transparent py-5 transition-colors hover:border-slate-100 hover:bg-slate-50/50 sm:-mx-6 sm:gap-8 sm:px-6 sm:py-7 md:flex-row md:items-center md:gap-10 md:rounded-[2rem] md:py-8"
                  >
                    {/* Thumbnail */}
                    <div className="aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 sm:aspect-[4/3] sm:rounded-2xl md:w-48">
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
                        <span className="text-[13px] font-bold text-primary tracking-tight px-3 py-1 bg-primary/5 rounded-full inline-block border border-primary/10">
                          {review.category}
                        </span>
                        <span className="text-[14px] font-bold text-ink-muted">#{review.id.slice(0, 8)}</span>
                      </div>
                      <h3 className="block line-clamp-2 break-keep text-h4 tracking-tight text-ink transition-colors group-hover:text-primary">
                        {review.title}
                      </h3>
                      <p className="break-keep text-[14px] font-medium leading-[1.7] tracking-tight text-ink-muted sm:text-[15px]">
                        의료법 규정에 따라 상세 내용은 로그인 후 보실 수 있습니다.
                      </p>
                    </div>
                    <div className="text-[15px] font-bold text-ink-muted shrink-0 md:w-32 md:text-right tracking-tight">
                      {new Date(review.created_at).toLocaleDateString('ko-KR')}
                    </div>
                  </Link>
                ))
              ) : (
                <div className="py-20 text-center space-y-2 flex flex-col justify-center items-center h-full">
                  <p className="text-[18px] font-bold text-ink-muted tracking-tight">등록된 치료체험후기가 없습니다.</p>
                  <p className="text-[15px] font-medium text-slate-300">직접 첫 번째 후기를 작성해 보세요.</p>
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex justify-end border-t border-slate-100 pt-8 sm:pt-12">
              <Link 
                href="/board/reviews/write"
                className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-navy-950 px-5 py-4 text-[16px] font-bold tracking-tight text-white shadow-lg transition-all hover:bg-primary hover:shadow-blue-glow active:scale-95 sm:w-auto sm:rounded-[1.25rem] sm:px-8 sm:py-5 sm:text-[17px]"
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
