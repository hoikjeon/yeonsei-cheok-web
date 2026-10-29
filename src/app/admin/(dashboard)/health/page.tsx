import Link from 'next/link';
import { ArrowRight, Bot, CalendarDays, ExternalLink, FileText, List, ListTodo, Pencil, Plus } from 'lucide-react';
import { requireAdmin } from '@/lib/adminAuth';
import { countQueuedHealthTopics, listAdminHealthArticles } from '@/lib/adminHealthRepository';
import {
  DEFAULT_HEALTH_THUMBNAIL,
  HEALTH_CATEGORIES,
  HEALTH_PUBLISH_SLOTS,
  formatHealthDate,
  healthArticlePath,
  toKstDate,
  toKstTime,
} from '@/lib/healthArticles';
import { HEALTH_STATUS_LABELS, healthArticleStatus, type AdminHealthArticle, type HealthArticleStatus } from '@/lib/healthArticleRecord';
import DeleteHealthButton from '@/components/admin/DeleteHealthButton';
import HealthPublishButton from '@/components/admin/HealthPublishButton';

const STATUS_STYLES: Record<HealthArticleStatus, string> = {
  draft: 'bg-slate-100 text-slate-500',
  scheduled: 'bg-blue-50 text-blue-700',
  published: 'bg-emerald-50 text-emerald-700',
};
const TABS = [
  { id: 'all', label: '전체' },
  { id: 'scheduled', label: '예약' },
  { id: 'published', label: '공개' },
  { id: 'draft', label: '임시저장' },
  { id: 'auto', label: '자동 작성' },
] as const;
const WEEKDAYS = ['일', '월', '화', '수', '목', '금', '토'];

/** 요청마다 한 번 정하는 기준 시각. 이 페이지는 요청마다 새로 그려집니다. */
function requestTime() {
  return Date.now();
}

function scheduleLabel(article: AdminHealthArticle) {
  const date = toKstDate(article.publishAt);
  const day = WEEKDAYS[new Date(`${date}T00:00:00+09:00`).getUTCDay()];
  return `${formatHealthDate(date).slice(5)}(${day}) ${toKstTime(article.publishAt)}`;
}

/** 이번 달 달력: 날짜마다 자동 발행 칸(HEALTH_PUBLISH_SLOTS)에 올라갈 글을 보여 줍니다. */
function ScheduleCalendar({ articles, month }: { articles: AdminHealthArticle[]; month: string }) {
  const [year, monthIndex] = month.split('-').map(Number);
  const first = new Date(Date.UTC(year, monthIndex - 1, 1));
  const daysInMonth = new Date(Date.UTC(year, monthIndex, 0)).getUTCDate();
  const today = toKstDate(new Date().toISOString());
  const byDate = new Map<string, AdminHealthArticle[]>();
  for (const article of articles) {
    if (!article.isPublished) continue;
    const date = toKstDate(article.publishAt);
    byDate.set(date, [...(byDate.get(date) ?? []), article]);
  }
  const cells = [...Array(first.getUTCDay()).fill(null), ...Array.from({ length: daysInMonth }, (_, i) => `${month}-${String(i + 1).padStart(2, '0')}`)];
  const shift = (delta: number) => {
    const d = new Date(Date.UTC(year, monthIndex - 1 + delta, 1));
    return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`;
  };

  return <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
    <div className="flex items-center justify-between border-b border-slate-200 p-4">
      <Link href={`/admin/health?view=calendar&month=${shift(-1)}`} className="rounded-lg px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100">← 이전 달</Link>
      <h2 className="font-black text-slate-900">{year}년 {monthIndex}월 발행 일정</h2>
      <Link href={`/admin/health?view=calendar&month=${shift(1)}`} className="rounded-lg px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100">다음 달 →</Link>
    </div>
    <div className="grid grid-cols-7 border-b border-slate-100 bg-slate-50 text-center text-xs font-bold text-slate-500">{WEEKDAYS.map((day) => <span key={day} className="py-2">{day}</span>)}</div>
    <div className="grid grid-cols-7">
      {cells.map((date, index) => {
        if (!date) return <div key={`empty-${index}`} className="min-h-28 border-b border-r border-slate-100 bg-slate-50/50" />;
        const items = (byDate.get(date) ?? []).sort((a, b) => a.publishAt.localeCompare(b.publishAt));
        const future = date >= today;
        return <div key={date} className={`min-h-28 space-y-1 border-b border-r border-slate-100 p-1.5 ${date === today ? 'bg-blue-50/40' : ''}`}>
          <p className={`px-1 text-xs font-bold ${date === today ? 'text-primary' : 'text-slate-500'}`}>{Number(date.slice(8))}</p>
          {HEALTH_PUBLISH_SLOTS.map((slot) => {
            const article = items.find((item) => toKstTime(item.publishAt) === slot);
            if (article) return <Link key={slot} href={`/admin/health/${article.slug}/edit`} title={article.title} className={`block truncate rounded px-1.5 py-1 text-[11px] font-bold ${STATUS_STYLES[healthArticleStatus(article)]}`}>{slot} {article.title}</Link>;
            return future ? <p key={slot} className="rounded border border-dashed border-amber-300 px-1.5 py-1 text-[11px] font-semibold text-amber-600">{slot} 비어 있음</p> : null;
          })}
          {items.filter((item) => !HEALTH_PUBLISH_SLOTS.includes(toKstTime(item.publishAt) as (typeof HEALTH_PUBLISH_SLOTS)[number])).map((article) =>
            <Link key={article.slug} href={`/admin/health/${article.slug}/edit`} title={article.title} className={`block truncate rounded px-1.5 py-1 text-[11px] font-bold ${STATUS_STYLES[healthArticleStatus(article)]}`}>{toKstTime(article.publishAt)} {article.title}</Link>)}
        </div>;
      })}
    </div>
  </section>;
}

export default async function AdminHealthPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdmin();
  const params = await searchParams;
  const single = (key: string) => typeof params[key] === 'string' ? params[key] as string : '';
  const tab = TABS.some((item) => item.id === single('tab')) ? single('tab') : 'all';
  const calendar = single('view') === 'calendar';
  const month = /^\d{4}-\d{2}$/.test(single('month')) ? single('month') : toKstDate(new Date().toISOString()).slice(0, 7);
  let articles: AdminHealthArticle[] = [];
  let queuedTopics = 0;
  let error = '';
  try { [articles, queuedTopics] = await Promise.all([listAdminHealthArticles(), countQueuedHealthTopics()]); }
  catch (err) { error = err instanceof Error ? err.message : '건강정보 글을 불러오지 못했습니다.'; }

  const now = requestTime();
  const counts = { all: articles.length, scheduled: 0, published: 0, draft: 0, auto: 0 } as Record<(typeof TABS)[number]['id'], number>;
  for (const article of articles) { counts[healthArticleStatus(article, now)] += 1; if (article.source === 'auto') counts.auto += 1; }
  const visible = articles
    .filter((article) => tab === 'all' || (tab === 'auto' ? article.source === 'auto' : healthArticleStatus(article, now) === tab))
    // 예약 글은 가까운 순서, 나머지는 최신 순서
    .sort((a, b) => tab === 'scheduled' ? a.publishAt.localeCompare(b.publishAt) : b.publishAt.localeCompare(a.publishAt));
  const nextScheduled = articles.filter((article) => healthArticleStatus(article, now) === 'scheduled').sort((a, b) => a.publishAt.localeCompare(b.publishAt));
  const lastScheduled = nextScheduled.at(-1);

  return <>
    <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-5 md:px-10">
      <div><Link href="/admin" className="text-xs font-bold text-slate-500 md:hidden">관리자 홈으로</Link><h1 className="text-2xl font-black text-slate-900">건강정보 관리</h1><p className="mt-1 text-sm text-slate-500">글을 쓰고 고치거나, 예약된 발행 일정을 확인하세요.</p></div>
      <div className="flex flex-wrap gap-2">
        <Link href="/admin/health/topics" className="flex items-center gap-2 rounded-lg bg-slate-100 px-4 py-3 text-sm font-bold text-slate-700"><ListTodo size={18} /> 자동 작성 주제 <span className="rounded-full bg-white px-2 text-xs">{queuedTopics}</span></Link>
        <Link href="/admin/health/write" className="flex items-center gap-2 rounded-lg bg-navy-950 px-5 py-3 text-sm font-bold text-white"><Plus size={18} /> 새 글 쓰기</Link>
      </div>
    </header>
    <div className="mx-auto w-full max-w-7xl space-y-6 p-5 md:p-10">
      {(single('saved') || single('deleted')) && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-800">{single('deleted') ? '글이 삭제되었습니다.' : '글이 저장되었습니다.'}{single('cleanup') === 'pending' && <p className="mt-1 font-normal">이전 이미지 파일 정리는 완료하지 못했습니다.</p>}</div>}
      {!error && <div className="grid gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-slate-200 bg-white p-5"><p className="text-xs font-bold text-slate-500">다음 발행</p><p className="mt-1 truncate font-bold text-slate-900">{nextScheduled[0] ? `${scheduleLabel(nextScheduled[0])} · ${nextScheduled[0].title}` : '예약된 글이 없습니다'}</p></div>
        <div className="rounded-xl border border-slate-200 bg-white p-5"><p className="text-xs font-bold text-slate-500">예약된 글</p><p className="mt-1 font-bold text-slate-900">{nextScheduled.length}편{lastScheduled ? ` · ${scheduleLabel(lastScheduled)}까지` : ''}</p></div>
        <div className={`rounded-xl border p-5 ${queuedTopics < 7 ? 'border-amber-200 bg-amber-50' : 'border-slate-200 bg-white'}`}><p className="text-xs font-bold text-slate-500">남은 자동 작성 주제</p><p className="mt-1 font-bold text-slate-900">{queuedTopics}개 · 약 {Math.floor(queuedTopics / HEALTH_PUBLISH_SLOTS.length)}일치</p>{queuedTopics < 7 && <Link href="/admin/health/topics" className="mt-1 inline-block text-xs font-bold text-amber-700 underline">주제 추가하기</Link>}</div>
      </div>}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <nav aria-label="글 상태" className="flex flex-wrap gap-2">
          {TABS.map((item) => <Link key={item.id} href={item.id === 'all' ? '/admin/health' : `/admin/health?tab=${item.id}`} aria-current={!calendar && tab === item.id ? 'page' : undefined} className={`rounded-full border px-4 py-2.5 text-sm font-bold transition ${!calendar && tab === item.id ? 'border-navy-950 bg-navy-950 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300'}`}>{item.label} <span className="opacity-60">{counts[item.id]}</span></Link>)}
        </nav>
        <div className="flex rounded-lg border border-slate-200 bg-white p-1">
          <Link href="/admin/health" aria-current={!calendar ? 'page' : undefined} className={`inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-bold ${!calendar ? 'bg-slate-100 text-slate-900' : 'text-slate-500'}`}><List size={16} /> 목록</Link>
          <Link href="/admin/health?view=calendar" aria-current={calendar ? 'page' : undefined} className={`inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-bold ${calendar ? 'bg-slate-100 text-slate-900' : 'text-slate-500'}`}><CalendarDays size={16} /> 달력</Link>
        </div>
      </div>

      {error ? <div role="alert" className="rounded-xl border border-slate-200 bg-white p-10 text-center text-rose-700"><p>{error}</p><Link href="/admin/health" className="mt-4 inline-block rounded-lg bg-slate-100 px-4 py-2 font-bold">다시 불러오기</Link></div>
        : calendar ? <ScheduleCalendar articles={articles} month={month} />
        : <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          {visible.length === 0 ? <div className="px-5 py-20 text-center"><FileText className="mx-auto mb-4 text-slate-300" size={38} /><p className="font-bold text-slate-700">해당하는 글이 없습니다.</p></div> : <>
            <div className="hidden grid-cols-[76px_minmax(0,1fr)_150px_300px] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-bold text-slate-500 lg:grid"><span>썸네일</span><span>제목</span><span>발행</span><span>관리</span></div>
            <div className="divide-y divide-slate-100">{visible.map((article) => {
              const status = healthArticleStatus(article, now);
              const preview = `/admin/health/${article.slug}/preview`;
              const edit = `/admin/health/${article.slug}/edit`;
              const thumb = article.thumbnail ?? article.heroImage?.src ?? DEFAULT_HEALTH_THUMBNAIL.src;
              return <div key={article.slug} className={`grid grid-cols-[64px_minmax(0,1fr)] items-center gap-4 p-5 lg:grid-cols-[76px_minmax(0,1fr)_150px_300px] ${single('saved') === article.slug ? 'bg-blue-50/70' : 'hover:bg-slate-50/70'}`}>
                <Link href={preview} aria-label={`${article.title} 미리보기`} className="block h-14 w-16 overflow-hidden rounded-lg bg-slate-100">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={thumb} alt="" className="h-full w-full object-cover" />
                </Link>
                <div className="min-w-0">
                  <div className="mb-1 flex flex-wrap items-center gap-1.5">
                    <span className={`rounded-full px-2 py-0.5 text-[11px] font-bold ${STATUS_STYLES[status]}`}>{HEALTH_STATUS_LABELS[status]}</span>
                    {article.source === 'auto' && <span className="inline-flex items-center gap-0.5 rounded-full bg-violet-50 px-2 py-0.5 text-[11px] font-bold text-violet-700"><Bot size={11} /> 자동</span>}
                    {!article.reviewedAt && <span className="rounded-full bg-amber-50 px-2 py-0.5 text-[11px] font-bold text-amber-700">검토 전</span>}
                    <span className="text-[11px] font-bold text-slate-400">{HEALTH_CATEGORIES[article.category].name}</span>
                  </div>
                  <Link href={edit} className="line-clamp-2 break-words font-bold leading-6 text-slate-800 hover:text-primary">{article.title}</Link>
                  <p className="mt-1 text-xs text-slate-500 lg:hidden">{scheduleLabel(article)}</p>
                </div>
                <p className={`hidden text-xs font-semibold lg:block ${status === 'scheduled' ? 'text-blue-700' : 'text-slate-500'}`}>{scheduleLabel(article)}</p>
                <div className="col-span-2 flex flex-wrap justify-end gap-1 lg:col-span-1 lg:justify-start">
                  <Link href={preview} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100"><ArrowRight size={15} /> 미리보기</Link>
                  <Link href={edit} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-bold text-primary hover:bg-blue-50"><Pencil size={15} /> 수정</Link>
                  {status === 'scheduled' && <><HealthPublishButton slug={article.slug} title={article.title} mode="now" /><HealthPublishButton slug={article.slug} title={article.title} mode="draft" /></>}
                  {status === 'published' && <Link href={healthArticlePath(article.slug)} target="_blank" aria-label={`${article.title} 홈페이지에서 보기`} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100"><ExternalLink size={15} /></Link>}
                  <DeleteHealthButton slug={article.slug} title={article.title} />
                </div>
              </div>;
            })}</div>
          </>}
        </section>}
      <Link href="/health" target="_blank" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500">홈페이지에서 건강정보 보기 <ExternalLink size={15} /></Link>
    </div>
  </>;
}
