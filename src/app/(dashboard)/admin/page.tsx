import {
  Users,
  Bike,
  CreditCard,
  AlertTriangle,
  Wallet,
  ClipboardList,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

async function getDashboardData() {
  const [
    pengajuan,
    kreditAktif,
    kreditLunas,
    kreditMacet,
    motor,
    pelanggan,
    angsuran,
  ] = await Promise.all([
    supabase
      .from("pengajuan_kredit")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("kredit")
      .select("*", { count: "exact", head: true })
      .eq("status_kredit", "Dicicil"),

    supabase
      .from("kredit")
      .select("*", { count: "exact", head: true })
      .eq("status_kredit", "Lunas"),

    supabase
      .from("kredit")
      .select("*", { count: "exact", head: true })
      .eq("status_kredit", "Macet"),

    supabase
      .from("motor")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("pelanggan")
      .select("*", { count: "exact", head: true }),

    supabase
      .from("angsuran")
      .select("total_bayar"),
  ]);

  const totalAngsuran =
    angsuran.data?.reduce(
      (acc, item) => acc + (item.total_bayar || 0),
      0
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
}

export default async function AdminDashboard() {
  const stats = await getDashboardData();

  const cards = [
    {
      title: "Total Pengajuan",
      value: stats.totalPengajuan,
      icon: ClipboardList,
      color: "blue",
    },
    {
      title: "Kredit Aktif",
      value: stats.totalKreditAktif,
      icon: CreditCard,
      color: "emerald",
    },
    {
      title: "Kredit Lunas",
      value: stats.totalKreditLunas,
      icon: Wallet,
      color: "green",
    },
    {
      title: "Kredit Macet",
      value: stats.totalKreditMacet,
      icon: AlertTriangle,
      color: "red",
    },
    {
      title: "Total Motor",
      value: stats.totalMotor,
      icon: Bike,
      color: "purple",
    },
    {
      title: "Total Pelanggan",
      value: stats.totalPelanggan,
      icon: Users,
      color: "orange",
    },
  ];

  return (
    <div className="p-8 bg-slate-50 min-h-screen">

      {/* HEADER */}
      <div className="mb-8">
        <h1 className="text-3xl font-black text-slate-800">
          Dashboard Admin
        </h1>

        <p className="text-slate-500 mt-1">
          Monitoring sistem kredit motor
        </p>
      </div>

      {/* GRID CARD */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">

        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={index}
              className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm hover:shadow-md transition"
            >
              <div className="flex items-center justify-between mb-4">

                <div
                  className={`w-14 h-14 rounded-2xl flex items-center justify-center
                  bg-${card.color}-50 text-${card.color}-600`}
                >
                  <Icon size={28} />
                </div>

              </div>

              <p className="text-slate-500 text-sm">
                {card.title}
              </p>

              <h2 className="text-3xl font-black text-slate-800 mt-2">
                {card.value}
              </h2>
            </div>
          );
        })}
      </div>

      {/* TOTAL PEMBAYARAN */}
      <div className="bg-gradient-to-r from-blue-600 to-emerald-500 rounded-3xl p-8 text-white shadow-xl">

        <p className="text-sm opacity-80 mb-2">
          Total Angsuran Masuk
        </p>

        <h2 className="text-4xl font-black">
          Rp {stats.totalAngsuran.toLocaleString("id-ID")}
        </h2>

      </div>

    </div>
  );
}