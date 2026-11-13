import { SITE_NAME, absoluteUrl } from '@/lib/seo';
import { HEALTH_CATEGORIES, healthArticlePath } from '@/lib/healthArticles';
import { getPublishedHealthArticles, healthArticleTimes } from '@/lib/healthArticleStore';

// 척추·관절 건강정보 글의 RSS 피드입니다.
// 네이버 서치어드바이저(요청 > RSS 제출)에 이 주소를 등록하면 새 글 수집이 빨라집니다.
export const dynamic = 'force-dynamic';

const escapeXml = (value: string) =>
  value.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');

export async function GET() {
  const articles = (await getPublishedHealthArticles()).slice(0, 50);
  const newest = articles.map((article) => healthArticleTimes(article).modified).sort().at(-1);

  const items = articles.map((article) => {
    const url = absoluteUrl(healthArticlePath(article.slug));
    return `    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${url}</link>
      <guid isPermaLink="true">${url}</guid>
      <pubDate>${new Date(healthArticleTimes(article).published).toUTCString()}</pubDate>
      <category>${escapeXml(`${HEALTH_CATEGORIES[article.category].name} 건강`)}</category>
      <description>${escapeXml(article.description || article.summary.join(' '))}</description>
    </item>`;
  });

  const xml = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom">
  <channel>
    <title>${escapeXml(`${SITE_NAME} 척추·관절 건강정보`)}</title>
    <link>${absoluteUrl('/health')}</link>
    <description>${escapeXml('신경외과·정형외과 전문의가 알려 주는 척추·관절 질환의 증상과 치료 기준')}</description>
    <language>ko</language>
    <atom:link href="${absoluteUrl('/rss.xml')}" rel="self" type="application/rss+xml" />
${newest ? `    <lastBuildDate>${new Date(newest).toUTCString()}</lastBuildDate>\n` : ''}${items.join('\n')}
  </channel>
</rss>
`;

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'no-store' } });
}
