'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;
  return (
    <footer className="bg-[#172b4d] text-slate-300 py-20 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center font-bold text-white text-lg border border-white/10">Y</div>
              <span className="text-xl font-bold tracking-tight text-white">연세척병원</span>
            </div>
            <p className="text-sm leading-relaxed text-slate-400 max-w-xs">
              세상을 바르게, 척추를 바르게.<br />
              연세대 세브란스 교수 출신의 의료진이<br />
              환자 한 분 한 분께 최선을 다해 진료합니다.
            </p>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-white font-bold tracking-wider uppercase text-sm border-l-2 border-primary pl-4">진료 시간</h4>
            <ul className="text-sm space-y-3 pl-4">
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>평일</span>
                <span className="text-white font-medium">AM 9:00 - PM 5:30</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>토요일</span>
                <span className="text-white font-medium">AM 9:00 - PM 1:00</span>
              </li>
              <li className="flex justify-between border-b border-white/5 pb-2">
                <span>점심시간</span>
                <span className="text-white font-medium">PM 12:30 - PM 1:30</span>
              </li>
              <li className="text-primary-light text-xs mt-4">* 일요일 및 공휴일은 휴진입니다.</li>
            </ul>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-white font-bold tracking-wider uppercase text-sm border-l-2 border-primary pl-4">상담 및 예약</h4>
            <div className="pl-4 space-y-2">
              <p className="text-3xl font-extrabold text-white tracking-tighter">051-935-1004</p>
              <p className="text-sm text-slate-400">카카오톡 상담: @연세척병원</p>
              <button className="mt-4 px-5 py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-lg text-xs font-semibold text-white transition-all">
                상담 신청하기
              </button>
            </div>
          </div>
          
          <div className="space-y-6">
            <h4 className="text-white font-bold tracking-wider uppercase text-sm border-l-2 border-primary pl-4">오시는 길</h4>
            <div className="pl-4 space-y-4">
              <p className="text-sm leading-relaxed text-slate-400">
                부산광역시 부산진구 가야대로 715<br />
                부암역 6번 출구 바로 앞 (온종합병원 옆)
              </p>
              <div className="flex gap-4">
                <div className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-primary/20 transition-colors cursor-pointer">
                  <span className="text-xs font-bold text-white">MAP</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="pt-10 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-xs text-slate-500 font-medium tracking-wide space-y-2">
            <p>부산광역시 부산진구 가야대로 715 (당감동 974, 위너스빌딩 1,2,3,4층) <span className="mx-2">·</span> 대표전화 : 051-935-1004</p>
            <p>© 2024 YONSEI CHEOK HOSPITAL. ALL RIGHTS RESERVED.</p>
          </div>
          <div className="flex gap-8 text-[11px] font-bold tracking-widest uppercase text-slate-500">
            <Link href="/" className="hover:text-white transition-colors">Terms</Link>
            <Link href="/" className="hover:text-primary-light transition-colors text-primary-light">Privacy Policy</Link>
            <Link href="/admin/login" className="hover:text-white transition-colors flex items-center gap-1 group">
               관리자 페이지 바로가기
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
