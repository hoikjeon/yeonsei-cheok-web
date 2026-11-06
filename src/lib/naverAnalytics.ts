// 네이버 광고 전환 추적(wcs.trans 버전)을 다룹니다.
// 공식 가이드: https://naver.github.io/conversion-tracking/pages/01_script_guide_wcstrans/
//
// 스크립트(wcslog.js)는 components/NaverAnalytics.tsx 가 공개 페이지에서만 불러옵니다.
// 전환은 스크립트가 아직 준비되지 않았으면 대기열에 담아 두었다가 준비되는 즉시 보냅니다.

export const NAVER_ACCOUNT_ID = 's_53d5bf44a82d';
export const NAVER_SCRIPT_SRC = 'https://wcs.naver.net/wcslog.js';
// 유입 정보 쿠키를 저장할 최상위 도메인입니다. www·m 하위 도메인이 함께 씁니다.
const NAVER_COOKIE_DOMAIN = 'ys-cheok.com';

// 네이버가 정한 전환 유형 코드입니다. (한글 이름이 아니라 코드 값을 보내야 합니다)
// - schedule: 예약 완료 (온라인 예약 접수)
// - inquiry: 문의·상담 전달 완료 (빠른 상담 신청, 상담 게시판 글 등록)
// - call: 전화 버튼 클릭
export type NaverConversionType = 'schedule' | 'inquiry' | 'call';

type NaverWcs = {
  inflow: (domain?: string) => void;
  trans: (conversion: { type: string; value?: string }) => void;
};

declare global {
  interface Window {
    wcs?: NaverWcs;
    wcs_add?: Record<string, string>;
    wcs_do?: () => void;
  }
}

let initialized = false;
const pendingConversions: NaverConversionType[] = [];

// 실제 운영 도메인에서만 수집합니다. 로컬 개발·Vercel 미리보기 방문은 보고서에 섞이지 않게 합니다.
export function isNaverTrackingHost(hostname: string) {
  return hostname === NAVER_COOKIE_DOMAIN || hostname.endsWith(`.${NAVER_COOKIE_DOMAIN}`);
}

function initNaverAnalytics() {
  if (initialized) return true;
  if (!window.wcs) return false;

  window.wcs_add = window.wcs_add || {};
  window.wcs_add.wa = NAVER_ACCOUNT_ID;
  window.wcs.inflow(NAVER_COOKIE_DOMAIN);
  initialized = true;
  return true;
}

function sendConversion(type: NaverConversionType) {
  try {
    window.wcs?.trans({ type });
  } catch {
    // 광고 추적 실패가 예약·상담 같은 실제 기능을 막으면 안 됩니다.
  }
}

// 페이지를 열 때마다(화면 전환 포함) 호출합니다. 가이드 순서대로 PV를 먼저 보내고,
// 스크립트 준비 전에 생긴 전환이 있으면 이어서 보냅니다.
export function trackNaverPageView() {
  if (!initNaverAnalytics()) return;

  try {
    window.wcs_do?.();
  } catch {
    // 위와 같은 이유로 무시합니다.
  }

  pendingConversions.splice(0).forEach(sendConversion);
}

export function trackNaverConversion(type: NaverConversionType) {
  if (typeof window === 'undefined' || !isNaverTrackingHost(window.location.hostname)) return;

  if (!initNaverAnalytics()) {
    pendingConversions.push(type);
    return;
  }

  sendConversion(type);
}
