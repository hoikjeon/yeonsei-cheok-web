import Link from 'next/link';
import { FileQuestion, LockKeyhole, LogIn, PenLine, Search } from 'lucide-react';
import SubHero from '@/components/SubHero';
import Pagination from '@/components/Pagination';
import { createClient } from '@/utils/supabase/server';

const PAGE_SIZE = 10;

type PublicConsultationTitle = {
  id: string;
  title: string;
  status: 'received' | 'answered';
  created_at: string;
  total_count: number | string;
};

function formatDate(value: string) {
  return new Date(value).toLocaleDateString('ko-KR', {
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  });
}

export default async function ConsultationPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; q?: string }>;
}) {
  const params = await searchParams;
  const currentPage = Math.max(1, Number.parseInt(params.page || '1', 10) || 1);
  const searchTerm = (params.q || '').trim().slice(0, 50);
  const supabase = await createClient();

  const [titlesResult, authResult] = await Promise.all([
    supabase.rpc('list_consultation_titles', {
      search_term: searchTerm,
      page_offset: (currentPage - 1) * PAGE_SIZE,
      page_limit: PAGE_SIZE,
    }),
    supabase.auth.getUser(),
  ]);

  const titles = (titlesResult.data || []) as PublicConsultationTitle[];
  const totalCount = titles.length > 0 ? Number(titles[0].total_count) || 0 : 0;
  const totalPages = Math.max(1, Math.ceil(totalCount / PAGE_SIZE));
  const user = authResult.data.user;

  let ownPostIds = new Set<string>();
  if (user && titles.length > 0) {
    const { data: ownPosts } = await supabase
      .from('consultation_posts')
      .select('id')
      .in('id', titles.map((post) => post.id));
    ownPostIds = new Set((ownPosts || []).map((post) => post.id as string));
  }

  const databaseSetupPending = Boolean(titlesResult.error);

  return (
    <main className="min-h-screen bg-white">
      <SubHero
        title="온라인 상담"
        subtitle="제목은 모든 방문자에게 보이며, 상세 내용과 답변은 작성자 본인만 확인할 수 있습니다."
        path={[{ name: '커뮤니티' }, { name: '온라인 상담' }]}
      />

      <section className="bg-white px-4 py-14 sm:px-6 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-7xl">
          <div className="mb-8 flex flex-col gap-5 rounded-xl border border-primary/15 bg-primary-light/45 px-5 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-7">
            <div className="flex items-start gap-3">
              <div className="mt-0.5 flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white text-primary shadow-sm">
                <LockKeyhole size={20} />
              </div>
              <div>
                <h2 className="text-[16px] font-bold text-ink">안심하고 상담을 남겨 주세요.</h2>
                <p className="mt-1 break-keep text-[14px] font-medium leading-6 text-ink-muted">
                  제목은 공개되지만 상담 본문·연락처·병원 답변은 로그인한 작성자 본인과 병원만 볼 수 있습니다.
                </p>
              </div>
            </div>
            {!user && (
              <Link
                href="/login?next=/consultation&reason=consultation-private"
                className="inline-flex min-h-11 shrink-0 items-center justify-center gap-2 rounded-lg border border-primary/20 bg-white px-5 py-3 text-[14px] font-bold text-primary transition-colors hover:bg-primary hover:text-white"
              >
                <LogIn size={17} /> 로그인
              </Link>
            )}
          </div>

          <div className="mb-5 flex flex-col gap-4 border-b-2 border-navy-900 pb-5 sm:flex-row sm:items-end sm:justify-between">
            <p className="text-[15px] font-bold text-ink-muted">
              총 <strong className="text-[19px] text-ink">{totalCount}</strong>건
            </p>
            <form action="/consultation" method="get" className="flex w-full max-w-md gap-2">
              <label htmlFor="consultation-search" className="sr-only">상담 제목 검색</label>
              <div className="relative min-w-0 flex-1">
                <input
                  id="consultation-search"
                  name="q"
                  type="search"
                  defaultValue={searchTerm}
                  placeholder="제목을 검색해 주세요."
                  className="min-h-11 w-full rounded-lg border border-slate-200 bg-white py-3 pl-4 pr-11 text-[15px] font-medium text-ink outline-none transition-colors focus:border-primary focus:ring-3 focus:ring-primary/10"
                />
                <Search size={19} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
              </div>
              <button type="submit" className="min-h-11 rounded-lg bg-navy-950 px-5 py-3 text-[14px] font-bold text-white transition-colors hover:bg-primary">
                검색
              </button>
            </form>
          </div>

          <div className="overflow-hidden border-y border-slate-200">
            <div className="hidden grid-cols-[150px_minmax(0,1fr)_160px] bg-slate-50 px-5 py-4 text-center text-[14px] font-bold text-ink-sub md:grid">
              <span>상태</span>
              <span>제목</span>
              <span>등록일</span>
            </div>

            {databaseSetupPending ? (
              <div className="flex min-h-64 flex-col items-center justify-center gap-3 px-5 py-16 text-center">
                <FileQuestion size={40} className="text-slate-300" />
                <p className="text-[17px] font-bold text-ink">상담 게시판을 준비하고 있습니다.</p>
                <p className="text-[14px] font-medium text-ink-muted">데이터베이스 설정 후 목록이 표시됩니다.</p>
              </div>
            ) : titles.length === 0 ? (
              <div className="flex min-h-64 flex-col items-center justify-center gap-3 px-5 py-16 text-center">
                <FileQuestion size={40} className="text-slate-300" />
                <p className="text-[17px] font-bold text-ink">
                  {searchTerm ? '검색 결과가 없습니다.' : '등록된 온라인 상담이 없습니다.'}
                </p>
              </div>
            ) : (
              <div className="divide-y divide-slate-100">
                {titles.map((post) => {
                  const isMine = ownPostIds.has(post.id);
                  const isAnswered = post.status === 'answered';
                  return (
                    <Link
                      key={post.id}
                      href={`/consultation/${post.id}`}
                      className="group grid gap-3 px-4 py-5 transition-colors hover:bg-slate-50 sm:px-5 md:grid-cols-[150px_minmax(0,1fr)_160px] md:items-center md:gap-0 md:py-6"
                    >
                      <div className="md:text-center">
                        <span className={`inline-flex min-h-8 items-center justify-center rounded-md px-3 py-1.5 text-[12px] font-bold ${
                          isAnswered ? 'bg-primary text-white' : 'bg-slate-100 text-ink-muted'
                        }`}>
                          {isAnswered ? '답변완료' : '접수완료'}
                        </span>
                      </div>
                      <div className="flex min-w-0 items-center gap-2.5 md:px-5">
                        <LockKeyhole size={17} className="shrink-0 text-slate-400 transition-colors group-hover:text-primary" />
                        <h3 className="min-w-0 truncate text-[16px] font-bold text-ink transition-colors group-hover:text-primary sm:text-[17px]">
                          {post.title}
                        </h3>
                        {isMine && (
                          <span className="shrink-0 rounded-md bg-primary-light px-2 py-1 text-[11px] font-bold text-primary">내 상담</span>
                        )}
                      </div>
                      <time className="pl-7 text-[13px] font-medium text-ink-muted md:pl-0 md:text-center md:text-[14px]" dateTime={post.created_at}>
                        {formatDate(post.created_at)}
                      </time>
                    </Link>
                  );
                })}
              </div>
            )}
          </div>

          {!databaseSetupPending && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              basePath="/consultation"
              query={{ q: searchTerm || undefined }}
            />
          )}

          <div className="mt-8 flex justify-end">
            <Link
              href={user ? '/consultation/write' : '/login?next=/consultation/write&reason=consultation-private'}
              className="inline-flex min-h-12 w-full items-center justify-center gap-2 rounded-lg bg-primary px-7 py-3.5 text-[15px] font-bold text-white shadow-lg shadow-primary/15 transition-colors hover:bg-primary-dark sm:w-auto"
            >
              <PenLine size={18} /> 글쓰기
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
