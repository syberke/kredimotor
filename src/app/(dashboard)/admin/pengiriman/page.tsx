import PengirimanTable from "@/components/pengiriman/PengirimanTable";
import { getPengirimanData } from "@/services/pengiriman.service";

export default async function PengirimanPage() {
  const data = await getPengirimanData();

  return (
    <div className="p-8 space-y-6">

      {/* HEADER */}
      <div>

        <h1 className="text-3xl font-black text-slate-800">
          Data Pengiriman
        </h1>

        <p className="text-slate-500 mt-1">
          Monitoring pengiriman motor pelanggan
        </p>

      </div>

      {/* TABLE */}
      <PengirimanTable data={data} />

    </div>
  );
}