'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { CalendarX, Send } from 'lucide-react';
import { changeAdminHealthPublish } from '@/app/admin/(dashboard)/health/actions';

/** 목록에서 예약 글을 바로 발행하거나, 예약을 취소해 임시저장으로 돌립니다. */
export default function HealthPublishButton({ slug, title, mode }: { slug: string; title: string; mode: 'now' | 'draft' }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);
  async function run() {
    const question = mode === 'now' ? `"${title}" 글을 지금 바로 홈페이지에 올릴까요?` : `"${title}" 글의 예약을 취소하고 임시저장으로 돌릴까요?`;
    if (!window.confirm(question)) return;
    setPending(true);
    try {
      const result = await changeAdminHealthPublish(slug, mode);
      if (!result.success) window.alert(result.error);
      router.refresh();
    } catch { window.alert('요청에 실패했습니다. 연결 상태를 확인하고 다시 시도해주세요.'); }
    finally { setPending(false); }
  }
  return mode === 'now'
    ? <button type="button" disabled={pending} onClick={run} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-bold text-emerald-700 hover:bg-emerald-50 disabled:opacity-50"><Send size={15} /> 지금 발행</button>
    : <button type="button" disabled={pending} onClick={run} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100 disabled:opacity-50"><CalendarX size={15} /> 예약 취소</button>;
}
