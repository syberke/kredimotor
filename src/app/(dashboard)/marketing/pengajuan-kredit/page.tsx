import PengajuanTable from "@/components/pengajuan/PengajuanTable";

import {
  getPengajuanKredit,
} from "@/services/pengajuan.service";

export default async function MarketingPengajuanPage() {
  const data = await getPengajuanKredit();

  return (
    <div className="p-8 space-y-6">

      {/* HEADER */}
      <div className="
        flex
        items-center
        justify-between
      ">

        <div>

          <h1 className="
            text-3xl
            font-black
          ">
            Pengajuan Kredit
          </h1>

          <p className="text-slate-500 mt-1">
            Input dan monitoring pengajuan kredit
          </p>

        </div>

        <button className="
          bg-blue-600
          hover:bg-blue-700
          text-white
          px-5
          py-3
          rounded-2xl
          font-medium
        ">
          Tambah Pengajuan
        </button>

      </div>

      {/* TABLE */}
      <PengajuanTable data={data} />

    </div>
  );
}