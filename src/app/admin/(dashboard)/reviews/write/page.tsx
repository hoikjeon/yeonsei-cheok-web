import { randomUUID } from 'node:crypto';
import AdminReviewEditor from '@/components/admin/AdminReviewEditor';
import { requireAdmin } from '@/lib/adminAuth';
import { safeReviewReturnTo } from '@/lib/adminReviews';

export default async function AdminReviewWritePage({ searchParams }: { searchParams: Promise<{ returnTo?: string }> }) {
  await requireAdmin();
  const { returnTo } = await searchParams;
  return <AdminReviewEditor postId={randomUUID()} returnTo={safeReviewReturnTo(returnTo)} />;
}
