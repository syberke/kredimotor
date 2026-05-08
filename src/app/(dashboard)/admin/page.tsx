// ✅ NO "use client" - This is a Server Component
import {
  Users, Bike, CreditCard, AlertTriangle, Wallet, ClipboardList,
  Calendar, TrendingUp
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import DashboardActions, { type DashboardStats } from "@/components/admin/DashboardActions";

// 🔒 Static color mapping
const COLOR_MAP: Record<string, { bg: string; text: string; ring: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-600", ring: "ring-blue-100" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", ring: "ring-emerald-100" },
  green: { bg: "bg-green-50", text: "text-green-600", ring: "ring-green-100" },
  red: { bg: "bg-red-50", text: "text-red-600", ring: "ring-red-100" },
  purple: { bg: "bg-purple-50", text: "text-purple-600", ring: "ring-purple-100" },
  orange: { bg: "bg-orange-50", text: "text-orange-600", ring: "ring-orange-100" },
};

// 🛠️ Helpers
const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);

const getGreeting = () => {
  const h = new Date().getHours();
  if (h < 12) return "Selamat Pagi";
  if (h < 15) return "Selamat Siang";
  if (h < 18) return "Selamat Sore";
  return "Selamat Malam";
};

// 🌐 Data Fetcher (Server-side only)
async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [
      pengajuan,
      kreditAktif,
      kreditLunas,
      kreditMacet,
      motor,
      pelanggan,
      angsuran,
    ] = await Promise.all([
      supabase.from("pengajuan_kredit").select("*", { count: "exact", head: true }),
      supabase.from("kredit").select("*", { count: "exact", head: true }).eq("status_kredit", "Dicicil"),
      supabase.from("kredit").select("*", { count: "exact", head: true }).eq("status_kredit", "Lunas"),
      supabase.from("kredit").select("*", { count: "exact", head: true }).eq("status_kredit", "Macet"),
      supabase.from("motor").select("*", { count: "exact", head: true }),
      supabase.from("pelanggan").select("*", { count: "exact", head: true }),
      supabase.from("angsuran").select("total_bayar"),
    ]);

    const queries = [pengajuan, kreditAktif, kreditLunas, kreditMacet, motor, pelanggan, angsuran];
    const errorQuery = queries.find(q => q.error);
    if (errorQuery?.error) {
      console.error("Supabase error:", errorQuery.error.message);
      return getFallbackStats();
    }

    const totalAngsuran = angsuran.data?.reduce(
      (acc, item) => acc + (item.total_bayar || 0), 0
    ) || 0;

    return {
      totalPengajuan: pengajuan.count || 0,
      totalKreditAktif: kreditAktif.count || 0,
      totalKreditLunas: kreditLunas.count || 0,
      totalKreditMacet: kreditMacet.count || 0,
      totalMotor: motor.count || 0,
      totalPelanggan: pelanggan.count || 0,
      totalAngsuran,
    };
  } catch (error) {
    console.error("Dashboard fetch error:", error);
    return getFallbackStats();
  }
}

function getFallbackStats(): DashboardStats {
  return {
    totalPengajuan: 0, totalKreditAktif: 0, totalKreditLunas: 0,
    totalKreditMacet: 0, totalMotor: 0, totalPelanggan: 0, totalAngsuran: 0,
  };
}

// 🎯 Stats cards config
type StatKey = keyof Omit<DashboardStats, "totalAngsuran">;

const STATS_CARDS: Array<{
  title: string;
  key: StatKey;
  icon: React.ElementType;
  color: keyof typeof COLOR_MAP;
}> = [
  { title: "Total Pengajuan", key: "totalPengajuan", icon: ClipboardList, color: "blue" },
  { title: "Kredit Aktif", key: "totalKreditAktif", icon: CreditCard, color: "emerald" },
  { title: "Kredit Lunas", key: "totalKreditLunas", icon: Wallet, color: "green" },
  { title: "Kredit Macet", key: "totalKreditMacet", icon: AlertTriangle, color: "red" },
  { title: "Total Motor", key: "totalMotor", icon: Bike, color: "purple" },
  { title: "Total Pelanggan", key: "totalPelanggan", icon: Users, color: "orange" },
];

// ✅ Server Component (Async allowed!)
export default async function AdminDashboard() {
  const stats = await getDashboardStats();
  const today = new Intl.DateTimeFormat("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric"
  }).format(new Date());

  return (
    <div className="p-6 lg:p-10 bg-slate-50 min-h-screen">
      {/* 📣 Header */}
      <header className="flex flex-col md:flex-row md:items-end md:justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold text-slate-800 tracking-tight">
            {getGreeting()}, Admin 👋
          </h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4" /> {today}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full flex items-center gap-1">
            <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" /> Online
          </span>
          <span className="px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
            Role: Admin
          </span>
        </div>
      </header>

      {/* 📊 Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-5 mb-8">
        {STATS_CARDS.map((card) => {
          const Icon = card.icon;
          const style = COLOR_MAP[card.color];
          const value = stats[card.key];

          return (
            <div
              key={card.title}
              className="group bg-white p-5 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-slate-300 transition-all cursor-pointer"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${style.bg} ${style.text} ${style.ring} ring-1`}>
                  <Icon size={22} />
                </div>
              </div>
              <p className="text-slate-500 text-sm font-medium">{card.title}</p>
              <h2 className="text-2xl font-bold text-slate-800 mt-1">
                {value.toLocaleString("id-ID")}
              </h2>
            </div>
          );
        })}
      </div>

      {/* 💰 Total Angsuran Banner with Client Actions */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-emerald-500 p-8 text-white shadow-xl mb-8">
        <div className="absolute top-0 right-0 -mt-10 -mr-10 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-3">
              <TrendingUp size={20} />
              <p className="text-sm font-medium opacity-90">Total Akumulasi Angsuran Masuk</p>
            </div>
            <h2 className="text-4xl font-bold tracking-tight">{formatRupiah(stats.totalAngsuran)}</h2>
            <p className="mt-2 text-sm opacity-75">Data real-time dari database • Semua status cicilan</p>
          </div>
          
          {/* ✅ Client Component receives server-fetched data as props */}
          <DashboardActions stats={stats} />
          
        </div>
      </div>

      {/* 🚀 Quick Access Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: "Pengajuan", href: "/admin/pengajuan-kredit", icon: ClipboardList, color: "blue" },
          { label: "Kredit", href: "/admin/kredit", icon: CreditCard, color: "emerald" },
          { label: "Angsuran", href: "/admin/angsuran", icon: Wallet, color: "green" },
          { label: "Motor", href: "/admin/motor", icon: Bike, color: "purple" },
        ].map((item) => {
          const Icon = item.icon;
          const style = COLOR_MAP[item.color];
          return (
            <a
              key={item.label}
              href={item.href}
              className="flex items-center gap-3 p-4 bg-white rounded-xl border border-slate-200 hover:border-slate-300 hover:shadow-sm transition group"
            >
              <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${style.bg} ${style.text}`}>
                <Icon size={20} />
              </div>
              <span className="text-sm font-medium text-slate-700 group-hover:text-slate-900">{item.label}</span>
            </a>
          );
        })}
      </div>
    </div>
  );
}