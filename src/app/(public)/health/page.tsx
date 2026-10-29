import JsonLd from '@/components/JsonLd';
import SubHero from '@/components/SubHero';
import { createPageMetadata } from '@/lib/seo';
import { buildHealthHubStructuredData } from '@/lib/structuredData';
import { DEFAULT_HEALTH_THUMBNAIL, healthArticlePath } from '@/lib/healthArticles';
import { getPublishedHealthArticles } from '@/lib/healthArticleStore';
import HealthMagazine from './HealthMagazine';

const PAGE = {
  name: '척추·관절 건강정보',
  description: '허리디스크, 척추관협착증, 목디스크 등 척추·관절 건강에 관한 궁금증을 알기 쉽게 정리한 연세척병원 건강 매거진입니다.',
  path: '/health',
};
// 예약 글이 발행 시각 뒤 5분 안에 목록에 보이도록 다시 만듭니다.
export const revalidate = 300;
export const metadata = createPageMetadata({ title: PAGE.name, description: PAGE.description, path: PAGE.path });

export default async function HealthHubPage() {
  const articles = await getPublishedHealthArticles();
  return <>
    <JsonLd data={buildHealthHubStructuredData({
      page: PAGE,
      articles: articles.map(article => ({ name: article.title, path: healthArticlePath(article.slug) })),
    })} />
    <SubHero
      title="건강정보"
      subtitle={'건강한 일상을 위한 척추·관절 이야기\n궁금했던 증상과 치료 정보를 알기 쉽게 전해드립니다.'}
      path={[{ name: '커뮤니티' }, { name: '건강정보' }]}
      ambientImage="/images/about/health-hub-banner.webp"
    />
    <HealthMagazine articles={articles.map(article => ({
      slug: article.slug,
      title: article.title,
      description: article.description,
      category: article.category,
      publishedAt: article.publishedAt,
      keywords: article.keywords,
      thumbnail: article.thumbnail ?? article.heroImage?.src ?? DEFAULT_HEALTH_THUMBNAIL.src,
      thumbnailPosition: article.thumbnail ? article.thumbnailPosition ?? 'center' : article.heroImage ? article.heroImage.position ?? 'center' : DEFAULT_HEALTH_THUMBNAIL.position,
    }))} />
  </>;
}
