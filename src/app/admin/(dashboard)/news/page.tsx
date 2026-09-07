import Link from 'next/link';
import Form from 'next/form';
import { ExternalLink, ImageIcon, Plus, Search, Pin, ArrowRight, Pencil } from 'lucide-react';
import { requireAdmin } from '@/lib/adminAuth';
import { adminNewsConfig, adminNewsTypes, adminTypeForStoredType, isAdminNewsType } from '@/lib/adminNews';
import { listAdminNews } from '@/lib/adminNewsRepository';
import DeleteNewsButton from '@/components/admin/DeleteNewsButton';

export default async function AdminNewsPage({ searchParams }: { searchParams: Promise<Record<string, string | string[] | undefined>> }) {
  await requireAdmin();
  const params = await searchParams;
  const single = (key: string) => typeof params[key] === 'string' ? params[key] as string : '';
  const type = isAdminNewsType(single('type')) ? single('type') as (typeof adminNewsTypes)[number] : undefined;
  const keyword = single('q').trim().slice(0, 200);
  const oldest = single('sort') === 'oldest';
  const page = Math.min(100_000, Math.max(1, Number.parseInt(single('page'), 10) || 1));
  let result: Awaited<ReturnType<typeof listAdminNews>> = { items: [], total: 0, currentPage: 1, pageSize: 20 };
  let error = '';
  try { result = await listAdminNews({ type, keyword, page, oldest }); }
  catch (err) { error = err instanceof Error ? err.message : '게시물을 불러오지 못했습니다.'; }
  const hrefFor = (changes: Record<string, string | undefined> = {}) => {
    const values: Record<string, string | undefined> = { type, q: keyword || undefined, sort: oldest ? 'oldest' : undefined, page: result.currentPage > 1 ? String(result.currentPage) : undefined, ...changes };
    const query = new URLSearchParams(Object.entries(values).filter((pair): pair is [string, string] => Boolean(pair[1])));
    return '/admin/news' + (query.size ? `?${query}` : '');
  };
  const returnTo = hrefFor();
  const totalPages = Math.max(1, Math.ceil(result.total / result.pageSize));
  const startPage = Math.max(1, Math.min(result.currentPage - 2, totalPages - 4));
  return <>
    <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 bg-white px-5 py-5 md:px-10">
      <div><Link href="/admin" className="text-xs font-bold text-slate-500 md:hidden">관리자 홈으로</Link><h1 className="text-2xl font-black text-slate-900">병원소식 관리</h1><p className="mt-1 text-sm text-slate-500">게시한 소식을 확인하고 내용을 수정하거나 삭제하세요.</p></div>
      <details className="group relative">
        <summary className="flex cursor-pointer list-none items-center gap-2 rounded-lg bg-navy-950 px-5 py-3 text-sm font-bold text-white"><Plus size={18} /> 새 글 등록</summary>
        <div className="absolute right-0 top-full z-40 mt-2 w-56 rounded-xl border border-slate-200 bg-white p-2 shadow-xl">{adminNewsTypes.map((item) => <Link key={item} href={`/admin/news/${item}/write?returnTo=${encodeURIComponent(returnTo)}`} className="block rounded-lg px-4 py-3 text-sm font-bold text-slate-700 hover:bg-blue-50">{adminNewsConfig[item].label}</Link>)}</div>
      </details>
    </header>
    <div className="mx-auto w-full max-w-7xl space-y-6 p-5 md:p-10">
      {(single('saved') || single('deleted')) && <div role="status" className="rounded-xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm font-bold text-emerald-800">{single('deleted') ? '게시물이 삭제되었습니다.' : '게시물이 저장되었습니다.'}{single('cleanup') === 'pending' && <p className="mt-1 font-normal">일부 이전 이미지 파일 정리는 완료하지 못했습니다.</p>}</div>}
      <nav aria-label="게시판 필터" className="flex flex-wrap gap-2">
        {[undefined, ...adminNewsTypes].map((item) => <Link key={item || 'all'} href={hrefFor({ type: item, page: undefined })} aria-current={type === item ? 'page' : undefined} className={`rounded-full border px-4 py-2.5 text-sm font-bold transition ${type === item ? 'border-navy-950 bg-navy-950 text-white' : 'border-slate-200 bg-white text-slate-600 hover:border-blue-300'}`}>{item ? adminNewsConfig[item].label : '전체'}</Link>)}
      </nav>
      <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-slate-200 p-5">
          <p className="text-sm text-slate-600">{keyword ? '검색 결과' : '등록된 게시물'} <strong className="text-lg text-slate-900">{result.total}</strong>건</p>
          <Form action="/admin/news" className="flex w-full flex-wrap gap-2 sm:w-auto">
            {type && <input type="hidden" name="type" value={type} />}
            <input name="q" aria-label="제목 또는 내용 검색" defaultValue={keyword} key={keyword} maxLength={200} placeholder="제목 또는 내용 검색" className="min-w-0 flex-1 rounded-lg border border-slate-200 px-3 py-2.5 text-sm sm:w-60" />
            <select name="sort" aria-label="게시물 정렬" defaultValue={oldest ? 'oldest' : 'newest'} key={String(oldest)} className="rounded-lg border border-slate-200 px-3 text-sm"><option value="newest">최신순</option><option value="oldest">오래된순</option></select>
            <button className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-4 py-2.5 text-sm font-bold"><Search size={16} /> 검색</button>
            {keyword && <Link href={hrefFor({ q: undefined, page: undefined })} className="self-center px-2 text-sm text-slate-500 underline">초기화</Link>}
          </Form>
        </div>
        {error ? <div role="alert" className="p-10 text-center text-rose-700"><p>{error}</p><Link href={returnTo} className="mt-4 inline-block rounded-lg bg-slate-100 px-4 py-2 font-bold">다시 불러오기</Link></div> : result.items.length === 0 ? <div className="px-5 py-20 text-center"><ImageIcon className="mx-auto mb-4 text-slate-300" size={38} /><p className="font-bold text-slate-700">{keyword ? '검색 결과가 없습니다.' : '등록된 게시물이 없습니다.'}</p><p className="mt-2 text-sm text-slate-500">{keyword ? '다른 검색어나 게시판으로 다시 찾아보세요.' : '상단의 새 글 등록 버튼으로 첫 소식을 작성하세요.'}</p></div> : <>
          <div className="hidden grid-cols-[76px_130px_minmax(0,1fr)_110px_220px] gap-4 border-b border-slate-100 bg-slate-50 px-5 py-3 text-xs font-bold text-slate-500 lg:grid"><span>이미지</span><span>게시판</span><span>제목</span><span>등록일</span><span>관리</span></div>
          <div className="divide-y divide-slate-100">{result.items.map((item) => {
            const board = adminTypeForStoredType(item.type)!;
            const detail = `/admin/news/${board}/${item.id}?returnTo=${encodeURIComponent(returnTo)}`;
            const edit = `/admin/news/${board}/${item.id}/edit?returnTo=${encodeURIComponent(returnTo)}`;
            return <div key={item.id} id={`news-${item.id}`} className={`grid grid-cols-[64px_minmax(0,1fr)] items-center gap-4 p-5 lg:grid-cols-[76px_130px_minmax(0,1fr)_110px_220px] ${single('saved') === item.id ? 'bg-blue-50/70' : 'hover:bg-slate-50/70'}`}>
              <Link href={detail} aria-label={`${item.title} 보기`} className="flex h-14 w-16 items-center justify-center overflow-hidden rounded-lg bg-slate-100">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                {item.image_urls?.[0] ? <img src={item.image_urls[0]} alt="" className="h-full w-full object-cover" /> : <ImageIcon size={23} className="text-slate-300" />}
              </Link>
              <span className="hidden text-xs font-bold text-slate-500 lg:block">{adminNewsConfig[board].label}</span>
              <div className="min-w-0"><p className="mb-1 text-xs text-slate-500 lg:hidden">{adminNewsConfig[board].label} · {new Date(item.created_at).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' })}</p><Link href={detail} aria-label={item.title} className="line-clamp-2 break-words font-bold leading-6 text-slate-800 hover:text-primary">{item.type === 'notice_pinned' && <Pin size={14} aria-label="상단 고정" className="mr-1 inline text-primary" />}{item.title}</Link>{board === 'media' && item.source_name && <p className="mt-1 text-xs text-slate-500">{item.source_name}</p>}</div>
              <time dateTime={item.created_at} className="hidden text-xs text-slate-500 lg:block">{new Date(item.created_at).toLocaleDateString('ko-KR', { timeZone: 'Asia/Seoul' })}</time>
              <div className="col-span-2 flex flex-wrap justify-end gap-1 lg:col-span-1 lg:justify-start"><Link href={detail} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100"><ArrowRight size={15} /> 보기</Link><Link href={edit} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-bold text-primary hover:bg-blue-50"><Pencil size={15} /> 수정</Link><DeleteNewsButton id={item.id} type={board} title={item.title} returnTo={returnTo} /></div>
            </div>;
          })}</div>
        </>}
        {!error && totalPages > 1 && <nav aria-label="게시물 페이지" className="flex flex-wrap items-center justify-center gap-2 border-t border-slate-100 p-5">
          {result.currentPage > 1 && <Link href={hrefFor({ page: String(result.currentPage - 1) })} className="rounded-lg px-3 py-2 text-sm">이전</Link>}
          {Array.from({ length: Math.min(5, totalPages) }, (_, index) => startPage + index).map((number) => <Link key={number} href={hrefFor({ page: String(number) })} aria-current={number === result.currentPage ? 'page' : undefined} className={`rounded-lg px-3.5 py-2 text-sm font-bold ${number === result.currentPage ? 'bg-navy-950 text-white' : 'bg-slate-100'}`}>{number}</Link>)}
          {result.currentPage < totalPages && <Link href={hrefFor({ page: String(result.currentPage + 1) })} className="rounded-lg px-3 py-2 text-sm">다음</Link>}
          <span className="ml-2 text-xs text-slate-500">{result.currentPage} / {totalPages} 페이지</span>
        </nav>}
      </section>
      {type && <Link href={adminNewsConfig[type].publicPath} target="_blank" className="inline-flex items-center gap-2 text-sm font-bold text-slate-500">홈페이지에서 {adminNewsConfig[type].label} 보기 <ExternalLink size={15} /></Link>}
    </div>
  </>;
}
