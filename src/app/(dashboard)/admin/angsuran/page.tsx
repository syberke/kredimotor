import AngsuranTable from "@/components/angsuran/AngsuranTable";
import { getAngsuranData } from "@/services/angsuran.service";

export default async function AngsuranPage() {
  const data = await getAngsuranData();

  return (
    <div className="p-8 space-y-6">

      {/* HEADER */}
      <div>

        <h1 className="text-3xl font-black text-slate-800">
          Data Angsuran
        </h1>

        <p className="text-slate-500 mt-1">
          Monitoring pembayaran kredit pelanggan
        </p>

      </div>

      {/* TABLE */}
      <AngsuranTable data={data} />

    </div>
  );
}