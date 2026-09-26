import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FooterConsultationSection from "@/components/FooterConsultationSection";
import QuickMenu from "@/components/QuickMenu";
import MainPopup from "@/components/MainPopup";
import VisitTracker from "@/components/VisitTracker";
import { getActivePopups } from "@/lib/popupData";

// 팝업 목록을 서버에서 읽어 HTML 에 담습니다.
// 브라우저에서 받아오던 때는 하이드레이션이 끝난 뒤 Supabase 왕복을 한 번 더
// 기다려야 팝업이 떴습니다. 자세한 배경은 src/lib/popupData.ts 주석에 있습니다.
export default async function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const popups = await getActivePopups();

  return (
    <div className="public-site-shell flex min-h-screen min-w-0 flex-1 flex-col">
      <VisitTracker />
      <Header />
      <MainPopup popups={popups} />
      <main className="min-w-0 flex-grow pt-[72px]">
        {children}
      </main>
      <QuickMenu />
      <FooterConsultationSection />
      <Footer />
    </div>
  );
}
