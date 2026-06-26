'use client';

import React, { useState, useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trophy, ChevronLeft, ChevronRight } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';

const MainPopup = () => {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [popups, setPopups] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  const supabase = createClient();

  if (pathname.startsWith('/admin')) return null;

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
        <div className="fixed left-8 top-[120px] z-[2000] pointer-events-none">
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
            className="relative w-[380px] bg-white rounded-[2rem] overflow-hidden shadow-[0_20px_50px_rgba(0,0,0,0.2)] border border-slate-100 pointer-events-auto group"
          >
            {/* 🖼️ Main Ceremonial Image Area */}
            <div className="relative aspect-[4/5] overflow-hidden">
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
                     className="absolute left-4 top-1/2 -translate-y-12 w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/40 text-white rounded-full transition-all backdrop-blur-sm z-30 opacity-0 group-hover:opacity-100"
                   >
                     <ChevronLeft size={24} />
                   </button>
                   <button 
                     onClick={handleNext}
                     className="absolute right-4 top-1/2 -translate-y-12 w-10 h-10 flex items-center justify-center bg-white/20 hover:bg-white/40 text-white rounded-full transition-all backdrop-blur-sm z-30 opacity-0 group-hover:opacity-100"
                   >
                     <ChevronRight size={24} />
                   </button>
                 </>
               )}

               {/* Floating Text Over Image */}
               <div className="absolute bottom-12 left-8 right-8 z-10 text-white">
                  <AnimatePresence mode="wait">
                    <motion.div
                      key={`text-${currentPopup.id}`}
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: -10, opacity: 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <h3 className="text-[26px] md:text-[28px] font-black tracking-tighter leading-[1.3] text-white whitespace-pre-line mb-3">
                        {currentPopup.title.replace(/\\n/g, '\n')}
                      </h3>
                      <p className="text-slate-300 text-sm font-medium line-clamp-2 leading-relaxed">
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
                 className="flex-1 py-5 bg-slate-50 hover:bg-slate-100 text-ink-muted font-bold transition-colors text-[14px] border-r border-slate-100"
               >
                 오늘 하루 보지 않기
               </button>
               <button 
                 onClick={closePopup}
                 className="flex-1 py-5 bg-white hover:bg-slate-50 text-ink font-black transition-colors text-[15px] tracking-tight"
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
