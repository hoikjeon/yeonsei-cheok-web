import Link from 'next/link';
import Form from 'next/form';
import { Search } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';
import SubHero from '@/components/SubHero';
import Pagination from '@/components/Pagination';
import { HOSPITAL_NEWS_CACHE_TAG } from '@/lib/hospitalNews';
import { createPageMetadata } from '@/lib/seo';

export const metadata = createPageMetadata({
  title: '공지사항',
  description: '연세척병원의 진료 일정, 휴진, 병원 이용과 관련된 주요 공지사항을 안내합니다.',
  path: '/news/notice',
});

// 서버 사이드 Supabase 클라이언트
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

const PAGE_SIZE = 10;

interface NoticeRow {
  id: string;
  type: string;
  title: string;
  created_at: string;
}

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}. ${mm}. ${dd}`;
}

// 이 페이지는 검색어·페이지 번호를 받기 때문에 정적으로 만들 수 없습니다.
// 대신 조회 결과 자체를 캐시에 담아, 같은 검색·같은 페이지 요청은 DB를 다시 타지 않게 합니다.
// 관리자에서 글을 올리면 최대 60초 안에 반영됩니다.
const getNotices = unstable_cache(
  async (keyword: string, page: number) => {
    // 공지(상단고정: notice_pinned)가 먼저, 이후 최신순
    let query = supabase
      .from('hospital_news')
      .select('id, type, title, created_at', { count: 'exact' })
      .in('type', ['notice', 'notice_pinned']);

    if (keyword) {
      query = query.ilike('title', `%${keyword}%`);
    }

    const { data, count, error } = await query
      .order('type', { ascending: false })
      .order('created_at', { ascending: false })
      .range((page - 1) * PAGE_SIZE, page * PAGE_SIZE - 1);

    if (error) {
      console.error('Error fetching notices:', error);
    }

    return { notices: data, count };
  },
  ['news-notice-list'],
  { tags: ['news-notice', HOSPITAL_NEWS_CACHE_TAG], revalidate: 60 },
);

export default async function NoticePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = '', page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam || '1', 10) || 1);

  const { notices, count } = await getNotices(q, currentPage);

  const totalCount = count || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));

  return (
    <main className="min-h-screen bg-slate-50">
      <SubHero
        title="공지사항"
        subtitle={'진료와 관련된 중요한 소식, 사전에 꼼꼼히 안내해 드립니다.\n내원 전 확인하시면 더욱 편안한 진료가 가능합니다.'}
        path={[{ name: '병원소식' }, { name: '공지사항' }]}
        bgImage="/hero-bg.png"
      />

      <section className="bg-white">
        <div className="mx-auto min-h-0 max-w-7xl border-x border-slate-50 px-4 py-14 shadow-sm sm:px-6 sm:py-16 md:min-h-[800px] lg:px-10 lg:py-24">
          {/* Intro Copy */}
          <div className="mb-10 space-y-5 sm:mb-16">
            <h2 className="break-keep text-h2 tracking-tight text-navy-900">
              중요한 정보,
              <br />
              놓치지 않고 차질 없도록
            </h2>
            <p className="max-w-3xl break-keep text-[15px] font-medium leading-[1.75] text-ink-sub sm:text-[16px]">
              진료와 관련된 중요한 소식을 사전에 꼼꼼히 안내해 드립니다. 내원 전 확인하시면 더욱 편안한 진료가 가능합니다.
            </p>
          </div>

          <div className="space-y-5 sm:space-y-6">
            {/* Search & Tool Bar */}
            <div className="flex flex-col items-stretch gap-4 border-b-2 border-slate-200 pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div className="text-[16px] font-bold text-ink-muted tracking-tight">
                총 <strong className="text-ink font-bold text-[18px]">{totalCount}</strong>건
              </div>
              <Form action="/news/notice" className="group relative w-full sm:max-w-[340px]">
                <input
                  type="text"
                  name="q"
                  defaultValue={q}
                  placeholder="검색어를 입력해주세요."
                  className="w-full pl-4 pr-12 py-3 border-b-2 border-slate-200 bg-transparent text-[15px] outline-none focus:border-primary transition-colors placeholder:text-ink-muted font-medium"
                />
                <button
                  type="submit"
                  aria-label="검색"
                  className="absolute right-2 top-1/2 -translate-y-1/2 p-2 text-ink-muted group-focus-within:text-primary transition-colors hover:text-primary"
                >
                  <Search size={22} strokeWidth={2.5} />
                </button>
              </Form>
            </div>

            {/* Notice List */}
            <div className="divide-y divide-slate-100 min-h-[200px]">
              {notices && notices.length > 0 ? (
                notices.map((item: NoticeRow) => {
                  const isPinned = item.type === 'notice_pinned';
                  return (
                    <Link
                      href={`/news/notice/${item.id}`}
                      key={item.id}
                      className="group flex items-center gap-4 py-6 transition-colors hover:bg-slate-50/70 sm:-mx-4 sm:gap-6 sm:px-4 sm:py-7 md:rounded-2xl"
                    >
                      {isPinned && (
                        <span className="inline-flex shrink-0 items-center justify-center rounded-full bg-navy-950 px-4 py-1.5 text-[13px] font-bold tracking-tight text-white">
                          공지
                        </span>
                      )}
                      <h3 className="min-w-0 flex-1 truncate text-[16px] font-bold tracking-tight text-ink transition-colors group-hover:text-primary sm:text-[17px]">
                        {item.title}
                      </h3>
                      <span className="shrink-0 text-[14px] font-bold tracking-tight text-ink-muted sm:text-[15px]">
                        {formatDate(item.created_at)}
                      </span>
                    </Link>
                  );
                })
              ) : (
                <div className="flex h-full flex-col items-center justify-center space-y-2 py-20 text-center">
                  <p className="text-[18px] font-bold text-ink-muted tracking-tight">
                    {q ? `'${q}'에 대한 검색 결과가 없습니다.` : '등록된 공지사항이 없습니다.'}
                  </p>
                  <p className="text-[15px] font-medium text-slate-300">병원의 새로운 소식을 빠르게 전해드리겠습니다.</p>
                </div>
              )}
            </div>

            <Pagination currentPage={currentPage} totalPages={totalPages} basePath="/news/notice" query={{ q }} />

          </div>
        </div>
      </section>
    </main>
  );
}
