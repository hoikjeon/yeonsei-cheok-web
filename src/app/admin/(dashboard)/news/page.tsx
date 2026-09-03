import Link from 'next/link';
import { ExternalLink, GraduationCap, Megaphone, Newspaper, PlaySquare, Plus, Stethoscope } from 'lucide-react';
import { requireAdmin } from '@/lib/adminAuth';
import { adminNewsConfig, type AdminNewsType } from '@/lib/adminNews';

const newsItems: Array<{
  type: AdminNewsType;
  icon: React.ReactNode;
  accent: string;
}> = [
  { type: 'notice', icon: <Megaphone size={24} />, accent: 'bg-blue-50 text-blue-600' },
  { type: 'media', icon: <Newspaper size={24} />, accent: 'bg-violet-50 text-violet-600' },
  { type: 'training', icon: <Stethoscope size={24} />, accent: 'bg-emerald-50 text-emerald-600' },
  { type: 'academic', icon: <GraduationCap size={24} />, accent: 'bg-amber-50 text-amber-600' },
  { type: 'youtube', icon: <PlaySquare size={24} />, accent: 'bg-red-50 text-red-600' },
];

export default async function AdminNewsPage() {
  await requireAdmin();

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white px-5 py-5 shadow-sm md:px-10 md:py-6">
        <h1 className="text-xl font-black tracking-tight text-ink md:text-2xl">병원소식 관리</h1>
        <p className="mt-1 text-sm font-medium text-ink-muted">홈페이지에 게시할 소식을 관리자만 등록할 수 있습니다.</p>
      </header>

      <div className="mx-auto w-full max-w-6xl p-5 md:p-10">
        <div className="mb-7 rounded bg-navy-950 p-6 text-white shadow-lg md:p-8">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-300">Hospital News</p>
          <h2 className="mt-3 text-2xl font-black tracking-tight md:text-3xl">게시판을 선택해 새 글을 등록하세요.</h2>
          <p className="mt-3 max-w-2xl break-keep text-sm font-medium leading-6 text-slate-300">등록된 글은 각 병원소식 게시판에 반영됩니다. 공개 홈페이지에서는 글을 작성할 수 없습니다.</p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {newsItems.map(({ type, icon, accent }) => {
            const config = adminNewsConfig[type];

            return (
              <section key={type} className="flex min-h-64 flex-col rounded border border-slate-200 bg-white p-6 shadow-sm">
                <div className={`flex h-12 w-12 items-center justify-center rounded ${accent}`}>{icon}</div>
                <h3 className="mt-5 text-xl font-black text-ink">{config.label}</h3>
                <p className="mt-2 flex-1 break-keep text-sm font-medium leading-6 text-ink-muted">{config.description}</p>
                <div className="mt-6 grid grid-cols-[1fr_auto] gap-2">
                  <Link href={`/admin/news/${type}/write`} className="inline-flex items-center justify-center gap-2 rounded bg-navy-950 px-4 py-3 text-sm font-black text-white transition hover:bg-primary">
                    <Plus size={17} /> 새 글 등록
                  </Link>
                  <Link href={config.publicPath} target="_blank" aria-label={`${config.label} 게시판 보기`} className="inline-flex h-11 w-11 items-center justify-center rounded bg-slate-100 text-ink-muted transition hover:bg-primary/10 hover:text-primary">
                    <ExternalLink size={17} />
                  </Link>
                </div>
              </section>
            );
          })}
        </div>
      </div>
    </>
  );
}
