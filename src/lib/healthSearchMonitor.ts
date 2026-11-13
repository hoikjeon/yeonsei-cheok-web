import 'server-only';
import { SITE_URL } from '@/lib/seo';
import { getPublishedHealthArticles, healthArticleTimes } from '@/lib/healthArticleStore';
import { healthSearchClient } from '@/lib/indexNow';
import { auditHealthSearch, type SearchAuditReport } from '@/lib/healthSearchAudit';

export async function runHealthSearchCheck() {
  if (process.env.VERCEL_ENV !== 'production') throw new Error('운영 환경에서만 정기 점검을 실행합니다.');
  let report: SearchAuditReport;
  try {
    const articles = await getPublishedHealthArticles();
    report = await auditHealthSearch(SITE_URL, articles.map((article) => ({ slug: article.slug, modified: healthArticleTimes(article).modified })));
  } catch (error) {
    const now = new Date().toISOString();
    report = { startedAt: now, finishedAt: now, sitemapUrls: 0, publicArticles: 0, checkedLinks: 0,
      issues: [`공개 글 원본 조회 또는 점검 실행 실패: ${String(error)}`] };
  }
  const { error } = await healthSearchClient().from('health_search_checks').insert({ ok: report.issues.length === 0, report });
  if (error) throw new Error(`점검 결과 저장 실패: ${error.message}`);
  return report;
}
