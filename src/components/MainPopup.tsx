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

const HIDE_KEY_PREFIX = 'hidePopup_';
const HIDE_DURATION_MS = 24 * 60 * 60 * 1000;

const isWithinSchedule = (popup: PopupItem, now: number) => {
  if (popup.starts_at && now < new Date(popup.starts_at).getTime()) return false;
  if (popup.ends_at && now > new Date(popup.ends_at).getTime()) return false;
  return true;
};

const isHiddenByUser = (id: PopupItem['id']) => {
  try {
    const raw = localStorage.getItem(`${HIDE_KEY_PREFIX}${id}`);
    if (!raw) return false;
    if (Date.now() > parseInt(raw, 10)) {
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
  const [todayChecked, setTodayChecked] = useState<Record<string, boolean>>({});
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
    if (todayChecked[String(id)]) {
      try {
        localStorage.setItem(`${HIDE_KEY_PREFIX}${id}`, String(Date.now() + HIDE_DURATION_MS));
      } catch {
        // localStorage 사용 불가 환경에서는 세션 내 닫기만 적용
      }
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
            모든 팝업 닫기
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
              {/* 상단 컨트롤 바 */}
              <div className="flex items-center justify-between border-b border-slate-100 bg-white px-4 py-3">
                <label className="flex cursor-pointer items-center gap-2 text-[13px] font-bold text-ink-sub">
                  <input
                    type="checkbox"
                    checked={!!todayChecked[String(popup.id)]}
                    onChange={(event) =>
                      setTodayChecked((prev) => ({ ...prev, [String(popup.id)]: event.target.checked }))
                    }
                    className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary"
                  />
                  오늘 하루 보지 않기
                </label>
                <button
                  onClick={() => closePopup(popup.id)}
                  className="text-[14px] font-bold text-ink transition-colors hover:text-primary"
                >
                  닫기
                </button>
              </div>

              {/* 이미지 + 문구 */}
              <div className="relative aspect-[4/5] overflow-hidden">
                <img
                  src={popup.image_url || '/ube_training.jpg'}
                  alt={popup.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-navy-950/85 via-navy-950/10 to-transparent" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <h3 className="mb-2 whitespace-pre-line break-keep text-h4 tracking-tight text-white">
                    {popup.title.replace(/\\n/g, '\n')}
                  </h3>
                  {popup.content && (
                    <p className="line-clamp-2 text-[13px] font-medium leading-relaxed text-slate-200">
                      {popup.content}
                    </p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </AnimatePresence>
  );
};

export default MainPopup;
