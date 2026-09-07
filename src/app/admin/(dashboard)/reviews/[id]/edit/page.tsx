import { notFound } from 'next/navigation';
import AdminReviewEditor from '@/components/admin/AdminReviewEditor';
import { requireAdmin } from '@/lib/adminAuth';
import { safeReviewReturnTo, validReviewId } from '@/lib/adminReviews';
import { getAdminReview } from '@/lib/adminReviewsRepository';

export default async function EditReviewPage({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ returnTo?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  if (!validReviewId(id)) notFound();
  const item = await getAdminReview(id);
  if (!item) notFound();
  const { returnTo } = await searchParams;
  return <AdminReviewEditor key={id} postId={id} initialReview={item} returnTo={safeReviewReturnTo(returnTo)} />;
}
