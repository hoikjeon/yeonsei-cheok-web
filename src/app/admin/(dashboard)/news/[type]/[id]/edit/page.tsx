import { notFound } from 'next/navigation';
import AdminNewsEditor from '@/components/admin/AdminNewsEditor';
import { requireAdmin } from '@/lib/adminAuth';
import { isAdminNewsType, safeNewsReturnTo, validNewsId } from '@/lib/adminNews';
import { getAdminNewsItem } from '@/lib/adminNewsRepository';

export default async function EditNewsPage({ params, searchParams }: {
  params: Promise<{ type: string; id: string }>;
  searchParams: Promise<{ returnTo?: string }>;
}) {
  await requireAdmin();
  const { type, id } = await params;
  if (!isAdminNewsType(type) || !validNewsId(id)) notFound();
  const item = await getAdminNewsItem(id, type);
  if (!item) notFound();
  const { returnTo } = await searchParams;
  return <AdminNewsEditor key={id} type={type} postId={id} initialPost={item} returnTo={safeNewsReturnTo(returnTo, `/admin/news?type=${type}`)} />;
}
