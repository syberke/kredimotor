"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import {
  LayoutDashboard, ClipboardList, CreditCard, Wallet,
  Truck, Bike, Tags, Users, Landmark, ShieldCheck,
  CalendarClock, UserCog, LogOut, ChevronDown, ChevronUp,
  Settings, Bell
} from "lucide-react";
import Image from "next/image";
// 📦 Menu configuration
type MenuRole = "admin" | "marketing" | "ceo" | "all";

interface MenuItem {
  name: string;
  href: string;
  icon: React.ElementType;
  roles?: MenuRole[];
  group?: string;
}

const MENU_ITEMS: MenuItem[] = [
  { name: "Dashboard", href: "/admin", icon: LayoutDashboard, roles: ["all"] },
  { name: "Pengajuan Kredit", href: "/admin/pengajuan-kredit", icon: ClipboardList, roles: ["admin", "marketing", "ceo"], group: "Transaksi" },
  { name: "Kredit", href: "/admin/kredit", icon: CreditCard, roles: ["admin", "ceo"], group: "Transaksi" },
  { name: "Angsuran", href: "/admin/angsuran", icon: Wallet, roles: ["admin", "ceo"], group: "Transaksi" },
  { name: "Pengiriman", href: "/admin/pengiriman", icon: Truck, roles: ["admin"], group: "Transaksi" },
  { name: "Motor", href: "/admin/motor", icon: Bike, roles: ["admin", "marketing", "ceo"], group: "Master Data" },
  { name: "Jenis Motor", href: "/admin/jenis-motor", icon: Tags, roles: ["admin"], group: "Master Data" },
  { name: "Pelanggan", href: "/admin/pelanggan", icon: Users, roles: ["admin"], group: "Master Data" },
  { name: "Metode Bayar", href: "/admin/metode-bayar", icon: Landmark, roles: ["admin"], group: "Settings" },
  { name: "Asuransi", href: "/admin/asuransi", icon: ShieldCheck, roles: ["admin"], group: "Settings" },
  { name: "Jenis Cicilan", href: "/admin/jenis-cicilan", icon: CalendarClock, roles: ["admin"], group: "Settings" },
  { name: "Users", href: "/admin/users", icon: UserCog, roles: ["admin"], group: "Settings" },
];

const groupMenus = (items: MenuItem[], role: MenuRole) => {
  const filtered = items.filter(m => !m.roles || m.roles.includes("all") || m.roles.includes(role));
  const groups: Record<string, MenuItem[]> = {};
  filtered.forEach(item => {
    const key = item.group || "Lainnya";
    if (!groups[key]) groups[key] = [];
    groups[key].push(item);
  });
  return groups;
};

export default function AdminSidebar({ userRole = "admin" }: { userRole?: MenuRole }) {
  const pathname = usePathname();
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    "Transaksi": true,
    "Master Data": true,
    "Settings": false,
  });

  const groupedMenus = groupMenus(MENU_ITEMS, userRole);
  const toggleGroup = (group: string) => {
    setOpenGroups(prev => ({ ...prev, [group]: !prev[group] }));
  };

  return (
    <aside className="w-72 h-screen bg-white border-r border-slate-200 flex flex-col">
      {/* Logo */}
      <div className="h-20 flex items-center px-6 border-b border-slate-100">
       <Link href="/admin" className="flex items-center gap-3">
  <Image
    src="/logo_slog_nobg_side.png"
    alt="KrediMotor Logo"
    loading="eager"
    width={450}
    height={450}
    className="object-contain"
  />

</Link>
      </div>

      {/* Notifications */}
      <div className="px-4 py-3 border-b border-slate-100">
        <button className="w-full flex items-center justify-between px-3 py-2 rounded-lg bg-slate-50 hover:bg-slate-100 transition text-sm text-slate-600">
          <span className="flex items-center gap-2">
            <Bell size={16} /> Notifikasi
          </span>
          <span className="px-2 py-0.5 bg-red-100 text-red-600 text-xs font-semibold rounded-full">3</span>
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {Object.entries(groupedMenus).map(([groupName, items]) => (
          <div key={groupName} className="mb-2">
            {items.length > 1 && (
              <button
                onClick={() => toggleGroup(groupName)}
                className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-slate-400 uppercase tracking-wider hover:text-slate-600 transition"
              >
                <span>{groupName}</span>
                {openGroups[groupName] ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
            )}
            <div className={`space-y-0.5 transition-all duration-200 ${openGroups[groupName] || items.length === 1 ? "opacity-100 max-h-96" : "opacity-0 max-h-0 overflow-hidden"}`}>
              {items.map((menu) => {
                const isActive = pathname === menu.href;
                const Icon = menu.icon;
                return (
                  <Link
                    key={menu.href}
                    href={menu.href}
                    className={`
                      flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200
                      ${isActive
                        ? "bg-blue-600 text-white shadow-md shadow-blue-200/50"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
                      }
                    `}
                  >
                    <Icon size={18} className={isActive ? "text-white" : "text-slate-400"} />
                    <span className="truncate">{menu.name}</span>
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </nav>

      {/* User Profile & Logout */}
      <div className="p-4 border-t border-slate-100 space-y-3">
        <div className="flex items-center gap-3 px-3 py-2 rounded-xl bg-slate-50 border border-slate-100">
         <div className="w-9 h-9 rounded-full bg-blue-600 flex items-center justify-center text-white font-semibold text-sm">
            A
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-slate-700 truncate">Admin Utama</p>
            <p className="text-xs text-slate-400 capitalize">{userRole}</p>
          </div>
          <button className="p-1.5 rounded-lg hover:bg-slate-100 transition text-slate-400 hover:text-slate-600">
            <Settings size={16} />
          </button>
        </div>
        <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium text-red-500 hover:bg-red-50 transition-colors">
          <LogOut size={18} />
          <span>Keluar</span>
        </button>
      </div>
    </aside>
  );
}