'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  SquarePen, 
  MapPin, 
  ClipboardPlus, 
  CheckCircle2, 
  Zap, 
  ArrowUp 
} from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const QUICK_ITEMS = [
  { name: '예약/상담', icon: <SquarePen size={26} />, href: '/reservation' },
  { name: '오시는 길', icon: <MapPin size={26} />, href: '/about/location' }, 
  { name: '진료안내', icon: <ClipboardPlus size={26} />, href: '/#expertise' },
  { name: '자가테스트', icon: <CheckCircle2 size={26} />, href: '/board/self-diagnosis' },
];

const QuickMenu = () => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);
  const pathname = usePathname();

  const handleMouseEnter = () => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setIsExpanded(true);
  };

  const handleMouseLeave = () => {
    // 0.5초(500ms) 지연 후 메뉴 닫기
    timeoutRef.current = setTimeout(() => {
      setIsExpanded(false);
    }, 500);
  };

  // Scroll visibility for Top button
  useEffect(() => {
    const toggleVisibility = () => {
      if (window.scrollY > 300) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };
    window.addEventListener('scroll', toggleVisibility);
    return () => {
      window.removeEventListener('scroll', toggleVisibility);
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  if (pathname.startsWith('/admin')) return null;

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  return (
    <div className="fixed right-8 bottom-8 z-[200] flex flex-col items-center gap-4">
      {/* 🚀 Expandable Menu List */}
      <div 
        className="flex flex-col items-center"
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
              className="bg-navy-950 rounded-t-[40px] px-4 pt-10 pb-6 flex flex-col items-center gap-8 shadow-2xl mb-[-40px]"
            >
              {QUICK_ITEMS.map((item) => (
                <Link 
                  key={item.name} 
                  href={item.href}
                  className="flex flex-col items-center gap-2 group"
                >
                  <div className="w-14 h-14 rounded-full flex items-center justify-center text-white/70 group-hover:text-white group-hover:bg-white/10 transition-all">
                    {item.icon}
                  </div>
                  <span className="text-[13px] font-bold text-white/80 group-hover:text-primary-light whitespace-nowrap px-4 tracking-tighter text-center">
                    {item.name}
                  </span>
                </Link>
              ))}
              {/* Extra spacing for the overlap with lightning button */}
              <div className="h-10" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* ⚡ Lightning Quick Menu Button (Trigger) */}
        <button 
          className={`w-20 h-20 rounded-full flex flex-col items-center justify-center gap-1 transition-all duration-300 z-10 shadow-premium ${
            isExpanded ? 'bg-primary scale-110 shadow-blue-glow' : 'bg-navy-950 hover:bg-primary'
          }`}
        >
          <Zap size={32} className="text-white fill-white" />
          <span className="text-[11px] font-black text-white">퀵메뉴</span>
        </button>
      </div>

      {/* 🔝 Scroll To Top Button Refined */}
      {isVisible && (
        <button
          onClick={scrollToTop}
          className="w-20 h-20 bg-white/80 backdrop-blur-md border border-slate-300 rounded-full flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.2)] hover:bg-white transition-all active:scale-90 group"
        >
          <ArrowUp size={28} className="text-navy-950 group-hover:-translate-y-1 transition-transform stroke-[2]" />
        </button>
      )}
    </div>
  );
};

export default QuickMenu;
