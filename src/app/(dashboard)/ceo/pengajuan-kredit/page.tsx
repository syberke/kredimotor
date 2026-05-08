import PengajuanTable from "@/components/pengajuan/PengajuanTable";

import {
  getPengajuanKredit,
} from "@/services/pengajuan.service";

export default async function CEOPengajuanPage() {
  const data = await getPengajuanKredit();

  return (
    <div className="p-8 space-y-6">

      <div>

        <h1 className="text-3xl font-black">
          Monitoring Pengajuan
        </h1>

        <p className="text-slate-500 mt-1">
          Monitoring seluruh pengajuan kredit
        </p>

      </div>

      <PengajuanTable data={data} />

    </div>
  );
}   