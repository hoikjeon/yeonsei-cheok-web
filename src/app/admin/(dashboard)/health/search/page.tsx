import Link from 'next/link';
import { requireAdmin } from '@/lib/adminAuth';
import { healthSearchClient } from '@/lib/indexNow';
import type { SearchAuditReport } from '@/lib/healthSearchAudit';

export const dynamic = 'force-dynamic';
const labels: Record<string, string> = { pending: '전송 대기/재시도', processing: '전송 중', accepted: '네이버 접수 완료', key_pending: '접수됨 · 키 확인 대기', failed: '전송 실패 · 확인 필요', cancelled: '변경되어 취소됨' };
const date = (value: string) => new Date(value).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' });
function isStale(value?: string) { return !value || Date.now() - Date.parse(value) > 26 * 60 * 60 * 1000; }

export default async function HealthSearchPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  await requireAdmin();
  const params = await searchParams;
  const db = healthSearchClient();
  const results = await Promise.all([
    db.from('health_search_checks').select('*').order('checked_at', { ascending: false }).limit(10),
    db.from('health_search_jobs').select('*').order('updated_at', { ascending: false }).limit(50),
    db.from('health_search_attempts').select('*,health_search_jobs(slug)').order('attempted_at', { ascending: false }).limit(30),
    db.from('health_search_jobs').select('id', { count: 'exact', head: true }).eq('status', 'failed'),
  ]);
  const error = results.find((result) => result.error)?.error;
  const [checks, jobs, attempts] = results;
  const latest = checks.data?.[0];
  const stale = isStale(latest?.checked_at);
  return <div className="mx-auto w-full max-w-6xl space-y-6 p-5 md:p-10">
    <Link href="/admin/health" className="text-sm text-blue-700">← 건강정보 관리</Link>
    <h1 className="text-2xl font-bold">검색 수집 점검</h1>
    <p className="text-sm text-slate-600">대상: https://www.ys-cheok.com · 변경 알림은 5분마다, 정기 점검은 매일 오전 9시 20분에 실행합니다.</p>
    <p className="text-sm text-slate-600">네이버 접수는 수집·색인 완료나 검색 노출을 뜻하지 않습니다. 소유확인 및 사이트맵·RSS 최초 제출 상태는 서치어드바이저 계정에서 확인하세요.</p>
    {error ? <div role="alert" className="rounded-xl bg-amber-50 p-5">검색 자동화 DB를 읽지 못했습니다. update_health_search_automation.sql 적용 여부와 서버 로그를 확인하세요.</div> : <>
      {params.error && <p role="alert" className="text-rose-700">점검 실행 또는 결과 저장에 실패했습니다. 서버 로그를 확인하세요.</p>}
      {stale && <p role="alert" className="rounded-xl bg-amber-50 p-4">최근 26시간 이내 점검 기록이 없습니다. 정기 실행 상태를 확인하세요.</p>}
      {Boolean(results[3].count) && <p role="alert" className="rounded-xl bg-rose-50 p-4">전송 실패 {results[3].count}건이 있습니다. 설정 또는 응답 코드를 확인하세요.</p>}
      <form action="/api/admin/health/search-check" method="post"><button className="rounded-lg bg-slate-900 px-5 py-3 font-bold text-white">지금 점검하기</button></form>
      <section className="space-y-3"><h2 className="text-lg font-bold">최근 점검</h2>
        {!checks.data?.length && <p>아직 점검 기록이 없습니다.</p>}
        {checks.data?.map((check) => {
          const report = check.report as SearchAuditReport;
          return <details key={check.id} open={check.id === latest?.id} className="rounded-xl border bg-white p-4">
            <summary className="cursor-pointer font-semibold">{date(check.checked_at)} · {check.ok ? '정상' : '확인 필요'} · 사이트맵 {report.sitemapUrls}개 / 공개 글 {report.publicArticles}개 / 링크 검사 {report.checkedLinks}개</summary>
            {report.issues.length ? <ul className="mt-3 space-y-2 break-all text-sm text-rose-700">{report.issues.map((issue, i) => <li key={i}>{issue}</li>)}</ul> : <p className="mt-3 text-sm text-emerald-700">접속·XML·공개 글·수정일·RSS·키 파일·포함 링크 검사 통과</p>}
          </details>;
        })}
      </section>
      <section className="space-y-3"><h2 className="text-lg font-bold">변경 알림 최근 50건</h2>
        {!jobs.data?.length && <p>아직 변경 알림이 없습니다. 설치 후 발행·수정한 글부터 기록됩니다.</p>}
        {jobs.data?.map((job) => <div key={job.id} className="rounded-xl border bg-white p-4 text-sm">
          <p className="break-all font-semibold">{job.slug} · {job.kind === 'removed' ? '공개 중단' : '발행/수정'}</p>
          <p>{labels[job.status]} · 시도 {job.attempts}회{job.last_http_status ? ` · HTTP ${job.last_http_status}` : ''}</p>
          <p className="text-slate-500">{date(job.updated_at)}{job.status === 'pending' ? ` · 다음 처리 가능: ${date(job.available_at)}` : ''}</p>
          {job.last_error && <p>{job.last_error}</p>}
          {job.status === 'failed' && <form action="/api/admin/health/search-retry" method="post" className="mt-2"><input type="hidden" name="id" value={job.id} /><button className="rounded-lg border px-3 py-2 font-semibold">설정 확인 후 다시 전송</button></form>}
        </div>)}
      </section>
      <section className="space-y-3"><h2 className="text-lg font-bold">전송 응답 최근 30건</h2>
        {attempts.data?.map((attempt) => <p key={attempt.id} className="break-all text-sm">{date(attempt.attempted_at)} · {attempt.health_search_jobs?.slug} · {labels[attempt.outcome]} · {attempt.http_status ?? '네트워크/취소'} · {attempt.detail}</p>)}
      </section>
    </>}
  </div>;
}
