// src/app/kredit/page.tsx
import KreditTable from "@/components/kredit/KreditTable";
import KreditPageClient from "@/components/kredit/KreditPageClient"; // ✅ Import dari components/kredit
import { getKreditData } from "@/services/kredit.service";
import { getKreditOptions } from "@/actions/kredit-actions";

export default async function KreditPage() {
  const [kreditData, options] = await Promise.all([
    getKreditData(),
    getKreditOptions(),
  ]);

  return (
    <div className="p-6 lg:p-8 space-y-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Data Kredit</h1>
          <p className="text-slate-500 mt-1">Monitoring seluruh kredit pelanggan</p>
        </div>
      <a href="/admin/kredit?modal=tambah" className="self-start sm:self-auto px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-medium transition shadow-sm hover:shadow flex items-center gap-2">
  <span className="text-lg">+</span> Tambah Kredit
</a>
      </div>

      {/* Table */}
      <KreditTable data={kreditData} />

      {/* ✅ Modal Wrapper - taruh di bawah table */}
      <KreditPageClient options={options}>
        <></>
      </KreditPageClient>
    </div>
  );
}