'use client';

import { motion } from 'framer-motion';
import { MapPin, Train, Bus, Car, Phone, Navigation } from 'lucide-react';
import dynamic from 'next/dynamic';

// 클라이언트 사이드 렌더링을 위해 NaverMap을 다이나믹 임포트합니다.
const NaverMap = dynamic(() => import('@/components/NaverMap'), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full min-h-[400px] bg-slate-50 flex items-center justify-center rounded-[2rem] animate-pulse">
      <p className="text-ink-muted font-bold text-sm tracking-widest font-montserrat uppercase">네이버 지도 로딩 중...</p>
    </div>
  ),
});

export default function LocationPage() {
  // 연세척병원 주소 및 좌표 정보 (부산광역시 부산진구 가야대로 715)
  // 휴병원(713) 바로 우측 위너스빌딩 정위치 좌표 보정
  const HOSPITAL_COORDS = { lat: 35.15845, lng: 129.04370 };
  const HOSPITAL_NAME = "연세척병원";

  const handleCopyAddress = () => {
    navigator.clipboard.writeText("부산광역시 부산진구 가야대로 715 (당감동 974, 위너스빌딩 1,2,3,4층)");
    alert("주소가 복사되었습니다.");
  };

  return (
    <div className="flex flex-col min-h-screen bg-white">
      {/* 📍 Header Hero Section */}
      <section className="border-b border-slate-100 bg-slate-50 pb-12 pt-14 sm:pb-14 sm:pt-16 lg:pb-20 lg:pt-40">
        <div className="mx-auto max-w-7xl space-y-4 px-4 text-center sm:space-y-6 sm:px-6">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm"
          >
            <MapPin size={16} className="text-primary" />
            <span className="text-sm font-bold text-ink-sub tracking-widest font-montserrat uppercase">Location</span>
          </motion.div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="break-keep text-[34px] font-black leading-tight tracking-tight text-ink sm:text-4xl lg:text-6xl"
          >
            오시는 길
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="mx-auto max-w-2xl break-keep text-[15px] font-medium leading-[1.75] text-ink-muted sm:text-[17px] lg:text-xl"
          >
            대학병원급 의료 시스템을 더 가까이에서 만나보세요. <br className="hidden md:block" />
            찾아오시는 길을 상세히 안내해 드립니다.
          </motion.p>
        </div>
      </section>

      {/* 🗺️ Map & Info Section */}
      <section className="py-14 sm:py-16 lg:py-24">
        <div className="mx-auto max-w-7xl space-y-12 px-4 sm:px-6 md:space-y-14 lg:space-y-16">
          
          {/* Top: Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
             <div className="flex flex-col items-start justify-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-5 sm:p-6 lg:rounded-[2rem] lg:p-8">
               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm mb-2"><MapPin size={24} /></div>
               <h3 className="text-sm font-black text-ink-muted font-montserrat uppercase tracking-widest">Address</h3>
               <p className="break-keep text-lg font-bold leading-snug text-ink sm:text-xl">부산광역시 부산진구 가야대로 715 <br />(당감동 974, 위너스빌딩 1~4층)</p>
               <button 
                 onClick={handleCopyAddress}
                 className="mt-2 text-sm font-bold text-primary hover:text-ink transition-colors flex items-center gap-1"
               >
                 주소 복사하기 &rarr;
               </button>
             </div>
             
             <div className="flex flex-col items-start justify-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-5 sm:p-6 lg:rounded-[2rem] lg:p-8">
               <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center text-primary shadow-sm mb-2"><Phone size={24} /></div>
               <h3 className="text-sm font-black text-ink-muted font-montserrat uppercase tracking-widest">Contact</h3>
               <p className="text-[26px] font-black tracking-tight text-ink sm:text-[28px]">051-935-1004</p>
               <p className="mt-2 text-sm font-medium text-ink-muted">팩스: 051-935-1008</p>
             </div>

             <div className="relative flex flex-col items-start justify-center gap-3 overflow-hidden rounded-2xl bg-primary p-5 text-white shadow-blue-glow sm:p-6 lg:rounded-[2rem] lg:p-8">
               <div className="relative z-10 space-y-3">
                  <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center text-white backdrop-blur-md mb-2"><Navigation size={24} /></div>
                  <h3 className="text-sm font-black text-white/70 font-montserrat uppercase tracking-widest">Navigation</h3>
                  <p className="text-lg font-bold sm:text-xl">내비게이션 검색</p>
                  <p className="mt-2 break-keep text-sm font-medium leading-relaxed text-white/80">
                     '연세척병원' 또는 '가야대로 715' 명칭 검색
                  </p>
               </div>
               <div className="absolute right-[-10%] bottom-[-20%] text-white/5"><Navigation size={180} /></div>
             </div>
          </div>

          {/* Middle: Map Container */}
          <div className="h-[400px] w-full overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 p-2 shadow-premium sm:h-[460px] sm:p-3 md:h-[500px] lg:h-[600px] lg:rounded-[3rem] lg:p-4">
             {/* 네이버 지도 컴포넌트 렌더링 */}
             <NaverMap lat={HOSPITAL_COORDS.lat} lng={HOSPITAL_COORDS.lng} placeName={HOSPITAL_NAME} />
          </div>

          {/* Bottom: Public Transport */}
          <div className="grid grid-cols-1 gap-8 border-t border-slate-100 pt-8 md:grid-cols-3 lg:gap-10 lg:pt-10">
             
             {/* Subway */}
             <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-emerald-50 rounded-2xl flex items-center justify-center text-emerald-600 shadow-sm border border-emerald-100">
                    <Train size={28} />
                  </div>
                  <h2 className="text-2xl font-black text-ink">지하철</h2>
                </div>
                <div className="space-y-4 pt-2 pl-4 border-l-2 border-emerald-100">
                   <div>
                     <span className="inline-block px-3 py-1 bg-emerald-500 text-white text-[12px] font-bold rounded-lg tracking-widest">2호선</span>
                     <p className="mt-2 break-keep text-base font-bold leading-relaxed text-ink-sub sm:text-lg">
                        <span className="text-emerald-600 font-black">부암역 6번 출구</span> <br />
                        출구로 나오셔서 바로 앞 약 10M 지점
                     </p>
                   </div>
                   <div className="space-y-3 pt-2">
                      <div className="break-keep text-[14px] leading-relaxed text-ink-muted">
                         <p className="font-bold text-ink-sub">■ 노포역/부산역 출발 시</p>
                         <p>서면역에서 2호선(사상/양산 방향) 환승 → 부암역 하차</p>
                      </div>
                      <div className="break-keep text-[14px] leading-relaxed text-ink-muted">
                         <p className="font-bold text-ink-sub">■ 사상역 출발 시</p>
                         <p>2호선(장산 방향) 이용 → 부암역 하차</p>
                      </div>
                   </div>
                </div>
             </div>

             {/* Bus */}
             <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-blue-50 rounded-2xl flex items-center justify-center text-blue-600 shadow-sm border border-blue-100">
                    <Bus size={28} />
                  </div>
                  <h2 className="text-2xl font-black text-ink">버스</h2>
                </div>
                <div className="space-y-4 pt-2 pl-4 border-l-2 border-blue-100">
                   <div>
                     <span className="inline-block px-3 py-1 bg-slate-100 text-ink-sub text-[11px] font-bold rounded-md mb-2">부암지하철 정류장</span>
                     <p className="text-[14px] font-bold text-ink-sub leading-relaxed">
                        31, 33, 62, 67, 68, 77, 85, 87, 110-1, <br/>108, 133, 138, 1004(급행)
                     </p>
                   </div>
                   <div className="pt-2">
                     <span className="inline-block px-3 py-1 bg-slate-100 text-ink-sub text-[11px] font-bold rounded-md mb-2">당감입구 정류장</span>
                     <p className="text-[14px] font-bold text-ink-sub leading-relaxed">
                        17, 23, 129-1, 138-1, 141, 160, 167, 169-1
                     </p>
                   </div>
                </div>
             </div>

             {/* Parking */}
             <div className="space-y-6">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center text-ink-sub shadow-sm border border-slate-200">
                    <Car size={28} />
                  </div>
                  <h2 className="text-2xl font-black text-ink">주차 안내</h2>
                </div>
                <div className="space-y-4 pt-2 pl-4 border-l-2 border-slate-200">
                   <div className="p-5 bg-slate-50 rounded-3xl border border-slate-100">
                     <p className="text-[15px] font-bold text-ink-sub leading-relaxed mb-3">
                        병원 정문 옆에 위치한 병원 전용 주차장
                     </p>
                     <p className="break-keep text-[14px] font-medium leading-relaxed text-ink-muted">
                        (주차공간이 한정되어 있는 관계로 가급적 대중교통 이용을 부탁드립니다.)
                     </p>
                   </div>
                </div>
             </div>

          </div>
        </div>
      </section>
    </div>
  );
}
