'use client';

import { useEffect, useMemo, useState } from 'react';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { createClient } from '@/utils/supabase/client';

type PopupItem = {
  id: string | number;
  title: string;
  content?: string | null;
  image_url?: string | null;
  display_slot?: number | null;
  starts_at?: string | null;
  ends_at?: string | null;
};

// 닫기를 누르면 오늘 자정까지 해당 팝업을 숨깁니다
const HIDE_KEY_PREFIX = 'hidePopup_';

// 다음 자정(오늘 끝나는 시각)의 타임스탬프
const getTodayEndTimestamp = () => {
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime();
};

const isWithinSchedule = (popup: PopupItem, now: number) => {
  if (popup.starts_at && now < new Date(popup.starts_at).getTime()) return false;
  if (popup.ends_at && now > new Date(popup.ends_at).getTime()) return false;
  return true;
};

const isHiddenByUser = (id: PopupItem['id']) => {
  try {
    const raw = localStorage.getItem(`${HIDE_KEY_PREFIX}${id}`);
    if (!raw) return false;
    // 자정이 지났으면 숨김 해제
    if (Date.now() >= parseInt(raw, 10)) {
      localStorage.removeItem(`${HIDE_KEY_PREFIX}${id}`);
      return false;
    }
    return true;
  } catch {
    return false;
  }
};

const MainPopup = () => {
  const pathname = usePathname();
  const [visiblePopups, setVisiblePopups] = useState<PopupItem[]>([]);
  const [isReady, setIsReady] = useState(false);

  const supabase = useMemo(() => createClient(), []);

  useEffect(() => {
    const fetchPopups = async () => {
      const { data } = await supabase
        .from('popups')
        .select('*')
        .eq('is_active', true)
        .not('display_slot', 'is', null)
        .order('display_slot', { ascending: true });

      const now = Date.now();
      const candidates = ((data || []) as PopupItem[])
        .filter((popup) => isWithinSchedule(popup, now))
        .filter((popup) => !isHiddenByUser(popup.id))
        .slice(0, 3);

      setVisiblePopups(candidates);
      setIsReady(true);
    };

    fetchPopups();
  }, [supabase]);

  if (pathname.startsWith('/admin')) return null;
  if (!isReady || visiblePopups.length === 0) return null;

  const closePopup = (id: PopupItem['id']) => {
    try {
      localStorage.setItem(`${HIDE_KEY_PREFIX}${id}`, String(getTodayEndTimestamp()));
    } catch {
      // localStorage 사용 불가 환경에서는 화면에서만 닫습니다
    }
    setVisiblePopups((prev) => prev.filter((popup) => popup.id !== id));
  };

  const closeAllPopups = () => {
    visiblePopups.forEach((popup) => closePopup(popup.id));
  };

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[2000] overflow-y-auto bg-black/70 px-4 py-16 sm:py-20"
      >
        {/* 모든 팝업 닫기 */}
        <div className="pointer-events-none sticky top-0 z-10 mb-6 flex justify-center">
          <button
            onClick={closeAllPopups}
            className="pointer-events-auto rounded-xl bg-white px-6 py-3 text-[15px] font-black tracking-tight text-ink shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-transform hover:-translate-y-0.5 sm:px-7 sm:text-[16px]"
          >
            오늘 하루 보지 않기
          </button>
        </div>

        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-start justify-center gap-4 sm:gap-5">
          {visiblePopups.map((popup, index) => (
            <motion.div
              key={popup.id}
              initial={{ opacity: 0, y: 24, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ type: 'spring', damping: 26, stiffness: 320, delay: 0.08 * index }}
              className="w-full max-w-[380px] overflow-hidden rounded-2xl bg-white shadow-[0_24px_60px_rgba(0,0,0,0.35)]"
            >
              {/* 팝업 이미지 (760 x 950 권장 비율로 고정) */}
              <img
                src={popup.image_url || '/ube_training.jpg'}
                alt={popup.title}
                className="block aspect-[4/5] w-full object-cover"
              />
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MainPopup;
