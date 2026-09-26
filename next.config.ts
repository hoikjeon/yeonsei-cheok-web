import type { NextConfig } from "next";

const CANONICAL_HOST = 'www.ys-cheok.com';
const MOBILE_HOST = 'm.ys-cheok.com';

const nextConfig: NextConfig = {
  // 옛 홈페이지(.php)의 색인된 주소를 새 페이지로 이전합니다.
  // 매칭되는 라우팅 규칙이 없는 .php 요청은 Vercel System Mitigations가 403으로
  // 거부하므로, 여기에 규칙이 있어야 사용자가 새 페이지까지 도달합니다.
  async redirects() {
    return [
      // 옛 모바일 사이트(m.ys-cheok.com)는 새 사이트가 반응형이라 없앱니다.
      // 아래 두 규칙은 www 규칙보다 먼저 와야 합니다. 뒤에 두면 경로만 같은
      // www 규칙에 먼저 걸려 m. 도메인에 그대로 남습니다.
      {
        source: '/005/002.php',
        has: [{ type: 'host', value: MOBILE_HOST }],
        destination: `https://${CANONICAL_HOST}/reservation`,
        permanent: true,
      },
      {
        // 나머지 모바일 주소는 경로를 유지한 채 www로 넘겨, 아래 .php 규칙이
        // 이어서 처리하게 합니다.
        source: '/:path*',
        has: [{ type: 'host', value: MOBILE_HOST }],
        destination: `https://${CANONICAL_HOST}/:path*`,
        permanent: true,
      },

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
      {
        source: '/001/006_2.php',
        destination: '/treatments/joint/knee',
        permanent: true,
      },
      // 발목 → 손목·발목 관절
      {
        source: '/003/006_05.php',
        destination: '/treatments/joint/wrist-ankle',
        permanent: true,
      },
      // 신경외과 → 척추센터
      {
        source: '/007/009.php',
        destination: '/treatments/spine',
        permanent: true,
      },

      // 아직 찾지 못한 옛 주소를 위한 안전망입니다. 파일명에 밑줄과 하이픈이
      // 쓰이므로(006_05, 006_2) 숫자만으로 좁히면 놓칩니다.
      {
        source: '/:dir(\\d{3})/:page([A-Za-z0-9_-]+).php',
        destination: '/treatments',
        permanent: true,
      },
    ];
  },

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
