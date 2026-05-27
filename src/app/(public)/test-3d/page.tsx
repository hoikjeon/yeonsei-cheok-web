import { GlassSphereScene } from "@/components/ui/GlassSphereScene";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "3D 유리 왜곡 | 연세척병원",
  description: "연세척병원 3D 안티그래비티 유리 구슬 테스트 페이지",
};

export default function Test3DPage() {
  return (
    <main className="relative w-full h-screen bg-[#121212] overflow-hidden selection:bg-white/20">
      {/* 3D Scene renders behind everything */}
      <GlassSphereScene />

      {/* Navigation Buttons (Top Right) */}
      <div className="absolute top-6 right-6 flex gap-4 z-20">
        <Link 
          href="/"
          className="flex items-center justify-center w-12 h-12 rounded-full border border-white/10 bg-black/20 backdrop-blur-md text-white hover:bg-white/10 transition-colors"
          title="재실행"
        >
          <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
          </svg>
        </Link>
        <Link 
          href="/"
          className="flex items-center justify-center w-12 h-12 rounded-full border border-white/10 bg-black/20 backdrop-blur-md text-white hover:bg-white/10 transition-colors"
          title="메인으로 이동"
        >
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
      
    </main>
  );
}
