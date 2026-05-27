import AdminSidebar from '@/components/admin/AdminSidebar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50 flex">
      {/* Sidebar Component */}
      <AdminSidebar />

      {/* Main Content Area: 대시보드의 스크롤과 레이아웃을 전담합니다. */}
      <main className="flex-1 flex flex-col h-screen overflow-y-auto relative">
        {children}
      </main>
    </div>
  );
}
