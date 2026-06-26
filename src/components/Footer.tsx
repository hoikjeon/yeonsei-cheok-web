'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

const Footer = () => {
  const pathname = usePathname();
  if (pathname.startsWith('/admin')) return null;
  return (
    <footer className="bg-[#37415a] px-6 py-10 text-slate-300">
      <div className="mx-auto max-w-7xl">
        <nav className="flex flex-wrap items-center gap-x-4 gap-y-3 text-sm font-semibold text-white/85">
          <Link href="/terms" className="transition-colors hover:text-white">이용약관</Link>
          <span className="text-white/25">·</span>
          <Link href="/privacy" className="transition-colors hover:text-white">개인정보취급방침</Link>
          <span className="text-white/25">·</span>
          <Link href="/video-policy" className="transition-colors hover:text-white">영상정보처리기기운영방침</Link>
          <span className="text-white/25">·</span>
          <Link href="/non-covered" className="transition-colors hover:text-white">비급여진료비안내</Link>
          <span className="text-white/25">·</span>
          <Link href="/admin/login" className="transition-colors hover:text-white">관리자모드</Link>
        </nav>

        <div className="mt-5 border-t border-white/12 pt-6">
          <p className="flex flex-wrap items-center gap-x-5 gap-y-1.5 text-sm font-medium text-white/80">
            <span>부산광역시 부산진구 가야대로 715 (부산 부산진구 당감동 974 위너스빌딩 1,2,3,4층)</span>
            <span className="text-white/25">·</span>
            <span>대표전화 : 051-935-1004</span>
            <span className="text-white/25">·</span>
            <span>사업자등록번호 : 605-92-44375</span>
            <span className="text-white/25">·</span>
            <span>병원장 : 이남, 김동한</span>
          </p>
          <p className="mt-2 text-xs font-medium text-white/40">
            Copyright (c) 2018 YS-CHEOK HOSPITAL All Rights Reserved Designed by 마케팅위너
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
