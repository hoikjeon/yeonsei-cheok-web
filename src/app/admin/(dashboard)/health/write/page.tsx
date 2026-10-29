import AdminHealthEditor from '@/components/admin/AdminHealthEditor';
import { requireAdmin } from '@/lib/adminAuth';
import { listAdminHealthArticles } from '@/lib/adminHealthRepository';

export default async function AdminHealthWritePage() {
  await requireAdmin();
  const articles = await listAdminHealthArticles();
  return <AdminHealthEditor otherArticles={articles.map(({ slug, title }) => ({ slug, title }))} />;
}
