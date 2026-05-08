import AdminSidebar from "@/components/shared/AdminSidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-slate-50">
      {/* Sidebar Desktop */}
      <div className="hidden lg:block fixed left-0 top-0 h-screen">
        <AdminSidebar />
      </div>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72">
        {/* TopBar */}
        <header className="sticky top-0 z-40 flex items-center justify-between px-6 lg:px-10 py-4 bg-white/80 backdrop-blur-md border-b border-slate-200">
          <div className="flex items-center gap-3 lg:hidden">
            {/* Hamburger button bisa ditambahkan di sini untuk mobile */}
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-emerald-500 bg-clip-text text-transparent">
              KrediMotor
            </span>
          </div>

          <div className="hidden lg:flex items-center gap-4 ml-auto">
            <div className="flex items-center gap-3 px-4 py-2 rounded-xl bg-slate-100/50 border border-slate-200">
              <div className="w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-bold">
                A
              </div>
              <div className="text-sm">
                <p className="font-semibold text-slate-700">Admin Utama</p>
                <p className="text-xs text-slate-500">Super Admin</p>
              </div>
            </div>
          </div>
        </header>

        <div className="p-6 lg:p-10">
          {children}
        </div>
      </main>
    </div>
  );
}