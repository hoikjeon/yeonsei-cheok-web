import 'server-only';
import { createClient } from '@supabase/supabase-js';
import { SITE_URL } from '@/lib/seo';
import { processHealthSearchJobs } from '@/lib/healthSearchWorker';
export { INDEXNOW_KEY } from '@/lib/healthSearchProtocol';

export function healthSearchClient() {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
    global: { fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }) },
  });
}

/** 운영 환경에서 DB 트리거가 남긴 대기열만 처리합니다. */
export async function notifySearchEngines(onlySlug?: string) {
  if (process.env.VERCEL_ENV !== 'production') return { skipped: 'non-production', processed: 0 };
  return processHealthSearchJobs(healthSearchClient(), SITE_URL, onlySlug);
}
