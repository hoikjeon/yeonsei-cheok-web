import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import HealthTopicsManager from '@/components/admin/HealthTopicsManager';
import { requireAdmin } from '@/lib/adminAuth';
import { listHealthTopics, type HealthTopic } from '@/lib/adminHealthRepository';

export default async function AdminHealthTopicsPage() {
  await requireAdmin();
  let topics: HealthTopic[] = [];
  let error = '';
  try { topics = await listHealthTopics(); }
  catch (err) { error = err instanceof Error ? err.message : '주제 목록을 불러오지 못했습니다.'; }

  return <>
    <header className="sticky top-0 z-30 border-b border-slate-200 bg-white px-5 py-5 md:px-10">
      <p className="mb-1 text-xs font-bold text-primary">건강정보 관리</p>
      <h1 className="text-2xl font-black text-slate-900">자동 작성 주제</h1>
      <p className="mt-1 text-sm text-slate-500">여기 넣은 주제로 매일 오전 9시에 글이 한 편씩 자동으로 작성·발행됩니다.</p>
    </header>
    <div className="mx-auto w-full max-w-5xl space-y-5 p-5 md:p-8">
      <Link href="/admin/health" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-primary"><ArrowLeft size={17} /> 글 목록으로</Link>
      {error ? <div role="alert" className="rounded-xl border border-slate-200 bg-white p-10 text-center text-rose-700">{error}</div> : <HealthTopicsManager topics={topics} />}
    </div>
  </>;
}
