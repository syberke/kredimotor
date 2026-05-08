"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  LayoutDashboard,
  ClipboardList,
  Bike,
  CreditCard,
  Wallet,
} from "lucide-react";

const menus = [
  {
    name: "Dashboard",
    href: "/ceo",
    icon: LayoutDashboard,
  },
  {
    name: "Pengajuan Kredit",
    href: "/ceo/pengajuan-kredit",
    icon: ClipboardList,
  },
  {
    name: "Kredit",
    href: "/ceo/kredit",
    icon: CreditCard,
  },
  {
    name: "Angsuran",
    href: "/ceo/angsuran",
    icon: Wallet,
  },
  {
    name: "Motor",
    href: "/ceo/motor",
    icon: Bike,
  },
];

export default function CeoSidebar() {
  const pathname = usePathname();

  return (
    <aside className="
      w-72
      min-h-screen
      bg-white
      border-r
      border-slate-200
      flex
      flex-col
    ">

      <div className="
        h-20
        flex
        items-center
        px-6
        border-b
      ">

        <h1 className="text-3xl font-black">
          <span className="text-blue-600">
            Kredi
          </span>

          <span className="text-emerald-500">
            Motor
          </span>
        </h1>

      </div>

      <nav className="
        flex-1
        p-4
        space-y-1
      ">

        {menus.map((menu) => {
          const active =
            pathname === menu.href;

          const Icon = menu.icon;

          return (
            <Link
              key={menu.href}
              href={menu.href}
              className={`
                flex
                items-center
                gap-3
                px-4
                py-3
                rounded-2xl
                text-sm
                font-medium
                transition-all
                ${
                  active
                    ? "bg-blue-600 text-white"
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

    </aside>
  );
}