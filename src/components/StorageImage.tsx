import type { Ref } from 'react';
import Image, { type ImageProps } from 'next/image';

// next.config.ts 의 images.remotePatterns 와 같은 범위입니다. 이 밖의 주소(유튜브 썸네일 등)는
// 최적화 대상이 아니라서, 그대로 넘기면 next/image 가 오류를 내므로 원본을 그대로 씁니다.
const SUPABASE_PUBLIC_STORAGE = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/`;

export function canOptimizeImage(src: string) {
  return (src.startsWith('/') && !src.startsWith('//')) || src.startsWith(SUPABASE_PUBLIC_STORAGE);
}

/**
 * 관리자가 올린 이미지(Supabase Storage)를 표시합니다.
 * Vercel 이 화면 크기에 맞춰 줄인 사본을 만들어 캐시해 두므로, 방문자가 볼 때마다
 * Supabase 에서 원본을 내려받지 않아 Supabase 전송량(egress)이 크게 줄어듭니다.
 */
export default function StorageImage({ src, alt, ...props }: Omit<ImageProps, 'src'> & { src: string; ref?: Ref<HTMLImageElement> }) {
  return <Image src={src} alt={alt} unoptimized={!canOptimizeImage(src)} {...props} />;
}
