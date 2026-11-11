import 'server-only';
import { cache } from 'react';
import { createClient } from '@supabase/supabase-js';
import { unstable_cache } from 'next/cache';
import { HEALTH_ARTICLE_SEED, type HealthArticle } from '@/lib/healthArticles';
import { rowToHealthArticle, type HealthArticleRow } from '@/lib/healthArticleRecord';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export const HEALTH_ARTICLES_CACHE_TAG = 'health-articles';

// 예약 글은 발행 시각이 지난 뒤 이 시간 안에 홈페이지에 나타납니다.
export const HEALTH_ARTICLES_CACHE_SECONDS = 300;

// 글은 수십 편 규모라 공개 글 전체를 한 번에 캐시하고, 상세·목록·사이트맵이 같이 씁니다.
const getCachedPublishedHealthArticles = unstable_cache(
  async (): Promise<HealthArticle[]> => {
    const { data, error } = await supabase
      .from('health_articles')
      .select('*')
      .eq('is_published', true)
      .lte('publish_at', new Date().toISOString())
      .order('publish_at', { ascending: false })
      .order('slug');

    if (error) {
      // 테이블이 아직 없거나 일시적으로 읽지 못할 때도 기존 글은 계속 보이도록 처음 데이터로 대신합니다.
      console.error('Error fetching health articles:', error.message);
      return HEALTH_ARTICLE_SEED;
    }

    return (data as HealthArticleRow[]).map(rowToHealthArticle);
  },
  ['health-articles-published'],
  {
    tags: [HEALTH_ARTICLES_CACHE_TAG],
    revalidate: HEALTH_ARTICLES_CACHE_SECONDS,
  },
);

export const getPublishedHealthArticles = cache(getCachedPublishedHealthArticles);

/**
 * 검색엔진에 알리는 게시·수정 시각(ISO)입니다.
 * 수정 시각은 글을 실제로 고친 때(updated_at)를 쓰되, 게시 시각보다 앞서지 않게 합니다.
 * (예약 글은 발행 전에 써 두므로 고친 때가 게시 시각보다 이릅니다.)
 */
export function healthArticleTimes(article: HealthArticle) {
  const row = article as HealthArticle & { publishAt?: string; updatedAt?: string };
  const published = row.publishAt || `${article.publishedAt}T09:00:00+09:00`;
  const candidates = [published, row.updatedAt, article.reviewedAt ? `${article.reviewedAt}T09:00:00+09:00` : undefined]
    .filter((value): value is string => Boolean(value) && !Number.isNaN(new Date(value!).getTime()));
  const modified = candidates.reduce((latest, value) => (new Date(value) > new Date(latest) ? value : latest), published);
  return { published: new Date(published).toISOString(), modified: new Date(modified).toISOString() };
}

export async function getPublishedHealthArticle(slug: string) {
  return (await getPublishedHealthArticles()).find((article) => article.slug === slug);
}
