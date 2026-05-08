import KreditTable from "@/components/kredit/KreditTable";

import {
  getKreditData,
} from "@/services/kredit.service";

export default async function MarketingKreditPage() {
  const data = await getKreditData();

  return (
    <div className="p-8 space-y-6">

      {/* HEADER */}
      <div>

        <h1 className="
          text-3xl
          font-black
        ">
          Monitoring Kredit
        </h1>

        <p className="text-slate-500 mt-1">
          Monitoring seluruh kredit pelanggan
        </p>

      </div>

      {/* TABLE */}
      <KreditTable data={data} />

    </div>
  );
}