import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // 옛 홈페이지(.php)의 색인된 주소를 새 페이지로 301(308) 이전합니다.
  // 주의: Vercel 방화벽이 .php 요청을 엣지에서 차단(x-vercel-mitigated: deny)하면
  // 이 리다이렉트까지 도달하지 못하므로, 대시보드 Firewall에서 해당 경로 Bypass 규칙이 필요합니다.
  async redirects() {
    return [
      // 정형외과 → 관절센터
      {
        source: '/001/007.php',
        destination: '/treatments/joint/knee',
        permanent: true,
      },
      {
        source: '/007/008.php',
        destination: '/treatments/joint/knee',
        permanent: true,
      },
      // 신경외과 → 척추센터
      {
        source: '/007/009.php',
        destination: '/treatments/spine',
        permanent: true,
      },
      // 그 밖에 남아 있는 옛 주소(/000/000.php 형태)는 진료과목 안내로 모읍니다.
      {
        source: '/:dir(\\d{3})/:page(\\d{3}).php',
        destination: '/treatments',
        permanent: true,
      },
    ];
  },
  // Browser checks use a separate development cache and never connect to production data.
  distDir: process.env.NEWS_TEST_DIST_DIR || '.next',
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
