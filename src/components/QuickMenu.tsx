'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUp,
  CalendarDays,
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
    name: '진료일정',
    icon: <CalendarDays size={22} />,
    href: '/doctors',
  },
  {
    name: '연세척TV',
    icon: <MonitorPlay size={22} />,
    href: 'https://www.youtube.com/@BusanYS-tv/videos',
    external: true,
  },
];

const MOBILE_QUICK_ITEMS = [
  {
    name: '전화상담',
    icon: <PhoneCall size={22} strokeWidth={1.8} />,
    href: 'tel:0519351004',
  },
  {
    name: '예약/상담',
    icon: <SquarePen size={22} strokeWidth={1.8} />,
    href: '/reservation',
  },
  {
    name: '오시는 길',
    icon: <MapPin size={22} strokeWidth={1.8} />,
    href: '/about/location',
  },
  {
    name: '진료안내',
    icon: <CalendarDays size={22} strokeWidth={1.8} />,
    href: '/doctors#doctor-schedule',
  },
];

const SCROLL_REVEAL_OFFSET = 300;

const QuickMenu = () => {
  const [isVisible, setIsVisible] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const toggleVisibility = () => {
      setIsVisible(window.scrollY > SCROLL_REVEAL_OFFSET);
    };

    toggleVisibility();
    window.addEventListener('scroll', toggleVisibility, { passive: true });

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
    <>
      <nav
        aria-label="모바일 빠른 메뉴"
        className="fixed inset-x-0 bottom-0 z-[220] overflow-hidden rounded-t-[26px] border-t border-white/10 bg-[#10346f]/[0.98] pb-[env(safe-area-inset-bottom)] text-white shadow-[0_-12px_34px_-24px_rgba(8,27,62,0.85)] backdrop-blur-xl lg:hidden"
      >
        <div className="mx-auto grid min-h-[68px] max-w-3xl grid-cols-4">
          {MOBILE_QUICK_ITEMS.map((item) => {
            const itemPathname = item.href.startsWith('/') ? item.href.split('#')[0] : '';
            const isActive = itemPathname !== '' && pathname === itemPathname;

            return (
              <Link
                key={item.name}
                href={item.href}
                aria-current={isActive ? 'page' : undefined}
                className={`group flex min-w-0 flex-col items-center justify-center gap-1.5 px-1 py-2 text-center transition-colors active:bg-white/10 ${
                  isActive ? 'bg-white/10 text-white' : 'text-white/80'
                }`}
              >
                <span className="flex h-7 w-7 items-center justify-center text-white/90 transition-transform group-active:scale-95">
                  {item.icon}
                </span>
                <span className="whitespace-nowrap text-[12px] font-bold leading-none tracking-tight">
                  {item.name}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      <AnimatePresence>
        {isVisible && (
          <motion.aside
            initial={{ opacity: 0, y: 18, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.96 }}
            transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="fixed bottom-8 right-7 z-[200] hidden lg:block"
          >
            <nav
              aria-label="빠른 메뉴"
              className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white/[0.94] shadow-[0_20px_60px_-38px_rgba(15,29,54,0.52)] backdrop-blur-xl"
            >
              <div className="flex w-[92px] flex-col">
                {QUICK_ITEMS.map((item) => (
                  <Link
                    key={item.name}
                    href={item.href}
                    target={item.external ? '_blank' : undefined}
                    rel={item.external ? 'noopener noreferrer' : undefined}
                    className={`group flex min-h-[82px] flex-col items-center justify-center gap-2.5 border-b border-slate-100 px-2 text-center transition-all ${
                      item.primary
                        ? 'bg-primary text-white hover:bg-primary-dark'
                        : 'bg-white/90 text-ink hover:bg-primary-light hover:text-primary'
                    }`}
                  >
                    <span className="flex h-7 w-7 items-center justify-center transition-transform duration-300 group-hover:scale-110">
                      {item.icon}
                    </span>
                    <span className="text-[13px] font-black leading-none tracking-tight">
                      {item.name}
                    </span>
                  </Link>
                ))}

                <button
                  type="button"
                  onClick={scrollToTop}
                  className="group flex min-h-[70px] flex-col items-center justify-center gap-2 bg-white/90 px-2 text-center text-ink transition-all hover:bg-navy-950 hover:text-white"
                  aria-label="맨 위로 이동"
                >
                  <ArrowUp size={22} />
                  <span className="text-[12px] font-black leading-none tracking-tight">위로</span>
                </button>
              </div>
            </nav>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
};

export default QuickMenu;
