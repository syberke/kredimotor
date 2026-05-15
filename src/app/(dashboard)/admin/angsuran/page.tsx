// src/app/(dashboard)/admin/angsuran/page.tsx
"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { Wallet, CreditCard, TrendingUp, AlertCircle, Plus, Search, Download, RefreshCw, Calendar} from "lucide-react";
import { format, startOfMonth, endOfMonth } from "date-fns";
import { toast } from "sonner";
  
import AngsuranTable from "@/components/angsuran/AngsuranTable";
import AngsuranModal from "@/components/angsuran/AngsuranModal";
import AngsuranDetailModal from "@/components/angsuran/AngsuranDetailModal";
import PaymentChart from "@/components/angsuran/PaymentChart";
import {
  getAngsuranData, AngsuranItem, getKreditOptions,
  createAngsuran, updateAngsuran, deleteAngsuran,
  CreateAngsuranPayload, KreditOption, ChartPeriod,
} from "@/services/angsuran.service";

type StatCard = { title: string; value: string | number; icon: React.ComponentType<{ size?: number }>; color: string; filterValue?: string };

export default function AngsuranPage() {
  const [data, setData] = useState<AngsuranItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [detailModalOpen, setDetailModalOpen] = useState(false);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [dateRange, setDateRange] = useState({ start: format(startOfMonth(new Date()), "yyyy-MM-dd"), end: format(endOfMonth(new Date()), "yyyy-MM-dd") });
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [chartPeriod, setChartPeriod] = useState<ChartPeriod>("month");
  const [kreditOptions, setKreditOptions] = useState<KreditOption[]>([]);
  const [selectedAngsuran, setSelectedAngsuran] = useState<AngsuranItem | null>(null);
  const [deleteTargetId, setDeleteTargetId] = useState<number | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [angsuranData, kreditData] = await Promise.all([
        getAngsuranData({ startDate: dateRange.start, endDate: dateRange.end, status: statusFilter === "all" ? undefined : statusFilter, search: searchQuery || undefined }),
        getKreditOptions(),
      ]);
      setData(angsuranData);
      setKreditOptions(kreditData);
      if (angsuranData.length > 0 || kreditData.length > 0) toast.success("Data berhasil dimuat");
    } catch (error) {
      const msg = error instanceof Error ? error.message : "Gagal memuat data";
      toast.error(msg);
      console.error("Fetch error:", error);
    } finally {
      setLoading(false);
    }
  }, [dateRange.start, dateRange.end, statusFilter, searchQuery]);

useEffect(() => {
  void (async () => {
    await fetchData();
  })();
}, [fetchData]);

  const stats = useMemo((): StatCard[] => {
    const totalPembayaran = data.reduce((acc, item) => acc + (item.total_bayar || 0), 0);
    const kreditLunas = data.filter(item => item.kredit?.status_kredit === "Lunas").length;
    const kreditAktif = data.filter(item => item.kredit?.status_kredit === "Dicicil").length;
    return [
      { title: "Total Pembayaran", value: `Rp ${totalPembayaran.toLocaleString("id-ID")}`, icon: Wallet, color: "bg-emerald-100 text-emerald-600" },
      { title: "Total Transaksi", value: data.length, icon: CreditCard, color: "bg-blue-100 text-blue-600" },
      { title: "Kredit Aktif", value: kreditAktif, icon: TrendingUp, color: "bg-amber-100 text-amber-600", filterValue: "Dicicil" },
      { title: "Kredit Lunas", value: kreditLunas, icon: AlertCircle, color: "bg-purple-100 text-purple-600", filterValue: "Lunas" },
    ];
  }, [data]);

  const handleCreate = async (payload: CreateAngsuranPayload): Promise<boolean> => {
    try {
      const result = await createAngsuran(payload);
      if (result.error) { toast.error(result.error.message || "Gagal menyimpan"); return false; }
      toast.success("Angsuran berhasil ditambahkan!");
      await fetchData();
      return true;
    } catch (err) { toast.error(err instanceof Error ? err.message : "Terjadi kesalahan"); return false; }
  };

  const handleUpdate = async (payload: CreateAngsuranPayload): Promise<boolean> => {
    if (!selectedAngsuran) return false;
    try {
      const result = await updateAngsuran(selectedAngsuran.id, payload);
      if (result.error) { toast.error(result.error.message || "Gagal update"); return false; }
      toast.success("Angsuran berhasil diperbarui");
      await fetchData();
      return true;
    } catch (err) { toast.error(err instanceof Error ? err.message : "Terjadi kesalahan"); return false; }
  };

  const handleDelete = async () => {
    if (!deleteTargetId) return;
    try {
      const result = await deleteAngsuran(deleteTargetId);
      if (result.error) { toast.error(result.error.message || "Gagal menghapus"); return; }
      toast.success("Angsuran berhasil dihapus");
      await fetchData();
    } catch (err) { toast.error(err instanceof Error ? err.message : "Terjadi kesalahan"); }
    finally { setDeleteConfirmOpen(false); setDeleteTargetId(null); }
  };

  const handleView = (item: AngsuranItem) => { setSelectedAngsuran(item); setDetailModalOpen(true); };
  const handleEdit = (item: AngsuranItem) => { setSelectedAngsuran(item); setEditModalOpen(true); };
  const handleDeleteClick = (id: number) => { setDeleteTargetId(id); setDeleteConfirmOpen(true); };
  const handleExport = (fmt: "csv" | "pdf") => toast.info(`Exporting as ${fmt.toUpperCase()}...`);
  const handleStatClick = (filterValue?: string) => { if (filterValue) { setStatusFilter(filterValue); toast.info(`Filter: ${filterValue}`); }};

  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100">
      <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-lg border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-black text-slate-800 flex items-center gap-3">
                <span className="p-2 bg-blue-600 rounded-xl"><CreditCard className="text-white" size={24} /></span>
                Data Angsuran
              </h1>
              <p className="text-slate-500 mt-1 text-sm">Monitoring pembayaran kredit pelanggan</p>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={() => fetchData()} disabled={loading} className="flex items-center gap-2 px-4 py-2.5 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-all disabled:opacity-50">
                <RefreshCw size={18} className={loading ? "animate-spin" : ""} /><span className="hidden sm:inline">Refresh</span>
              </button>
              <button onClick={() => { setSelectedAngsuran(null); setModalOpen(true); }} className="flex items-center gap-2 px-5 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl font-semibold shadow-lg">
                <Plus size={18} /> Input Angsuran
              </button>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Filters */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm">
          <div className="flex flex-col lg:flex-row lg:items-center gap-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input type="text" placeholder="Cari keterangan..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
            </div>
            <div className="flex items-center gap-2">
              <Calendar className="text-slate-400" size={18} />
              <input type="date" value={dateRange.start} onChange={(e) => setDateRange(p => ({...p, start: e.target.value}))} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
              <span className="text-slate-400">-</span>
              <input type="date" value={dateRange.end} onChange={(e) => setDateRange(p => ({...p, end: e.target.value}))} className="px-3 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm" />
            </div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm">
              <option value="all">Semua Status</option><option value="Dicicil">Dicicil</option><option value="Lunas">Lunas</option><option value=" Macet">Macet</option>
            </select>
            <div className="flex items-center gap-2 ms-auto">
              <span className="text-sm text-slate-500 hidden sm:inline">Export:</span>
              <button onClick={() => handleExport("csv")} className="p-2.5 hover:bg-blue-50 rounded-lg"><Download size={18} /></button>
            </div>
          </div>
        </div>

      {/* Stats */}
<div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4">
  {stats.map((stat, i) => {
    const Icon = stat.icon;

    return (
      <button
        key={i}
        onClick={() => handleStatClick(stat.filterValue)}
        className="group bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:shadow-md transition-all text-left"
      >
        <div className="flex items-start justify-between">
          <div>
            <p className="text-slate-500 text-sm">{stat.title}</p>

            <h3 className="text-2xl font-black text-slate-800 mt-1">
              {stat.value}
            </h3>
          </div>

          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center ${stat.color}`}
          >
            <Icon size={22} />
          </div>
        </div>
      </button>
    );
  })}
</div>
        {/* Chart + Recent */}
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          <div className="xl:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div><h2 className="text-lg font-bold">Grafik Pembayaran</h2><p className="text-sm text-slate-500">Trend pembayaran</p></div>
              <div className="flex gap-1 bg-slate-100 rounded-xl p-1">
                {(["week","month","year"] as ChartPeriod[]).map(p => (
                  <button key={p} onClick={() => setChartPeriod(p)} className={`px-3 py-1.5 rounded-lg text-sm ${chartPeriod===p?"bg-white text-blue-600 shadow-sm":"text-slate-600"}`}>
                    {p==="week"?"Minggu":p==="month"?"Bulan":"Tahun"}
                  </button>
                ))}
              </div>
            </div>
    <PaymentChart period={chartPeriod} />
          </div>
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm">
            <h2 className="text-lg font-bold mb-4">Pembayaran Terbaru</h2>
            <div className="space-y-3 max-h-72 overflow-y-auto">
              {loading ? Array.from({length:4}).map((_,i)=><div key={i} className="h-12 bg-slate-100 rounded animate-pulse"/>) :
               data.length===0 ? <p className="text-center text-slate-500 py-4">Belum ada data</p> :
               data.slice(0,4).map(item => (
                 <div key={item.id} className="flex justify-between items-center p-2 rounded hover:bg-slate-50 cursor-pointer" onClick={() => handleView(item)}>
                   <div className="min-w-0">
                     <p className="font-medium text-slate-700 truncate">{item.kredit?.pengajuan_kredit?.pelanggan?.nama_pelanggan||"-"}</p>
                     <p className="text-xs text-slate-500">Angsuran #{item.angsuran_ke}</p>
                   </div>
                   <div className="text-right">
                     <p className="font-bold text-emerald-600">Rp {item.total_bayar?.toLocaleString("id-ID")}</p>
                     <p className="text-xs text-slate-400">{item.tgl_bayar?.slice(0,10)||"-"}</p>
                   </div>
                 </div>
               ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <AngsuranTable data={data} loading={loading} onRefresh={fetchData} onView={handleView} onEdit={handleEdit} onDelete={handleDeleteClick} />
        </div>
      </main>

      {/* Modals */}
      <AngsuranModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setSelectedAngsuran(null); }} onSubmit={handleCreate} kreditOptions={kreditOptions} />
      <AngsuranModal isOpen={editModalOpen} onClose={() => { setEditModalOpen(false); setSelectedAngsuran(null); }} onSubmit={handleUpdate} kreditOptions={kreditOptions} initialData={selectedAngsuran || undefined} isEdit={true} />
      <AngsuranDetailModal isOpen={detailModalOpen} onClose={() => { setDetailModalOpen(false); setSelectedAngsuran(null); }} angsuran={selectedAngsuran} />
      
      {/* Delete Confirmation */}
      {deleteConfirmOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={() => setDeleteConfirmOpen(false)} />
          <div className="relative bg-white rounded-2xl shadow-xl p-6 max-w-md w-full">
            <h3 className="text-lg font-bold text-slate-800 mb-2">Konfirmasi Hapus</h3>
            <p className="text-slate-600 mb-6">Apakah Anda yakin ingin menghapus angsuran ini? Tindakan ini tidak dapat dibatalkan.</p>
            <div className="flex justify-end gap-3">
              <button onClick={() => setDeleteConfirmOpen(false)} className="px-4 py-2 text-slate-700 hover:bg-slate-100 rounded-xl">Batal</button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded-xl hover:bg-red-700">Hapus</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}