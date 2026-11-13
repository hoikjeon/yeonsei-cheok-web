import type { SupabaseClient } from '@supabase/supabase-js';
import { INDEXNOW_ENDPOINT, INDEXNOW_KEY, indexNowOutcome } from './healthSearchProtocol';

type SearchJob = { id: string; slug: string; kind: 'public' | 'removed'; attempts: number; lease_token: string };

export async function processHealthSearchJobs(db: SupabaseClient, siteUrl: string, onlySlug?: string, fetcher: typeof fetch = fetch) {
  const absoluteUrl = (path: string) => new URL(path, siteUrl).toString();
  const { data, error } = await db.rpc('claim_health_search_jobs', { batch_size: 20, only_slug: onlySlug ?? null });
  if (error) throw new Error(`IndexNow 대기열 조회 실패: ${error.message}`);
  const jobs = (data ?? []) as SearchJob[];
  if (!jobs.length) return { processed: 0 };

  const finish = async (job: SearchJob, outcome: string, status: number | null, detail: string, retryAt: string | null = null) => {
    const { error } = await db.rpc('finish_health_search_job', {
      job_id: job.id, token: job.lease_token, outcome, http_status: status, detail, retry_at: retryAt,
    });
    if (error) throw new Error(`IndexNow 결과 저장 실패: ${error.message}`);
  };

  // 예약 취소·비공개 전환 중 변경된 글을 전송 직전에 다시 확인합니다.
  const { data: articles, error: readError } = await db.from('health_articles')
    .select('slug,is_published,publish_at').in('slug', jobs.map((job) => job.slug));
  if (readError) throw new Error(`IndexNow 공개 상태 확인 실패: ${readError.message}`);
  const visible = new Set((articles ?? []).filter((article) => article.is_published && Date.parse(article.publish_at) <= Date.now()).map((article) => article.slug));
  const active: SearchJob[] = [];
  for (const job of jobs) {
    if ((job.kind === 'public') !== visible.has(job.slug)) await finish(job, 'cancelled', null, '현재 공개 상태와 일치하지 않아 취소');
    else active.push(job);
  }
  if (!active.length) return { processed: jobs.length, submitted: 0 };

  let status: number | null = null;
  let detail = '';
  let retryAfter: string | null = null;
  try {
    const response = await fetcher(INDEXNOW_ENDPOINT, {
      method: 'POST', headers: { 'Content-Type': 'application/json; charset=utf-8' },
      body: JSON.stringify({ host: new URL(siteUrl).host, key: INDEXNOW_KEY,
        keyLocation: absoluteUrl(`/${INDEXNOW_KEY}.txt`),
        urlList: [...new Set(['/health', ...active.map((job) => `/health/${job.slug}`)])].map(absoluteUrl),
      }),
      signal: AbortSignal.timeout(8000), cache: 'no-store', redirect: 'error',
    });
    status = response.status;
    retryAfter = response.headers.get('retry-after');
    detail = status === 200 ? '네이버 접수 완료 (색인 보장 아님)' : status === 202 ? '접수됨 · 네이버 키 확인 대기' : `네이버 HTTP ${status}`;
    await response.body?.cancel();
  } catch (error) {
    detail = error instanceof Error ? error.message.slice(0, 300) : '네트워크 오류';
  }
  for (const job of active) {
    const outcome = indexNowOutcome(status, job.attempts, retryAfter);
    await finish(job, outcome.status, status, detail, outcome.retryAt);
  }
  return { processed: jobs.length, submitted: active.length, httpStatus: status };
}
