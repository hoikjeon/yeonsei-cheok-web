'use client';

import { useCallback, useEffect, useMemo, useRef, useState, useSyncExternalStore } from 'react';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { X } from 'lucide-react';
import type { PopupItem } from '@/lib/popupData';

// 닫기를 누르면 오늘 자정까지 해당 팝업을 숨깁니다
const HIDE_KEY_PREFIX = 'hidePopup_';

// 다음 자정(오늘 끝나는 시각)의 타임스탬프
const getTodayEndTimestamp = () => {
  const midnight = new Date();
  midnight.setHours(24, 0, 0, 0);
  return midnight.getTime();
};

const hiddenPopupListeners = new Set<() => void>();

const subscribeToHiddenPopups = (onChange: () => void) => {
  hiddenPopupListeners.add(onChange);
  // 다른 탭에서 닫은 경우에도 맞춥니다.
  window.addEventListener('storage', onChange);
  return () => {
    hiddenPopupListeners.delete(onChange);
    window.removeEventListener('storage', onChange);
  };
};

const notifyHiddenPopupsChanged = () => {
  hiddenPopupListeners.forEach((listener) => listener());
};

/**
 * 숨김 처리된 팝업 id 를 '|' 로 이어 붙인 값.
 *
 * useSyncExternalStore 는 Object.is 로 비교하므로 문자열을 돌려주면 매번 새로
 * 만들어도 안전합니다. 자정이 지난 항목은 건너뛰기만 합니다. 여기서 지우면
 * 렌더 중에 외부 상태를 바꾸는 셈이 되기 때문입니다.
 */
const getHiddenPopupsSnapshot = () => {
  try {
    const now = Date.now();
    const ids: string[] = [];

    for (let index = 0; index < localStorage.length; index += 1) {
      const key = localStorage.key(index);
      if (!key?.startsWith(HIDE_KEY_PREFIX)) continue;

      const until = parseInt(localStorage.getItem(key) ?? '', 10);
      if (Number.isNaN(until) || now >= until) continue;

      ids.push(key.slice(HIDE_KEY_PREFIX.length));
    }

    return ids.sort().join('|');
  } catch {
    // localStorage 를 못 쓰는 환경에서는 숨김 없이 그대로 보여줍니다.
    return '';
  }
};

/** 서버는 localStorage 를 알 수 없습니다. 아직 확인 전임을 null 로 나타냅니다. */
const getHiddenPopupsServerSnapshot = () => null;

const rememberHidden = (id: PopupItem['id']) => {
  try {
    localStorage.setItem(`${HIDE_KEY_PREFIX}${id}`, String(getTodayEndTimestamp()));
  } catch {
    // localStorage 사용 불가 환경에서는 이 탭에서만 닫힌 상태가 유지됩니다.
  }
};

/**
 * 팝업 데이터는 서버에서 받아옵니다(src/lib/popupData.ts).
 *
 * "오늘 하루 보지 않기"는 localStorage 에 있어 서버가 알 수 없습니다. 그래서
 * 서버와 첫 렌더는 팝업을 모두 그리되 화면에서는 감춰 두고, 마운트 직후
 * localStorage 를 확인해 보여줄 것만 남깁니다. 마크업이 서버 HTML 에 들어 있어야
 * Next 가 첫 팝업 이미지의 미리 불러오기 링크를 넣어 주기 때문입니다.
 *
 * 감춘 상태로 시작하므로 이미 닫은 팝업이 깜빡 보이는 일은 없습니다.
 */
const MainPopup = ({ popups }: { popups: PopupItem[] }) => {
  const pathname = usePathname();

  // 하이드레이션 전에는 서버와 같은 null 을 받고, 그 뒤 localStorage 값을 읽습니다.
  const hiddenSnapshot = useSyncExternalStore(
    subscribeToHiddenPopups,
    getHiddenPopupsSnapshot,
    getHiddenPopupsServerSnapshot,
  );
  const checked = hiddenSnapshot !== null;

  // 좁은 화면에서는 좌우로 넘겨 보므로, 지금 보고 있는 팝업이 몇 번째인지 표시합니다.
  const [activeIndex, setActiveIndex] = useState(0);
  const scrollerRef = useRef<HTMLDivElement>(null);

  // 팝업은 첫 화면(홈)에서만 띄웁니다.
  // 예약·오시는 길·로그인처럼 목적을 갖고 들어온 페이지를 가리면 이탈로 이어집니다.
  const isHome = pathname === '/';

  // 확인이 끝나기 전에는 서버와 같은 마크업을 그려야 하이드레이션이 어긋나지 않습니다.
  const visiblePopups = useMemo(() => {
    if (hiddenSnapshot === null) return popups;
    const hiddenIds = hiddenSnapshot ? hiddenSnapshot.split('|') : [];
    return popups.filter((popup) => !hiddenIds.includes(popup.id));
  }, [popups, hiddenSnapshot]);

  const hidePopup = useCallback((id: PopupItem['id']) => {
    rememberHidden(id);
    notifyHiddenPopupsChanged();
  }, []);

  const hideAllPopups = useCallback(() => {
    popups.forEach((popup) => rememberHidden(popup.id));
    notifyHiddenPopupsChanged();
  }, [popups]);

  // 가운데에 가장 가까운 카드를 현재 카드로 봅니다. 카드 폭이 화면마다 달라도 그대로 맞습니다.
  const syncActiveIndex = useCallback(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;

    const center = scroller.scrollLeft + scroller.clientWidth / 2;
    let nearest = 0;
    let nearestDistance = Number.POSITIVE_INFINITY;

    Array.from(scroller.children).forEach((child, index) => {
      const item = child as HTMLElement;
      const distance = Math.abs(item.offsetLeft + item.offsetWidth / 2 - center);
      if (distance < nearestDistance) {
        nearestDistance = distance;
        nearest = index;
      }
    });

    setActiveIndex(nearest);
  }, []);

  const scrollToPopup = useCallback((index: number) => {
    const target = scrollerRef.current?.children[index] as HTMLElement | undefined;
    target?.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
  }, []);

  // ESC 로도 닫을 수 있어야 합니다.
  useEffect(() => {
    if (!checked || visiblePopups.length === 0) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') hideAllPopups();
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [checked, visiblePopups.length, hideAllPopups]);

  if (!isHome) return null;
  if (visiblePopups.length === 0) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="병원 안내 팝업"
      // 확인이 끝날 때까지 감춰 둡니다. 이미지는 감춰진 동안에도 내려받습니다.
      aria-hidden={!checked}
      className={`fixed inset-0 z-[2000] overflow-y-auto bg-black/70 px-4 py-16 transition-opacity duration-200 sm:py-20 ${
        checked ? 'opacity-100' : 'pointer-events-none invisible opacity-0'
      }`}
    >
      {/* 모든 팝업 닫기 */}
      <div className="pointer-events-none sticky top-0 z-10 mb-6 flex justify-center">
        <button
          type="button"
          onClick={hideAllPopups}
          tabIndex={checked ? 0 : -1}
          className="pointer-events-auto rounded-xl bg-white px-6 py-3 text-[15px] font-black tracking-tight text-ink shadow-[0_10px_30px_rgba(0,0,0,0.35)] transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white sm:px-7 sm:text-[16px]"
        >
          오늘 하루 보지 않기
        </button>
      </div>

      {/* 넓은 화면(xl~)에서는 세 개를 한 줄에 놓습니다. 줄바꿈되면 세 번째 팝업이
            화면 아래로 잘려 스크롤해야 보이기 때문입니다. 폭이 모자라면 정사각형을
            유지한 채 셋이 같은 비율로 줄어듭니다. */}
      <div
        ref={scrollerRef}
        onScroll={syncActiveIndex}
        className="mx-auto flex w-full max-w-[1580px] snap-x snap-mandatory items-start gap-4 overflow-x-auto overscroll-x-contain [scrollbar-width:none] sm:gap-5 xl:snap-none xl:justify-center xl:overflow-x-visible [&::-webkit-scrollbar]:hidden"
      >
        {visiblePopups.map((popup, index) => (
          <div
            key={popup.id}
            className="relative w-full max-w-[380px] shrink-0 snap-center overflow-hidden bg-white shadow-[0_24px_60px_rgba(0,0,0,0.35)] first:ml-auto last:mr-auto xl:min-w-0 xl:max-w-[500px] xl:shrink xl:basis-[500px]"
          >
            {/* 팝업 이미지 (500 x 500 정사각형. 원본도 1:1 로 올리면 여백 없이 꽉 찹니다) */}
            <div className="relative aspect-square w-full">
              <Image
                src={popup.image_url || '/ube_training.jpg'}
                alt={popup.title}
                fill
                sizes="(min-width: 1280px) 500px, (min-width: 640px) 380px, 100vw"
                // 서버 렌더 덕분에 첫 팝업 이미지는 HTML <head> 의 미리 불러오기
                // 링크로 잡혀, 자바스크립트를 기다리지 않고 함께 내려옵니다.
                priority={index === 0}
                // 세로로 긴 기존 포스터가 잘려나가지 않도록 contain 으로 맞춥니다.
                // 1:1 이미지는 cover 와 똑같이 정사각형을 꽉 채웁니다.
                className="object-contain"
              />
            </div>

            {/* 팝업별 닫기 */}
            <button
              type="button"
              onClick={() => hidePopup(popup.id)}
              aria-label={`${popup.title} 팝업 닫기`}
              tabIndex={checked ? 0 : -1}
              className="absolute right-2 top-2 flex h-10 w-10 items-center justify-center rounded-full bg-black/55 text-white backdrop-blur-sm transition-colors hover:bg-black/75 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
            >
              <X size={20} strokeWidth={2.4} aria-hidden="true" />
            </button>
          </div>
        ))}
      </div>

      {/* 좌우로 넘길 수 있다는 것과 몇 번째인지 알려줍니다. 한 줄에 다 보이는 xl 이상에서는 감춥니다. */}
      {visiblePopups.length > 1 && (
        <div className="mt-5 flex items-center justify-center gap-2.5 xl:hidden">
          {visiblePopups.map((popup, index) => (
            <button
              key={`dot-${popup.id}`}
              type="button"
              onClick={() => scrollToPopup(index)}
              aria-label={`${index + 1}번째 팝업 보기`}
              aria-current={index === activeIndex}
              tabIndex={checked ? 0 : -1}
              className={`h-2.5 rounded-full transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                index === activeIndex ? 'w-7 bg-white' : 'w-2.5 bg-white/45'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default MainPopup;
