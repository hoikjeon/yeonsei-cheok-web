import Link from 'next/link';
import Form from 'next/form';
import { Search, PenSquare, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import SubHero from '@/components/SubHero';

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

function pageHref(page: number, q: string) {
  const params = new URLSearchParams();
  if (page > 1) params.set('page', String(page));
  if (q) params.set('q', q);
  const qs = params.toString();
  return qs ? `/news/notice?${qs}` : '/news/notice';
}

export default async function NoticePage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q = '', page: pageParam } = await searchParams;
  const currentPage = Math.max(1, parseInt(pageParam || '1', 10) || 1);

  // 공지(상단고정: notice_pinned)가 먼저, 이후 최신순
  let query = supabase
    .from('hospital_news')
    .select('id, type, title, created_at', { count: 'exact' })
    .in('type', ['notice', 'notice_pinned']);

  if (q) {
    query = query.ilike('title', `%${q}%`);
  }

  const { data: notices, count, error } = await query
    .order('type', { ascending: false })
    .order('created_at', { ascending: false })
    .range((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE - 1);

  if (error) {
    console.error('Error fetching notices:', error);
  }

  const totalCount = count || 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);

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

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-1 pt-8 sm:gap-2 sm:pt-10">
                <Link href={pageHref(1, q)} aria-label="첫 페이지" className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-50 hover:text-primary">
                  <ChevronsLeft size={18} />
                </Link>
                <Link href={pageHref(Math.max(1, currentPage - 1), q)} aria-label="이전 페이지" className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-50 hover:text-primary">
                  <ChevronLeft size={18} />
                </Link>
                {pageNumbers.map((num) => (
                  <Link
                    key={num}
                    href={pageHref(num, q)}
                    className={`flex h-9 w-9 items-center justify-center rounded-lg text-[15px] font-bold transition-colors ${
                      num === currentPage
                        ? 'bg-navy-950 text-white'
                        : 'text-ink-muted hover:bg-slate-50 hover:text-primary'
                    }`}
                  >
                    {num}
                  </Link>
                ))}
                <Link href={pageHref(Math.min(totalPages, currentPage + 1), q)} aria-label="다음 페이지" className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-50 hover:text-primary">
                  <ChevronRight size={18} />
                </Link>
                <Link href={pageHref(totalPages, q)} aria-label="마지막 페이지" className="flex h-9 w-9 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-50 hover:text-primary">
                  <ChevronsRight size={18} />
                </Link>
              </div>
            )}

            {/* Admin Action */}
            <div className="flex justify-end border-t border-slate-100 pt-8 sm:pt-12">
              <Link
                href="/news/notice/write"
                className="inline-flex w-full items-center justify-center gap-3 rounded-xl bg-navy-950 px-5 py-4 text-[16px] font-bold tracking-tight text-white shadow-lg transition-all hover:bg-primary hover:shadow-blue-glow active:scale-95 sm:w-auto sm:rounded-[1.25rem] sm:px-8 sm:py-5 sm:text-[17px]"
              >
                <PenSquare size={20} strokeWidth={2.5} />
                공지사항 등록하기
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
