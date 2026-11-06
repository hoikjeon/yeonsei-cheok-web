'use client';

import Script from 'next/script';
import { usePathname } from 'next/navigation';
import { useEffect, useState, useSyncExternalStore } from 'react';
import {
  NAVER_SCRIPT_SRC,
  isNaverTrackingHost,
  trackNaverConversion,
  trackNaverPageView,
} from '@/lib/naverAnalytics';

const subscribeNothing = () => () => {};

// 네이버 광고 공통 스크립트 + 페이지뷰 + 전화 클릭 전환을 담당합니다.
// 이 사이트는 페이지를 옮길 때 새로고침하지 않으므로, 주소가 바뀔 때마다 PV를 다시 보냅니다.
export default function NaverAnalytics() {
  const pathname = usePathname();
  const enabled = useSyncExternalStore(
    subscribeNothing,
    () => isNaverTrackingHost(window.location.hostname),
    () => false,
  );
  const [scriptReady, setScriptReady] = useState(false);

  useEffect(() => {
    if (scriptReady) trackNaverPageView();
  }, [pathname, scriptReady]);

  // 빠른메뉴·푸터·본문 등 어디에 있든 전화 링크를 누르면 전환으로 잡습니다.
  useEffect(() => {
    if (!enabled) return;

    const handleClick = (event: MouseEvent) => {
      const target = event.target;
      if (target instanceof Element && target.closest('a[href^="tel:"]')) {
        trackNaverConversion('call');
      }
    };

    document.addEventListener('click', handleClick, true);
    return () => document.removeEventListener('click', handleClick, true);
  }, [enabled]);

  if (!enabled) return null;

  return <Script src={NAVER_SCRIPT_SRC} onReady={() => setScriptReady(true)} />;
}
