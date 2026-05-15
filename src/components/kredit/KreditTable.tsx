// src/components/kredit/KreditTable.tsx
"use client";

import { useState, useMemo, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Kredit, StatusKredit } from "@/types/kredit.types";
import KreditStatusBadge from "./KreditStatusBadge";
import { 
  Search, Download, MoreVertical, Eye, Edit, Trash2, 
  ChevronLeft, ChevronRight, X, CreditCard, Copy, Check, 
  AlertCircle, Loader2, ChevronDown, CheckCircle2
} from "lucide-react";

type Props = {
  data: Kredit[];
  isLoading?: boolean;
};

const ITEMS_PER_PAGE = 10;
const PLACEHOLDER_IMG = "https://via.placeholder.com/60?text=Motor";

const STATUS_OPTIONS: { value: StatusKredit | "all"; label: string; icon: string; color: string }[] = [
  { value: "all", label: "Semua Status", icon: "", color: "text-slate-600" },
  { value: "Dicicil", label: "Dicicil", icon: "🔄", color: "text-blue-600" },
  { value: "Lunas", label: "Lunas", icon: "✅", color: "text-emerald-600" },
  { value: "Macet", label: "Macet", icon: "⚠️", color: "text-red-600" },
];

export default function KreditTable({ data, isLoading = false }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusKredit | "all">("all");
  const [statusDropdownOpen, setStatusDropdownOpen] = useState(false);
  const [page, setPage] = useState(1);
  const [actionDropdown, setActionDropdown] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [deleting, setDeleting] = useState<number | null>(null);
  
  const statusDropdownRef = useRef<HTMLDivElement>(null);
  const toastTimer = useRef<NodeJS.Timeout | null>(null);

  const showToast = useCallback((type: "success" | "error", message: string) => {
    setToast({ type, message });
    if (toastTimer.current) clearTimeout(toastTimer.current);
    toastTimer.current = setTimeout(() => setToast(null), 3000);
  }, []);

  useEffect(() => {
    return () => { if (toastTimer.current) clearTimeout(toastTimer.current); };
  }, []);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (statusDropdownRef.current && !statusDropdownRef.current.contains(e.target as Node)) {
        setStatusDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setStatusDropdownOpen(false);
        setActionDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const filtered = useMemo(() => {
    return data.filter((item) => {
      const p = item.pengajuan_kredit;
      const nama = p.pelanggan?.nama_pelanggan?.toLowerCase() ?? "";
      const email = p.pelanggan?.email?.toLowerCase() ?? "";
      const motor = p.motor?.nama_motor?.toLowerCase() ?? "";
      const q = search.toLowerCase();
      return (search === "" || nama.includes(q) || email.includes(q) || motor.includes(q)) &&
             (status === "all" || item.status_kredit === status);
    });
  }, [data, search, status]);

  const total = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const items = filtered.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);

  const fmt = (n: number | null | undefined) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n ?? 0);

  const exportCsv = () => {
    const rows = [
      ["No", "ID", "Pelanggan", "Email", "Motor", "Kredit", "Cicilan", "Sisa", "Status", "Mulai"],
      ...filtered.map((it, i) => [
        i + 1, it.id,
        it.pengajuan_kredit?.pelanggan?.nama_pelanggan ?? "",
        it.pengajuan_kredit?.pelanggan?.email ?? "",
        it.pengajuan_kredit?.motor?.nama_motor ?? "",
        it.pengajuan_kredit?.harga_kredit ?? 0,
        it.pengajuan_kredit?.cicilan_perbulan ?? 0,
        it.sisa_kredit ?? 0,
        it.status_kredit,
        it.tgl_mulai_kredit ?? "",
      ]),
    ];
    const csv = rows.map((r) => r.map(v => `"${String(v).replace(/"/g, '""')}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `kredit-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    showToast("success", "✅ Data berhasil diexport!");
  };

  const reset = () => { setSearch(""); setStatus("all"); setPage(1); };

  const handleViewDetail = (id: number) => {
    router.push(`/admin/kredit/${id}`);
    setActionDropdown(null);
  };

  const handleEdit = (id: number) => {
    router.push(`/admin/kredit/${id}/edit`);
    setActionDropdown(null);
  };

  const handlePayment = (id: number) => {
    router.push(`/admin/kredit/${id}/bayar`);
    setActionDropdown(null);
  };

  const handleCopyId = async (id: number) => {
    await navigator.clipboard.writeText(String(id));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
    showToast("success", "📋 ID berhasil disalin!");
    setActionDropdown(null);
  };

  const handleDelete = async (id: number) => {
    if (!confirm("⚠️ Yakin ingin menghapus data kredit ini?\nTindakan ini tidak dapat dibatalkan.")) return;
    
    setDeleting(id);
    try {
      const res = await fetch(`/api/kredit/${id}`, { method: "DELETE", cache: "no-store" });
      if (res.ok) {
        router.refresh();
        showToast("success", "🗑️ Data berhasil dihapus");
      } else {
        const err: { error?: string } = await res.json().catch(() => ({}));
        showToast("error", `❌ Gagal: ${err.error || "Terjadi kesalahan"}`);
      }
    } catch {
      showToast("error", "❌ Terjadi kesalahan koneksi");
    } finally {
      setDeleting(null);
      setActionDropdown(null);
    }
  };

  const currentStatusOption = STATUS_OPTIONS.find(opt => opt.value === status) || STATUS_OPTIONS[0];

  if (isLoading) {
    return <div className="p-12 text-center text-slate-500 flex flex-col items-center gap-4">
      <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin" />
      <span>Memuat data...</span>
    </div>;
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm">
      {/* Toast Notification */}
      {toast && (
        <div className={`fixed top-4 right-4 z-9999 flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg border backdrop-blur-md text-sm font-medium transition-all animate-in fade-in slide-in-from-top-2 ${toast.type === "success" ? "bg-emerald-50/90 border-emerald-200 text-emerald-800" : "bg-red-50/90 border-red-200 text-red-800"}`}>
          {toast.type === "success" ? <Check className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
          {toast.message}
        </div>
      )}

      {/* Header */}
      <div className="p-6 border-b border-slate-100">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Data Kredit</h2>
            <p className="text-sm text-slate-500 mt-1">
              {filtered.length} dari {data.length} data • 
              <span className="ml-2 text-emerald-600 font-medium">
                {data.filter(d => d.status_kredit === 'Lunas').length} Lunas
              </span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <input value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }} placeholder="Cari nama, email, motor..." className="pl-10 pr-4 py-2.5 w-64 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-sm" />
            </div>

            <div className="relative" ref={statusDropdownRef}>
              <button 
                onClick={() => setStatusDropdownOpen(!statusDropdownOpen)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 bg-white hover:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm transition min-w-35"
              >
                <span className={currentStatusOption.color}>{currentStatusOption.icon}</span>
                <span className="text-slate-700 font-medium">{currentStatusOption.label}</span>
                <ChevronDown className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${statusDropdownOpen ? "rotate-180" : ""}`} />
              </button>

              {statusDropdownOpen && (
                <div className="absolute right-0 top-full mt-2 w-full bg-white rounded-xl shadow-xl border border-slate-100 py-1.5 z-50 min-w-40">
                  {STATUS_OPTIONS.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => { setStatus(opt.value); setStatusDropdownOpen(false); setPage(1); }}
                      className={`w-full flex items-center gap-2 px-4 py-2.5 text-sm transition text-left ${status === opt.value ? "bg-blue-50 text-blue-700 font-medium" : "text-slate-700 hover:bg-slate-50"}`}
                    >
                      <span className={opt.color}>{opt.icon}</span>
                      <span>{opt.label}</span>
                      {status === opt.value && <CheckCircle2 className="w-4 h-4 ml-auto text-blue-600" />}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <button onClick={exportCsv} className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-sm transition">
              <Download className="w-4 h-4" /> Export
            </button>

            {(search || status !== "all") && (
              <button onClick={reset} className="p-2.5 rounded-xl text-slate-500 hover:text-red-600 hover:bg-red-50 transition" title="Reset">
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto" style={{ overflow: 'visible' }}>
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Pelanggan</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Motor</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Kredit</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Cicilan</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Sisa</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Status</th>
              <th className="text-left px-6 py-4 text-xs font-semibold text-slate-500 uppercase">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {items.length === 0 ? (
              <tr><td colSpan={7} className="px-6 py-16 text-center">
                <div className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full bg-slate-100 flex items-center justify-center mb-4"><Search className="w-8 h-8 text-slate-400" /></div>
                  <p className="text-slate-700 font-medium">Tidak ada data ditemukan</p>
                  <p className="text-slate-500 text-sm mt-1">Coba ubah filter atau kata kunci pencarian</p>
                  <button onClick={reset} className="mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm transition">Reset Filter</button>
                </div>
              </td></tr>
            ) : (
              items.map((item) => {
                const p = item.pengajuan_kredit;
                const pelanggan = p?.pelanggan;
                const motor = p?.motor;
                const tenor = p?.jenis_cicilan?.lama_cicilan;
                const isOpen = actionDropdown === item.id;

                return (
                  <tr key={item.id} className="hover:bg-slate-50/80 transition group relative">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        {pelanggan?.foto ? (
                          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-slate-100">
                            <Image src={pelanggan.foto} alt={pelanggan.nama_pelanggan} fill className="object-cover" sizes="40px" />
                          </div>
                        ) : (
                          <div className="w-10 h-10 rounded-full bg-linear-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white font-semibold text-sm">
                            {pelanggan?.nama_pelanggan?.charAt(0) ?? "U"}
                          </div>
                        )}
                        <div>
                          <p className="font-semibold text-slate-800">{pelanggan?.nama_pelanggan ?? "-"}</p>
                          <p className="text-sm text-slate-500">{pelanggan?.email ?? "-"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative w-12 h-12 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                          <Image src={motor?.foto1?.trim() ? motor.foto1 : PLACEHOLDER_IMG} alt={motor?.nama_motor ?? "Motor"} fill className="object-cover" sizes="48px" />
                        </div>
                        <div>
                          <p className="font-medium text-slate-800">{motor?.nama_motor ?? "-"}</p>
                          <p className="text-xs text-slate-500">{motor?.jenis_motor?.merk ?? "-"} • {motor?.warna ?? "-"}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-slate-800">{fmt(p?.harga_kredit)}</p>
                      <p className="text-xs text-slate-500">{tenor ? `${tenor} bulan` : "-"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-medium text-slate-700">{fmt(p?.cicilan_perbulan)}</p>
                      <p className="text-xs text-slate-500">{item.metode_bayar?.metode_pembayaran ?? "-"}</p>
                    </td>
                    <td className="px-6 py-4">
                      <p className={`font-bold ${item.sisa_kredit > 0 ? 'text-red-600' : 'text-emerald-600'}`}>{fmt(item.sisa_kredit)}</p>
                    </td>
                    <td className="px-6 py-4"><KreditStatusBadge status={item.status_kredit} /></td>
                    <td className="px-6 py-4 relative">
                      <div className="relative inline-block text-left">
                        <button 
                          onClick={() => setActionDropdown(isOpen ? null : item.id)}
                          className={`p-2 rounded-xl transition focus:outline-none focus:ring-2 focus:ring-blue-500/20 ${isOpen ? 'bg-blue-50 text-blue-600' : 'hover:bg-slate-100 text-slate-500 hover:text-slate-700'}`}
                          aria-label="Menu aksi"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </button>

                        {isOpen && (
                          <>
                            <div className="fixed inset-0 z-40" onClick={() => setActionDropdown(null)} />
                            <div className="absolute right-0 top-full mt-2 w-64 rounded-2xl border border-slate-200/60 bg-white shadow-2xl ring-1 ring-black/5 overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                              <div className="px-4 py-3 bg-slate-50/80 border-b border-slate-100">
                                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi Cepat</p>
                                <p className="text-sm font-medium text-slate-800 truncate mt-0.5">ID #{item.id} • {pelanggan?.nama_pelanggan ?? "-"}</p>
                              </div>
                              <div className="py-1.5">
                                <button onClick={() => handleViewDetail(item.id)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition">
                                  <Eye className="w-4 h-4" /> Lihat Detail
                                </button>
                                {item.status_kredit !== 'Lunas' && (
                                  <button onClick={() => handlePayment(item.id)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-emerald-700 hover:bg-emerald-50 transition">
                                    <CreditCard className="w-4 h-4" /> Bayar Cicilan
                                  </button>
                                )}
                                <button onClick={() => handleEdit(item.id)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition">
                                  <Edit className="w-4 h-4" /> Edit Data
                                </button>
                                <button onClick={() => handleCopyId(item.id)} className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-slate-700 hover:bg-slate-50 transition">
                                  {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                  {copiedId === item.id ? "Tersalin!" : "Salin ID Kredit"}
                                </button>
                              </div>
                              <hr className="border-slate-100" />
                              <button
                                onClick={() => handleDelete(item.id)}
                                disabled={deleting === item.id}
                                className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
                              >
                                {deleting === item.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <Trash2 className="w-4 h-4" />}
                                {deleting === item.id ? "Menghapus..." : "Hapus Permanen"}
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {total > 1 && (
        <div className="px-6 py-4 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
          <span className="text-sm text-slate-500">Halaman {page} dari {total}</span>
          <div className="flex gap-2">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={page === 1} className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1">
              <ChevronLeft className="w-4 h-4" /> Sebelumnya
            </button>
            <button onClick={() => setPage((p) => Math.min(total, p + 1))} disabled={page === total} className="px-3 py-2 rounded-lg border border-slate-200 text-sm text-slate-600 hover:bg-white disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center gap-1">
              Selanjutnya <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}