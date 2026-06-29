'use client';

import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client';
import { MessageSquare, CheckCircle2, Phone, Search, ChevronDown, ChevronUp, Calendar, ClipboardList, Megaphone } from 'lucide-react';
import { toggleConsultationChecked } from '@/app/admin/actions';

interface ConsultationRecord {
  id: string;
  name: string;
  phone: string;
  message: string | null;
  consultation_type?: string | null;
  preferred_date?: string | null;
  marketing_agreed?: boolean | null;
  is_checked: boolean;
  created_at: string;
}

export default function AdminConsultationsPage() {
  const [consultations, setConsultations] = useState<ConsultationRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'checked'>('all');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  
  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    let isMounted = true;

    const fetchConsultations = async () => {
      const { data } = await supabase
        .from('consultations')
        .select('*')
        .order('created_at', { ascending: false });

      if (!isMounted) return;

      setConsultations((data || []) as ConsultationRecord[]);
      setIsLoading(false);
    };

    fetchConsultations();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  const handleToggleCheck = async (id: string, currentStatus: boolean) => {
    const actionText = currentStatus ? '미확인 상태로 변경' : '확인 완료 처리';
    if (!confirm(`정말로 이 상담 신청을 ${actionText} 하시겠습니까?`)) return;

    const { error } = await toggleConsultationChecked(id, currentStatus);
    if (error) {
      alert(`오류가 발생했습니다: ${error}`);
    } else {
      setConsultations(prev => prev.map(c => c.id === id ? { ...c, is_checked: !currentStatus } : c));
    }
  };

  const filteredConsultations = consultations.filter(c => {
    const searchableText = [
      c.name,
      c.phone,
      c.message,
      c.consultation_type,
      c.preferred_date,
    ].filter(Boolean).join(' ');
    const matchesSearch = searchableText.includes(searchTerm);
    if (filterStatus === 'pending') return matchesSearch && !c.is_checked;
    if (filterStatus === 'checked') return matchesSearch && c.is_checked;
    return matchesSearch;
  });

  const formatPreferredDate = (date?: string | null) => {
    if (!date) return '미입력';
    return new Date(`${date}T00:00:00`).toLocaleDateString('ko-KR', { dateStyle: 'medium' });
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 px-10 py-6 sticky top-0 z-[50] shadow-sm flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-black text-ink tracking-tight flex items-center gap-3">
            <MessageSquare className="text-emerald-600" /> 온라인 상담 관리
          </h1>
          <p className="text-ink-muted text-sm font-medium mt-0.5">환자들이 남긴 1:1 상담 신청 내역입니다.</p>
        </div>
      </header>

      <div className="p-10 space-y-8 max-w-[1400px] w-full mx-auto">
        
        {/* Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between bg-white p-6 rounded-3xl border border-slate-100 shadow-sm">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-ink-muted" size={18} />
            <input 
              type="text" 
              placeholder="이름 또는 상담 내용으로 검색..." 
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
                  filterStatus === status ? 'bg-white text-ink shadow-md' : 'text-ink-muted hover:text-ink-sub'
                }`}
              >
                {status === 'all' ? '전체' : status === 'pending' ? '미확인' : '확인완료'}
              </button>
            ))}
          </div>
        </div>

        {/* List Cards */}
        <div className="space-y-4">
          {isLoading ? (
            <div className="py-20 text-center font-bold text-slate-300 bg-white rounded-3xl border border-slate-100 shadow-sm">데이터를 불러오고 있습니다...</div>
          ) : filteredConsultations.length === 0 ? (
            <div className="py-20 text-center font-medium text-ink-muted bg-white rounded-3xl border border-slate-100 shadow-sm">내역이 존재하지 않습니다.</div>
          ) : (
              filteredConsultations.map((cons) => (
              <div key={cons.id} className={`bg-white border rounded-[2.5rem] overflow-hidden transition-all shadow-sm ${cons.is_checked ? 'border-slate-100 opacity-80' : 'border-emerald-100 ring-2 ring-emerald-50 shadow-emerald-950/5 shadow-xl'}`}>
                <div className="p-8 flex flex-col md:flex-row gap-6 md:items-center">
                  {/* Status & Name */}
                  <div className="md:w-60 flex items-center gap-4 border-r border-slate-100 pr-6">
                    <span className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${cons.is_checked ? 'bg-slate-100 text-ink-muted' : 'bg-emerald-100 text-emerald-600 animate-pulse'}`}>
                      {cons.is_checked ? <CheckCircle2 size={18} /> : <MessageSquare size={18} />}
                    </span>
                    <div>
                      <p className="text-[14px] text-ink-muted font-bold mb-0.5">{cons.is_checked ? '상담확인' : '신규신청'}</p>
                      <p className="text-xl font-black text-ink">{cons.name}</p>
                    </div>
                  </div>

                  {/* Contact Info */}
                  <div className="flex-1 grid grid-cols-1 sm:grid-cols-2 gap-4">
                     <div className="flex items-center gap-3">
                       <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-ink-muted border border-slate-200 shadow-sm"><Phone size={16} /></div>
                       <div>
                          <p className="text-[10px] text-ink-muted font-black font-montserrat uppercase tracking-widest">Phone</p>
                          <p className="text-[15px] font-bold text-ink-sub">{cons.phone}</p>
                       </div>
                     </div>
                     <div className="flex items-center gap-3">
                       <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-ink-muted border border-slate-200 shadow-sm"><ClipboardList size={16} /></div>
                       <div>
                          <p className="text-[10px] text-ink-muted font-black font-montserrat uppercase tracking-widest">Type</p>
                          <p className="text-[15px] font-bold text-ink-sub">{cons.consultation_type || '미입력'}</p>
                       </div>
                     </div>
                     <div className="flex items-center gap-3">
                       <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-ink-muted border border-slate-200 shadow-sm"><Calendar size={16} /></div>
                       <div>
                          <p className="text-[10px] text-ink-muted font-black font-montserrat uppercase tracking-widest">Preferred Date</p>
                          <p className="text-[15px] font-bold text-ink-sub">{formatPreferredDate(cons.preferred_date)}</p>
                       </div>
                     </div>
                     <div className="flex items-center gap-3">
                       <div className="w-9 h-9 rounded-xl bg-slate-50 flex items-center justify-center text-ink-muted border border-slate-200 shadow-sm"><Megaphone size={16} /></div>
                       <div>
                          <p className="text-[10px] text-ink-muted font-black font-montserrat uppercase tracking-widest">Marketing</p>
                          <p className="text-[15px] font-bold text-ink-sub">{cons.marketing_agreed ? '동의' : '미동의'}</p>
                       </div>
                     </div>
                  </div>

                  {/* Action */}
                  <div className="md:border-l border-slate-100 md:pl-8 flex items-center gap-3">
                     <button
                       onClick={() => setExpandedId(expandedId === cons.id ? null : cons.id)}
                       className="flex items-center gap-2 px-5 py-3 hover:bg-slate-50 rounded-xl transition-all font-bold text-[14px] text-ink-muted"
                     >
                       상세내용 {expandedId === cons.id ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                     </button>
                     <button
                        onClick={() => handleToggleCheck(cons.id, cons.is_checked)}
                        className={`px-6 py-4 rounded-2xl font-black text-[15px] transition-all shadow-lg ${
                          cons.is_checked 
                            ? 'bg-slate-100 text-ink-muted hover:bg-slate-200 shadow-none' 
                            : 'bg-emerald-600 text-white hover:bg-emerald-700 translate-y--0.5 hover:shadow-emerald-950/10'
                        }`}
                      >
                        {cons.is_checked ? '상태변경' : '확인처리'}
                      </button>
                  </div>
                </div>

                {/* Expanded Content Area */}
                {expandedId === cons.id && (
                  <div className="bg-slate-50/50 p-8 pt-0 border-t border-slate-100 mt--1">
                     <div className="bg-white p-8 rounded-2xl border border-slate-100 shadow-inner">
                        <p className="text-xs font-black text-emerald-600 font-montserrat uppercase tracking-widest mb-3">Consultation Details</p>
                        <div className="mb-4 grid grid-cols-1 gap-3 text-[14px] font-bold text-ink-sub md:grid-cols-3">
                          <span className="rounded-xl bg-slate-50 px-4 py-3">상담내용: {cons.consultation_type || '미입력'}</span>
                          <span className="rounded-xl bg-slate-50 px-4 py-3">희망 날짜: {formatPreferredDate(cons.preferred_date)}</span>
                          <span className="rounded-xl bg-slate-50 px-4 py-3">접수일: {new Date(cons.created_at).toLocaleString('ko-KR', { dateStyle: 'medium', timeStyle: 'short' })}</span>
                        </div>
                        <div className="text-[16px] text-ink leading-[1.8] font-medium whitespace-pre-line bg-slate-50 p-6 rounded-xl">
                          {cons.message || '상담 내용이 입력되지 않았습니다.'}
                        </div>
                     </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      </div>
    </>
  );
}
