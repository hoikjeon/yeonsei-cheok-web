import type { HealthArticle } from './healthArticles';

/**
 * 검색엔진에 알리는 게시·수정 시각(ISO)입니다.
 * 수정 시각은 글을 실제로 고친 때(updated_at)를 쓰되, 게시 시각보다 앞서지 않게 합니다.
 * (예약 글은 발행 전에 써 두므로 고친 때가 게시 시각보다 이릅니다.)
 */
export function healthArticleTimes(article: Pick<HealthArticle, 'publishedAt'> & { publishAt?: string; updatedAt?: string }) {
  const published = article.publishAt || `${article.publishedAt}T09:00:00+09:00`;
  const candidates = [published, article.updatedAt]
    .filter((value): value is string => Boolean(value) && !Number.isNaN(new Date(value!).getTime()));
  const modified = candidates.reduce((latest, value) => (new Date(value) > new Date(latest) ? value : latest), published);
  return { published: new Date(published).toISOString(), modified: new Date(modified).toISOString() };
}
