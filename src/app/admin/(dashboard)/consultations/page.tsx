import Link from 'next/link';
import type { ReactNode } from 'react';
import { ArrowRight, CheckCircle2, LockKeyhole, PhoneCall } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import ConsultationAdminTabs from '@/components/admin/ConsultationAdminTabs';
import { requireAdmin } from '@/lib/adminAuth';

type SummaryCardProps = {
  title: string;
  label: string;
  description: string;
  pendingLabel: string;
  pendingCount: number;
  totalCount: number;
  href: string;
  icon: ReactNode;
  accentClass: string;
  items: string[];
};

function SummaryCard({
  title,
  label,
  description,
  pendingLabel,
  pendingCount,
  totalCount,
  href,
  icon,
  accentClass,
  items,
}: SummaryCardProps) {
  return (
    <article className="flex min-h-[390px] flex-col overflow-hidden rounded border border-slate-200 bg-white shadow-sm">
      <div className="flex-1 p-6 md:p-8">
        <div className={`flex h-12 w-12 items-center justify-center rounded ${accentClass}`}>{icon}</div>
        <p className="mt-6 text-xs font-black uppercase tracking-[0.15em] text-ink-muted">{label}</p>
        <h2 className="mt-2 text-2xl font-black tracking-tight text-ink">{title}</h2>
        <p className="mt-3 break-keep text-sm font-medium leading-6 text-ink-muted">{description}</p>

        <dl className="mt-7 grid grid-cols-2 gap-3">
          <div className="rounded bg-slate-50 px-4 py-4">
            <dt className="text-xs font-bold text-ink-muted">{pendingLabel}</dt>
            <dd className="mt-1 text-3xl font-black text-primary">{pendingCount}<span className="ml-1 text-sm text-ink-muted">건</span></dd>
          </div>
          <div className="rounded bg-slate-50 px-4 py-4">
            <dt className="text-xs font-bold text-ink-muted">전체 누적</dt>
            <dd className="mt-1 text-3xl font-black text-ink">{totalCount}<span className="ml-1 text-sm text-ink-muted">건</span></dd>
          </div>
        </dl>

        <ul className="mt-6 space-y-2.5">
          {items.map((item) => (
            <li key={item} className="flex items-start gap-2 text-sm font-medium leading-6 text-ink-sub">
              <CheckCircle2 size={16} className="mt-1 shrink-0 text-primary" /> {item}
            </li>
          ))}
        </ul>
      </div>
      <Link href={href} className="flex min-h-14 items-center justify-between border-t border-slate-200 bg-slate-50 px-6 py-4 text-sm font-black text-ink transition-colors hover:bg-primary hover:text-white md:px-8">
        {title} 관리 <ArrowRight size={18} />
      </Link>
    </article>
  );
}

export default async function ConsultationsOverviewPage() {
  await requireAdmin();

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
  const [generalTotal, generalPending, memberTotal, memberPending] = await Promise.all([
    supabase.from('consultations').select('id', { count: 'exact', head: true }),
    supabase.from('consultations').select('id', { count: 'exact', head: true }).eq('is_checked', false),
    supabase.from('consultation_posts').select('id', { count: 'exact', head: true }),
    supabase.from('consultation_posts').select('id', { count: 'exact', head: true }).eq('status', 'received'),
  ]);
  const hasError = [generalTotal, generalPending, memberTotal, memberPending].some((result) => result.error);

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white px-5 py-5 shadow-sm md:px-10 md:py-6">
        <h1 className="text-xl font-black tracking-tight text-ink md:text-2xl">상담 관리</h1>
        <p className="mt-1 text-sm font-medium text-ink-muted">일반 문의와 로그인 회원의 1:1 문의를 구분해 관리합니다.</p>
      </header>
      <ConsultationAdminTabs />

      <div className="mx-auto w-full max-w-6xl p-5 md:p-10">
        {hasError && (
          <div className="mb-6 rounded border border-amber-200 bg-amber-50 px-5 py-4 text-sm font-bold text-amber-800">
            일부 상담 현황을 불러오지 못했습니다. 목록 페이지에서 데이터베이스 연결을 확인해 주세요.
          </div>
        )}

        <div className="mb-7 rounded bg-navy-950 px-6 py-6 text-white shadow-lg md:px-8 md:py-7">
          <p className="text-xs font-black uppercase tracking-[0.18em] text-blue-300">Consultation Center</p>
          <div className="mt-3 flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-2xl font-black tracking-tight md:text-3xl">문의 유형에 맞게 처리해 주세요.</h2>
              <p className="mt-2 break-keep text-sm font-medium leading-6 text-slate-300">일반 문의는 연락 후 확인 처리하고, 회원 1:1 문의는 관리자 화면에서 답변을 등록합니다.</p>
            </div>
          </div>
        </div>

        <div className="grid gap-5 lg:grid-cols-2">
          <SummaryCard
            title="일반 문의"
            label="General / Quick Request"
            description="로그인 없이 홈페이지 하단 빠른 상담에서 접수된 콜백 요청입니다."
            pendingLabel="신규 접수"
            pendingCount={generalPending.count || 0}
            totalCount={generalTotal.count || 0}
            href="/admin/consultations/general"
            icon={<PhoneCall size={24} />}
            accentClass="bg-blue-50 text-blue-700"
            items={[
              '이름·연락처·희망일을 확인합니다.',
              '유선 안내 후 확인 완료로 변경합니다.',
            ]}
          />
          <SummaryCard
            title="회원 1:1 문의"
            label="Members-only Consultation"
            description="로그인한 회원이 남긴 비공개 상담입니다. 본문과 답변은 작성자 본인만 확인합니다."
            pendingLabel="답변 대기"
            pendingCount={memberPending.count || 0}
            totalCount={memberTotal.count || 0}
            href="/admin/consultations/member"
            icon={<LockKeyhole size={24} />}
            accentClass="bg-primary-light text-primary"
            items={[
              '비공개 상담 본문을 확인합니다.',
              '관리자 답변 저장 시 답변 완료로 변경됩니다.',
            ]}
          />
        </div>
      </div>
    </>
  );
}
