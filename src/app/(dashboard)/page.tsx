import {
  Users,
  Bike,
  CreditCard,
  AlertTriangle,
  Wallet,
  ClipboardList,
  TrendingUp,
  Calendar,
  ChevronRight,
} from "lucide-react";
import { supabase } from "@/lib/supabase";

// 🔒 Mapping statis untuk menghindari bug Tailwind dynamic class
const COLOR_MAP: Record<string, { bg: string; text: string; ring: string }> = {
  blue: { bg: "bg-blue-50", text: "text-blue-600", ring: "ring-blue-100" },
  emerald: { bg: "bg-emerald-50", text: "text-emerald-600", ring: "ring-emerald-100" },
  green: { bg: "bg-green-50", text: "text-green-600", ring: "ring-green-100" },
  red: { bg: "bg-red-50", text: "text-red-600", ring: "ring-red-100" },
  purple: { bg: "bg-purple-50", text: "text-purple-600", ring: "ring-purple-100" },
  orange: { bg: "bg-orange-50", text: "text-orange-600", ring: "ring-orange-100" },
};

const formatRupiah = (amount: number) =>
  new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);

const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 12) return "Selamat Pagi";
  if (hour < 15) return "Selamat Siang";
  if (hour < 18) return "Selamat Sore";
  return "Selamat Malam";
};

async function getDashboardData() {
  try {
    const queries = await Promise.all([
      supabase.from("pengajuan_kredit").select("*", { count: "exact", head: true }),
      supabase.from("kredit").select("*", { count: "exact", head: true }).eq("status_kredit", "Dicicil"),
      supabase.from("kredit").select("*", { count: "exact", head: true }).eq("status_kredit", "Lunas"),
      supabase.from("kredit").select("*", { count: "exact", head: true }).eq("status_kredit", "Macet"),
      supabase.from("motor").select("*", { count: "exact", head: true }),
      supabase.from("pelanggan").select("*", { count: "exact", head: true }),
      supabase.from("angsuran").select("total_bayar"),
    ]);

    // Cek error Supabase
    queries.forEach((res) => {
      if (res.error) throw new Error(res.error.message);
    });

    const [pengajuan, aktif, lunas, macet, motor, pelanggan, angsuran] = queries;

    const totalAngsuran =
      angsuran.data?.reduce((acc, item) => acc + (item.total_bayar || 0), 0) || 0;

    return {
      totalPengajuan: pengajuan.count || 0,
      totalKreditAktif: aktif.count || 0,
      totalKreditLunas: lunas.count || 0,
      totalKreditMacet: macet.count || 0,
      totalMotor: motor.count || 0,
      totalPelanggan: pelanggan.count || 0,
      totalAngsuran,
    };
  } catch (error) {
    console.error("Dashboard Data Error:", error);
    return {
      totalPengajuan: 0, totalKreditAktif: 0, totalKreditLunas: 0,
      totalKreditMacet: 0, totalMotor: 0, totalPelanggan: 0, totalAngsuran: 0,
    };
  }
}

export default async function AdminDashboard() {
  const stats = await getDashboardData();
  const today = new Intl.DateTimeFormat("id-ID", {
    weekday: "long", day: "numeric", month: "long", year: "numeric",
  }).format(new Date());

  const cards = [
    { title: "Total Pengajuan", value: stats.totalPengajuan, icon: ClipboardList, color: "blue" },
    { title: "Kredit Aktif", value: stats.totalKreditAktif, icon: CreditCard, color: "emerald" },
    { title: "Kredit Lunas", value: stats.totalKreditLunas, icon: Wallet, color: "green" },
    { title: "Kredit Macet", value: stats.totalKreditMacet, icon: AlertTriangle, color: "red" },
    { title: "Total Motor", value: stats.totalMotor, icon: Bike, color: "purple" },
    { title: "Total Pelanggan", value: stats.totalPelanggan, icon: Users, color: "orange" },
  ];

  return (
    <div className="p-6 lg:p-10 bg-slate-50/50 min-h-screen">
      {/* Header */}
      <header className="mb-10 flex flex-col md:flex-row md:items-end md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            {getGreeting()}, Admin 👋
          </h1>
          <p className="text-slate-500 mt-1 flex items-center gap-2 text-sm">
            <Calendar className="w-4 h-4" /> {today}
          </p>
        </div>
        <div className="flex items-center gap-3">
          <span className="px-3 py-1.5 bg-emerald-100 text-emerald-700 text-xs font-semibold rounded-full">
            Sistem Aktif
          </span>
        </div>
      </header>

      {/* Grid Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-10">
        {cards.map((card) => {
          const Icon = card.icon;
          const style = COLOR_MAP[card.color] || COLOR_MAP.blue;

          return (
            <div
              key={card.title}
              className="group bg-white p-6 rounded-2xl border border-slate-200/60 shadow-sm hover:shadow-md hover:border-slate-300 transition-all duration-300"
            >
              <div className="flex items-center justify-between mb-4">
                <div
                  className={`w-12 h-12 rounded-xl flex items-center justify-center ${style.bg} ${style.text} ${style.ring} ring-1`}
                >
                  <Icon size={24} />
                </div>
                <ChevronRight className="w-5 h-5 text-slate-300 group-hover:text-slate-500 transition-colors" />
              </div>

              <p className="text-slate-500 text-sm font-medium">{card.title}</p>
              <h2 className="text-3xl font-bold text-slate-800 mt-1 tracking-tight">
                {card.value.toLocaleString("id-ID")}
              </h2>
            </div>
          );
        })}
      </div>

      {/* Total Angsuran Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-blue-600 to-emerald-500 p-8 text-white shadow-xl">
        <div className="absolute top-0 right-0 -mt-6 -mr-6 w-40 h-40 bg-white/10 rounded-full blur-2xl" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-3">
            <TrendingUp className="w-6 h-6" />
            <p className="text-sm font-medium opacity-90">Total Angsuran Masuk</p>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold tracking-tight">
            {formatRupiah(stats.totalAngsuran)}
          </h2>
          <p className="mt-3 text-sm opacity-75">
            Data diperbarui secara real-time dari database
          </p>
        </div>
      </div>
    </div>
  );
}