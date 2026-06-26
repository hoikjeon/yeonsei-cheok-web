'use client';

import SubHero from '@/components/SubHero';
import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';

const DOCTORS_BY_SPECIALTY = {
  '척추외과(신경외과)': ['이남', '김동한'],
  '정형외과': ['최호']
};

export default function ReservationPage() {
  const [formData, setFormData] = useState({
    category: '초진',
    name: '',
    phone: '',
    specialty: '척추외과(신경외과)',
    doctor: '이남',
    reservation_date: '',
    reservation_time: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [isAgreed, setIsAgreed] = useState(false);

  // Update doctor when specialty changes
  useEffect(() => {
    const doctors = DOCTORS_BY_SPECIALTY[formData.specialty as keyof typeof DOCTORS_BY_SPECIALTY];
    if (doctors && doctors.length > 0 && !doctors.includes(formData.doctor)) {
      setFormData(prev => ({ ...prev, doctor: doctors[0] }));
    }
  }, [formData.specialty]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.phone || !formData.reservation_date) {
      alert('필수 정보(이름, 연락처, 예약일자)를 모두 입력해 주세요.');
      return;
    }

    if (!isAgreed) {
      alert('개인정보 수집 및 이용에 동의해 주세요.');
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase
        .from('reservations')
        .insert([
          {
            category: formData.category,
            name: formData.name,
            phone: formData.phone,
            specialty: formData.specialty,
            doctor: formData.doctor,
            reservation_date: formData.reservation_date,
            reservation_time: formData.reservation_time,
            created_at: new Date().toISOString()
          }
        ]);

      if (error) {
        throw error;
      }

      setIsSuccess(true);
      setFormData({ 
        category: '초진', 
        name: '', 
        phone: '', 
        specialty: '척추외과(신경외과)', 
        doctor: '이남',
        reservation_date: '',
        reservation_time: ''
      });
      setIsAgreed(false);
      alert('예약 신청이 완료되었습니다. 확인 후 빠른 시일 내에 연락드리겠습니다.');
    } catch (error: any) {
      console.error('Error submitting reservation:', error.message);
      alert('신청 중 오류가 발생했습니다. 다시 시도해 주시거나 전화 상담을 이용해 주세요.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="flex flex-col min-h-screen">
      <SubHero 
        title="온라인 예약" 
        subtitle="원하시는 스케줄에 맞춰 신속하고 간편한 진료 예약을 도와드립니다."
        path={[{ name: '커뮤니티' }, { name: '온라인 예약' }]}
        bgImage="/hero-bg.png"
      />

      <section className="bg-white py-24 flex-grow">
        <div className="max-w-4xl mx-auto px-6 w-full">
          <div className="bg-white rounded-[2rem] border border-slate-200 shadow-premium p-10 md:p-16 space-y-12">
            
            <div className="text-center space-y-4">
              <h2 className="text-3xl font-black text-ink tracking-tight">진료 예약 신청</h2>
              <p className="text-ink-muted font-medium">
                정보를 정확히 기입해 주시면, 전문 상담원이 예약 확정을 위해 연락을 드립니다.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-10">
              
              {/* === 기본 정보 입력 === */}
              <div className="space-y-8 p-8 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="text-lg font-bold text-ink border-b border-slate-200 pb-3">기본 정보</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* 방문 분류 */}
                  <div className="space-y-3 md:col-span-2">
                    <label className="text-sm font-bold text-ink-sub">방문 분류</label>
                    <div className="flex gap-4">
                      {['초진', '재진'].map((cat) => (
                        <label key={cat} className={`flex-1 flex items-center justify-center gap-2 p-4 rounded-xl cursor-pointer font-bold border transition-all ${formData.category === cat ? 'bg-primary border-primary text-white shadow-md' : 'bg-white border-slate-200 text-ink-muted hover:border-primary/50'}`}>
                          <input 
                            type="radio" 
                            name="category" 
                            value={cat}
                            checked={formData.category === cat}
                            onChange={handleInputChange}
                            className="hidden" 
                          />
                          <span>{cat} {cat === '초진' && <span className="text-xs font-normal opacity-80">(처음 오신 분)</span>}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  {/* 이름 & 연락처 */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-ink-sub">이름 <span className="text-red-500">*</span></label>
                    <input 
                      type="text" 
                      name="name"
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-primary transition-all text-ink font-medium"
                      placeholder="이름을 입력해 주세요"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-ink-sub">연락처 <span className="text-red-500">*</span></label>
                    <input 
                      type="tel" 
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-primary transition-all text-ink font-medium"
                      placeholder="010-0000-0000"
                      required
                    />
                  </div>
                </div>
              </div>

              {/* === 진료 정보 입력 === */}
              <div className="space-y-8 p-8 bg-slate-50 rounded-2xl border border-slate-100">
                <h3 className="text-lg font-bold text-ink border-b border-slate-200 pb-3">진료 예약 정보</h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* 진료과목 & 의료진 */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-ink-sub">진료과목</label>
                    <select 
                      name="specialty"
                      value={formData.specialty}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-primary transition-all text-ink font-bold appearance-none cursor-pointer"
                    >
                      {Object.keys(DOCTORS_BY_SPECIALTY).map((spec) => (
                        <option key={spec} value={spec}>{spec}</option>
                      ))}
                    </select>
                  </div>
                  
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-ink-sub">원하시는 의료진</label>
                    <select 
                      name="doctor"
                      value={formData.doctor}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-primary transition-all text-ink font-bold appearance-none cursor-pointer"
                    >
                      {DOCTORS_BY_SPECIALTY[formData.specialty as keyof typeof DOCTORS_BY_SPECIALTY].map((doc) => (
                        <option key={doc} value={doc}>
                          {doc} {(['이남', '김동한', '김훈'].includes(doc)) ? '병원장님' : '원장님'}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* 예약 가능 날짜 및 시간 */}
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-ink-sub">희망 진료일자 <span className="text-red-500">*</span></label>
                    <input 
                      type="date"
                      name="reservation_date"
                      value={formData.reservation_date}
                      onChange={handleInputChange}
                      min={new Date().toISOString().split('T')[0]}
                      className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-primary transition-all text-ink font-medium"
                      required
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-ink-sub">희망 진료시간대</label>
                    <select 
                      name="reservation_time"
                      value={formData.reservation_time}
                      onChange={handleInputChange}
                      className="w-full px-5 py-4 bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-primary transition-all text-ink font-medium appearance-none cursor-pointer"
                    >
                      <option value="">원하시는 시간대를 선택해주세요 (선택)</option>
                      <option value="오전 (09:00 - 12:00)">오전 (09:00 - 12:00)</option>
                      <option value="오후 (14:00 - 17:30)">오후 (14:00 - 17:30)</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* === 개인정보 처리방침 === */}
              <div className="space-y-4">
                <label className="text-sm font-bold text-ink-sub">개인정보 수집 및 이용 동의 <span className="text-red-500">*</span></label>
                <div className="h-48 overflow-y-auto p-5 bg-slate-50 border border-slate-200 rounded-xl text-[13px] text-ink-sub leading-relaxed font-medium">
                  <h4 className="font-bold text-ink mb-2">개인정보의 수집 및 이용목적</h4>
                  <p className="mb-4">
                    연세척병원은 수집한 개인정보를 다음의 목적을 위해 활용합니다. 이용자가 제공한 모든 정보는 하기 목적에 필요한 용도 이외로는 사용되지 않으며 이용 목적이 변경될 시에는 사전 동의를 구할 것입니다.
                  </p>
                  
                  <h5 className="font-bold text-ink mb-1">[ 홈페이지 회원정보 ]</h5>
                  <ul className="list-disc pl-4 mb-4 space-y-1">
                    <li>필수정보: 홈페이지를 통한 진료 예약, 회원제 서비스 제공</li>
                    <li>선택정보: 이메일을 통한 병원소식, 질병정보 등의 안내, 설문조사</li>
                  </ul>

                  <h4 className="font-bold text-ink mb-2">수집하는 개인정보 항목</h4>
                  <ul className="list-disc pl-4 mb-2 space-y-1">
                    <li>온라인상담 : 고객명, 전화번호, 이메일</li>
                    <li>온라인예약 : 이름, 연락처</li>
                    <li>게시판 : 작성자, 이메일, 전화번호(필요시)</li>
                  </ul>
                  <p className="mb-4">개인정보 수집방법 : 홈페이지, 서면양식, 팩스, 전화, 이메일</p>

                  <h4 className="font-bold text-ink mb-2">개인정보의 보유 및 이용기간</h4>
                  <p className="mb-4">
                    연세척병원은 개인정보의 수집목적 또는 제공받은 목적이 달성된 때에는 귀하의 개인정보를 지체 없이 파기합니다. 다만, 수집목적 또는 제공받은 목적이 달성된 경우에도 상법 등 법령의 규정에 의하여 보존할 필요성이 있는 경우에는 귀하의 개인정보를 보유할 수 있습니다.
                  </p>
                  
                  <h5 className="font-bold text-ink mb-1">[ 법령에 따른 보존기간 ]</h5>
                  <ul className="list-disc pl-4 space-y-1">
                    <li>소비자의 불만 또는 분쟁처리에 관한 기록 : 3년 (전자상거래 등에서의 소비자보호에 관한 법률)</li>
                    <li>신용정보의 수집/처리 및 이용 등에 관한 기록 : 3년 (신용정보의 이용 및 보호에 관한 법률)</li>
                    <li>본인 확인에 관한 기록 : 6개월 (정보통신망 이용촉진 및 정보보호 등에 관한 법률)</li>
                    <li>방문에 관한 기록 : 3개월 (통신비밀보호법)</li>
                  </ul>
                </div>
                
                <div className="flex items-center gap-3 pt-2">
                  <input 
                    type="checkbox" 
                    id="privacy-agree" 
                    checked={isAgreed}
                    onChange={(e) => setIsAgreed(e.target.checked)}
                    className="w-5 h-5 rounded border-slate-300 text-primary focus:ring-primary" 
                    required 
                  />
                  <label htmlFor="privacy-agree" className="text-[15px] font-bold text-ink cursor-pointer">
                    개인정보 수집 및 이용 목적에 동의합니다.
                  </label>
                </div>
              </div>

              <div className="pt-6">
                <button 
                  type="submit" 
                  disabled={isSubmitting}
                  className={`w-full py-5 text-white font-black text-lg rounded-[1.5rem] transition-all shadow-xl shadow-primary/20 hover:-translate-y-1 ${isSubmitting ? 'bg-slate-400 cursor-not-allowed' : 'bg-primary hover:bg-primary-dark active:scale-[0.98]'}`}
                >
                  {isSubmitting ? '신청 처리 중...' : '예약 신청 완료하기'}
                </button>
              </div>
              
            </form>
          </div>
        </div>
      </section>
    </div>
  );
}
