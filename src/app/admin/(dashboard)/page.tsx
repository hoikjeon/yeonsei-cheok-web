import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { createClient } from '@supabase/supabase-js';
import Link from 'next/link';
import { Calendar, MessageSquare, Settings, ArrowRight } from 'lucide-react';
import { AnalyticsSummary, AnalyticsGraphs } from '@/components/admin/AnalyticsCharts';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;
const supabase = createClient(supabaseUrl, supabaseServiceKey);

interface ReservationRecord {
  id: string;
  name: string;
  phone: string;
  specialty: string | null;
  doctor: string | null;
  reservation_date: string | null;
  reservation_time: string | null;
  created_at: string;
}

interface ConsultationRecord {
  id: string;
  name: string;
  phone: string;
  message: string | null;
  consultation_type?: string | null;
  preferred_date?: string | null;
  created_at: string;
}

interface PopupRecord {
  id: string;
  title: string;
  image_url: string | null;
  is_active: boolean | null;
}

export default async function AdminDashboardPage() {
  const cookieStore = await cookies();
  const isAdmin = cookieStore.get('admin_auth')?.value === 'true';

  if (!isAdmin) {
    redirect('/admin/login');
  }

  // 7일 전 날짜 계산
  const todayRaw = new Date();
  const sevenDaysAgo = new Date(todayRaw.getTime() - 7 * 24 * 60 * 60 * 1000);

  // 데이터 한 번에 병렬 패칭 (미확인 건 위주)
  const [reservationsRes, consultationsRes, popupsRes, visitsRes] = await Promise.all([
    supabase.from('reservations').select('*').eq('is_checked', false).order('created_at', { ascending: false }).limit(10),
    supabase.from('consultations').select('*').eq('is_checked', false).order('created_at', { ascending: false }).limit(10),
    supabase.from('popups').select('*').order('created_at', { ascending: false }).limit(6),
    supabase.from('site_visits').select('*').gte('visited_at', sevenDaysAgo.toISOString()).order('visited_at', { ascending: true })
  ]);

  const reservations = (reservationsRes.data || []) as ReservationRecord[];
  const consultations = (consultationsRes.data || []) as ConsultationRecord[];
  const popups = (popupsRes.data || []) as PopupRecord[];
  const visits = visitsRes.data || [];

  return (
    <>
      <header className="bg-white border-b border-slate-200 px-10 py-6 flex justify-between items-center sticky top-0 z-[50] shadow-sm">
        <h1 className="text-2xl font-black text-ink tracking-tight">통합 대시보드</h1>
        <div className="flex items-center gap-4">
          <Link href="/" target="_blank" className="text-sm font-bold text-ink-muted hover:text-primary transition-colors">
            내 병원 사이트 보기 &rarr;
          </Link>
        </div>
      </header>

      <div className="p-10 space-y-10 max-w-[1600px] w-full">
        
        {/* 1. 요약 카드 최상단 배치 */}
        <AnalyticsSummary visits={visits} />

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-10">
          {/* 온라인 예약 리스트 (미확인) */}
          <section className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col max-h-[600px]">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg animate-pulse shadow-sm shadow-blue-500/20"><Calendar size={20} /></div>
                <h3 className="text-[17px] font-black text-ink">미확인 온라인 예약</h3>
              </div>
              <Link href="/admin/reservations" className="text-xs font-bold text-primary bg-primary/5 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-all flex items-center gap-1">전체보기 <ArrowRight size={12} /></Link>
            </div>
            <div className="overflow-auto flex-1 p-2">
              <table className="w-full text-left text-sm">
                <thead className="text-ink-muted font-bold sticky top-0 bg-white shadow-sm z-10">
                  <tr>
                    <th className="py-4 px-6 border-b border-slate-100">신청일</th>
                    <th className="py-4 px-6 border-b border-slate-100">이름</th>
                    <th className="py-4 px-6 border-b border-slate-100">연락처</th>
                    <th className="py-4 px-6 border-b border-slate-100">진료과목</th>
                    <th className="py-4 px-6 border-b border-slate-100">희망일자</th>
                  </tr>
                </thead>
                <tbody>
                  {reservations.length === 0 ? (
                    <tr><td colSpan={5} className="py-12 text-center text-ink-muted font-medium">새로운 예약 신청이 없습니다.</td></tr>
                  ) : (
                    reservations.map((res) => (
                      <tr key={res.id} className="hover:bg-slate-50 border-b border-slate-50 transition-colors group">
                        <td className="py-4 px-6 font-bold text-ink">
                          <span className="text-[11px] bg-blue-100 text-blue-600 px-2.5 py-1.5 rounded-lg animate-pulse font-black shadow-sm shadow-blue-200">
                            {new Date(res.created_at).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-bold text-ink-sub">
                           <Link href="/admin/reservations" className="hover:text-primary transition-colors underline underline-offset-4 decoration-slate-200">
                             {res.name}
                           </Link>
                        </td>
                        <td className="py-4 px-6 text-ink-muted font-medium text-xs">{res.phone}</td>
                        <td className="py-4 px-6 font-bold text-ink-sub">{res.specialty} <span className="text-xs text-ink-muted">({res.doctor})</span></td>
                        <td className="py-4 px-6 text-ink-muted font-medium">{res.reservation_date} <br/><span className="text-xs">{res.reservation_time}</span></td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>

          {/* 온라인 상담 리스트 (미확인) */}
          <section className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 overflow-hidden flex flex-col max-h-[600px]">
            <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-emerald-100 text-emerald-600 rounded-lg animate-pulse shadow-sm shadow-emerald-500/20"><MessageSquare size={20} /></div>
                <h3 className="text-[17px] font-black text-ink">미확인 온라인 상담</h3>
              </div>
              <Link href="/admin/consultations" className="text-xs font-bold text-primary bg-primary/5 px-3 py-1.5 rounded-lg hover:bg-primary/10 transition-all flex items-center gap-1">전체보기 <ArrowRight size={12} /></Link>
            </div>
            <div className="overflow-auto flex-1 p-2">
              <table className="w-full text-left text-sm">
                <thead className="text-ink-muted font-bold sticky top-0 bg-white shadow-sm z-10">
                  <tr>
                    <th className="py-4 px-6 border-b border-slate-100 w-24">신청일</th>
                    <th className="py-4 px-6 border-b border-slate-100 w-24">이름</th>
                    <th className="py-4 px-6 border-b border-slate-100 w-32">연락처</th>
                    <th className="py-4 px-6 border-b border-slate-100 w-28">희망일</th>
                    <th className="py-4 px-6 border-b border-slate-100">상담내용</th>
                  </tr>
                </thead>
                <tbody>
                  {consultations.length === 0 ? (
                    <tr><td colSpan={5} className="py-12 text-center text-ink-muted font-medium">새로운 상담 신청이 없습니다.</td></tr>
                  ) : (
                    consultations.map((cons) => (
                      <tr key={cons.id} className="hover:bg-slate-50 border-b border-slate-50 transition-colors group">
                        <td className="py-4 px-6">
                          <span className="text-[11px] bg-emerald-100 text-emerald-600 px-2.5 py-1.5 rounded-lg animate-pulse font-black shadow-sm shadow-emerald-200">
                            {new Date(cons.created_at).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })}
                          </span>
                        </td>
                        <td className="py-4 px-6 font-bold text-ink-sub">
                          <Link href="/admin/consultations" className="hover:text-emerald-600 transition-colors underline underline-offset-4 decoration-slate-200">
                            {cons.name}
                          </Link>
                        </td>
                        <td className="py-4 px-6 text-ink-muted font-medium text-xs">{cons.phone}</td>
                        <td className="py-4 px-6 text-ink-muted font-medium text-xs">{cons.preferred_date || '-'}</td>
                        <td className="py-4 px-6">
                          <p className="font-black text-ink-sub">{cons.consultation_type || '미입력'}</p>
                          <p className="line-clamp-1 text-ink-muted font-medium leading-relaxed">{cons.message}</p>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </div>

        {/* 2. 통계 차트 영역 */}
        <AnalyticsGraphs visits={visits} />

        {/* 3. 팝업 설정 현황 요약 */}
        <section className="bg-white rounded-[1.5rem] shadow-sm border border-slate-200 overflow-hidden">
          <div className="px-8 py-6 border-b border-slate-100 flex justify-between items-center bg-slate-50/50">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-100 text-purple-600 rounded-lg"><Settings size={20} /></div>
              <h3 className="text-[17px] font-black text-ink">공지 팝업창 현황</h3>
            </div>
            <Link href="/admin/popups" className="text-sm font-bold text-primary hover:text-ink transition-colors">
               전체 관리 바로가기 &rarr;
            </Link>
          </div>
          
          <div className="p-8">
              {popups.length === 0 ? (
                <div className="p-20 text-center text-ink-muted font-medium bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
                   등록된 팝업이 없습니다.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {popups.map((p) => (
                    <div key={p.id} className="p-5 border border-slate-200 rounded-2xl flex justify-between items-center hover:bg-slate-50 transition-all hover:shadow-md bg-white group">
                      <div className="flex items-center gap-4">
                         <div className="w-14 h-14 rounded-xl bg-slate-100 overflow-hidden shrink-0 border border-slate-100 shadow-sm transition-transform group-hover:scale-105">
                            <img src={p.image_url || '/ube_training.jpg'} className="w-full h-full object-cover" alt="" />
                         </div>
                         <div>
                            <p className="font-bold text-ink text-sm whitespace-pre-line leading-tight">
                              {p.title.replace(/\\n/g, '\n')}
                            </p>
                            <div className="flex items-center gap-2 mt-1.5">
                              <span className={`w-2 h-2 rounded-full ${p.is_active ? 'bg-primary animate-pulse' : 'bg-slate-300'}`}></span>
                              <p className="text-[11px] text-ink-muted font-bold">{p.is_active ? '사이트 노출 중' : '비활성 상태'}</p>
                            </div>
                         </div>
                      </div>
                      <Link href={`/admin/popups?edit=${p.id}`} className="px-4 py-2 bg-white border border-slate-200 hover:border-primary hover:text-primary transition-all font-bold text-[13px] rounded-xl shadow-sm hover:shadow-md">
                        수정
                      </Link>
                    </div>
                  ))}
                </div>
              )}
          </div>
        </section>

      </div>
    </>
  );
}
