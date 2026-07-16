'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { AnimatePresence, motion } from 'framer-motion';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { createClient } from '@/utils/supabase/client';
import {
  DEFAULT_HOME_NOTICE_SETTINGS,
  HOME_NOTICE_SETTINGS_ID,
  type HomeNoticeItem,
  type HomeNoticeSettings,
  normalizeHomeNoticeSettings,
} from '@/lib/homeNoticeSettings';

const isExternalHref = (href: string) =>
  href.startsWith('http://') || href.startsWith('https://') || href.startsWith('tel:') || href.startsWith('mailto:');

function NoticeLink({ notice }: { notice: HomeNoticeItem }) {
  const className =
    'line-clamp-2 block min-w-0 break-keep text-body font-medium tracking-tight text-white md:truncate md:leading-normal';

  if (isExternalHref(notice.href)) {
    return (
      <a href={notice.href} target="_blank" rel="noopener noreferrer" className={className}>
        {notice.title}
      </a>
    );
  }

  return (
    <Link href={notice.href} className={className}>
      {notice.title}
    </Link>
  );
}

export default function HomeNoticeBar() {
  const supabase = useMemo(() => createClient(), []);
  const [settings, setSettings] = useState<HomeNoticeSettings>(DEFAULT_HOME_NOTICE_SETTINGS);
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchSettings = async () => {
      const { data } = await supabase
        .from('home_notice_settings')
        .select('*')
        .eq('id', HOME_NOTICE_SETTINGS_ID)
        .maybeSingle();

      if (isMounted && data) {
        setSettings(normalizeHomeNoticeSettings(data));
      }
    };

    fetchSettings();

    return () => {
      isMounted = false;
    };
  }, [supabase]);

  useEffect(() => {
    if (settings.notices.length <= 1) return;

    const timerId = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % settings.notices.length);
    }, 6500);

    return () => window.clearInterval(timerId);
  }, [settings.notices.length]);

  if (!settings.is_active) return null;

  const notices = settings.notices;
  const safeActiveIndex = notices.length > 0 ? activeIndex % notices.length : 0;
  const currentNotice = notices[safeActiveIndex] ?? notices[0] ?? DEFAULT_HOME_NOTICE_SETTINGS.notices[0];

  const moveNotice = (direction: 'prev' | 'next') => {
    if (notices.length <= 1) return;

    setActiveIndex((current) => {
      if (direction === 'next') return (current + 1) % notices.length;
      return (current - 1 + notices.length) % notices.length;
    });
  };

  return (
    <section className="relative z-30 bg-gradient-to-r from-[#17326F] via-[#284AA5] to-[#3C63C4] shadow-[0_22px_60px_-34px_rgba(10,20,40,0.45)]">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-0 px-5 py-4 text-white sm:px-6 md:h-24 md:grid-cols-[minmax(0,1fr)_1px_minmax(0,1fr)] md:items-center md:gap-8 md:py-0">
        <div className="grid min-w-0 grid-cols-[72px_minmax(0,1fr)] items-start gap-3 md:grid-cols-[108px_minmax(0,1fr)_42px] md:items-center md:gap-5">
          <div className="flex items-center">
            <span className="pt-0.5 text-body-lg font-bold tracking-tight md:pt-0">공지사항</span>
          </div>

          <div className="relative min-w-0 overflow-hidden" aria-live="polite">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={`${safeActiveIndex}-${currentNotice.title}`}
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -12 }}
                transition={{ duration: 0.22, ease: 'easeOut' }}
              >
                <NoticeLink notice={currentNotice} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="hidden items-center justify-center gap-1 md:flex">
            <button
              type="button"
              aria-label="이전 공지 보기"
              onClick={() => moveNotice('prev')}
              disabled={notices.length <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/90 transition hover:bg-white/15 disabled:cursor-default disabled:text-white/35 disabled:hover:bg-transparent"
            >
              <ChevronUp size={18} />
            </button>
            <button
              type="button"
              aria-label="다음 공지 보기"
              onClick={() => moveNotice('next')}
              disabled={notices.length <= 1}
              className="flex h-8 w-8 items-center justify-center rounded-lg text-white/90 transition hover:bg-white/15 disabled:cursor-default disabled:text-white/35 disabled:hover:bg-transparent"
            >
              <ChevronDown size={18} />
            </button>
          </div>
        </div>

        <div className="hidden h-10 w-px bg-white/35 md:block" />

        <div className="mt-3 grid min-w-0 grid-cols-[72px_minmax(0,1fr)] gap-3 border-t border-white/20 pt-3 md:mt-0 md:grid-cols-[108px_minmax(0,1fr)] md:items-center md:gap-5 md:border-t-0 md:pt-0">
          <div className="flex items-center">
            <span className="pt-0.5 text-body-lg font-bold tracking-tight md:pt-0">휴진일</span>
          </div>
          <div className="flex min-w-0 flex-wrap items-baseline gap-x-3 gap-y-1 md:items-center md:gap-x-5">
            <span className="text-h4 font-bold tracking-tight text-white">
              {settings.closed_month}
            </span>
            <span className="min-w-0 break-keep text-body font-medium text-white/90 md:leading-normal">
              {settings.closed_message}
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}
