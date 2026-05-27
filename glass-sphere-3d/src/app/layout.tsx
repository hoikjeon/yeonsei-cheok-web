import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Glass Sphere 3D - Interactive Typography Demo",
  description: "Interactive 3D glass sphere with reactive typography built with React Three Fiber, Three.js, and Next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
