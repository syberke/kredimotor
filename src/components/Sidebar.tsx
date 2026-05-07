// src/components/Sidebar.tsx
"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Users, Bike, FileText, Settings, LogOut } from "lucide-react";

export default function Sidebar({ role }: { role: string }) {
  const pathname = usePathname();

  const menus = {
    admin: [
      { name: "Dashboard", href: "/admin", icon: LayoutDashboard }, // Diperbarui
      { name: "Kelola Staff", href: "/admin/users", icon: Users },
      { name: "Data Motor", href: "/admin/motor", icon: Bike },
      { name: "Metode Bayar", href: "/admin/payment", icon: Settings },
    ],
    marketing: [
      { name: "Dashboard", href: "/marketing", icon: LayoutDashboard }, // Diperbarui
      { name: "Pengajuan", href: "/marketing/pengajuan", icon: FileText },
      { name: "Data Motor", href: "/marketing/motor", icon: Bike },
    ],
    ceo: [
      { name: "Overview", href: "/ceo", icon: LayoutDashboard }, // Diperbarui
      { name: "Laporan Kredit", href: "/ceo/laporan", icon: FileText },
    ],
  };

  const currentMenu = menus[role as keyof typeof menus] || [];

  return (
    <div className="w-64 bg-white h-screen border-r border-slate-200 p-6 flex flex-col">
      {/* ... (kode sisa tampilan Sidebar sama seperti sebelumnya) ... */}
    </div>
  );
}