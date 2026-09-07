import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, Pencil } from 'lucide-react';
import { requireAdmin } from '@/lib/adminAuth';
import { safeReviewReturnTo, validReviewId } from '@/lib/adminReviews';
import { getAdminReview } from '@/lib/adminReviewsRepository';
import DeleteReviewButton from '@/components/admin/DeleteReviewButton';
import ReviewArticlePreview from '@/components/admin/ReviewArticlePreview';

export default async function AdminReviewDetailPage({ params, searchParams }: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ returnTo?: string }>;
}) {
  await requireAdmin();
  const { id } = await params;
  if (!validReviewId(id)) notFound();
  const item = await getAdminReview(id);
  if (!item) notFound();
  const { returnTo } = await searchParams;
  const back = safeReviewReturnTo(returnTo);
  return <>
    <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-5 md:px-10">
      <div><p className="text-xs font-bold text-primary">치료체험후기 관리</p><h1 className="mt-1 text-xl font-black text-slate-900">후기 상세 보기</h1></div>
      <div className="flex flex-wrap gap-2"><Link href={`/admin/reviews/${id}/edit?returnTo=${encodeURIComponent(back)}`} className="inline-flex items-center gap-2 rounded-lg bg-navy-950 px-4 py-2 text-sm font-bold text-white"><Pencil size={16} /> 수정</Link><DeleteReviewButton id={id} title={item.title} returnTo={back} /></div>
    </header>
    <div className="mx-auto w-full max-w-5xl space-y-5 p-5 md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-3"><Link href={back} className="inline-flex items-center gap-2 text-sm font-bold text-slate-500"><ArrowLeft size={17} /> 후기 목록으로</Link><Link href={`/board/reviews/${id}`} target="_blank" className="inline-flex items-center gap-2 text-sm font-bold text-primary">홈페이지 상세 보기 <ExternalLink size={15} /></Link></div>
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500"><span>진료 과목 {item.category}</span><time dateTime={item.created_at}>등록일 {new Date(item.created_at).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</time></div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><ReviewArticlePreview category={item.category} title={item.title} content={item.content} images={item.image_urls || []} /></div>
    </div>
  </>;
}
