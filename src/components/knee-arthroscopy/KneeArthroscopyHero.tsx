import Link from 'next/link';
import { ChevronRight, Home } from 'lucide-react';

export default function KneeArthroscopyHero() {
  return (
    <section className="border-b border-slate-200 bg-[#F3F5F7] px-5 sm:px-6">
      <div className="relative mx-auto max-w-7xl overflow-hidden py-8 md:py-12">
        <nav aria-label="현재 위치" className="relative z-10 flex flex-wrap items-center gap-2 text-xs text-slate-500 sm:text-sm">
          <Link href="/" aria-label="홈으로" className="hover:text-navy-900"><Home size={15} /></Link>
          <ChevronRight aria-hidden size={12} />
          <Link href="/treatments" className="hover:text-navy-900">관절센터</Link>
          <ChevronRight aria-hidden size={12} />
          <Link href="/treatments/joint/knee" className="hover:text-navy-900">무릎 관절</Link>
          <ChevronRight aria-hidden size={12} />
          <span aria-current="page" className="text-slate-600">무릎관절내시경</span>
        </nav>
        <div className="grid gap-4 pb-3 pt-8 md:grid-cols-2 md:items-end md:gap-16 md:pb-6 md:pt-12">
          <h1 className="break-keep text-display tracking-tight text-navy-900">무릎관절내시경</h1>
          <p className="max-w-lg break-keep text-sm leading-[1.8] text-slate-600 sm:text-base md:text-lg">
            증상과 영상검사 결과를 함께 살펴<br className="hidden sm:block" /> 관절 안쪽의 원인을 세밀하게 확인합니다.
          </p>
        </div>
      </div>
    </section>
  );
}
