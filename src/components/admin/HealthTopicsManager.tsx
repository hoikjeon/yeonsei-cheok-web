'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, RotateCcw, Trash2 } from 'lucide-react';
import { addHealthTopics, deleteHealthTopic, retryHealthTopic } from '@/app/admin/(dashboard)/health/topics/actions';
import type { HealthTopic } from '@/lib/adminHealthRepository';

const STATUS: Record<HealthTopic['status'], { label: string; style: string }> = {
  queued: { label: '대기', style: 'bg-blue-50 text-blue-700' },
  processing: { label: '작성 중', style: 'bg-violet-50 text-violet-700' },
  done: { label: '완료', style: 'bg-emerald-50 text-emerald-700' },
  failed: { label: '실패', style: 'bg-rose-50 text-rose-700' },
};

export default function HealthTopicsManager({ topics }: { topics: HealthTopic[] }) {
  const router = useRouter();
  const [text, setText] = useState('');
  const [pending, setPending] = useState(false);
  const [message, setMessage] = useState<{ ok: boolean; text: string } | null>(null);

  async function add(event: React.FormEvent) {
    event.preventDefault();
    setPending(true);
    setMessage(null);
    try {
      const result = await addHealthTopics(text);
      if (!result.success) { setMessage({ ok: false, text: result.error }); return; }
      setText('');
      setMessage({ ok: true, text: `주제 ${result.added}개를 대기열에 넣었습니다.` });
      router.refresh();
    } catch { setMessage({ ok: false, text: '요청에 실패했습니다. 연결 상태를 확인해주세요.' }); }
    finally { setPending(false); }
  }
  async function run(action: () => Promise<{ success: boolean; error?: string }>) {
    const result = await action();
    if (!result.success) window.alert(result.error);
    router.refresh();
  }

  const queued = topics.filter((topic) => topic.status === 'queued' || topic.status === 'processing');
  const finished = topics.filter((topic) => topic.status === 'done' || topic.status === 'failed').reverse();

  return <div className="space-y-6">
    <form onSubmit={add} className="space-y-3 rounded-xl border border-slate-200 bg-white p-5 shadow-sm md:p-8">
      <label htmlFor="topics" className="block font-bold text-slate-900">주제 추가</label>
      <textarea id="topics" rows={6} value={text} onChange={(event) => setText(event.target.value)} disabled={pending}
        placeholder={'한 줄에 주제 하나씩 적어 주세요. 분류와 메모는 생략해도 됩니다.\n척추관협착증 걷기 운동, 하루에 얼마나 걸어야 할까 | 척추\n무릎 연골이 닳으면 다시 자라나요? | 관절 | 50~60대 대상\n부산 사상구에서 허리디스크 비수술 치료 받기 전 알아둘 점 | 척추'}
        className="w-full rounded-lg border border-slate-200 px-4 py-3 text-sm outline-none focus:border-blue-400 focus:ring-2 focus:ring-blue-100" />
      <p className="text-xs leading-5 text-slate-500">형식: <code>주제 | 척추 또는 관절 | 메모</code>. 자동 작성은 하루 1편(오전 9시)씩, 오래된 주제부터 하나씩 씁니다.</p>
      {message && <p role="status" className={`text-sm font-bold ${message.ok ? 'text-emerald-700' : 'text-rose-700'}`}>{message.text}</p>}
      <button disabled={pending || !text.trim()} className="inline-flex items-center gap-2 rounded-lg bg-navy-950 px-5 py-3 text-sm font-bold text-white disabled:opacity-50"><Plus size={17} /> {pending ? '추가 중…' : '대기열에 넣기'}</button>
    </form>

    <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <h2 className="border-b border-slate-200 p-5 font-bold text-slate-900">대기 중 <span className="text-slate-500">{queued.length}개 · 약 {queued.length}일치</span></h2>
      {queued.length === 0 ? <p className="p-10 text-center text-sm text-slate-500">대기 중인 주제가 없습니다. 주제가 없으면 자동 작성이 쉬게 됩니다.</p>
        : <ol className="divide-y divide-slate-100">{queued.map((topic, index) => <li key={topic.id} className="flex items-center gap-3 p-4">
          <span className="w-7 shrink-0 text-xs font-bold text-slate-400">{index + 1}</span>
          <div className="min-w-0 flex-1">
            <p className="break-words font-bold text-slate-800">{topic.topic}</p>
            <p className="mt-0.5 text-xs text-slate-500">{topic.category === 'joint' ? '관절' : topic.category === 'spine' ? '척추' : '분류 자동'}{topic.note ? ` · ${topic.note}` : ''}</p>
          </div>
          <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${STATUS[topic.status].style}`}>{STATUS[topic.status].label}</span>
          {topic.status === 'queued' && <button type="button" aria-label={`${topic.topic} 삭제`} onClick={() => { if (window.confirm('이 주제를 대기열에서 뺄까요?')) void run(() => deleteHealthTopic(topic.id)); }} className="rounded p-2 text-rose-600 hover:bg-rose-50"><Trash2 size={15} /></button>}
        </li>)}</ol>}
    </section>

    {finished.length > 0 && <section className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <h2 className="border-b border-slate-200 p-5 font-bold text-slate-900">작성 기록</h2>
      <ul className="divide-y divide-slate-100">{finished.slice(0, 100).map((topic) => <li key={topic.id} className="flex items-center gap-3 p-4">
        <div className="min-w-0 flex-1">
          <p className="break-words font-bold text-slate-800">{topic.topic}</p>
          {topic.status === 'done' && topic.article_slug && <Link href={`/admin/health/${topic.article_slug}/edit`} className="mt-0.5 inline-block text-xs font-bold text-primary underline">작성된 글 보기</Link>}
          {topic.status === 'failed' && <p className="mt-0.5 break-words text-xs text-rose-700">{topic.error}</p>}
        </div>
        <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-bold ${STATUS[topic.status].style}`}>{STATUS[topic.status].label}</span>
        {topic.status === 'failed' && <button type="button" onClick={() => void run(() => retryHealthTopic(topic.id))} className="inline-flex items-center gap-1 rounded-lg px-3 py-2 text-xs font-bold text-slate-700 hover:bg-slate-100"><RotateCcw size={14} /> 다시 시도</button>}
      </li>)}</ul>
    </section>}
  </div>;
}
