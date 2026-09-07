'use client';

import { useId, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2 } from 'lucide-react';
import { deleteAdminNews } from '@/app/admin/(dashboard)/news/actions';
import { safeNewsReturnTo, type AdminNewsType } from '@/lib/adminNews';

export default function DeleteNewsButton({ id, type, title, returnTo }: { id: string; type: AdminNewsType; title: string; returnTo: string }) {
  const dialog = useRef<HTMLDialogElement>(null);
  const headingId = useId();
  const router = useRouter();
  const [pending, setPending] = useState(false);
  const [error, setError] = useState('');
  async function remove() {
    setPending(true);
    setError('');
    try {
      const result = await deleteAdminNews(id, type);
      if (!result.success) { setError(result.error); return; }
      try { localStorage.removeItem(`ys-news-draft:${type}:${id}`); } catch { /* Storage can be disabled. */ }
      dialog.current?.close();
      const target = new URL(safeNewsReturnTo(returnTo), window.location.origin);
      target.searchParams.set('deleted', '1');
      if (result.warning) target.searchParams.set('cleanup', 'pending');
      router.replace(target.pathname + target.search);
      router.refresh();
    } catch { setError('삭제 요청에 실패했습니다. 연결 상태를 확인하고 다시 시도해주세요.'); }
    finally { setPending(false); }
  }
  return <>
    <button type="button" onClick={() => { setError(''); dialog.current?.showModal(); }} className="inline-flex items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50" aria-label={`${title} 삭제`}><Trash2 size={15} /> 삭제</button>
    <dialog ref={dialog} aria-labelledby={headingId} onCancel={(event) => { if (pending) event.preventDefault(); }} className="m-auto w-[calc(100%-2rem)] max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-2xl backdrop:bg-slate-950/50">
      <h2 id={headingId} className="text-xl font-extrabold text-slate-900">게시물을 삭제할까요?</h2>
      <p className="mt-4 break-words rounded-lg bg-slate-50 p-4 font-bold text-slate-700">{title}</p>
      <p className="mt-4 text-sm leading-6 text-slate-600">홈페이지에서도 삭제되며 복구할 수 없습니다.</p>
      {error && <p role="alert" className="mt-4 text-sm text-rose-700">{error}</p>}
      <div className="mt-6 flex justify-end gap-2">
        <button type="button" disabled={pending} onClick={() => dialog.current?.close()} className="rounded-lg bg-slate-100 px-5 py-3 font-bold disabled:opacity-50">취소</button>
        <button type="button" disabled={pending} onClick={remove} className="rounded-lg bg-rose-600 px-5 py-3 font-bold text-white disabled:opacity-50">{pending ? '삭제 중…' : '영구 삭제'}</button>
      </div>
    </dialog>
  </>;
}
