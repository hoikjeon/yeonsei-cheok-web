'use client';

import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import AdminSidebar from '@/components/admin/AdminSidebar';
import { Calendar, CheckCircle2, Clock, User, Phone, Stethoscope, Search, Filter } from 'lucide-react';
import { toggleReservationChecked } from '@/app/admin/actions';

export default function AdminReservationsPage() {
  const [reservations, setReservations] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'checked'>('all');
  
  const supabase = createClient();

  const fetchReservations = async () => {
    setIsLoading(true);
    let query = supabase.from('reservations').select('*').order('created_at', { ascending: false });
    
    const { data } = await query;
    setReservations(data || []);
    setIsLoading(false);
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  const handleToggleCheck = async (id: string, currentStatus: boolean) => {
    const actionText = currentStatus ? '미확인 상태로 변경' : '확인 완료 처리';
    if (!confirm(`정말로 이 예약을 ${actionText} 하시겠습니까?`)) return;

    const { error } = await toggleReservationChecked(id, currentStatus);
    if (error) {
      alert(`오류가 발생했습니다: ${error}`);
    } else {
      setReservations(prev => prev.map(r => r.id === id ? { ...r, is_checked: !currentStatus } : r));
    }
  };

  const filteredReservations = reservations.filter(r => {
    const matchesSearch = r.name.includes(searchTerm) || r.phone.includes(searchTerm);
    if (filterStatus === 'pending') return matchesSearch && !r.is_checked;
    if (filterStatus === 'checked') return matchesSearch && r.is_checked;
    return matchesSearch;
  });

  return (
    <>
      <header className="bg-white border-b border-slate-200 px-10 py-6 sticky top-0 z-[50] shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-navy-950 tracking-tight flex items-center gap-3">
            <Calendar className="text-blue-600" /> 온라인 예약 관리
          </h1>
          <p className="text-slate-500 text-sm font-medium mt-0.5">환자들이 홈페이지를 통해 신청한 진료 예약 목록입니다.</p>
        </div>
      </header>

      <div className="p-10 space-y-8 max-w-[1400px] w-full mx-auto">
        
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="이름 또는 연락처로 검색..." 
              className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-2xl focus:outline-none focus:border-primary text-sm font-medium"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex bg-slate-100 p-1.5 rounded-2xl w-full md:w-auto">
            {(['all', 'pending', 'checked'] as const).map((status) => (
              <button
                key={status}
                onClick={() => setFilterStatus(status)}
                className={`flex-1 md:flex-none px-6 py-2.5 rounded-xl text-sm font-bold transition-all ${
                  filterStatus === status ? 'bg-white text-navy-950 shadow-md' : 'text-slate-500 hover:text-slate-700'
                }`}
              >
                {status === 'all' ? '전체' : status === 'pending' ? '미확인' : '확인완료'}
              </button>
            ))}
          </div>
        </div>

        {/* List Board */}
        <div className="bg-white border border-slate-200 rounded-[2.5rem] shadow-sm overflow-hidden">
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-wider">상태</th>
                <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-wider">신청일시</th>
                <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-wider">환자정보</th>
                <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-wider">진료내역</th>
                <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-wider">희망일정</th>
                <th className="px-8 py-5 text-xs font-black text-slate-500 uppercase tracking-wider text-right">작업</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {isLoading ? (
                <tr><td colSpan={6} className="py-20 text-center font-bold text-slate-300">데이터를 불러오고 있습니다...</td></tr>
              ) : filteredReservations.length === 0 ? (
                <tr><td colSpan={6} className="py-20 text-center font-medium text-slate-400">내역이 존재하지 않습니다.</td></tr>
              ) : (
                filteredReservations.map((res) => (
                  <tr key={res.id} className={`group transition-all ${res.is_checked ? 'bg-white opacity-80' : 'bg-blue-50/10'}`}>
                    <td className="px-8 py-7">
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-[11px] font-black tracking-tight ${
                        res.is_checked ? 'bg-slate-100 text-slate-500' : 'bg-blue-600 text-white animate-pulse shadow-lg shadow-blue-200'
                      }`}>
                        {res.is_checked ? '확인완료' : '신규접수'}
                      </span>
                    </td>
                    <td className="px-8">
                       <div className={`inline-block px-3 py-1.5 rounded-xl ${res.is_checked ? 'bg-slate-50' : 'bg-blue-100 animate-pulse-slow shadow-sm shadow-blue-200'}`}>
                         <p className={`text-sm font-black ${res.is_checked ? 'text-slate-400' : 'text-blue-700'}`}>{new Date(res.created_at).toLocaleDateString('ko-KR', { month: 'numeric', day: 'numeric' })}</p>
                         <p className={`text-[10px] font-bold ${res.is_checked ? 'text-slate-300' : 'text-blue-400 opacity-80'}`}>{new Date(res.created_at).toLocaleTimeString('ko-KR', { hour: '2-digit', minute: '2-digit' })}</p>
                       </div>
                    </td>
                    <td className="px-8">
                      <div className="flex items-center gap-3">
                         <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400">
                           <User size={18} />
                         </div>
                         <div>
                           <p className="text-[15px] font-black text-navy-950">{res.name} <span className="text-xs font-bold text-slate-400">({res.category})</span></p>
                           <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5"><Phone size={10} /> {res.phone}</p>
                         </div>
                      </div>
                    </td>
                    <td className="px-8">
                      <div className="flex items-center gap-2 text-primary font-bold text-[14px]">
                        <Stethoscope size={14} /> {res.specialty}
                      </div>
                      <p className="text-xs text-slate-500 mt-1">{res.doctor} 병원장님</p>
                    </td>
                    <td className="px-8">
                      <p className="text-sm font-black text-navy-950">{res.reservation_date}</p>
                      <p className="text-xs text-blue-500 font-bold mt-1 bg-blue-50 inline-block px-2 py-0.5 rounded">{res.reservation_time}</p>
                    </td>
                    <td className="px-8 text-right">
                      <button
                        onClick={() => handleToggleCheck(res.id, res.is_checked)}
                        className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all ${
                          res.is_checked 
                            ? 'bg-slate-100 text-slate-400 hover:bg-slate-200' 
                            : 'bg-primary text-white hover:bg-primary-dark shadow-lg shadow-primary/20'
                        }`}
                      >
                        {res.is_checked ? '상태변경' : '확인처리'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </>
  );
}
