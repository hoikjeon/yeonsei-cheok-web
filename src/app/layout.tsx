import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import JsonLd from "@/components/JsonLd";
import { buildHospitalStructuredData } from "@/lib/structuredData";
import {
  DEFAULT_OG_IMAGE,
  DEFAULT_SITE_DESCRIPTION,
  DEFAULT_SITE_TITLE,
  NAVER_SITE_VERIFICATION,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo";
import "./globals.css";

// 외부 CDN 요청 없이 빌드 시점에 내려받아 자체 호스팅합니다.
// 한글 폰트(Pretendard·Nanum Brush Script)는 next/font에 한글 서브셋이 없어
// app/pretendard.css, app/nanum-brush.css 에서 직접 자체 호스팅합니다.
const montserrat = Montserrat({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-montserrat-loaded",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_SITE_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    type: "website",
    title: DEFAULT_SITE_TITLE,
    description: DEFAULT_SITE_DESCRIPTION,
    url: "/",
    siteName: SITE_NAME,
    locale: "ko_KR",
    images: [
      {
        url: DEFAULT_OG_IMAGE,
        width: 1919,
        height: 820,
        alt: "부산 척추·관절 진료 연세척병원",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_SITE_TITLE,
    description: DEFAULT_SITE_DESCRIPTION,
    images: [DEFAULT_OG_IMAGE],
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    ...(process.env.GOOGLE_SITE_VERIFICATION
      ? { google: process.env.GOOGLE_SITE_VERIFICATION }
      : {}),
    other: {
      "naver-site-verification": NAVER_SITE_VERIFICATION,
    },
  },
  icons: {
    icon: "/favicon.ico",
  },
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0A1428",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" className={montserrat.variable}>
      <body className="min-h-screen flex flex-col antialiased">
        {/* 어느 페이지로 크롤러가 들어와도 병원 정보를 확인할 수 있게 전 페이지에 둡니다. */}
        <JsonLd data={buildHospitalStructuredData()} />
        {children}
      </body>
    </html>
  );
}
