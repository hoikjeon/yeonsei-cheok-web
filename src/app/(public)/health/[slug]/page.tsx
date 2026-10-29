import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import HealthArticleView from '@/components/HealthArticleView';
import JsonLd from '@/components/JsonLd';
import { absoluteUrl, createPageMetadata } from '@/lib/seo';
import { buildHealthArticleStructuredData } from '@/lib/structuredData';
import { getHealthReviewer, healthArticlePath, type HealthArticle } from '@/lib/healthArticles';
import { getPublishedHealthArticle, getPublishedHealthArticles } from '@/lib/healthArticleStore';

type ArticlePageProps = { params: Promise<{ slug: string }> };

// 관리자에서 새로 공개한 글은 빌드 목록에 없어도 첫 방문 때 만들어집니다.
export const dynamicParams = true;
// 예약 글이 발행 시각 뒤 5분 안에 보이도록 다시 만듭니다. (healthArticleStore 의 캐시 시간과 같게 둡니다)
export const revalidate = 300;

/** 공유 미리보기 이미지: 대표 이미지 → 목록 썸네일 순 */
function shareImage(article: HealthArticle) {
  const src = article.heroImage?.src ?? article.thumbnail;
  return src ? (src.startsWith('/') ? absoluteUrl(src) : src) : undefined;
}

export async function generateStaticParams() {
  return (await getPublishedHealthArticles()).map((article) => ({ slug: article.slug }));
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const { slug } = await params;
  const article = await getPublishedHealthArticle(slug);
  if (!article) return {};

  return createPageMetadata({
    title: article.seoTitle ?? article.title,
    description: article.description,
    path: healthArticlePath(article.slug),
    image: shareImage(article),
    type: 'article',
  });
}

export default async function HealthArticlePage({ params }: ArticlePageProps) {
  const { slug } = await params;
  const articles = await getPublishedHealthArticles();
  const article = articles.find((item) => item.slug === slug);
  if (!article) notFound();

  const reviewer = getHealthReviewer(article);
  const path = healthArticlePath(article.slug);
  const relatedArticles = article.relatedSlugs
    .map((relatedSlug) => articles.find((item) => item.slug === relatedSlug))
    .filter((related) => related !== undefined);
  // 오른쪽 칸: 같은 분류의 최신 글을 먼저, 모자라면 다른 분류로 채웁니다.
  const others = articles.filter((item) => item.slug !== article.slug);
  const moreArticles = [...others.filter((item) => item.category === article.category), ...others.filter((item) => item.category !== article.category)]
    .slice(0, 4)
    .map(({ slug, title, thumbnail, thumbnailPosition }) => ({ slug, title, thumbnail, thumbnailPosition }));

  const breadcrumb = [
    { name: '홈', path: '/' },
    { name: '척추·관절 건강정보', path: '/health' },
    { name: article.title, path },
  ];

  return (
    <>
      <JsonLd
        data={buildHealthArticleStructuredData({
          page: {
            name: article.title,
            description: article.description,
            path,
            datePublished: article.publishedAt,
            lastReviewed: article.reviewedAt,
            keywords: article.keywords,
          },
          reviewerId: reviewer?.id,
          image: shareImage(article),
          breadcrumb,
          faq: article.faq,
          references: article.references.map((reference) => reference.label),
        })}
      />
      <HealthArticleView article={article} relatedArticles={relatedArticles} moreArticles={moreArticles} />
    </>
  );
}
