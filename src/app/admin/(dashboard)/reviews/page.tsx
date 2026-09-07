import Link from 'next/link';
import Form from 'next/form';
import { ArrowRight, ExternalLink, ImageIcon, Pencil, Plus, Search } from 'lucide-react';
import { requireAdmin } from '@/lib/adminAuth';
import { isReviewCategory, reviewCategories } from '@/lib/adminReviews';
import { listAdminReviews } from '@/lib/adminReviewsRepository';
import DeleteReviewButton from '@/components/admin/DeleteReviewButton';

export default async function AdminReviewsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdmin();
  const params = await searchParams;
  const single = (key: string) => typeof params[key] === 'string' ? params[key] as string : '';
  const category = isReviewCategory(single('category')) ? single('category') as (typeof reviewCategories)[number] : undefined;
  const keyword = single('q').trim().slice(0, 200);
  const oldest = single('sort') === 'oldest';
  const page = Math.min(100_000, Math.max(1, Number.parseInt(single('page'), 10) || 1));
  let result: Awaited<ReturnType<typeof listAdminReviews>> = { items: [], total: 0, currentPage: 1, pageSize: 20 };
  let error = '';
  try { result = await listAdminReviews({ category, keyword, page, oldest }); }
  catch (loadError) { error = loadError instanceof Error ? loadError.message : '치료체험후기를 불러오지 못했습니다.'; }

  const hrefFor = (changes: Record<string, string | undefined> = {}) => {
    const values: Record<string, string | undefined> = { category, q: keyword || undefined, sort: oldest ? 'oldest' : undefined, page: result.currentPage > 1 ? String(result.currentPage) : undefined, ...changes };
    const query = new URLSearchParams(Object.entries(values).filter((pair): pair is [string, string] => Boolean(pair[1])));
    return '/admin/reviews' + (query.size ? `?${query}` : '');
  };
  const returnTo = hrefFor();
  const totalPages = Math.max(1, Math.ceil(result.total / result.pageSize));
  const startPage = Math.max(1, Math.min(result.currentPage - 2, totalPages - 4));

  return <>
    <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-5 md:px-10">
      <div><Link href="/admin" className="text-xs font-bold text-slate-500 md:hidden">관리자 홈으로</Link><h1 className="text-2xl font-black text-slate-900">치료체험후기 관리</h1><p className="mt-1 text-sm text-slate-500">회원과 관리자가 등록한 후기를 확인하고 수정하거나 삭제하세요.</p></div>
      <Link href={`/admin/reviews/write?returnTo=${encodeURIComponent(returnTo)}`} className="inline-flex items-center gap-2 rounded-lg bg-navy-950 px-5 py-3 text-sm font-bold text-white"><Plus size={18} /> 새 후기 등록</Link>
    </header>
    <div className="mx-auto w-full max-w-7xl space-y-6 p-5 md:p-10">
      {(single('saved') || single('deleted')) && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-800">{single('deleted') ? '치료체험후기가 삭제되었습니다.' : '치료체험후기가 저장되었습니다.'}{single('cleanup') === 'pending' && <p className="mt-1 font-normal">일부 이전 이미지 파일 정리는 완료하지 못했습니다.</p>}</div>}
      <nav aria-label="진료 과목 필터" className="flex flex-wrap gap-2">
        {[undefined, ...reviewCategories].map((item) => <Link key={item || 'all'} href={hrefFor({ category: item, page: undefined })} aria-current={category === item ? 'page' : undefined} className={`rounded-full border px-4 py-2.5 text-sm font-bold transition ${category === item ? 'border-navy-950 bg-navy-950 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300'}`}>{item || '전체'}</Link>)}
      </nav>
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 p-5">
          <p className="text-sm text-slate-600">{keyword ? '검색 결과' : '등록된 후기'} <strong className="text-lg text-slate-900">{result.total}</strong>건</p>
          <Form action="/admin/reviews" className="flex w-full flex-wrap gap-2 sm:w-auto">
            {category && <input type="hidden" name="category" value={category} />}
            <input name="q" aria-label="후기 제목 또는 내용 검색" defaultValue={keyword} key={keyword} maxLength={200} placeholder="제목 또는 내용 검색" className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm sm:w-60" />
            <select name="sort" aria-label="후기 정렬" defaultValue={oldest ? 'oldest' : 'newest'} key={String(oldest)} className="rounded-lg border border-slate-200 px-3 text-sm"><option value="newest">최신순</option><option value="oldest">오래된순</option></select>
            <button className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-bold"><Search size={16} /> 검색</button>
            {keyword && <Link href={hrefFor({ q: undefined, page: undefined })} className="self-center px-2 text-sm text-slate-500 underline">초기화</Link>}
          </Form>
        </div>
        {error ? <div role="alert" className="p-10 text-center text-rose-700"><p>{error}</p><Link href={returnTo} className="mt-4 inline-block rounded-lg bg-slate-100 px-4 py-2 font-bold">다시 불러오기</Link></div> : result.items.length === 0 ? <div className="px-5 py-20 text-center"><ImageIcon className="mx-auto mb-4 text-slate-300" size={38} /><p className="font-bold text-slate-700">{keyword ? '검색 결과가 없습니다.' : '등록된 치료체험후기가 없습니다.'}</p><p className="mt-2 text-sm text-slate-500">{keyword ? '다른 검색어나 진료 과목으로 다시 찾아보세요.' : '상단의 새 후기 등록 버튼으로 첫 후기를 작성하세요.'}</p></div> : <>
          <div className="hidden grid-cols-[76px_100px_minmax(0,1fr)_110px_220px] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-bold text-slate-500 lg:grid"><span>이미지</span><span>진료 과목</span><span>제목</span><span>등록일</span><span>관리</span></div>
          <div className="divide-y divide-slate-100">{result.items.map((item) => {
            const detail = `/admin/reviews/${item.id}?returnTo=${encodeURIComponent(returnTo)}`;
            const edit = `/admin/reviews/${item.id}/edit?returnTo=${encodeURIComponent(returnTo)}`;
            return <div key={item.id} id={`review-${item.id}`} className={`grid grid-cols-[64px_minmax(0,1fr)] items-center gap-4 p-5 lg:grid-cols-[76px_100px_minmax(0,1fr)_110px_220px] ${single('saved') === item.id ? 'bg-blue-50/70' : 'hover:bg-slate-50/70'}`}>
              <Link href={detail} aria-label={`${item.title} 보기`} className="flex h-14 w-16 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {item.image_urls?.[0] ? <img src={item.image_urls[0]} alt="" className="h-full w-full object-cover" /> : <ImageIcon size={23} className="text-slate-300" />}
              </Link>
              <span className="hidden text-xs font-bold text-slate-500 lg:block">{item.category}</span>
              <div className="min-w-0"><p className="mb-1 text-xs text-slate-500 lg:hidden">{item.category} · {new Date(item.created_at).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' })}</p><Link href={detail} aria-label={item.title} className="line-clamp-2 break-words font-bold leading-6 text-slate-800 hover:text-primary">{item.title}</Link></div>
              <time dateTime={item.created_at} className="hidden text-xs text-slate-500 lg:block">{new Date(item.created_at).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' })}</time>
              <div className="col-span-2 flex flex-wrap justify-end gap-1 lg:col-span-1 lg:justify-start"><Link href={detail} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100"><ArrowRight size={15} /> 보기</Link><Link href={edit} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-bold text-primary hover:bg-blue-50"><Pencil size={15} /> 수정</Link><DeleteReviewButton id={item.id} title={item.title} returnTo={returnTo} /></div>
            </div>;
          })}</div>
        </>}
        {!error && totalPages > 1 && <nav aria-label="후기 페이지" className="flex flex-wrap items-center justify-center gap-2 border-t border-slate-100 p-5">
          {result.currentPage > 1 && <Link href={hrefFor({ page: String(result.currentPage - 1) })} className="rounded-lg px-3 py-2 text-sm">이전</Link>}
          {Array.from({ length: Math.min(5, totalPages) }, (_, index) => startPage + index).map((number) => <Link key={number} href={hrefFor({ page: String(number) })} aria-current={number === result.currentPage ? 'page' : undefined} className={`rounded-lg px-3.5 py-2 text-sm font-bold ${number === result.currentPage ? 'bg-navy-950 text-white' : 'bg-slate-100'}`}>{number}</Link>)}
          {result.currentPage < totalPages && <Link href={hrefFor({ page: String(result.currentPage + 1) })} className="rounded-lg px-3 py-2 text-sm">다음</Link>}
          <span className="ml-2 text-xs text-slate-500">{result.currentPage} / {totalPages} 페이지</span>
        </nav>}
      </section>
      <Link href="/board/reviews" target="_blank" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500">홈페이지에서 치료체험후기 보기 <ExternalLink size={15} /></Link>
    </div>
  </>;
}
