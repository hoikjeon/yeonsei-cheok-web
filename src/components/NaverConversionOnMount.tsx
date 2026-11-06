'use client';

import { useEffect, useRef } from 'react';
import { trackNaverConversion, type NaverConversionType } from '@/lib/naverAnalytics';

// 서버에서 등록을 마치고 넘어온 화면(예: 상담 글 상세 ?submitted=1)에서 전환을 한 번 보냅니다.
// 보낸 뒤에는 주소의 표시를 지워, 새로고침해도 전환이 다시 잡히지 않게 합니다.
export default function NaverConversionOnMount({ type }: { type: NaverConversionType }) {
  const sent = useRef(false);

  useEffect(() => {
    if (sent.current) return;
    sent.current = true;

    trackNaverConversion(type);
    window.history.replaceState(null, '', window.location.pathname);
  }, [type]);

  return null;
}
