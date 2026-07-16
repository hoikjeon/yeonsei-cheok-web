'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

type PopupItem = {
  id: string | number;
  title: string;
  content?: string | null;
  image_url?: string | null;
};

const MainPopup = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [popups, setPopups] = useState<PopupItem[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const fetchActivePopups = async () => {
      const { data } = await supabase
        .from('popups')
        .select('*')
        .eq('is_active', true)
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        setPopups(data);
        
        // 24시간 동안 보지 않기 로직 체크
        const hideUntil = localStorage.getItem('hideMainPopup');
        if (!hideUntil || new Date().getTime() > parseInt(hideUntil)) {
          setIsOpen(true);
        }
      }
    };

    fetchActivePopups();
  }, [supabase]);

  // 자동 슬라이드 로직 (6초 간격, 팝업이 2개 이상일 때만 작동)
  useEffect(() => {
    if (!isOpen || popups.length <= 1) return;

    const intervalId = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % popups.length);
    }, 6000);

    return () => clearInterval(intervalId);
  }, [isOpen, popups.length]);

  if (pathname.startsWith('/admin')) return null;

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % popups.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + popups.length) % popups.length);
  };

  const closePopup = () => setIsOpen(false);

  const closeForDay = () => {
    // 현재 시간 + 24시간 저장
    const expiry = new Date().getTime() + 24 * 60 * 60 * 1000;
    localStorage.setItem('hideMainPopup', expiry.toString());
    setIsOpen(false);
  };

  if (!isOpen || popups.length === 0) return null;

  const currentPopup = popups[currentIndex];

  return (
    <AnimatePresence mode="wait">
      {isOpen && (
        <div className="pointer-events-none fixed inset-x-3 bottom-[calc(5.25rem_+_env(safe-area-inset-bottom))] top-auto z-[2000] sm:inset-x-auto sm:bottom-auto sm:left-6 sm:top-[96px] md:left-8 md:top-[120px]">
          <motion.div
            initial={{ opacity: 0, x: -50, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -50, scale: 0.9 }}
            transition={{ 
              type: 'spring', 
              damping: 25, 
              stiffness: 300,
              delay: 0.2
            }}
            className="group pointer-events-auto relative max-h-[calc(100dvh_-_6.5rem_-_env(safe-area-inset-bottom))] w-full max-w-[380px] overflow-y-auto rounded-[1.25rem] border border-slate-100 bg-white shadow-[0_20px_50px_rgba(0,0,0,0.2)] sm:w-[380px] sm:rounded-[2rem]"
          >
            {/* 🖼️ Main Ceremonial Image Area */}
            <div className="relative aspect-[4/3] overflow-hidden sm:aspect-[4/5]">
               <AnimatePresence mode="wait">
                 <motion.img 
                    key={`img-${currentPopup.id}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.6, ease: "easeInOut" }}
                    src={currentPopup.image_url || "/ube_training.jpg"}
                    alt={currentPopup.title} 
                    className="absolute inset-0 w-full h-full object-cover grayscale-[10%] transition-all duration-700"
                 />
               </AnimatePresence>
               
               {/* Elegant Gradient Overlay */}
               <div className="absolute inset-0 bg-gradient-to-t from-navy-950/90 via-navy-950/20 to-transparent opacity-90" />
               
               {/* Navigation Arrows (Visible on group hover) */}
               {popups.length > 1 && (
                 <>
                   <button 
                     onClick={handlePrev}
                     aria-label="이전 팝업 보기"
                     className="absolute left-3 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 text-white opacity-100 backdrop-blur-sm transition-all hover:bg-white/40 sm:left-4 sm:h-10 sm:w-10 sm:-translate-y-12 sm:bg-white/20 sm:opacity-0 sm:group-hover:opacity-100"
                   >
                     <ChevronLeft size={24} />
                   </button>
                   <button 
                     onClick={handleNext}
                     aria-label="다음 팝업 보기"
                     className="absolute right-3 top-1/2 z-30 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/25 text-white opacity-100 backdrop-blur-sm transition-all hover:bg-white/40 sm:right-4 sm:h-10 sm:w-10 sm:-translate-y-12 sm:bg-white/20 sm:opacity-0 sm:group-hover:opacity-100"
                   >
                     <ChevronRight size={24} />
                   </button>
                 </>
               )}

               {/* Floating Text Over Image */}
               <div className="absolute bottom-5 left-5 right-5 z-10 text-white sm:bottom-12 sm:left-8 sm:right-8">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`text-${currentPopup.id}`}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h3 className="mb-2 whitespace-pre-line break-keep text-h3 tracking-tight text-white sm:mb-3">
                        {currentPopup.title.replace(/\\n/g, '\n')}
                      </h3>
                      <p className="line-clamp-2 text-[13px] font-medium leading-relaxed text-slate-200 sm:text-sm sm:text-slate-300">
                        {currentPopup.content}
                      </p>
                    </motion.div>
                  </AnimatePresence>
               </div>
               
               {/* Slide Indicators */}
               {popups.length > 1 && (
                 <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 z-20">
                   {popups.map((_, index) => (
                     <button 
                       key={index} 
                       onClick={() => setCurrentIndex(index)}
                       aria-label={`${index + 1}번째 팝업 보기`}
                       className={`h-1.5 rounded-full transition-all duration-500 hover:bg-primary/80 ${index === currentIndex ? 'w-6 bg-primary' : 'w-1.5 bg-white/30'}`}
                     />
                   ))}
                 </div>
               )}
            </div>

            {/* 🔘 Control Actions */}
            <div className="flex border-t border-slate-100">
               <button 
                 onClick={closeForDay}
                 className="flex-1 border-r border-slate-100 bg-slate-50 py-3.5 text-[13px] font-bold text-ink-sub transition-colors hover:bg-slate-100 sm:py-5 sm:text-[14px]"
               >
                 오늘 하루 보지 않기
               </button>
               <button 
                 onClick={closePopup}
                 className="flex-1 bg-white py-3.5 text-[14px] font-bold tracking-tight text-ink transition-colors hover:bg-slate-50 sm:py-5 sm:text-[15px]"
               >
                 닫기
               </button>
            </div>
          </motion.div>
        </div>

      )}
    </AnimatePresence>

  );
};

export default MainPopup;
