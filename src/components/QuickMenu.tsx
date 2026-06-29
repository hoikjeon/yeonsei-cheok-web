'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowUp,
  ClipboardPlus,
  MapPin,
  Menu,
  MonitorPlay,
  PhoneCall,
  SquarePen,
  X,
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

const SCROLL_REVEAL_OFFSET = 300;

const QuickMenu = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const toggleVisibility = () => {
      const shouldShow = window.scrollY > SCROLL_REVEAL_OFFSET;
      setIsVisible(shouldShow);

      if (!shouldShow) {
        setIsMobileMenuOpen(false);
      }
    };

    toggleVisibility();
    window.addEventListener('scroll', toggleVisibility);

    return () => window.removeEventListener('scroll', toggleVisibility);
  }, []);

  if (pathname.startsWith('/admin')) return null;

  const scrollToTop = () => {
    setIsMobileMenuOpen(false);
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.aside
          initial={{ opacity: 0, y: 18, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.96 }}
          transition={{ duration: 0.24, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-5 right-4 z-[200] md:bottom-8 md:right-7"
        >
          <nav
            aria-label="빠른 메뉴"
            className="hidden overflow-hidden rounded-2xl border border-slate-200/80 bg-white/[0.94] shadow-[0_20px_60px_-38px_rgba(15,29,54,0.52)] backdrop-blur-xl md:block"
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

          <div className="relative md:hidden">
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.nav
                  key="mobile-quick-menu"
                  id="mobile-quick-menu"
                  initial={{ opacity: 0, y: 12, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 10, scale: 0.96 }}
                  transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
                  aria-label="모바일 빠른 메뉴"
                  className="absolute bottom-[68px] right-0 w-[176px] overflow-hidden rounded-2xl border border-slate-200/80 bg-white/[0.96] shadow-[0_22px_60px_-34px_rgba(15,29,54,0.55)] backdrop-blur-xl"
                >
                  {QUICK_ITEMS.map((item) => (
                    <Link
                      key={item.name}
                      href={item.href}
                      target={item.external ? '_blank' : undefined}
                      rel={item.external ? 'noopener noreferrer' : undefined}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex min-h-[54px] items-center gap-3 border-b border-slate-100 px-4 text-[14px] font-black tracking-tight transition-colors last:border-b-0 ${
                        item.primary
                          ? 'bg-primary text-white'
                          : 'bg-white text-ink hover:bg-primary-light hover:text-primary'
                      }`}
                    >
                      <span className="flex h-6 w-6 items-center justify-center">
                        {item.icon}
                      </span>
                      {item.name}
                    </Link>
                  ))}

                  <button
                    type="button"
                    onClick={scrollToTop}
                    className="flex min-h-[54px] w-full items-center gap-3 bg-white px-4 text-left text-[14px] font-black tracking-tight text-ink transition-colors hover:bg-navy-950 hover:text-white"
                  >
                    <ArrowUp size={22} />
                    맨 위로
                  </button>
                </motion.nav>
              )}
            </AnimatePresence>

            <button
              type="button"
              onClick={() => setIsMobileMenuOpen((current) => !current)}
              aria-expanded={isMobileMenuOpen}
              aria-controls="mobile-quick-menu"
              className="flex h-14 items-center gap-2 rounded-full bg-primary px-4 text-[14px] font-black tracking-tight text-white shadow-[0_18px_40px_-20px_rgba(40,74,165,0.85)] transition-all active:scale-95"
            >
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              퀵메뉴
            </button>
          </div>
        </motion.aside>
      )}
    </AnimatePresence>
  );
};

export default QuickMenu;
