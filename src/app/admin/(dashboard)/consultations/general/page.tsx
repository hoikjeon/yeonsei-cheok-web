import Link from 'next/link';
import { CheckCircle2, ChevronDown, PhoneCall, Search } from 'lucide-react';
import { createClient } from '@supabase/supabase-js';
import ConsultationAdminTabs from '@/components/admin/ConsultationAdminTabs';
import { requireAdmin } from '@/lib/adminAuth';
import { toggleGeneralConsultation } from './actions';

type GeneralConsultation = {
  id: string;
  name: string;
  phone: string;
  message: string | null;
  consultation_type: string | null;
  preferred_date: string | null;
  marketing_agreed: boolean | null;
  is_checked: boolean;
  created_at: string;
};

type FilterStatus = 'all' | 'pending' | 'checked';

function formatDate(value: string) {
  return new Date(value).toLocaleString('ko-KR', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });
}

function formatPreferredDate(value: string | null) {
  if (!value) return '미입력';
  return new Date(`${value}T00:00:00`).toLocaleDateString('ko-KR', { dateStyle: 'medium' });
}

function filterHref(status: FilterStatus, searchTerm: string) {
  const query = new URLSearchParams();
  if (status !== 'all') query.set('status', status);
  if (searchTerm) query.set('q', searchTerm);
  const value = query.toString();
  return value ? `/admin/consultations/general?${value}` : '/admin/consultations/general';
}

const errorMessages: Record<string, string> = {
  'invalid-id': '잘못된 상담 번호입니다.',
  'database-config': '데이터베이스 연결 설정을 확인해 주세요.',
  'update-failed': '상담 상태를 변경하지 못했습니다.',
};

export default async function GeneralConsultationsAdminPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; status?: string; error?: string }>;
}) {
  await requireAdmin();
  const params = await searchParams;
  const searchTerm = (params.q || '').trim().slice(0, 80);
  const status: FilterStatus = params.status === 'pending' || params.status === 'checked'
    ? params.status
    : 'all';

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    { auth: { autoRefreshToken: false, persistSession: false } },
  );
  const { data, error } = await supabase
    .from('consultations')
    .select('id,name,phone,message,consultation_type,preferred_date,marketing_agreed,is_checked,created_at')
    .order('created_at', { ascending: false })
    .limit(200);

  const consultations = ((data || []) as GeneralConsultation[]).filter((item) => {
    if (status === 'pending' && item.is_checked) return false;
    if (status === 'checked' && !item.is_checked) return false;
    if (!searchTerm) return true;
    return [item.name, item.phone, item.message, item.consultation_type, item.preferred_date]
      .filter(Boolean)
      .join(' ')
      .toLocaleLowerCase('ko-KR')
      .includes(searchTerm.toLocaleLowerCase('ko-KR'));
  });

  return (
    <>
      <header className="sticky top-0 z-50 border-b border-slate-200 bg-white px-5 py-5 shadow-sm md:px-10 md:py-6">
        <h1 className="text-xl font-black tracking-tight text-ink md:text-2xl">일반 문의</h1>
        <p className="mt-1 text-sm font-medium text-ink-muted">비회원도 신청할 수 있는 빠른 상담·콜백 접수입니다.</p>
      </header>
      <ConsultationAdminTabs />

      <div className="mx-auto w-full max-w-6xl space-y-6 p-5 md:p-10">
        {params.error && (
          <div className="rounded border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">
            {errorMessages[params.error] || '요청을 처리하지 못했습니다.'}
          </div>
        )}
        {error && (
          <div className="rounded border border-red-200 bg-red-50 px-5 py-4 text-sm font-bold text-red-700">일반 문의를 불러오지 못했습니다.</div>
        )}

        <section className="rounded border border-slate-200 bg-white p-4 shadow-sm md:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <form action="/admin/consultations/general" method="get" className="flex w-full max-w-lg gap-2">
              {status !== 'all' && <input type="hidden" name="status" value={status} />}
              <div className="relative min-w-0 flex-1">
                <label htmlFor="general-consultation-search" className="sr-only">일반 문의 검색</label>
                <input
                  id="general-consultation-search"
                  name="q"
                  type="search"
                  defaultValue={searchTerm}
                  placeholder="이름, 연락처, 상담 내용 검색"
                  className="min-h-11 w-full rounded border border-slate-200 bg-slate-50 py-3 pl-4 pr-11 text-sm font-medium text-ink outline-none transition focus:border-primary focus:bg-white"
                />
                <Search size={18} className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-muted" />
              </div>
              <button type="submit" className="rounded bg-navy-950 px-5 py-3 text-sm font-black text-white transition hover:bg-primary">검색</button>
            </form>

            <div className="flex rounded bg-slate-100 p-1">
              {([
                ['all', '전체'],
                ['pending', '신규 접수'],
                ['checked', '확인 완료'],
              ] as const).map(([value, label]) => (
                <Link
                  key={value}
                  href={filterHref(value, searchTerm)}
                  className={`flex-1 whitespace-nowrap rounded px-4 py-2.5 text-center text-sm font-black transition ${status === value ? 'bg-white text-ink shadow-sm' : 'text-ink-muted hover:text-ink'}`}
                >
                  {label}
                </Link>
              ))}
            </div>
          </div>
        </section>

        <div className="flex items-center justify-between">
          <p className="text-sm font-bold text-ink-muted">검색 결과 <strong className="text-lg text-ink">{consultations.length}</strong>건</p>
          <p className="text-xs font-medium text-ink-muted">확인 후 기재된 연락처로 안내해 주세요.</p>
        </div>

        {!error && consultations.length === 0 ? (
          <div className="rounded border border-slate-200 bg-white px-5 py-20 text-center shadow-sm">
            <PhoneCall size={42} className="mx-auto text-slate-300" />
            <p className="mt-4 text-base font-bold text-ink-muted">조건에 맞는 일반 문의가 없습니다.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {consultations.map((item) => (
              <article key={item.id} className={`overflow-hidden rounded border bg-white shadow-sm ${item.is_checked ? 'border-slate-200' : 'border-blue-200 ring-2 ring-blue-50'}`}>
                <div className="grid gap-5 px-5 py-5 md:grid-cols-[180px_minmax(0,1fr)_auto] md:items-center md:px-7">
                  <div>
                    <span className={`inline-flex rounded px-2.5 py-1 text-xs font-black ${item.is_checked ? 'bg-slate-100 text-ink-muted' : 'bg-blue-600 text-white'}`}>
                      {item.is_checked ? '확인 완료' : '신규 접수'}
                    </span>
                    <p className="mt-2 text-lg font-black text-ink">{item.name}</p>
                    <a href={`tel:${item.phone}`} className="mt-1 block text-sm font-bold text-primary hover:underline">{item.phone}</a>
                  </div>

                  <dl className="grid gap-3 text-sm sm:grid-cols-3">
                    <div><dt className="text-xs font-bold text-ink-muted">상담 분야</dt><dd className="mt-1 font-bold text-ink-sub">{item.consultation_type || '미입력'}</dd></div>
                    <div><dt className="text-xs font-bold text-ink-muted">희망일</dt><dd className="mt-1 font-bold text-ink-sub">{formatPreferredDate(item.preferred_date)}</dd></div>
                    <div><dt className="text-xs font-bold text-ink-muted">접수일</dt><dd className="mt-1 font-bold text-ink-sub">{formatDate(item.created_at)}</dd></div>
                  </dl>

                  <form action={toggleGeneralConsultation}>
                    <input type="hidden" name="id" value={item.id} />
                    <input type="hidden" name="currentStatus" value={String(item.is_checked)} />
                    <button type="submit" className={`inline-flex min-h-11 w-full items-center justify-center gap-2 rounded px-4 py-3 text-sm font-black transition md:w-auto ${item.is_checked ? 'bg-slate-100 text-ink-muted hover:bg-slate-200' : 'bg-primary text-white hover:bg-primary-dark'}`}>
                      <CheckCircle2 size={17} /> {item.is_checked ? '미확인으로 변경' : '확인 처리'}
                    </button>
                  </form>
                </div>

                <details className="group border-t border-slate-200 bg-slate-50/60">
                  <summary className="flex cursor-pointer list-none items-center justify-between px-5 py-4 text-sm font-black text-ink-sub md:px-7">
                    상담 내용 확인
                    <ChevronDown size={18} className="transition-transform group-open:rotate-180" />
                  </summary>
                  <div className="border-t border-slate-200 px-5 py-5 md:px-7">
                    <p className="whitespace-pre-wrap rounded border border-slate-200 bg-white px-4 py-4 text-[15px] font-medium leading-7 text-ink-sub">
                      {item.message || '상담 내용이 입력되지 않았습니다.'}
                    </p>
                    <p className="mt-3 text-xs font-medium text-ink-muted">마케팅 수신: {item.marketing_agreed ? '동의' : '미동의'}</p>
                  </div>
                </details>
              </article>
            ))}
          </div>
        )}
      </div>
    </>
  );
}

