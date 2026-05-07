"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Sidebar from "@/components/Sidebar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [role, setRole] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const router = useRouter();
  const pathname = usePathname(); // Untuk mendapatkan URL saat ini (misal: /admin atau /marketing)

  useEffect(() => {
    const checkAuthAndProtectRoute = async () => {
      // 1. Cek apakah user sedang login (punya sesi aktif)
      const { data: { session } } = await supabase.auth.getSession();

      if (!session) {
        // Kalau belum login, langsung tendang ke halaman login
        router.replace("/login");
        return;
      }

      // 2. Ambil role user dari tabel 'users'
      const { data: userData, error } = await supabase
        .from("users")
        .select("role")
        .eq("id", session.user.id)
        .single();

      if (error || !userData?.role) {
        // Kalau datanya bermasalah, tendang ke login juga
        router.replace("/login");
        return;
      }

      const userRole = userData.role; // 'admin', 'marketing', atau 'ceo'

      // 3. LOGIKA PROTEKSI ROUTE (SATPAM)
      // Mencegah user mengakses halaman yang bukan haknya
      if (pathname.startsWith("/admin") && userRole !== "admin") {
        router.replace(`/${userRole}`);
        return;
      }
      
      if (pathname.startsWith("/marketing") && userRole !== "marketing") {
        router.replace(`/${userRole}`);
        return;
      }
      
      if (pathname.startsWith("/ceo") && userRole !== "ceo") {
        router.replace(`/${userRole}`);
        return;
      }

      // 4. Lolos pengecekan, simpan role dan matikan loading
      setRole(userRole);
      setIsLoading(false);
    };

    checkAuthAndProtectRoute();
  }, [pathname, router]);

  // Tampilkan layar loading saat sedang mengecek ke database
  if (isLoading) {
    return (
      <div className="h-screen flex flex-col items-center justify-center bg-slate-50">
        <div className="w-12 h-12 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-medium">Memverifikasi akses...</p>
      </div>
    );
  }

  // Jika lolos, render Sidebar dan konten halamannya
  return (
    <div className="flex h-screen bg-slate-50 overflow-hidden">
      {/* Sekarang Sidebar menerima role yang dinamis dan ASLI dari database */}
      <Sidebar role={role!} />
      
      <main className="flex-1 overflow-y-auto">
        {children}
      </main>
    </div>
  );
}