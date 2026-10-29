import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, ExternalLink, Pencil } from 'lucide-react';
import HealthArticleView from '@/components/HealthArticleView';
import { requireAdmin } from '@/lib/adminAuth';
import { getAdminHealthArticle, listAdminHealthArticles } from '@/lib/adminHealthRepository';
import { healthArticlePath, toKstDate, toKstTime } from '@/lib/healthArticles';
import { healthArticleStatus } from '@/lib/healthArticleRecord';

// 비공개 글도 홈페이지와 같은 모양으로 확인할 수 있는 관리자 미리보기입니다.
export default async function AdminHealthPreviewPage({ params }: { params: Promise<{ slug: string }> }) {
  await requireAdmin();
  const { slug } = await params;
  const [article, articles] = await Promise.all([getAdminHealthArticle(slug), listAdminHealthArticles()]);
  if (!article) notFound();
  const status = healthArticleStatus(article);
  const relatedArticles = article.relatedSlugs
    .map((relatedSlug) => articles.find((item) => item.slug === relatedSlug))
    .filter((related) => related !== undefined);

  return <>
    <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 bg-white px-5 py-4 md:px-10">
      <div className="flex items-center gap-3">
        <Link href="/admin/health" className="inline-flex items-center gap-1 text-sm font-bold text-slate-500 hover:text-slate-800"><ArrowLeft size={16} /> 목록</Link>
        <span className={`rounded-full px-2.5 py-1 text-xs font-bold ${status === 'published' ? 'bg-emerald-50 text-emerald-700' : status === 'scheduled' ? 'bg-blue-50 text-blue-700' : 'bg-slate-100 text-slate-500'}`}>{status === 'published' ? '공개 중' : status === 'scheduled' ? `예약 · ${toKstDate(article.publishAt)} ${toKstTime(article.publishAt)} 발행` : '임시저장 · 홈페이지에 보이지 않음'}</span>
      </div>
      <div className="flex gap-2">
        {status === 'published' && <Link href={healthArticlePath(article.slug)} target="_blank" className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-bold text-slate-700"><ExternalLink size={15} /> 홈페이지에서 보기</Link>}
        <Link href={`/admin/health/${article.slug}/edit`} className="inline-flex items-center gap-1 rounded-lg bg-navy-950 px-4 py-2.5 text-sm font-bold text-white"><Pencil size={15} /> 수정</Link>
      </div>
    </header>
    <div className="bg-white py-4">
      <HealthArticleView article={article} relatedArticles={relatedArticles} />
    </div>
  </>;
}
