import 'server-only';
import { cache } from 'react';
import { createClient } from '@supabase/supabase-js';
import { type HealthArticle } from '@/lib/healthArticles';
import { rowToHealthArticle, type HealthArticleRow } from '@/lib/healthArticleRecord';

// 요청마다 같은 DB 스냅샷을 사용하고, 요청 사이에는 공개 상태를 캐시하지 않습니다.
// 자동 작성·예약 발행은 관리자 액션을 거치지 않으므로 ISR에 맡기면 목록이 달라질 수 있습니다.
export const getPublishedHealthArticles = cache(async () => {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { global: { fetch: (url, options) => fetch(url, { ...options, cache: 'no-store' }) } },
  );
  const articles: HealthArticle[] = [];
  const now = new Date().toISOString();
  for (let from = 0; ; from += 500) {
    const { data, error } = await supabase.from('health_articles').select('*')
      .eq('is_published', true).lte('publish_at', now)
      .order('publish_at', { ascending: false }).order('slug').range(from, from + 499);
    // 조회 오류를 예제 글로 덮으면 누락·비공개 노출을 감출 수 있습니다.
    if (error) throw new Error(`건강정보 조회 실패: ${error.message}`);
    articles.push(...(data as HealthArticleRow[]).map(rowToHealthArticle));
    if (data.length < 500) return articles;
  }
});

export { healthArticleTimes } from '@/lib/healthArticleTimes';

export async function getPublishedHealthArticle(slug: string) {
  return (await getPublishedHealthArticles()).find((article) => article.slug === slug);
}
