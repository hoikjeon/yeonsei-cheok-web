import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "연세척병원 | 실력을 세우다, 원칙을 지키다",
  description: "연세대 세브란스 교수 출신의 의료진이 진료하는 부산 연세척병원입니다. 척추 및 관절 질환의 바른 치료를 약속합니다.",
  icons: {
    icon: "/favicon.ico",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className="min-h-screen flex flex-col antialiased">
        {children}
      </body>
    </html>
  );
}
