'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Clock, Phone } from 'lucide-react';

const NAVER_MAP_QUERY = '부산 부산진구 가야대로 715 연세척병원';
const NAVER_MAP_URL = `https://map.naver.com/p/search/${encodeURIComponent(NAVER_MAP_QUERY)}`;

export default function FooterLocationSection() {
  const pathname = usePathname();

  if (pathname === '/login') return null;

  return (
    <section className="border-t border-slate-100 bg-white py-16">
      <div className="mx-auto grid max-w-7xl px-7 xl:px-10 grid-cols-1 gap-10 lg:grid-cols-[0.78fr_1.22fr] lg:items-stretch">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-1">
          <div className="rounded-2xl border border-slate-100 bg-white p-7 shadow-[0_24px_70px_-54px_rgba(15,29,54,0.45)]">
            <div className="mb-5 flex items-center gap-3">
              <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary-light text-primary">
                <Clock size={22} />
              </span>
              <h2 className="text-h3 tracking-tight text-ink">진료 시간</h2>
            </div>
            <dl className="space-y-3 text-[15px]">
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                <dt className="font-bold text-ink-muted">평일</dt>
                <dd className="font-bold text-ink">09:00 - 17:30</dd>
              </div>
              <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
                <dt className="font-bold text-ink-muted">토요일</dt>
                <dd className="font-bold text-ink">09:00 - 13:00</dd>
              </div>
              <div className="flex items-center justify-between gap-4">
                <dt className="font-bold text-ink-muted">점심시간</dt>
                <dd className="font-bold text-ink">12:30 - 13:30</dd>
              </div>
            </dl>
            <div className="mt-5 flex items-center gap-3 rounded-xl bg-slate-50 px-4 py-3">
              <Phone size={18} className="text-primary" />
              <span className="text-sm font-bold text-ink-muted">전화문의</span>
              <Link href="tel:051-935-1004" className="text-lg font-bold tracking-tight text-ink">
                051-935-1004
              </Link>
            </div>
          </div>
        </div>

        <div className="min-h-[360px] overflow-hidden rounded-2xl border border-slate-100 bg-slate-50 shadow-[0_28px_90px_-62px_rgba(15,29,54,0.5)]">
          <iframe
            src={NAVER_MAP_URL}
            title="연세척병원 네이버 지도"
            width="100%"
            height="100%"
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            className="h-[360px] w-full border-0 lg:h-full"
          />
        </div>
      </div>
    </section>
  );
}
