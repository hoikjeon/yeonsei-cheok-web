import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    qualities: [75, 90],
    localPatterns: [
      {
        pathname: '/**',
        search: '',
      },
      {
        pathname: '/banner/h1d.jpg',
        search: '?v=b4bc1be1',
      },
    ],
    // 후기 첨부 이미지는 Supabase Storage에 올라가므로 원격 호스트를 허용해야
    // next/image가 WebP/AVIF 변환과 리사이즈를 적용할 수 있습니다.
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'jehfwqehrbsedvkusedc.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
    ],
  },
};

export default nextConfig;
