'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { recordVisit } from '@/app/actions/visit_actions';

export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // 관리자 페이지 진입은 카운트에서 제외합니다. (서버에서도 한 번 더 걸러냅니다)
    if (pathname?.startsWith('/admin')) return;

    try {
      // 방문자 식별은 서버가 IP·브라우저·날짜로 직접 계산합니다.
      // 여기서는 하루에 한 번만 요청을 보내 불필요한 왕복을 줄이는 역할만 합니다.
      const today = new Date().toDateString();
      if (localStorage.getItem('ys_last_visit_date') === today) return;

      localStorage.setItem('ys_last_visit_date', today);
      recordVisit(pathname || '/');
    } catch {
      // localStorage 를 못 쓰는 환경(시크릿 모드 등)에서는 그대로 한 번 기록합니다.
      // 중복은 서버에서 걸러집니다.
      recordVisit(pathname || '/');
    }
  }, [pathname]);

  return null; // 화면에 아무것도 그리지 않는 투명 컴포넌트
}
