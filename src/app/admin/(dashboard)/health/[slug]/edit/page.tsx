import { notFound } from 'next/navigation';
import AdminHealthEditor from '@/components/admin/AdminHealthEditor';
import { requireAdmin } from '@/lib/adminAuth';
import { getAdminHealthArticle, listAdminHealthArticles } from '@/lib/adminHealthRepository';

export default async function AdminHealthEditPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdmin();
  const { slug } = await params;
  const [article, articles] = await Promise.all([getAdminHealthArticle(slug), listAdminHealthArticles()]);
  if (!article) notFound();
  return <AdminHealthEditor key={article.updatedAt} initialArticle={article} otherArticles={articles.filter((item) => item.slug !== slug).map(({ slug, title }) => ({ slug, title }))} />;
}
