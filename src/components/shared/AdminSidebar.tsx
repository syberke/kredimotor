"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  ClipboardList,
  CreditCard,
  Wallet,
  Truck,
  Bike,
  Tags,
  Users,
  Landmark,
  ShieldCheck,
  CalendarClock,
  UserCog,
} from "lucide-react";

const menus = [
  {
    name: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
  },
  {
    name: "Pengajuan Kredit",
    href: "/admin/pengajuan-kredit",
    icon: ClipboardList,
  },
  {
    name: "Kredit",
    href: "/admin/kredit",
    icon: CreditCard,
  },
  {
    name: "Angsuran",
    href: "/admin/angsuran",
    icon: Wallet,
  },
  {
    name: "Pengiriman",
    href: "/admin/pengiriman",
    icon: Truck,
  },
  {
    name: "Motor",
    href: "/admin/motor",
    icon: Bike,
  },
  {
    name: "Jenis Motor",
    href: "/admin/jenis-motor",
    icon: Tags,
  },
  {
    name: "Pelanggan",
    href: "/admin/pelanggan",
    icon: Users,
  },
  {
    name: "Metode Bayar",
    href: "/admin/metode-bayar",
    icon: Landmark,
  },
  {
    name: "Asuransi",
    href: "/admin/asuransi",
    icon: ShieldCheck,
  },
  {
    name: "Jenis Cicilan",
    href: "/admin/jenis-cicilan",
    icon: CalendarClock,
  },
  {
    name: "Users",
    href: "/admin/users",
    icon: UserCog,
  },
];

export default function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-72 min-h-screen bg-white border-r border-slate-200 flex flex-col">

      {/* LOGO */}
      <div className="h-20 flex items-center px-6 border-b border-slate-100">

        <h1 className="text-3xl font-black tracking-tight">
          <span className="text-blue-600">Kredi</span>
          <span className="text-emerald-500">Motor</span>
        </h1>

      </div>

      {/* MENU */}
      <nav className="flex-1 p-4 space-y-1 overflow-y-auto">

        {menus.map((menu) => {
          const active = pathname === menu.href;

          const Icon = menu.icon;

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`
                flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all
                ${
                  active
                    ? "bg-blue-600 text-white shadow-lg shadow-blue-100"
                    : "text-slate-600 hover:bg-slate-100"
                }
              `}
            >
              <Icon size={20} />

              <span>{menu.name}</span>
            </Link>
          );
        })}

      </nav>

      {/* FOOTER */}
      <div className="p-5 border-t border-slate-100">

        <div className="bg-slate-50 rounded-2xl p-4">
          <p className="text-xs text-slate-400 mb-1">
            Sistem Kredit Motor
          </p>

          <p className="font-semibold text-slate-700">
            Admin Panel v1.0
          </p>
        </div>

      </div>

    </aside>
  );
}