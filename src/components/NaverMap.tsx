'use client';

import { useState } from 'react';

export default function NaverMapComponent({ lat, lng, placeName }: { lat: number, lng: number, placeName: string }) {
  const [isLoading, setIsLoading] = useState(true);

  // 네이버 지도 iframe 임베드 URL (API 키 불필요, 가장 안정적인 방식)
  const mapUrl = `https://map.naver.com/p/search/${encodeURIComponent('부산 부산진구 가야대로 715 연세척병원')}`;

  return (
    <div className="relative w-full h-full rounded-[2rem] overflow-hidden border border-slate-100 shadow-premium" style={{ minHeight: '400px' }}>
      {isLoading && (
        <div className="absolute inset-0 bg-slate-50 flex items-center justify-center z-10">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 border-3 border-primary border-t-transparent rounded-full animate-spin" />
            <p className="text-slate-400 font-bold text-sm tracking-widest uppercase">지도 로딩 중...</p>
          </div>
        </div>
      )}
      <iframe
        src={mapUrl}
        width="100%"
        height="100%"
        style={{ border: 0, minHeight: '400px' }}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setIsLoading(false)}
        title={`${placeName} 위치 지도`}
      />
    </div>
  );
}
