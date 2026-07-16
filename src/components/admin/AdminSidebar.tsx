'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LogOut, Calendar, MessageSquare, Settings, LayoutDashboard, Megaphone } from 'lucide-react';
import { adminLogout } from '@/app/admin/actions';

export default function AdminSidebar() {
  const pathname = usePathname();

  const menuItems = [
    { name: '통합 대시보드', href: '/admin', icon: <LayoutDashboard size={18} /> },
    { name: '온라인 예약 관리', href: '/admin/reservations', icon: <Calendar size={18} /> },
    { name: '온라인 상담 관리', href: '/admin/consultations', icon: <MessageSquare size={18} /> },
    { name: '메인 공지/휴진 관리', href: '/admin/notice-bar', icon: <Megaphone size={18} /> },
    { name: '공지 팝업 관리', href: '/admin/popups', icon: <Settings size={18} /> },
  ];

  return (
    <aside className="w-64 bg-[#172b4d] text-white hidden md:flex flex-col shadow-xl flex-shrink-0">
      <div className="p-8 pb-4">
        <h2 className="text-xl font-bold tracking-tight">연세척 관리자</h2>
        <p className="text-blue-300 text-[10px] mt-1 font-bold font-montserrat uppercase tracking-wider opacity-70">Hospital Admin System</p>
      </div>

      <nav className="flex-1 px-4 py-8 space-y-1.5">
        {menuItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link 
              key={item.href} 
              href={item.href} 
              className={`px-4 py-3.5 rounded-xl font-bold flex items-center gap-3 transition-all ${
                isActive 
                  ? 'bg-white/15 text-white shadow-lg shadow-black/10' 
                  : 'text-ink-muted hover:bg-white/5 hover:text-slate-200'
              }`}
            >
              {item.icon}
              <span className="text-[14.5px]">{item.name}</span>
            </Link>
          );
        })}
      </nav>

      <div className="p-4 border-t border-white/5">
        <form action={adminLogout}>
          <button type="submit" className="w-full flex items-center gap-2 justify-center py-3.5 bg-white/5 hover:bg-red-500/10 text-ink-muted hover:text-red-400 rounded-xl transition-all text-[13px] font-bold">
            <LogOut size={16} /> 로그아웃
          </button>
        </form>
      </div>
    </aside>
  );
}
