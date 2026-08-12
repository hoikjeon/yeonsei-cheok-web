'use client';

import Script from 'next/script';
import Image from 'next/image';
import { CustomOverlayMap, Map, ZoomControl, useMap } from 'react-kakao-maps-sdk';
import { useCallback, useEffect, useState } from 'react';

const KAKAO_API_KEY_ENV_NAME = 'NEXT_PUBLIC_KAKAO_MAP_API_KEY';
const MAP_LOAD_TIMEOUT_MS = 7000;

function normalizeApiKey(value: string | undefined) {
  if (!value) return '';

  const trimmedValue = value.trim().replace(/^['"]|['"]$/g, '');
  const assignmentPrefix = `${KAKAO_API_KEY_ENV_NAME}=`;
  const apiKey = trimmedValue.startsWith(assignmentPrefix)
    ? trimmedValue.slice(assignmentPrefix.length).trim()
    : trimmedValue;

  return apiKey.replace(/^['"]|['"]$/g, '');
}

const KAKAO_API_KEY = normalizeApiKey(process.env.NEXT_PUBLIC_KAKAO_MAP_API_KEY);
const HAS_VALID_KAKAO_API_KEY = /^[a-f0-9]{32}$/i.test(KAKAO_API_KEY);

// 지도에 담길 기본 반경(m). 이 값만 바꾸면 처음 보이는 범위가 달라집니다.
const DEFAULT_VIEW_RADIUS_M = 30;

function EmbeddedKakaoMap({ lat, lng, placeName }: { lat: number; lng: number; placeName: string }) {
  const mapUrl = `https://map.kakao.com/link/map/${encodeURIComponent(placeName)},${lat},${lng}`;

  return (
    <div className="relative h-full min-h-[400px] w-full overflow-hidden rounded-[2rem] bg-slate-100">
      <iframe
        src={mapUrl}
        title={`${placeName} 위치 지도`}
        loading="eager"
        allowFullScreen
        referrerPolicy="strict-origin-when-cross-origin"
        className="absolute inset-y-0 left-0 h-full border-0"
        style={{ width: 'calc(100% + 390px)', transform: 'translateX(-390px)' }}
      />

      <div className="pointer-events-none absolute left-1/2 top-1/2 z-10 flex -translate-x-1/2 -translate-y-full flex-col items-center">
        <div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white py-1.5 pl-1.5 pr-4 shadow-[0_8px_24px_rgba(15,29,54,0.22)]">
          <Image
            src="/ys-logo-bg.png"
            alt=""
            width={32}
            height={32}
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
    </div>
  );
}

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
  const [loadState, setLoadState] = useState<'loading' | 'ready' | 'error'>('loading');

  const handleSdkReady = useCallback(() => {
    if (!window.kakao?.maps?.load) {
      setLoadState('error');
      return;
    }

    window.kakao.maps.load(() => {
      setLoadState('ready');
    });
  }, []);

  useEffect(() => {
    if (loadState !== 'loading' || !HAS_VALID_KAKAO_API_KEY) return;

    const timeoutId = window.setTimeout(() => {
      setLoadState('error');
    }, MAP_LOAD_TIMEOUT_MS);

    return () => window.clearTimeout(timeoutId);
  }, [loadState]);

  if (!HAS_VALID_KAKAO_API_KEY) {
    return <EmbeddedKakaoMap lat={lat} lng={lng} placeName={placeName} />;
  }

  return (
    <>
      <Script 
        id="kakao-map-sdk"
        src={`https://dapi.kakao.com/v2/maps/sdk.js?appkey=${KAKAO_API_KEY}&autoload=false`}
        strategy="afterInteractive"
        onReady={handleSdkReady}
        onError={() => setLoadState('error')}
      />
      {loadState === 'ready' ? (
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
                <Image
                  src="/ys-logo-bg.png"
                  alt=""
                  width={32}
                  height={32}
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
        <EmbeddedKakaoMap lat={lat} lng={lng} placeName={placeName} />
      )}
    </>
  );
}
