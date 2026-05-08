import {
  Bike,
  ClipboardList,
  CreditCard,
  Wallet,
  AlertTriangle,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

async function getStats() {
  const [
    pengajuan,
    kreditAktif,
    kreditLunas,
    kreditMacet,
    motor,
    angsuran,
  ] = await Promise.all([
    supabase
      .from("pengajuan_kredit")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("kredit")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("status_kredit", "Dicicil"),

    supabase
      .from("kredit")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("status_kredit", "Lunas"),

    supabase
      .from("kredit")
      .select("*", {
        count: "exact",
        head: true,
      })
      .eq("status_kredit", "Macet"),

    supabase
      .from("motor")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("angsuran")
      .select("total_bayar"),
  ]);

  const totalAngsuran =
    angsuran.data?.reduce(
      (acc, item) =>
        acc + (item.total_bayar || 0),
      0
    ) || 0;

  return {
    totalPengajuan:
      pengajuan.count || 0,

    totalKreditAktif:
      kreditAktif.count || 0,

    totalKreditLunas:
      kreditLunas.count || 0,

    totalKreditMacet:
      kreditMacet.count || 0,

    totalMotor:
      motor.count || 0,

    totalAngsuran,
  };
}

export default async function CEOPage() {
  const stats = await getStats();

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
  ];

const colorMap: Record<string, string> = {
    blue:
      "bg-blue-100 text-blue-600",

    emerald:
      "bg-emerald-100 text-emerald-600",

    green:
      "bg-green-100 text-green-600",

    red:
      "bg-red-100 text-red-600",

    purple:
      "bg-purple-100 text-purple-600",
  };

  return (
    <div className="p-8 space-y-8">

      {/* HEADER */}
      <div>

        <h1 className="text-4xl font-black text-slate-800">
          CEO Dashboard
        </h1>

        <p className="text-slate-500 mt-2">
          Monitoring bisnis kredit motor
        </p>

      </div>

      {/* CARD */}
      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-5
        gap-6
      ">

        {cards.map((card, index) => {
          const Icon = card.icon;

          return (
            <div
              key={index}
              className="
                bg-white
                rounded-3xl
                border
                border-slate-100
                p-6
              "
            >

              <div className="
                flex
                items-center
                justify-between
                mb-5
              ">

                <div
                  className={`
                    w-14
                    h-14
                    rounded-2xl
                    flex
                    items-center
                    justify-center
                    ${colorMap[card.color]}
                  `}
                >
                  <Icon size={28} />
                </div>

              </div>

              <p className="text-slate-500 text-sm">
                {card.title}
              </p>

              <h2 className="
                text-3xl
                font-black
                mt-2
              ">
                {card.value}
              </h2>

            </div>
          );
        })}

      </div>

      {/* TOTAL PEMASUKAN */}
      <div className="
        bg-gradient-to-r
        from-blue-600
        to-emerald-500
        rounded-3xl
        p-8
        text-white
      ">

        <p className="opacity-80 mb-2">
          Total Angsuran Masuk
        </p>

        <h2 className="
          text-5xl
          font-black
        ">
          Rp{" "}
          {stats.totalAngsuran.toLocaleString(
            "id-ID"
          )}
        </h2>

      </div>

    </div>
  );
}