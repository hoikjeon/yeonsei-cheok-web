'use client';

import Image from 'next/image';

type NavigationAppLinksProps = {
  name: string;
  address: string;
  lat: number;
  lng: number;
  kakaoPlaceId: string;
};

type NavigationProvider = 'naver' | 'kakao' | 'tmap';

const TMAP_APP_STORE_URL = 'https://apps.apple.com/kr/app/id431589174';

const APP_BUTTONS = [
  {
    provider: 'naver',
    label: '네이버지도',
    icon: '/brands/navigation/naver-map.png',
  },
  {
    provider: 'kakao',
    label: '카카오맵',
    icon: '/brands/navigation/kakao-map.png',
  },
  {
    provider: 'tmap',
    label: '티맵',
    icon: '/brands/navigation/tmap.png',
  },
] as const satisfies ReadonlyArray<{
  provider: NavigationProvider;
  label: string;
  icon: string;
}>;

function openWebPage(url: string) {
  window.open(url, '_blank', 'noopener,noreferrer');
}

function openAppWithFallback(appUrl: string, fallbackUrl: string) {
  let didLeavePage = false;

  const markAsOpened = () => {
    didLeavePage = true;
    cleanup();
  };

  const handleVisibilityChange = () => {
    if (document.visibilityState === 'hidden') {
      markAsOpened();
    }
  };

  const fallbackTimer = window.setTimeout(() => {
    cleanup();

    if (!didLeavePage && document.visibilityState === 'visible') {
      window.location.assign(fallbackUrl);
    }
  }, 1800);

  const cleanup = () => {
    window.clearTimeout(fallbackTimer);
    window.removeEventListener('pagehide', markAsOpened);
    document.removeEventListener('visibilitychange', handleVisibilityChange);
  };

  window.addEventListener('pagehide', markAsOpened, { once: true });
  document.addEventListener('visibilitychange', handleVisibilityChange);

  window.location.assign(appUrl);
}

export default function NavigationAppLinks({
  name,
  address,
  lat,
  lng,
  kakaoPlaceId,
}: NavigationAppLinksProps) {
  const openNavigation = (provider: NavigationProvider) => {
    const userAgent = window.navigator.userAgent;
    const isAndroid = /Android/i.test(userAgent);
    const isIOS =
      /iPad|iPhone|iPod/i.test(userAgent) ||
      (window.navigator.platform === 'MacIntel' && window.navigator.maxTouchPoints > 1);

    const encodedName = encodeURIComponent(name);
    const naverWebUrl = `https://map.naver.com/p/search/${encodeURIComponent(`${name} ${address}`)}`;
    const kakaoWebUrl = `https://map.kakao.com/link/to/${encodedName},${lat},${lng}`;
    const tmapWebUrl = 'https://www.tmap.co.kr/';

    if (!isAndroid && !isIOS) {
      const desktopUrls: Record<NavigationProvider, string> = {
        naver: naverWebUrl,
        kakao: kakaoWebUrl,
        tmap: tmapWebUrl,
      };

      openWebPage(desktopUrls[provider]);
      return;
    }

    if (isAndroid) {
      const androidIntents: Record<NavigationProvider, string> = {
        naver:
          `intent://navigation?dlat=${lat}&dlng=${lng}&dname=${encodedName}` +
          `&appname=${encodeURIComponent(window.location.hostname)}` +
          '#Intent;scheme=nmap;package=com.nhn.android.nmap;' +
          `S.browser_fallback_url=${encodeURIComponent(naverWebUrl)};end`,
        kakao:
          `intent://place?id=${kakaoPlaceId}` +
          '#Intent;scheme=kakaomap;package=net.daum.android.map;' +
          `S.browser_fallback_url=${encodeURIComponent(kakaoWebUrl)};end`,
        tmap:
          `intent://route?rGoName=${encodedName}&rGoX=${lng}&rGoY=${lat}` +
          '#Intent;scheme=tmap;package=com.skt.tmap.ku;' +
          'S.browser_fallback_url=' +
          `${encodeURIComponent('https://play.google.com/store/apps/details?id=com.skt.tmap.ku')};end`,
      };

      window.location.assign(androidIntents[provider]);
      return;
    }

    const iosAppUrls: Record<NavigationProvider, string> = {
      naver:
        `nmap://navigation?dlat=${lat}&dlng=${lng}&dname=${encodedName}` +
        `&appname=${encodeURIComponent(window.location.hostname)}`,
      kakao: `kakaomap://place?id=${kakaoPlaceId}`,
      tmap: `tmap://route?rGoName=${encodedName}&rGoX=${lng}&rGoY=${lat}`,
    };
    const iosFallbackUrls: Record<NavigationProvider, string> = {
      naver: naverWebUrl,
      kakao: kakaoWebUrl,
      tmap: TMAP_APP_STORE_URL,
    };

    openAppWithFallback(iosAppUrls[provider], iosFallbackUrls[provider]);
  };

  return (
    <div className="grid grid-cols-3 gap-2.5 sm:gap-3">
      {APP_BUTTONS.map(({ provider, label, icon }) => (
        <button
          key={provider}
          type="button"
          onClick={() => openNavigation(provider)}
          aria-label={`${label} 앱으로 ${name} 길찾기`}
          title={label}
          className="group flex min-h-14 w-full items-center justify-center bg-transparent p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-primary"
        >
          <Image
            src={icon}
            alt=""
            aria-hidden="true"
            width={48}
            height={48}
            unoptimized
            className="h-11 w-11 rounded-xl object-cover shadow-sm transition-transform duration-200 group-hover:scale-105 sm:h-12 sm:w-12 sm:rounded-[13px]"
          />
        </button>
      ))}
    </div>
  );
}
