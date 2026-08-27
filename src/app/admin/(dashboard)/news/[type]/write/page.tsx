import { notFound } from 'next/navigation';
import AdminNewsEditor from '@/components/admin/AdminNewsEditor';
import { requireAdmin } from '@/lib/adminAuth';
import { isAdminNewsType } from '@/lib/adminNews';

export default async function AdminNewsWritePage({
  params,
}: {
  params: Promise<{ type: string }>;
}) {
  await requireAdmin();

  const { type } = await params;
  if (!isAdminNewsType(type)) notFound();

  return <AdminNewsEditor type={type} />;
}
