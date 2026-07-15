import Header from "@/components/Header";
import Footer from "@/components/Footer";
import FooterConsultationSection from "@/components/FooterConsultationSection";
import QuickMenu from "@/components/QuickMenu";
import MainPopup from "@/components/MainPopup";
import VisitTracker from "@/components/VisitTracker";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div className="public-site-shell flex min-h-screen min-w-0 flex-1 flex-col">
      <VisitTracker />
      <Header />
      <MainPopup />
      <main className="min-w-0 flex-grow pt-[72px]">
        {children}
      </main>
      <QuickMenu />
      <FooterConsultationSection />
      <Footer />
    </div>
  );
}
