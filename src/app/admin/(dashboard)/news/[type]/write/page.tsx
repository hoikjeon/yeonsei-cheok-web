import { notFound } from 'next/navigation';
import { randomUUID } from 'node:crypto';
import AdminNewsEditor from '@/components/admin/AdminNewsEditor';
import { requireAdmin } from '@/lib/adminAuth';
import { isAdminNewsType, safeNewsReturnTo } from '@/lib/adminNews';

export default async function AdminNewsWritePage({
  params,
  searchParams,
}: {
  params: Promise<{ type: string }>;
  searchParams: Promise<{ returnTo?: string }>;
}) {
  await requireAdmin();

  const { type } = await params;
  if (!isAdminNewsType(type)) notFound();

  const { returnTo } = await searchParams;
  return <AdminNewsEditor type={type} postId={randomUUID()} returnTo={safeNewsReturnTo(returnTo, `/admin/news?type=${type}`)} />;
}
