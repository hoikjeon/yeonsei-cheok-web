'use client';

import Script from 'next/script';
import { CustomOverlayMap, Map, ZoomControl, useMap } from 'react-kakao-maps-sdk';
import { useEffect, useState } from 'react';
import { MapPin } from 'lucide-react';

const KAKAO_API_KEY = process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY;

// 지도에 담길 기본 반경(m). 이 값만 바꾸면 처음 보이는 범위가 달라집니다.
const DEFAULT_VIEW_RADIUS_M = 30;

/**
 * 중심에서 지정한 반경(m)이 담기도록 확대 수준을 맞춥니다.
 * level 숫자 대신 실제 거리로 지정할 수 있습니다.
 */
function FitToRadius({ lat, lng, radius }: { lat: number; lng: number; radius: number }) {
  const map = useMap();

  useEffect(() => {
    if (!map) return;

    const latDelta = radius / 111320;
    const lngDelta = radius / (111320 * Math.cos((lat * Math.PI) / 180));

    const bounds = new window.kakao.maps.LatLngBounds(
      new window.kakao.maps.LatLng(lat - latDelta, lng - lngDelta),
      new window.kakao.maps.LatLng(lat + latDelta, lng + lngDelta),
    );

    map.setBounds(bounds);
  }, [map, lat, lng, radius]);

  return null;
}

export default function KakaoMap({
  lat,
  lng,
  placeName,
  viewRadius = DEFAULT_VIEW_RADIUS_M,
}: {
  lat: number;
  lng: number;
  placeName: string;
  viewRadius?: number;
}) {
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
          level={3}
        >
          {/* 처음 보이는 범위를 거리(m) 기준으로 맞춤 */}
          <FitToRadius lat={lat} lng={lng} radius={viewRadius} />

          {/* 확대/축소 버튼 */}
          <ZoomControl position="RIGHT" />

          {/* 병원 로고 마커 */}
          <CustomOverlayMap position={{ lat, lng }} yAnchor={1.08}>
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-4 shadow-[0_8px_24px_rgba(15,29,54,0.22)]">
                <img
                  src="/ys-logo-bg.png"
                  alt=""
                  className="h-8 w-8 shrink-0 rounded-full"
                />
                <span className="whitespace-nowrap text-[15px] font-bold tracking-tight text-ink">
                  {placeName}
                </span>
              </div>
              <span
                aria-hidden
                className="-mt-px h-0 w-0 border-x-[7px] border-t-[9px] border-x-transparent border-t-white drop-shadow-[0_2px_1px_rgba(15,29,54,0.18)]"
              />
            </div>
          </CustomOverlayMap>
        </Map>
      ) : (
        <div className="w-full h-full min-h-[400px] bg-slate-50 flex items-center justify-center rounded-[2rem] animate-pulse">
          <p className="text-ink-muted font-bold text-sm">지도를 불러오는 중입니다...</p>
        </div>
      )}
    </>
  );
}
