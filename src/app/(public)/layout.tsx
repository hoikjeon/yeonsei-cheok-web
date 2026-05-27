import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuickMenu from "@/components/QuickMenu";
import MainPopup from "@/components/MainPopup";
import VisitTracker from "@/components/VisitTracker";

export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <VisitTracker />
      <Header />
      <MainPopup />
      <main className="flex-grow pt-20">
        {children}
      </main>
      <QuickMenu />
      <Footer />
    </>
  );
}
