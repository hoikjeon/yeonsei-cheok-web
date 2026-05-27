'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { recordVisit } from '@/app/actions/visit_actions';

export default function VisitTracker() {
  const pathname = usePathname();

  useEffect(() => {
    // 관리자 페이지 진입은 카운트에서 제외 (옵션)
    if (pathname?.startsWith('/admin')) return;

    try {
      const today = new Date().toDateString(); // 예: "Thu Apr 02 2026"
      const lastVisit = localStorage.getItem('ys_last_visit_date');
      let visitorId = localStorage.getItem('ys_visitor_id');

      // 방문자 고유 ID가 없다면 새로 생성
      if (!visitorId) {
        visitorId = crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
        localStorage.setItem('ys_visitor_id', visitorId);
      }

      // 오늘 처음 방문한 경우에만 서버에 기록 요청! (동일 브라우저 중복 방지)
      if (lastVisit !== today) {
        localStorage.setItem('ys_last_visit_date', today);
        recordVisit(visitorId, pathname || '/');
      }
    } catch (e) {
      console.error('Visit tracker access error. Privacy block may be enabled.', e);
    }
  }, [pathname]);

  return null; // 화면에 아무것도 그리지 않는 투명 컴포넌트
}
