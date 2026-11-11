import { createClient } from '@supabase/supabase-js';
import { healthArticlePath } from '@/lib/healthArticles';
import { notifySearchEngines } from '@/lib/indexNow';

// 하루 한 번(vercel.json 의 crons) 실행됩니다.
// 예약 발행 글과 자동 작성 글은 저장하는 순간이 아니라 정한 시각에 공개되므로,
// 지난 하루 사이 공개된 글을 여기서 모아 검색엔진에 알립니다.
export const dynamic = 'force-dynamic';

const DAY_MS = 24 * 60 * 60 * 1000;

export async function GET(request: Request) {
  // Vercel 은 CRON_SECRET 환경 변수가 있으면 이 값을 Authorization 머리글로 보냅니다.
  const secret = process.env.CRON_SECRET;
  const allowed = secret
    ? request.headers.get('authorization') === `Bearer ${secret}`
    : request.headers.get('user-agent')?.startsWith('vercel-cron/');
  if (!allowed) return Response.json({ error: 'unauthorized' }, { status: 401 });

  const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
  const now = Date.now();
  const { data, error } = await supabase
    .from('health_articles')
    .select('slug')
    .eq('is_published', true)
    .gt('publish_at', new Date(now - DAY_MS).toISOString())
    .lte('publish_at', new Date(now).toISOString());
  if (error) return Response.json({ error: 'lookup failed' }, { status: 500 });

  const slugs = (data ?? []).map((row) => row.slug as string);
  if (!slugs.length) return Response.json({ sent: false, urls: [] });
  return Response.json(await notifySearchEngines(['/health', ...slugs.map(healthArticlePath)]));
}
