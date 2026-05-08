import {
  ClipboardList,
  CreditCard,
  Wallet,
  Bike,
} from "lucide-react";

import { supabase } from "@/lib/supabase";

async function getStats() {
  const [
    pengajuan,
    kredit,
    angsuran,
    motor,
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
      }),

    supabase
      .from("angsuran")
      .select("*", {
        count: "exact",
        head: true,
      }),

    supabase
      .from("motor")
      .select("*", {
        count: "exact",
        head: true,
      }),
  ]);

  return {
    pengajuan:
      pengajuan.count || 0,

    kredit:
      kredit.count || 0,

    angsuran:
      angsuran.count || 0,

    motor:
      motor.count || 0,
  };
}

export default async function MarketingPage() {
  const stats = await getStats();

  const cards = [
    {
      title: "Pengajuan",
      value: stats.pengajuan,
      icon: ClipboardList,
    },
    {
      title: "Kredit",
      value: stats.kredit,
      icon: CreditCard,
    },
    {
      title: "Angsuran",
      value: stats.angsuran,
      icon: Wallet,
    },
    {
      title: "Motor",
      value: stats.motor,
      icon: Bike,
    },
  ];

  return (
    <div className="p-8 space-y-8">

      <div>

        <h1 className="text-4xl font-black">
          Marketing Dashboard
        </h1>

        <p className="text-slate-500 mt-2">
          Monitoring aktivitas marketing
        </p>

      </div>

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-4
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
                p-6
              "
            >

              <div className="
                w-14
                h-14
                rounded-2xl
                bg-blue-100
                text-blue-600
                flex
                items-center
                justify-center
                mb-5
              ">
                <Icon size={28} />
              </div>

              <p className="text-slate-500">
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

    </div>
  );
}