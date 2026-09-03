import Link from 'next/link';
import Image from 'next/image';
import { Search, PenSquare } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import SubHero from '@/components/SubHero';
import Pagination from '@/components/Pagination';
import { createPageMetadata } from '@/lib/seo';
// 목록은 공개이므로 로그인 여부에 따라 안내 노출을 달리합니다.
import { createClient as createSessionClient } from '@/utils/supabase/server';

export const metadata = createPageMetadata({
  title: '치료체험후기',
  description: '회원 전용으로 제공되는 연세척병원 치료체험후기 페이지입니다.',
  path: '/board/reviews',
  noIndex: true,
});

// 서버 사이드에서 데이터 페칭을 위해 클라이언트 생성
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

// 한 줄짜리 목록형이라 공지사항과 동일하게 10건.
const PAGE_SIZE = 10;

// 관리자에서 글을 올리면 최대 60초 안에 목록에 반영됩니다.
// 이 값이 없으면 빌드 시점 데이터로 굳어 재배포 전까지 새 글이 보이지 않습니다.
export const revalidate = 60;

interface Review {
  id: string;
  category: string;
  title: string;
  content: string;
  image_urls: string[];
  created_at: string;
}

export default async function ReviewsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string }>;
}) {
  const { page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam || '1', 10) || 1);

  // 1. Supabase에서 데이터 가져오기 (최신순)
  const { data: reviews, count, error } = await supabase
    .from('reviews')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE - 1);

  if (error) {
    console.error('Error fetching reviews:', error);
  }

  const reviewsCount = count || 0;
  const totalPages = Math.max(1, Math.ceil(reviewsCount / PAGE_SIZE));

  const sessionClient = await createSessionClient();
  const {
    data: { user },
  } = await sessionClient.auth.getUser();

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
          {!user && (
            <div className="mb-9 sm:mb-12">
              <div className="flex flex-col items-start gap-3 rounded-lg border border-slate-100 bg-slate-50/70 px-5 py-4 sm:flex-row sm:items-center sm:justify-between sm:gap-5 sm:px-6 sm:py-5">
                <span className="break-keep text-[14px] font-bold leading-[1.7] tracking-tight text-ink-muted sm:text-[15px]">
                  <strong className="text-[16px] font-bold text-ink">※</strong> 후기 상세 내용은 로그인 후 확인하실 수 있습니다.
                </span>
                <Link
                  href="/login?next=/board/reviews"
                  className="inline-flex flex-shrink-0 items-center justify-center rounded-full bg-primary/10 px-5 py-2 text-[14px] font-bold text-primary transition-colors hover:bg-primary hover:text-white sm:px-7"
                >
                  로그인하기
                </Link>
              </div>
            </div>
          )}

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
                    <div className="relative aspect-[16/10] w-full shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-100 sm:aspect-[4/3] sm:rounded-2xl md:w-48">
                      {review.image_urls && review.image_urls.length > 0 ? (
                        <Image
                          src={review.image_urls[0]}
                          alt={review.title}
                          fill
                          sizes="(min-width: 768px) 192px, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-slate-300">
                          <PenSquare size={40} strokeWidth={1.5} />
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <h3 className="block line-clamp-2 break-keep text-h4 tracking-tight text-ink transition-colors group-hover:text-primary">
                        {review.title}
                      </h3>
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

            <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/board/reviews" />

          </div>

        </div>
      </section>
    </main>
  );
}
