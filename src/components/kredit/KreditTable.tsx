// src/components/kredit/KreditTable.tsx
"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Kredit, StatusKredit } from "@/types/kredit.types";
import KreditStatusBadge from "./KreditStatusBadge";
import { Search, Download, MoreVertical, Eye, Edit, Trash2, ChevronLeft, ChevronRight, X, CreditCard, Copy, Check } from "lucide-react";

type Props = {
  data: Kredit[];
  isLoading?: boolean;
};

const ITEMS_PER_PAGE = 10;
const PLACEHOLDER_IMG = "https://via.placeholder.com/60?text=Motor";

export default function KreditTable({ data, isLoading = false }: Props) {
  const router = useRouter();
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState<StatusKredit | "all">("all");
  const [page, setPage] = useState(1);
  const [dropdown, setDropdown] = useState<number | null>(null);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdown(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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
  };

  const reset = () => { setSearch(""); setStatus("all"); setPage(1); };

  const handleViewDetail = (id: number) => router.push(`/kredit/${id}`);
  const handleEdit = (id: number) => router.push(`/kredit/${id}/edit`);
  const handleBayarCicilan = (id: number) => router.push(`/kredit/${id}/bayar`);

  const handleDelete = async (id: number) => {
    if (!confirm("⚠️ Yakin ingin menghapus data kredit ini?")) return;
    try {
      const res = await fetch(`/api/kredit/${id}`, { method: "DELETE", cache: "no-store" });
      if (res.ok) router.refresh();
      else alert("❌ Gagal menghapus data");
    } catch {
      alert("❌ Terjadi kesalahan koneksi");
    }
  };

  const handleCopyId = async (id: number) => {
    await navigator.clipboard.writeText(String(id));
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (isLoading) {
    return <div className="p-12 text-center text-slate-500">Memuat data...</div>;
  }

  return (
    <div className="bg-white rounded-3xl border border-slate-100 shadow-sm overflow-hidden">
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
            <select value={status} onChange={(e) => { setStatus(e.target.value as StatusKredit | "all"); setPage(1); }} className="px-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 text-sm bg-white">
              <option value="all">Semua Status</option>
              <option value="Dicicil">🔄 Dicicil</option>
              <option value="Lunas">✅ Lunas</option>
              <option value="Macet">⚠️ Macet</option>
            </select>
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
      <div className="overflow-x-auto">
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

                return (
                  <tr key={item.id} className="hover:bg-slate-50 transition">
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
                    <td className="px-6 py-4">
                      <div className="relative inline-block text-left" ref={dropdownRef}>
                        <button onClick={() => setDropdown((d) => (d === item.id ? null : item.id))} className="p-2 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-700 transition focus:outline-none focus:ring-2 focus:ring-blue-500/20" aria-label="Menu aksi">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                        {dropdown === item.id && (
                          <>
                            <div className="fixed inset-0 z-30" onClick={() => setDropdown(null)} />
                            <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-40">
                              <div className="px-4 py-2 border-b border-slate-100">
                                <p className="text-xs font-semibold text-slate-500 uppercase">Aksi</p>
                                <p className="text-sm font-medium text-slate-800 truncate">#{item.id}</p>
                              </div>
                              <button onClick={() => { handleViewDetail(item.id); setDropdown(null); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition text-left">
                                <Eye className="w-4 h-4" /> Detail
                              </button>
                              {item.status_kredit !== 'Lunas' && (
                                <button onClick={() => { handleBayarCicilan(item.id); setDropdown(null); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-emerald-700 hover:bg-emerald-50 transition text-left">
                                  <CreditCard className="w-4 h-4" /> Bayar Cicilan
                                </button>
                              )}
                              <button onClick={() => { handleEdit(item.id); setDropdown(null); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition text-left">
                                <Edit className="w-4 h-4" /> Edit
                              </button>
                              <button onClick={() => handleCopyId(item.id)} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-slate-700 hover:bg-slate-50 transition text-left">
                                {copiedId === item.id ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                                {copiedId === item.id ? "Tersalin!" : "Salin ID"}
                              </button>
                              <hr className="my-2 border-slate-100" />
                              <button onClick={() => { handleDelete(item.id); setDropdown(null); }} className="w-full flex items-center gap-3 px-4 py-3 text-sm text-red-600 hover:bg-red-50 transition text-left">
                                <Trash2 className="w-4 h-4" /> Hapus Permanen
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