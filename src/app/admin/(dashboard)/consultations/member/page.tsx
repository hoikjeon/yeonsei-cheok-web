import Link from 'next/link';
import { CheckCircle2, Clock3, ExternalLink, LockKeyhole, MessageSquareText, Save, Search } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import ConsultationAdminTabs from '@/components/admin/ConsultationAdminTabs';
import { requireAdmin } from '@/lib/adminAuth';
import { answerConsultationPost } from './actions';

type ConsultationPost = {
  id: string;
  author_name: string;
  phone: string | null;
  consultation_type: string;
  title: string;
  content: string;
  status: 'received' | 'answered';
  answer: string | null;
  answered_at: string | null;
  created_at: string;
};

type FilterStatus = 'all' | 'received' | 'answered';

function formatDate(value: string) {
  return new Date(value).toLocaleString('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function filterHref(status: FilterStatus, searchTerm: string) {
  const query = new URLSearchParams();
  if (status !== 'all') query.set('status', status);
  if (searchTerm) query.set('q', searchTerm);
  const value = query.toString();
  return value ? `/admin/consultations/member?${value}` : '/admin/consultations/member';
}

export default async function MemberConsultationsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string; error?: string; q?: string; status?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const searchTerm = (params.q || '').trim().slice(0, 80);
  const status: FilterStatus = params.status === 'received' || params.status === 'answered'
    ? params.status
    : 'all';
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
  const supabase = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  const { data, error } = await supabase
    .from('consultation_posts')
    .select('id,author_name,phone,consultation_type,title,content,status,answer,answered_at,created_at')
    .order('created_at', { ascending: false })
    .limit(200);
  const allPosts = (data || []) as ConsultationPost[];
  const posts = allPosts.filter((post) => {
    if (status !== 'all' && post.status !== status) return false;
    if (!searchTerm) return true;
    return [post.author_name, post.phone, post.consultation_type, post.title, post.content]
      .filter(Boolean)
      .join(' ')
      .toLocaleLowerCase('ko-KR')
      .includes(searchTerm.toLocaleLowerCase('ko-KR'));
  });
  const pendingCount = allPosts.filter((post) => post.status === 'received').length;
  const answeredCount = allPosts.filter((post) => post.status === 'answered').length;

  return (
    <>
      <header className="sticky top-0 z-50 flex flex-col gap-4 border-b border-slate-200 bg-white px-5 py-5 shadow-sm md:flex-row md:items-center md:justify-between md:px-10 md:py-6">
        <div>
          <h1 className="text-xl font-black tracking-tight text-ink md:text-2xl">회원 1:1 문의</h1>
          <p className="mt-1 text-sm font-medium text-ink-muted">로그인한 회원이 남긴 비공개 상담을 확인하고 답변합니다.</p>
        </div>
        <Link href="/consultation" target="_blank" className="inline-flex items-center gap-2 rounded bg-slate-100 px-4 py-3 text-sm font-bold text-ink-sub transition hover:bg-slate-200">
          사용자 화면 보기 <ExternalLink size={17} />
        </Link>
      </header>
      <ConsultationAdminTabs />

      <div className="mx-auto w-full max-w-6xl space-y-6 p-5 md:p-10">
        {params.error && (
          <div className="rounded border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">{params.error}</div>
        )}
        {error && (
          <div className="rounded border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-bold leading-6 text-amber-800">
            회원 상담 테이블을 불러오지 못했습니다. <code>setup_member_consultation_board.sql</code>을 Supabase에 먼저 적용해 주세요.
          </div>
        )}

        <section className="grid gap-3 sm:grid-cols-3">
          <div className="rounded border border-slate-200 bg-white px-5 py-5 shadow-sm">
            <p className="text-xs font-bold text-ink-muted">전체 회원 문의</p>
            <p className="mt-2 text-3xl font-black text-ink">{allPosts.length}<span className="ml-1 text-sm text-ink-muted">건</span></p>
          </div>
          <div className="rounded border border-amber-200 bg-amber-50 px-5 py-5 shadow-sm">
            <p className="text-xs font-bold text-amber-800">답변 대기</p>
            <p className="mt-2 text-3xl font-black text-amber-800">{pendingCount}<span className="ml-1 text-sm">건</span></p>
          </div>
          <div className="rounded border border-blue-200 bg-blue-50 px-5 py-5 shadow-sm">
            <p className="text-xs font-bold text-primary">답변 완료</p>
            <p className="mt-2 text-3xl font-black text-primary">{answeredCount}<span className="ml-1 text-sm">건</span></p>
          </div>
        </section>

        <section className="rounded border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <form action="/admin/consultations/member" method="get" className="flex w-full max-w-lg gap-2">
              {status !== 'all' && <input type="hidden" name="status" value={status} />}
              <div className="relative min-w-0 flex-1">
                <label htmlFor="member-consultation-search" className="sr-only">회원 문의 검색</label>
                <input
                  id="member-consultation-search"
                  name="q"
                  type="search"
                  defaultValue={searchTerm}
                  placeholder="작성자, 제목, 연락처 검색"
                  className="min-h-11 w-full rounded border border-slate-200 bg-slate-50 py-3 pl-4 pr-11 text-sm font-medium text-ink outline-none transition focus:border-primary focus:bg-white"
                />
                <Search size={18} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
              </div>
              <button type="submit" className="rounded bg-navy-950 px-5 py-3 text-sm font-black text-white transition hover:bg-primary">검색</button>
            </form>

            <div className="flex rounded bg-slate-100 p-1">
              {([
                ['all', '전체'],
                ['received', '답변 대기'],
                ['answered', '답변 완료'],
              ] as const).map(([value, label]) => (
                <Link
                  key={value}
                  href={filterHref(value, searchTerm)}
                  className={`flex-1 whitespace-nowrap rounded px-4 py-2.5 text-center text-sm font-black transition ${status === value ? 'bg-white text-ink shadow-sm' : 'text-ink-muted hover:text-ink'}`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-ink-muted">검색 결과 <strong className="text-lg text-ink">{posts.length}</strong>건</p>
          <p className="text-xs font-medium text-ink-muted">본문과 답변은 관리자와 작성자만 확인할 수 있습니다.</p>
        </div>

        {!error && posts.length === 0 ? (
          <div className="rounded border border-slate-200 bg-white px-5 py-20 text-center shadow-sm">
            <MessageSquareText size={42} className="mx-auto text-slate-300" />
            <p className="mt-4 text-base font-bold text-ink-muted">조건에 맞는 회원 문의가 없습니다.</p>
          </div>
        ) : (
          posts.map((post) => {
            const answered = post.status === 'answered' && Boolean(post.answer);
            return (
              <article key={post.id} className="overflow-hidden rounded border border-slate-200 bg-white shadow-sm">
                <header className="border-b border-slate-200 bg-slate-50/70 px-5 py-5 md:px-7">
                  <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className={`rounded px-2.5 py-1 text-xs font-black ${answered ? 'bg-primary text-white' : 'bg-amber-100 text-amber-800'}`}>
                          {answered ? '답변완료' : '답변대기'}
                        </span>
                        <span className="text-xs font-bold text-primary">{post.consultation_type}</span>
                      </div>
                      <h2 className="mt-3 break-keep text-xl font-black text-ink">{post.title}</h2>
                    </div>
                    <div className="shrink-0 text-sm font-medium leading-6 text-ink-muted md:text-right">
                      <p className="font-bold text-ink-sub">{post.author_name} · {post.phone || '연락처 없음'}</p>
                      <p>{formatDate(post.created_at)}</p>
                    </div>
                  </div>
                </header>

                <div className="grid gap-6 px-5 py-6 md:px-7 lg:grid-cols-2">
                  <section>
                    <h3 className="flex items-center gap-2 text-sm font-black text-ink"><LockKeyhole size={16} className="text-primary" /> 상담 본문</h3>
                    <div className="mt-3 min-h-52 whitespace-pre-wrap rounded border border-slate-200 bg-slate-50 px-4 py-4 text-[15px] font-medium leading-7 text-ink-sub">
                      {post.content}
                    </div>
                  </section>

                  <form action={answerConsultationPost}>
                    <input type="hidden" name="postId" value={post.id} />
                    <label htmlFor={`answer-${post.id}`} className="flex items-center gap-2 text-sm font-black text-ink">
                      {answered ? <CheckCircle2 size={16} className="text-primary" /> : <Clock3 size={16} className="text-amber-600" />}
                      병원 답변
                    </label>
                    <textarea
                      id={`answer-${post.id}`}
                      name="answer"
                      required
                      maxLength={5000}
                      rows={8}
                      defaultValue={post.answer || ''}
                      placeholder="회원이 확인할 답변을 입력해 주세요."
                      className="mt-3 min-h-52 w-full resize-y rounded border border-slate-200 bg-white px-4 py-4 text-[15px] font-medium leading-7 text-ink outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/10"
                    />
                    <div className="mt-3 flex items-center justify-between gap-3">
                      <p className="text-xs font-medium text-ink-muted">
                        {post.answered_at ? `마지막 답변 ${formatDate(post.answered_at)}` : '저장 시 답변완료로 변경됩니다.'}
                      </p>
                      <button type="submit" className="inline-flex shrink-0 items-center gap-2 rounded bg-primary px-5 py-3 text-sm font-black text-white transition hover:bg-primary-dark">
                        <Save size={16} /> {answered ? '답변 수정' : '답변 저장'}
                      </button>
                    </div>
                    {params.saved === post.id && (
                      <p className="mt-3 text-sm font-bold text-emerald-700">답변이 저장되었습니다.</p>
                    )}
                  </form>
                </div>
              </article>
            );
          })
        )}
      </div>
    </>
  );
}
