'use client';

import { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { togglePopupActive, uploadPopup, deletePopup, updatePopup, assignPopupSlot } from './actions';
import { Image as ImageIcon, Trash2, Edit3 } from 'lucide-react';
import AdminSidebar from '@/components/admin/AdminSidebar';

type PopupStatus = {
  label: string;
  dotClass: string;
  textClass: string;
  isLiveNow: boolean;
};

// 저장된 ISO 시각 → datetime-local 입력값(한국 시간 기준 "YYYY-MM-DDTHH:mm")
const toKstInputValue = (iso?: string | null) => {
  if (!iso) return '';
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return '';
  const kst = new Date(date.getTime() + 9 * 60 * 60 * 1000);
  return kst.toISOString().slice(0, 16);
};

const formatKstLabel = (iso?: string | null) => {
  if (!iso) return null;
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return null;
  return date.toLocaleString('ko-KR', {
    timeZone: 'Asia/Seoul',
    month: 'numeric',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
};

const getPopupStatus = (popup: any): PopupStatus => {
  if (!popup.is_active) {
    return { label: '비활성', dotClass: 'bg-slate-300', textClass: 'text-ink-muted', isLiveNow: false };
  }
  if (popup.display_slot == null) {
    return { label: '자리 미지정', dotClass: 'bg-slate-300', textClass: 'text-ink-muted', isLiveNow: false };
  }
  const now = Date.now();
  if (popup.starts_at && now < new Date(popup.starts_at).getTime()) {
    return { label: '노출 예약됨', dotClass: 'bg-amber-400', textClass: 'text-amber-600', isLiveNow: false };
  }
  if (popup.ends_at && now > new Date(popup.ends_at).getTime()) {
    return { label: '기간 종료', dotClass: 'bg-rose-400', textClass: 'text-rose-500', isLiveNow: false };
  }
  return { label: '지금 노출 중', dotClass: 'bg-emerald-500', textClass: 'text-emerald-600', isLiveNow: true };
};

function PopupsAdminContent() {
  const [popups, setPopups] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [editingPopup, setEditingPopup] = useState<any | null>(null);
  
  const searchParams = useSearchParams();
  const supabase = createClient();

  const fetchPopups = async () => {
    const { data } = await supabase.from('popups').select('*').order('created_at', { ascending: false });
    const popupList: any[] = data || [];
    setPopups(popupList);
    setIsLoading(false);

    const editId = searchParams.get('edit');
    if (editId) {
      const target = popupList.find((p: any) => p.id === editId);
      if (target) {
        setEditingPopup(target);
        setPreviewImage(target.image_url);
      }
    }
  };

  useEffect(() => {
    fetchPopups();
  }, [searchParams]);

  const handleToggle = async (id: string, currentStatus: boolean) => {
    setPopups(prev => prev.map(p => p.id === id ? { ...p, is_active: !currentStatus } : p));
    const { error } = await togglePopupActive(id, currentStatus);
    if (error) {
      alert(`상태 변경 중 오류: ${error}`);
      fetchPopups(); 
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('정말로 이 팝업을 삭제하시겠습니까?')) return;
    setPopups(prev => prev.filter(p => p.id !== id));
    await deletePopup(id);
  };

  const handleSlotChange = async (id: string, value: string) => {
    const slot = value ? parseInt(value, 10) : null;
    setPopups(prev => prev.map(p => {
      if (p.id === id) return { ...p, display_slot: slot };
      if (slot !== null && p.display_slot === slot) return { ...p, display_slot: null };
      return p;
    }));
    const { error } = await assignPopupSlot(id, slot);
    if (error) {
      alert(`노출 자리 변경 중 오류: ${error}`);
      fetchPopups();
    }
  };

  const handleEditClick = (popup: any) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setEditingPopup(popup);
    setPreviewImage(popup.image_url);
  };

  const cancelEdit = () => {
    setEditingPopup(null);
    setPreviewImage(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setPreviewImage(url);
    } else if (!editingPopup) {
      setPreviewImage(null);
    }
  };

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    
    let result;
    if (editingPopup) {
      result = await updatePopup(editingPopup.id, formData);
    } else {
      result = await uploadPopup(formData);
    }
    
    if (result.error) {
      alert(`요청 실패: ${result.error}`);
    } else {
      alert(editingPopup ? '팝업 정보가 수정되었습니다.' : '신규 팝업이 등록되었습니다.');
      if (!editingPopup) (e.target as HTMLFormElement).reset();
      setEditingPopup(null);
      setPreviewImage(null);
      fetchPopups();
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <header className="bg-white border-b border-slate-200 px-10 py-6 sticky top-0 z-[50] shadow-sm">
        <h1 className="text-2xl font-black text-ink tracking-tight">공지 팝업 관리</h1>
        <p className="text-ink-muted text-sm font-medium mt-0.5">메인 홈페이지에 노출되는 팝업을 등록하고 관리합니다.</p>
      </header>

      <div className="p-10 space-y-10 max-w-[1400px] w-full mx-auto">

        {/* 메인 화면 미리보기 */}
        <section className="rounded-[2rem] bg-navy-950 p-8">
          <div className="mb-6 flex flex-col gap-1 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-xl font-bold text-white">메인 화면 미리보기</h2>
              <p className="mt-1 text-sm font-medium text-slate-400">
                1 · 2 · 3번 자리에 지정된 팝업이 방문자에게 나란히 보입니다. 기간이 지나거나 시작 전인 팝업은 흐리게 표시됩니다.
              </p>
            </div>
            <p className="text-xs font-bold text-slate-500">
              현재 노출 중: {popups.filter(p => getPopupStatus(p).isLiveNow).length}개
            </p>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            {[1, 2, 3].map((slot) => {
              const popup = popups.find(p => p.display_slot === slot);
              if (!popup) {
                return (
                  <div key={slot} className="flex min-h-[220px] flex-col items-center justify-center rounded-2xl border-2 border-dashed border-white/15 text-slate-500">
                    <p className="text-2xl font-black">{slot}</p>
                    <p className="mt-1 text-sm font-bold">빈 자리</p>
                  </div>
                );
              }

              const status = getPopupStatus(popup);
              const startsLabel = formatKstLabel(popup.starts_at);
              const endsLabel = formatKstLabel(popup.ends_at);

              return (
                <div key={slot} className={`overflow-hidden rounded-2xl bg-white shadow-lg transition-opacity ${status.isLiveNow ? '' : 'opacity-50'}`}>
                  <div className="flex items-center justify-between border-b border-slate-100 px-3 py-2">
                    <span className="text-[11px] font-bold text-ink-muted">오늘 하루 보지 않기</span>
                    <span className="text-[11px] font-bold text-ink">닫기</span>
                  </div>
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <img src={popup.image_url || '/ube_training.jpg'} alt="" className="absolute inset-0 h-full w-full object-cover" />
                    <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/10 to-transparent" />
                    <p className="absolute bottom-3 left-3 right-3 whitespace-pre-line text-[13px] font-black leading-tight text-white">
                      {popup.title.replace(/\\n/g, '\n')}
                    </p>
                    <span className="absolute left-3 top-3 rounded-full bg-navy-950/80 px-2.5 py-1 text-[11px] font-black text-white">
                      {slot}번
                    </span>
                  </div>
                  <div className="space-y-1 px-3 py-2.5">
                    <p className={`flex items-center gap-1.5 text-[12px] font-black ${status.textClass}`}>
                      <span className={`h-2 w-2 rounded-full ${status.dotClass}`} />
                      {status.label}
                    </p>
                    {(startsLabel || endsLabel) && (
                      <p className="text-[11px] font-bold text-ink-muted">
                        {startsLabel ? `${startsLabel}부터` : ''}{startsLabel && endsLabel ? ' ' : ''}{endsLabel ? `${endsLabel}까지` : ''}
                      </p>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-10 items-start">
          
          <div className="lg:col-span-2 bg-white rounded-[2rem] p-8 shadow-sm border border-slate-200">
            <h2 className="text-xl font-bold text-ink border-b border-slate-100 pb-4 mb-6">등록된 팝업 리스트</h2>
            
            {isLoading ? (
              <div className="py-20 text-center text-ink-muted font-bold">데이터를 불러오는 중입니다...</div>
            ) : popups.length === 0 ? (
              <div className="py-20 text-center text-ink-muted font-medium bg-slate-50 rounded-2xl border border-slate-100">
                등록된 팝업이 없습니다.
              </div>
            ) : (
              <div className="space-y-6">
                {popups.map(popup => (
                  <div key={popup.id} className={`flex max-sm:flex-col gap-6 p-6 rounded-2xl border transition-all ${editingPopup?.id === popup.id ? 'border-primary bg-primary/5 ring-4 ring-primary/10 shadow-lg' : popup.is_active ? 'border-primary/20 bg-primary/[0.02] shadow-sm' : 'border-slate-200 bg-white hover:border-slate-300'}`}>
                    <div className="w-full sm:w-32 h-32 rounded-xl border border-slate-100 overflow-hidden bg-slate-100 shrink-0">
                      <img src={popup.image_url || '/ube_training.jpg'} alt="popup" className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 space-y-2">
                       <h3 className="text-lg font-black text-ink leading-tight whitespace-pre-line">
                         {popup.title.replace(/\\n/g, '\n')}
                       </h3>
                       <p className="text-sm font-medium text-ink-muted line-clamp-2 leading-relaxed">{popup.content}</p>
                       {(() => {
                         const status = getPopupStatus(popup);
                         const startsLabel = formatKstLabel(popup.starts_at);
                         const endsLabel = formatKstLabel(popup.ends_at);
                         return (
                           <p className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs font-bold">
                             <span className={`flex items-center gap-1.5 ${status.textClass}`}>
                               <span className={`h-2 w-2 rounded-full ${status.dotClass}`} />
                               {status.label}
                             </span>
                             {(startsLabel || endsLabel) && (
                               <span className="text-ink-muted">
                                 {startsLabel ? `${startsLabel}부터` : ''}{startsLabel && endsLabel ? ' ' : ''}{endsLabel ? `${endsLabel}까지` : ''}
                               </span>
                             )}
                           </p>
                         );
                       })()}
                       <p className="text-xs text-ink-muted">등록일: {new Date(popup.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex sm:flex-col items-center justify-center gap-3 shrink-0 pt-4 sm:pt-0 sm:pl-4 sm:border-l border-slate-100">
                       <select
                         value={popup.display_slot ?? ''}
                         onChange={(e) => handleSlotChange(popup.id, e.target.value)}
                         className="w-full rounded-lg border border-slate-200 bg-white px-2 py-2 text-[13px] font-bold text-ink focus:border-primary focus:outline-none"
                       >
                         <option value="">노출 안 함</option>
                         <option value="1">1번 자리</option>
                         <option value="2">2번 자리</option>
                         <option value="3">3번 자리</option>
                       </select>
                       <button
                         onClick={() => handleToggle(popup.id, popup.is_active)}
                         className={`flex items-center justify-center px-5 py-3 rounded-xl font-bold text-sm transition-all ${
                           popup.is_active ? 'bg-primary text-white hover:bg-primary-dark' : 'bg-slate-100 text-ink-muted hover:bg-slate-200'
                         }`}
                       >
                         {popup.is_active ? '노출 중' : '비노출'}
                       </button>
                       <div className="flex gap-2">
                         <button onClick={() => handleEditClick(popup)} className={`p-3 rounded-lg transition-colors ${editingPopup?.id === popup.id ? 'bg-primary text-white shadow-md' : 'bg-slate-50 text-ink-muted hover:text-primary hover:bg-white border border-transparent'}`}>
                           <Edit3 size={18} />
                         </button>
                         <button onClick={() => handleDelete(popup.id)} className="p-3 bg-slate-50 text-ink-muted hover:text-red-500 hover:bg-white border border-transparent rounded-lg transition-colors">
                           <Trash2 size={18} />
                         </button>
                       </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-[2rem] p-8 shadow-premium border border-slate-200 sticky top-28">
            <div className="flex items-center justify-between mb-6 border-b border-slate-100 pb-4">
              <h2 className="text-xl font-bold text-ink">
                {editingPopup ? '팝업 수정하기' : '신규 팝업 등록'}
              </h2>
              {editingPopup && (
                <button onClick={cancelEdit} className="text-xs font-bold text-ink-muted hover:text-red-500 transition-colors">취소</button>
              )}
            </div>
            <form onSubmit={handleFormSubmit} className="space-y-6">
              <div className="space-y-3">
                <label className="text-xs font-bold text-ink-muted font-montserrat uppercase flex justify-between">
                   <span>대표 이미지</span>
                   <span className="text-primary tracking-tighter text-[10px]">권장: 760 x 950 px</span>
                </label>
                <div className="relative border-2 border-dashed border-slate-200 rounded-2xl bg-slate-50 p-4 transition-colors hover:border-primary/50 text-center group">
                  <input type="file" name="image" accept="image/*" onChange={handleImageChange} className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10" />
                  {previewImage ? (
                     <div className="relative h-44 w-full rounded-xl overflow-hidden shadow-sm">
                       <img src={previewImage || undefined} alt="Preview" className="w-full h-full object-cover" />
                     </div>
                  ) : (
                    <div className="py-10 flex flex-col items-center justify-center gap-2 text-ink-muted">
                      <ImageIcon size={28} />
                      <span className="text-sm font-bold">파일 선택</span>
                    </div>
                  )}
                </div>
              </div>
              <input type="hidden" name="label" key={editingPopup?.id} defaultValue={editingPopup?.label || "Notice"} />
              <div className="space-y-2">
                <label className="text-xs font-bold text-ink-muted font-montserrat uppercase">메인 제목</label>
                <textarea required name="title" rows={2} key={editingPopup?.id} defaultValue={editingPopup?.title || ""} placeholder="내용 입력..." className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-primary text-sm font-bold resize-none leading-tight text-ink" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-ink-muted font-montserrat uppercase">서브 내용</label>
                <textarea required name="content" rows={3} key={editingPopup?.id} defaultValue={editingPopup?.content || ""} placeholder="설명 입력..." className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-primary text-sm font-medium resize-y leading-relaxed text-ink-sub" />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-bold text-ink-muted font-montserrat uppercase">노출 자리</label>
                <select
                  name="display_slot"
                  key={`slot-${editingPopup?.id}`}
                  defaultValue={editingPopup?.display_slot ?? ''}
                  className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-primary text-sm font-bold text-ink"
                >
                  <option value="">노출 안 함 (자리 미지정)</option>
                  <option value="1">1번 자리 (왼쪽)</option>
                  <option value="2">2번 자리 (가운데)</option>
                  <option value="3">3번 자리 (오른쪽)</option>
                </select>
                <p className="text-[11px] font-medium text-ink-muted">이미 사용 중인 자리를 선택하면 기존 팝업의 자리가 자동 해제됩니다.</p>
              </div>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-ink-muted font-montserrat uppercase">노출 시작일시</label>
                  <input
                    type="datetime-local"
                    name="starts_at"
                    key={`starts-${editingPopup?.id}`}
                    defaultValue={toKstInputValue(editingPopup?.starts_at)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-primary text-sm font-bold text-ink"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-ink-muted font-montserrat uppercase">노출 종료일시</label>
                  <input
                    type="datetime-local"
                    name="ends_at"
                    key={`ends-${editingPopup?.id}`}
                    defaultValue={toKstInputValue(editingPopup?.ends_at)}
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 bg-white focus:outline-none focus:border-primary text-sm font-bold text-ink"
                  />
                </div>
                <p className="sm:col-span-2 text-[11px] font-medium text-ink-muted -mt-1">
                  비워두면 제한 없이 노출됩니다. 시작일만 넣으면 그때부터, 종료일만 넣으면 그때까지 노출됩니다. (한국 시간 기준)
                </p>
              </div>
              <label className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100 cursor-pointer hover:bg-slate-100">
                <input type="checkbox" name="is_active" key={editingPopup?.id} className="w-5 h-5 rounded text-primary focus:ring-primary border-slate-300" defaultChecked={editingPopup ? editingPopup.is_active : true} />
                <span className="text-sm font-bold text-ink">사이트 노출 적용</span>
              </label>
              <div className="pt-2 flex gap-3">
                <button type="submit" disabled={isSubmitting} className={`w-full py-4 text-white font-black text-lg rounded-xl transition-all shadow-md ${isSubmitting ? 'bg-slate-400' : 'bg-primary hover:-translate-y-1 hover:shadow-blue-glow'}`}>
                  {isSubmitting ? '처리 중...' : editingPopup ? '수정 완료' : '등록 하기'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}

export default function PopupsAdminPage() {
  return (
    <Suspense fallback={<div className="p-20 text-center font-bold text-ink-muted">불러오는 중...</div>}>
      <PopupsAdminContent />
    </Suspense>
  );
}
