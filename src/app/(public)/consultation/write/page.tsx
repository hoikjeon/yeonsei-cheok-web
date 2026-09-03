import type { Metadata } from 'next';
import Link from 'next/link';
import { ChevronRight, Home, LockKeyhole } from 'lucide-react';
import { redirect } from 'next/navigation';
import ConsultationWriteForm from '@/components/ConsultationWriteForm';
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
  title: '온라인 상담 글쓰기 | 연세척병원',
  robots: { index: false, follow: false },
};

export default async function ConsultationWritePage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect('/login?next=/consultation/write&reason=consultation-private');
  }

  const memberName =
    typeof user.user_metadata?.full_name === 'string' && user.user_metadata.full_name.trim()
      ? user.user_metadata.full_name.trim()
      : '회원';
  const memberPhone =
    typeof user.user_metadata?.phone === 'string' ? user.user_metadata.phone.trim() : undefined;

  return (
    <main className="min-h-screen bg-slate-50">
      <nav className="border-b border-slate-200 bg-white">
        <div className="mx-auto flex max-w-7xl items-center gap-2 px-4 py-4 text-[13px] font-bold text-ink-muted sm:px-6 lg:px-10">
          <Link href="/" aria-label="홈으로" className="transition-colors hover:text-primary"><Home size={15} /></Link>
          <ChevronRight size={13} />
          <Link href="/consultation" className="transition-colors hover:text-primary">온라인 상담</Link>
          <ChevronRight size={13} />
          <span className="text-ink">글쓰기</span>
        </div>
      </nav>

      <section className="px-4 py-12 sm:px-6 sm:py-16 lg:py-20">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
          <header className="border-b border-slate-200 px-5 py-7 sm:px-9 sm:py-9">
            <div className="flex items-center gap-2 text-[13px] font-bold text-primary">
              <LockKeyhole size={16} /> 회원 전용 1:1 상담
            </div>
            <h1 className="mt-3 text-h2 tracking-tight text-ink">상담 내용을 작성해 주세요.</h1>
            <p className="mt-3 break-keep text-body leading-7 text-ink-muted">
              제목은 공개되며, 상세 내용과 병원 답변은 작성자 본인만 확인할 수 있습니다.
            </p>
          </header>
          <div className="px-5 py-7 sm:px-9 sm:py-10">
            <ConsultationWriteForm memberName={memberName} memberPhone={memberPhone} />
          </div>
        </div>
      </section>
    </main>
  );
}

