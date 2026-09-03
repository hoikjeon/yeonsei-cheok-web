'use client';

import Link from 'next/link';
import { LayoutDashboard, LockKeyhole, PhoneCall } from 'lucide-react';
import { usePathname } from 'next/navigation';

const tabs = [
  { label: '상담 현황', href: '/admin/consultations', icon: LayoutDashboard },
  { label: '일반 문의', href: '/admin/consultations/general', icon: PhoneCall },
  { label: '회원 1:1 문의', href: '/admin/consultations/member', icon: LockKeyhole },
];

export default function ConsultationAdminTabs() {
  const pathname = usePathname();

  return (
    <nav aria-label="상담 관리 메뉴" className="overflow-x-auto border-b border-slate-200 bg-white">
      <div className="flex min-w-max gap-1 px-5 md:px-10">
        {tabs.map((tab) => {
          const active = tab.href === '/admin/consultations'
            ? pathname === tab.href
            : pathname.startsWith(tab.href);
          const Icon = tab.icon;

          return (
            <Link
              key={tab.href}
              href={tab.href}
              aria-current={active ? 'page' : undefined}
              className={`relative inline-flex min-h-14 items-center gap-2 px-4 text-sm font-black transition-colors ${
                active ? 'text-primary' : 'text-ink-muted hover:text-ink'
              }`}
            >
              <Icon size={17} />
              {tab.label}
              {active && <span className="absolute inset-x-3 bottom-0 h-0.5 bg-primary" />}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}

