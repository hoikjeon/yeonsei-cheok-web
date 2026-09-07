import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, Pencil, Pin } from 'lucide-react';
import { requireAdmin } from '@/lib/adminAuth';
import { adminNewsConfig, isAdminNewsType, safeNewsReturnTo, validNewsId } from '@/lib/adminNews';
import { getAdminNewsItem } from '@/lib/adminNewsRepository';
import DeleteNewsButton from '@/components/admin/DeleteNewsButton';
import NewsArticlePreview from '@/components/admin/NewsArticlePreview';

export default async function NewsDetailPage({ params, searchParams }: {
  params: Promise<{ type: string; id: string }>;
  searchParams: Promise<{ returnTo?: string }>;
}) {
  await requireAdmin();
  const { type, id } = await params;
  if (!isAdminNewsType(type) || !validNewsId(id)) notFound();
  const item = await getAdminNewsItem(id, type);
  if (!item) notFound();
  const { returnTo } = await searchParams;
  const back = safeNewsReturnTo(returnTo, `/admin/news?type=${type}`);
  return <>
    <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-5 md:px-10">
      <div><p className="text-xs font-bold text-primary">병원소식 관리</p><h1 className="mt-1 text-xl font-black text-slate-900">{adminNewsConfig[type].label} 상세 보기</h1></div>
      <div className="flex flex-wrap gap-2"><Link href={`/admin/news/${type}/${id}/edit?returnTo=${encodeURIComponent(back)}`} className="inline-flex items-center gap-2 rounded-lg bg-navy-950 px-4 py-2 text-sm font-bold text-white"><Pencil size={16} /> 수정</Link><DeleteNewsButton id={id} type={type} title={item.title} returnTo={back} /></div>
    </header>
    <div className="mx-auto w-full max-w-5xl space-y-5 p-5 md:p-10">
      <div className="flex flex-wrap items-center justify-between gap-3"><Link href={back} className="inline-flex items-center gap-2 text-sm font-bold text-slate-500"><ArrowLeft size={17} /> 게시물 목록으로</Link><Link href={`/news/${type}/${id}`} target="_blank" className="inline-flex items-center gap-2 text-sm font-bold text-primary">홈페이지에서 보기 <ExternalLink size={15} /></Link></div>
      <div className="flex flex-wrap items-center gap-4 text-xs text-slate-500"><time dateTime={item.created_at}>등록일 {new Date(item.created_at).toLocaleString('ko-KR', { timeZone: 'Asia/Seoul' })}</time>{item.type === 'notice_pinned' && <span className="inline-flex items-center gap-1 font-bold text-primary"><Pin size={13} /> 상단 고정</span>}</div>
      <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm"><NewsArticlePreview type={type} title={item.title} content={item.content} images={item.image_urls || []} videoUrl={item.video_url} sourceName={item.source_name} sourceUrl={item.source_url} /></div>
    </div>
  </>;
}
