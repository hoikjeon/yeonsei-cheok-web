import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
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
  title: "연세척병원 | 실력을 세우다, 원칙을 지키다",
  description: "연세대 세브란스 교수 출신의 의료진이 진료하는 부산 연세척병원입니다. 척추 및 관절 질환의 바른 치료를 약속합니다.",
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
        {children}
      </body>
    </html>
  );
}
