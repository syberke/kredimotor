import {
  Wallet,
  CreditCard,
  TrendingUp,
  AlertCircle,
} from "lucide-react";

import AngsuranTable from "@/components/angsuran/AngsuranTable";
import { getAngsuranData } from "@/services/angsuran.service";

export default async function AngsuranPage() {
  type AngsuranItem = {
  id: number;
  total_bayar: number;
  angsuran_ke: number;
  tgl_bayar: string;

  kredit?: {
    status_kredit?: string;

    pengajuan_kredit?: {
      pelanggan?: {
        nama_pelanggan?: string;
      };
    };
  };
};
  const data = await getAngsuranData();

  /* =========================
     STATISTIK
  ========================= */

  const totalPembayaran = data.reduce(
    (acc: number, item: AngsuranItem) =>
      acc + (item.total_bayar || 0),
    0
  );

  const totalTransaksi = data.length;

  const kreditLunas = data.filter(
    (item: AngsuranItem) =>
      item.kredit?.status_kredit === "Lunas"
  ).length;

  const kreditAktif = data.filter(
    (item: AngsuranItem) =>
      item.kredit?.status_kredit === "Dicicil"
  ).length;

  const stats = [
    {
      title: "Total Pembayaran",
      value: `Rp ${totalPembayaran.toLocaleString(
        "id-ID"
      )}`,
      icon: Wallet,
      color:
        "bg-emerald-100 text-emerald-600",
    },
    {
      title: "Total Transaksi",
      value: totalTransaksi,
      icon: CreditCard,
      color:
        "bg-blue-100 text-blue-600",
    },
    {
      title: "Kredit Aktif",
      value: kreditAktif,
      icon: TrendingUp,
      color:
        "bg-amber-100 text-amber-600",
    },
    {
      title: "Kredit Lunas",
      value: kreditLunas,
      icon: AlertCircle,
      color:
        "bg-purple-100 text-purple-600",
    },
  ];

  return (
    <div className="p-8 space-y-8 bg-slate-50 min-h-screen">

      {/* =========================
          HEADER
      ========================= */}

      <div className="
        flex
        flex-col
        md:flex-row
        md:items-center
        md:justify-between
        gap-5
      ">

        <div>

          <h1 className="
            text-4xl
            font-black
            text-slate-800
          ">
            Data Angsuran
          </h1>

          <p className="
            text-slate-500
            mt-2
          ">
            Monitoring pembayaran kredit pelanggan
          </p>

        </div>

        <button className="
          bg-blue-600
          hover:bg-blue-700
          transition-all
          text-white
          px-6
          py-3
          rounded-2xl
          font-semibold
          shadow-lg
          shadow-blue-200
        ">
          + Input Angsuran
        </button>

      </div>

      {/* =========================
          STATISTIC CARDS
      ========================= */}

      <div className="
        grid
        grid-cols-1
        md:grid-cols-2
        xl:grid-cols-4
        gap-6
      ">

        {stats.map((item, index) => {
          const Icon = item.icon;

          return (
            <div
              key={index}
              className="
                bg-white
                rounded-3xl
                border
                border-slate-100
                p-6
                shadow-sm
              "
            >

              <div className="
                flex
                items-center
                justify-between
              ">

                <div>

                  <p className="
                    text-slate-500
                    text-sm
                  ">
                    {item.title}
                  </p>

                  <h2 className="
                    text-3xl
                    font-black
                    mt-3
                    text-slate-800
                  ">
                    {item.value}
                  </h2>

                </div>

                <div
                  className={`
                    w-14
                    h-14
                    rounded-2xl
                    flex
                    items-center
                    justify-center
                    ${item.color}
                  `}
                >
                  <Icon size={28} />
                </div>

              </div>

            </div>
          );
        })}

      </div>

      {/* =========================
          CHART & ACTIVITY
      ========================= */}

      <div className="
        grid
        grid-cols-1
        xl:grid-cols-3
        gap-6
      ">

        {/* CHART PLACEHOLDER */}
        <div className="
          xl:col-span-2
          bg-white
          rounded-3xl
          border
          border-slate-100
          p-6
        ">

          <div className="
            flex
            items-center
            justify-between
            mb-6
          ">

            <div>

              <h2 className="
                text-xl
                font-bold
                text-slate-800
              ">
                Grafik Pembayaran
              </h2>

              <p className="
                text-sm
                text-slate-500
                mt-1
              ">
                Statistik pembayaran pelanggan
              </p>

            </div>

            <div className="
              bg-blue-100
              text-blue-700
              text-sm
              px-4
              py-2
              rounded-xl
              font-semibold
            ">
              Bulan Ini
            </div>

          </div>

          {/* FAKE CHART */}
          <div className="
            h-72
            flex
            items-end
            gap-4
          ">

            {[40, 80, 55, 90, 60, 120, 75].map(
              (height, index) => (
                <div
                  key={index}
                  className="
                    flex-1
                    bg-gradient-to-t
                    from-blue-600
                    to-emerald-400
                    rounded-t-2xl
                  "
                  style={{
                    height: `${height}%`,
                  }}
                />
              )
            )}

          </div>

        </div>

        {/* RECENT PAYMENT */}
        <div className="
          bg-white
          rounded-3xl
          border
          border-slate-100
          p-6
        ">

          <h2 className="
            text-xl
            font-bold
            text-slate-800
            mb-6
          ">
            Pembayaran Terbaru
          </h2>

          <div className="space-y-5">

            {data.slice(0, 5).map((item: AngsuranItem) => (
              <div
                key={item.id}
                className="
                  flex
                  items-center
                  justify-between
                "
              >

                <div>

                  <p className="
                    font-semibold
                    text-slate-700
                  ">
                    {
                      item.kredit
                        ?.pengajuan_kredit
                        ?.pelanggan
                        ?.nama_pelanggan
                    }
                  </p>

                  <p className="
                    text-sm
                    text-slate-500
                  ">
                    Angsuran ke-
                    {item.angsuran_ke}
                  </p>

                </div>

                <div className="text-right">

                  <p className="
                    font-bold
                    text-emerald-600
                  ">
                    Rp{" "}
                    {item.total_bayar?.toLocaleString(
                      "id-ID"
                    )}
                  </p>

                  <p className="
                    text-xs
                    text-slate-400
                  ">
                    {item.tgl_bayar}
                  </p>

                </div>

              </div>
            ))}

          </div>

        </div>

      </div>

      {/* =========================
          TABLE
      ========================= */}

      <AngsuranTable data={data} />

    </div>
  );
}