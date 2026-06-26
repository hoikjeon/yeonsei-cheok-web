'use client';

import Script from 'next/script';
import { Map, MapMarker } from 'react-kakao-maps-sdk';
import { useState } from 'react';
import { MapPin } from 'lucide-react';

const KAKAO_API_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;

export default function KakaoMap({ lat, lng, placeName }: { lat: number, lng: number, placeName: string }) {
  const [isLoaded, setIsLoaded] = useState(false);

  // API 키가 없는 경우 표시할 MockUI (개발자 안내용)
  if (!KAKAO_API_KEY) {
    return (
      <div className="w-full h-full min-h-[400px] bg-slate-50 flex flex-col items-center justify-center text-ink-muted p-6 text-center border-2 border-dashed border-slate-200 rounded-[2rem]">
        <MapPin size={48} className="text-slate-300 mb-4" />
        <h3 className="font-extrabold text-xl text-ink-muted mb-2">지도 영역</h3>
        <p className="text-sm font-medium mb-4">카카오맵 API 키가 설정되지 않아 실제 지도가 표시되지 않습니다.</p>
        <div className="text-[11px] mt-2 p-4 bg-slate-100 rounded-xl font-mono text-left inline-block">
          <p className="font-bold text-ink-muted mb-1">✓ 조치 방법</p>
          <p>.env.local 파일을 열고 아래 값을 추가해 주세요.</p>
          <p className="text-blue-600 mt-2">NEXT_PUBLIC_KAKAO_MAP_API_KEY=발급받은앱키</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <Script 
        src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}&autoload=false`}
        strategy="lazyOnload"
        onLoad={() => {
          // 스크립트 로드 후 kakao.maps 내부 객체 초기화 대기
          window.kakao.maps.load(() => {
            setIsLoaded(true);
          });
        }}
      />
      {isLoaded ? (
        <Map
          center={{ lat, lng }}
          style={{ width: '100%', height: '100%', borderRadius: '2rem' }}
          level={3} // 확대 수준
        >
          <MapMarker 
            position={{ lat, lng }}
            image={{
              src: "https://t1.daumcdn.net/localimg/localimages/07/mapapidoc/markerStar.png", // 마커 이미지 URL (임의의 별 마커, 또는 커스텀 이미지)
              size: { width: 24, height: 35 }
            }}
          >
             {/* 마커 위에 표시할 인포윈도우 */}
             <div className="p-2 w-max rounded-lg font-bold text-ink text-sm whitespace-nowrap shadow-sm">
                🏥 {placeName}
             </div>
          </MapMarker>
        </Map>
      ) : (
        <div className="w-full h-full min-h-[400px] bg-slate-50 flex items-center justify-center rounded-[2rem] animate-pulse">
          <p className="text-ink-muted font-bold text-sm tracking-widest font-montserrat uppercase">Loading Map...</p>
        </div>
      )}
    </>
  );
}
