// src/components/angsuran/AngsuranTable.tsx
"use client";

import { useState, useMemo } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { ChevronDown, ChevronUp, Search, Edit2, Trash2, Eye } from "lucide-react";
import { AngsuranItem } from "@/services/angsuran.service";

type Props = {
  data: AngsuranItem[];
  loading?: boolean;
  onRefresh?: () => void;
  onView?: (item: AngsuranItem) => void;
  onEdit?: (item: AngsuranItem) => void;
  onDelete?: (id: number) => void;
};

type SortKey = "id" | "angsuran_ke" | "total_bayar" | "tgl_bayar" | "keterangan" | "created_at" | "nama_pelanggan" | "nama_motor" | "status_kredit";
type SortDirection = "asc" | "desc";

export default function AngsuranTable({ data, loading = false, onView, onEdit, onDelete }: Props) {
  const [sortKey, setSortKey] = useState<SortKey>("created_at");
  const [sortDirection, setSortDirection] = useState<SortDirection>("desc");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedRow, setSelectedRow] = useState<number | null>(null);
  const itemsPerPage = 10;

  const filteredData = useMemo(() => {
    return data.filter((item) => {
      const s = searchTerm.toLowerCase();
      const np = item.kredit?.pengajuan_kredit?.pelanggan?.nama_pelanggan?.toLowerCase() || "";
      const nm = item.kredit?.pengajuan_kredit?.motor?.nama_motor?.toLowerCase() || "";
      const kt = item.keterangan?.toLowerCase() || "";
      return np.includes(s) || nm.includes(s) || kt.includes(s) || item.angsuran_ke.toString().includes(searchTerm);
    });
  }, [data, searchTerm]);

  const sortedData = useMemo(() => {
    return [...filteredData].sort((a, b) => {
      let av: string | number = "";
      let bv: string | number = "";
      
      switch (sortKey) {
        case "nama_pelanggan":
          av = a.kredit?.pengajuan_kredit?.pelanggan?.nama_pelanggan || "";
          bv = b.kredit?.pengajuan_kredit?.pelanggan?.nama_pelanggan || "";
          break;
        case "nama_motor":
          av = a.kredit?.pengajuan_kredit?.motor?.nama_motor || "";
          bv = b.kredit?.pengajuan_kredit?.motor?.nama_motor || "";
          break;
        case "status_kredit":
          av = a.kredit?.status_kredit || "";
          bv = b.kredit?.status_kredit || "";
          break;
        case "angsuran_ke":
        case "total_bayar":
        case "id":
          av = Number(a[sortKey as keyof AngsuranItem]) || 0;
          bv = Number(b[sortKey as keyof AngsuranItem]) || 0;
          break;
        default:
          av = String(a[sortKey as keyof AngsuranItem] || "");
          bv = String(b[sortKey as keyof AngsuranItem] || "");
      }
      if (av < bv) return sortDirection === "asc" ? -1 : 1;
      if (av > bv) return sortDirection === "asc" ? 1 : -1;
      return 0;
    });
  }, [filteredData, sortKey, sortDirection]);

  const paginatedData = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return sortedData.slice(start, start + itemsPerPage);
  }, [sortedData, currentPage]);

  const totalPages = Math.ceil(sortedData.length / itemsPerPage);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) setSortDirection(d => d === "asc" ? "desc" : "asc");
    else { setSortKey(key); setSortDirection("asc"); }
  };

  const SortIcon = ({ column }: { column: SortKey }) => {
    if (sortKey !== column) return <ChevronDown size={14} className="opacity-30" />;
    return sortDirection === "asc" ? <ChevronUp size={14} className="text-blue-600" /> : <ChevronDown size={14} className="text-blue-600" />;
  };

  const getStatusBadge = (status?: string): string => {
    const styles: Record<string, string> = {
      "Lunas": "bg-emerald-100 text-emerald-700 border-emerald-200",
      "Dicicil": "bg-amber-100 text-amber-700 border-amber-200",
      "Macet": "bg-slate-100 text-slate-700 border-slate-200",
    };
    return styles[status || ""] || styles["Macet"];
  };

  if (loading) {
    return <div className="p-8"><div className="animate-pulse space-y-4">{[...Array(5)].map((_, i) => <div key={i} className="h-16 bg-slate-100 rounded-xl" />)}</div></div>;
  }

  return (
    <div className="overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 border-b border-slate-100">
        <div className="relative max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input type="text" placeholder="Cari di tabel..." value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="w-full pl-9 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20" />
        </div>
        <p className="text-sm text-slate-500">Menampilkan {paginatedData.length} dari {sortedData.length} data</p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-slate-50">
            <tr>
              {[
                { key: "angsuran_ke" as SortKey, label: "Angsuran Ke" },
                { key: "nama_pelanggan" as SortKey, label: "Pelanggan" },
                { key: "nama_motor" as SortKey, label: "Motor" },
                { key: "total_bayar" as SortKey, label: "Jumlah" },
                { key: "tgl_bayar" as SortKey, label: "Tanggal" },
                { key: "status_kredit" as SortKey, label: "Status" },
                { key: "keterangan" as SortKey, label: "Keterangan" },
              ].map((col) => (
                <th key={col.key} onClick={() => handleSort(col.key)}
                  className="px-5 py-4 text-left text-xs font-semibold text-slate-600 uppercase tracking-wider cursor-pointer hover:bg-slate-100 transition-colors select-none">
                  <div className="flex items-center gap-1.5">{col.label}<SortIcon column={col.key} /></div>
                </th>
              ))}
              <th className="px-5 py-4 text-end text-xs font-semibold text-slate-600 uppercase">Aksi</th>
            </tr>
          </thead>
          
          <tbody className="divide-y divide-slate-100">
            {paginatedData.length === 0 ? (
              <tr><td colSpan={8} className="px-5 py-12 text-center text-slate-500">
                <div className="flex flex-col items-center gap-2">
                  <Search className="opacity-30" size={32} /><p>Tidak ada data yang ditemukan</p>
                  {searchTerm && <button onClick={() => setSearchTerm("")} className="text-blue-600 text-sm hover:underline">Hapus filter pencarian</button>}
                </div>
              </td></tr>
            ) : paginatedData.map((item) => (
              <tr key={item.id} onClick={() => setSelectedRow(selectedRow === item.id ? null : item.id)}
                className={`hover:bg-blue-50/50 transition-colors cursor-pointer ${selectedRow === item.id ? "bg-blue-50" : ""}`}>
                <td className="px-5 py-4"><span className="font-semibold text-slate-800">#{item.angsuran_ke}</span></td>
                <td className="px-5 py-4"><p className="font-medium text-slate-700">{item.kredit?.pengajuan_kredit?.pelanggan?.nama_pelanggan || "-"}</p></td>
                <td className="px-5 py-4"><p className="text-slate-600">{item.kredit?.pengajuan_kredit?.motor?.nama_motor || "-"}</p></td>
                <td className="px-5 py-4"><span className="font-bold text-emerald-600">Rp {item.total_bayar?.toLocaleString("id-ID")}</span></td>
                <td className="px-5 py-4"><span className="text-slate-600 text-sm">{item.tgl_bayar ? format(new Date(item.tgl_bayar), "dd MMM yyyy", { locale: id }) : "-"}</span></td>
                <td className="px-5 py-4"><span className={`inline-flex px-2.5 py-1 rounded-full text-xs font-medium border ${getStatusBadge(item.kredit?.status_kredit)}`}>{item.kredit?.status_kredit || "Macet"}</span></td>
                <td className="px-5 py-4"><p className="text-slate-500 text-sm truncate max-w-xs" title={item.keterangan}>{item.keterangan || "-"}</p></td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-1">
                    <button onClick={(e) => { e.stopPropagation(); onView?.(item); }} className="p-2 text-slate-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" title="Lihat Detail"><Eye size={16} /></button>
                    <button onClick={(e) => { e.stopPropagation(); onEdit?.(item); }} className="p-2 text-slate-400 hover:text-amber-600 hover:bg-amber-50 rounded-lg transition-all" title="Edit"><Edit2 size={16} /></button>
                    <button onClick={(e) => { e.stopPropagation(); onDelete?.(item.id); }} className="p-2 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-all" title="Hapus"><Trash2 size={16} /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-slate-100">
          <p className="text-sm text-slate-500">Halaman {currentPage} dari {totalPages}</p>
          <div className="flex items-center gap-2">
            <button onClick={() => setCurrentPage(p => Math.max(1, p - 1))} disabled={currentPage === 1}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50">Sebelumnya</button>
            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let pn: number;
                if (totalPages <= 5) pn = i + 1;
                else if (currentPage <= 3) pn = i + 1;
                else if (currentPage >= totalPages - 2) pn = totalPages - 4 + i;
                else pn = currentPage - 2 + i;
                return (
                  <button key={pn} onClick={() => setCurrentPage(pn)}
                    className={`w-9 h-9 rounded-lg text-sm font-medium transition-all ${currentPage === pn ? "bg-blue-600 text-white shadow-md" : "text-slate-600 hover:bg-slate-100"}`}>{pn}</button>
                );
              })}
            </div>
            <button onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))} disabled={currentPage === totalPages}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 disabled:opacity-50">Selanjutnya</button>
          </div>
        </div>
      )}
    </div>
  );
}