// src/app/(dashboard)/admin/pengajuan-kredit/page.tsx
"use client";

import PengajuanTable from "@/components/pengajuan/PengajuanTable";
import { getPengajuanKredit, Pengajuan } from "@/services/pengajuan.service";
import { AlertCircle, AlertTriangle, CheckCircle, Clock, CreditCard, Loader2, Package, RefreshCw, Store, UserX } from "lucide-react";
import { useEffect, useState } from "react";

export default function PengajuanKreditPage() {
  const [data, setData] = useState<Pengajuan[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let isMounted = true;
    
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getPengajuanKredit({ 
          page, 
          limit: 10, 
          search, 
          status: status === "all" ? "" : status 
        });
        
        if (isMounted) {
          setData(res.data);
          setTotal(res.total);
        }
      } catch (err: unknown) {
        if (isMounted) {
          const message = err instanceof Error ? err.message : "Terjadi kesalahan tidak diketahui";
          setError(message);
          console.error("[Page] Error fetching ", err);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchData();
    return () => { isMounted = false; };
  }, [page, search, status]);

  // ✅ Stats calculation untuk SEMUA status
  const stats = data.reduce(
    (acc, curr) => {
      acc.total += 1;
      switch (curr.status_pengajuan) {
        case "Menunggu Konfirmasi": acc.pending += 1; break;
        case "Diproses": acc.processing += 1; break;
        case "Dibatalkan Pembeli": acc.cancelledBuyer += 1; break;
        case "Dibatalkan Penjual": acc.cancelledSeller += 1; break;
        case "Bermasalah": acc.issue += 1; break;
        case "Diterima": acc.approved += 1; break;
      }
      return acc;
    },
    { total: 0, pending: 0, processing: 0, cancelledBuyer: 0, cancelledSeller: 0, issue: 0, approved: 0 }
  );

  const handleRefresh = () => {
    setPage((prev) => prev);
  };

  if (loading && data.length === 0) {
    return (
      <div className="p-6 md:p-8 space-y-6 min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-10 h-10 text-[#4f46e5] animate-spin mx-auto mb-4" />
          <p className="text-slate-600">Memuat data pengajuan...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 md:p-8 min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-[#f87171] flex items-start gap-4 max-w-md">
          <AlertCircle className="w-6 h-6 text-[#ef4444] shrink-0 mt-0.5" />
          <div>
            <h3 className="text-lg font-semibold text-[#ef4444]">Gagal Memuat Data</h3>
            <p className="text-slate-600 mt-1 text-sm">{error}</p>
            <button 
              onClick={() => { setError(null); handleRefresh(); }} 
              className="mt-3 flex items-center gap-2 text-sm font-medium text-[#4f46e5] hover:text-[#4338ca]"
            >
              <RefreshCw className="w-4 h-4" /> Coba Lagi
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 md:p-8 space-y-6 min-h-screen bg-linear-to-b from-slate-50 to-white">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 tracking-tight">Pengajuan Kredit</h1>
          <p className="text-slate-500 mt-1 text-sm">Kelola seluruh pengajuan kredit motor dengan 6 status lengkap.</p>
        </div>
        <button 
          onClick={handleRefresh}
          className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-300 text-slate-700 font-medium rounded-xl hover:bg-slate-50 transition-all shadow-sm"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {/* Stats Cards - ALL 6 STATUS */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-7 gap-3">
        {[
          { label: "Total", value: stats.total, icon: CreditCard, color: "bg-[#eff6ff] text-[#1e40af]", border: "border-[#bfdbfe]" },
          { label: "Menunggu", value: stats.pending, icon: Clock, color: "bg-[#fef3c7] text-[#92400e]", border: "border-[#fcd34d]" },
          { label: "Diproses", value: stats.processing, icon: Package, color: "bg-[#dbeafe] text-[#1e40af]", border: "border-[#93c5fd]" },
          { label: "Dibatalkan Pembeli", value: stats.cancelledBuyer, icon: UserX, color: "bg-[#ffedd5] text-[#9a3412]", border: "border-[#fdba74]" },
          { label: "Dibatalkan Penjual", value: stats.cancelledSeller, icon: Store, color: "bg-[#fee2e2] text-[#991b1b]", border: "border-[#f87171]" },
          { label: "Bermasalah", value: stats.issue, icon: AlertTriangle, color: "bg-[#f3e8ff] text-[#6b21a8]", border: "border-[#d8b4fe]" },
          { label: "Diterima", value: stats.approved, icon: CheckCircle, color: "bg-[#dcfce7] text-[#166534]", border: "border-[#86efac]" },
        ].map((stat, i) => (
          <div key={i} className={`p-3 rounded-xl border ${stat.border} bg-white shadow-sm hover:shadow-md transition-shadow`}>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-[11px] font-medium text-slate-500 leading-tight">{stat.label}</p>
                <p className="text-lg font-bold text-slate-800 mt-0.5">{stat.value}</p>
              </div>
              <div className={`p-1.5 rounded-lg ${stat.color}`}>
                <stat.icon className="w-4 h-4" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Table Component */}
      <PengajuanTable
        data={data}
        total={total}
        page={page}
        totalPages={Math.ceil(total / 10) || 1}
        onPageChange={setPage}
        onSearch={setSearch}
        onFilter={setStatus}
        onRefresh={handleRefresh}
      />
    </div>
  );
}