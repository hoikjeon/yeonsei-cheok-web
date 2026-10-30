'use client';

import { useCallback, useState, type CSSProperties, type ReactNode } from 'react';
import type { ImageProps } from 'next/image';
import StorageImage from '@/components/StorageImage';

/**
 * 원본보다 크게 늘려 보여 주지 않는 이미지.
 *
 * 관리자가 올린 포스터 중에는 595px처럼 작은 이미지가 많아, 칸 폭(약 950px)에 맞춰 늘리면 흐려 보입니다.
 * 이미지를 불러온 뒤 실제 픽셀 폭을 읽어 "칸 폭"과 "원본 폭" 중 작은 쪽으로 틀(frame)의 폭을 정합니다.
 * Next 이미지 최적화는 원본보다 큰 사본을 만들지 않으므로, 받은 이미지 폭이 칸보다 작다면 그것이 곧 원본 폭입니다.
 */
export default function NaturalWidthImage({
  as: Frame = 'div',
  frameClassName,
  frameStyle,
  frameProps,
  baseWidth = '100%',
  children,
  src,
  alt,
  ...imageProps
}: Omit<ImageProps, 'src' | 'onLoad' | 'ref'> & {
  src: string;
  as?: 'div' | 'figure';
  frameClassName?: string;
  frameStyle?: CSSProperties;
  frameProps?: Record<string, string | undefined>;
  /** 원본 폭으로 줄이기 전의 폭. 편집기에서 정한 비율(예: 60%)이 있으면 넘깁니다. */
  baseWidth?: string;
  /** 이미지 아래에 이어 그릴 내용(캡션 등) */
  children?: ReactNode;
}) {
  const [naturalWidth, setNaturalWidth] = useState<number | null>(null);
  // srcset 으로 고른 이미지의 naturalWidth 는 화면 배율로 나눈 값(595px 원본이 레티나에서 297)이라,
  // 받은 주소를 srcset 없이 다시 읽어 실제 픽셀 폭을 잽니다. 이미 받은 파일이라 다시 내려받지 않습니다.
  const measure = useCallback((img: HTMLImageElement | null) => {
    if (!img?.complete || !img.currentSrc) return;
    const probe = new window.Image();
    probe.onload = () => setNaturalWidth(probe.naturalWidth || null);
    probe.src = img.currentSrc;
  }, []);

  return (
    <Frame
      {...frameProps}
      className={frameClassName}
      style={{ ...frameStyle, width: naturalWidth ? `min(${baseWidth}, ${naturalWidth}px)` : baseWidth }}
    >
      {/* 하이드레이션 전에 이미 다 받은 이미지는 onLoad 가 오지 않을 수 있어 ref 로도 한 번 잽니다. */}
      <StorageImage
        ref={measure}
        src={src}
        alt={alt}
        onLoad={(event) => measure(event.currentTarget)}
        {...imageProps}
      />
      {children}
    </Frame>
  );
}
