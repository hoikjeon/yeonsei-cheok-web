'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  ArrowUp,
  ClipboardPlus,
  MapPin,
  MonitorPlay,
  PhoneCall,
  SquarePen,
} from 'lucide-react';

const QUICK_ITEMS = [
  {
    name: '예약상담',
    icon: <SquarePen size={22} />,
    href: '/reservation',
    primary: true,
  },
  {
    name: '전화문의',
    icon: <PhoneCall size={22} />,
    href: 'tel:0519351004',
  },
  {
    name: '오시는 길',
    icon: <MapPin size={22} />,
    href: '/about/location',
  },
  {
    name: '진료안내',
    icon: <ClipboardPlus size={22} />,
    href: '/#expertise',
  },
  {
    name: '연세척TV',
    icon: <MonitorPlay size={22} />,
    href: 'https://www.youtube.com/@BusanYS-tv/videos',
    external: true,
  },
];

const QuickMenu = () => {
  const [isTopVisible, setIsTopVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const toggleVisibility = () => {
      setIsTopVisible(window.scrollY > 300);
    };

    toggleVisibility();
    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  if (pathname.startsWith('/admin')) return null;

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <aside className="fixed bottom-20 right-3 z-[200] md:bottom-8 md:right-7">
      <nav
        aria-label="빠른 메뉴"
        className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/[0.92] shadow-[0_20px_60px_-38px_rgba(15,29,54,0.52)] backdrop-blur-xl"
      >
        <div className="flex w-[74px] flex-col md:w-[92px]">
          {QUICK_ITEMS.map((item) => (
            <Link
              key={item.name}
              href={item.href}
              target={item.external ? '_blank' : undefined}
              rel={item.external ? 'noopener noreferrer' : undefined}
              className={`group flex min-h-[74px] flex-col items-center justify-center gap-2 border-b border-slate-100 px-2 text-center transition-all last:border-b-0 md:min-h-[84px] ${
                item.primary
                  ? 'bg-primary text-white hover:bg-primary-dark'
                  : 'bg-white/90 text-ink hover:bg-primary-light hover:text-primary'
              }`}
            >
              <span
                className={`flex h-9 w-9 items-center justify-center rounded-xl transition-all md:h-10 md:w-10 ${
                  item.primary
                    ? 'bg-white/[0.16] text-white group-hover:bg-white/[0.22]'
                    : 'bg-slate-50 text-primary ring-1 ring-slate-100 group-hover:bg-white group-hover:ring-primary/[0.18]'
                }`}
              >
                {item.icon}
              </span>
              <span className="text-[12px] font-black leading-none tracking-tight md:text-[13px]">
                {item.name}
              </span>
            </Link>
          ))}
        </div>
      </nav>

      {isTopVisible && (
        <motion.button
          type="button"
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 8 }}
          transition={{ duration: 0.18 }}
          onClick={scrollToTop}
          className="mx-auto mt-3 flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/[0.92] text-ink shadow-[0_16px_34px_-26px_rgba(15,29,54,0.55)] backdrop-blur-xl transition-all hover:-translate-y-0.5 hover:bg-white active:scale-95"
          aria-label="맨 위로 이동"
        >
          <ArrowUp size={20} />
        </motion.button>
      )}
    </aside>
  );
};

export default QuickMenu;
