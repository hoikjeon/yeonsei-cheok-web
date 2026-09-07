'use client';

export default function NewsError({ reset }: { reset: () => void }) {
  return <div role="alert" className="m-5 rounded-xl border border-rose-200 bg-white p-8 md:m-10"><h2 className="text-xl font-bold text-slate-900">게시물을 불러오지 못했습니다.</h2><p className="mt-3 text-sm text-slate-600">연결 상태를 확인한 뒤 다시 시도해주세요.</p><button type="button" onClick={reset} className="mt-5 rounded-lg bg-navy-950 px-5 py-3 text-sm font-bold text-white">다시 시도</button></div>;
}
