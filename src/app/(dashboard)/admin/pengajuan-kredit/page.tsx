import PengajuanTable from "@/components/pengajuan/PengajuanTable";
import { getPengajuanKredit } from "@/services/pengajuan.service";

export default async function PengajuanKreditPage() {
  const data = await getPengajuanKredit();

  return (
    <div className="p-8 space-y-6">

      {/* HEADER */}
      <div>

        <h1 className="text-3xl font-black text-slate-800">
          Pengajuan Kredit
        </h1>

        <p className="text-slate-500 mt-1">
          Kelola seluruh pengajuan kredit motor
        </p>

      </div>

      {/* TABLE */}
      <PengajuanTable data={data} />

    </div>
  );
}