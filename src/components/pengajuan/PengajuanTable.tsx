// src/components/pengajuan/PengajuanTable.tsx
"use client";

import { useState } from "react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import Image from "next/image";
import { 
  Search, Eye, FileText, CheckCircle, XCircle, Clock, AlertCircle, 
  Loader2, X, ExternalLink, Image as ImageIcon, File as FileIcon, 
  Package, UserX, Store, AlertTriangle 
} from "lucide-react";
import { Pengajuan, updateStatusPengajuan } from "@/services/pengajuan.service";
import { getDocumentPreviewUrl, getDocumentThumbnailUrl, isPreviewableImage } from "@/lib/cloudinary";

interface PengajuanTableProps {
  data: Pengajuan[];
  total: number;
  page: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  onSearch: (search: string) => void;
  onFilter: (status: string) => void;
  onRefresh: () => void;
}

export default function PengajuanTable({
  data, total, page, totalPages, onPageChange, onSearch, onFilter, onRefresh
}: PengajuanTableProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("all");
  const [detailId, setDetailId] = useState<number | null>(null);
  const [actionLoading, setActionLoading] = useState<number | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);

  const formatRupiah = (amount: number | null) => {
    if (amount == null) return "-";
    return new Intl.NumberFormat("id-ID", { 
      style: "currency", 
      currency: "IDR", 
      minimumFractionDigits: 0 
    }).format(amount);
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleStatusFilter = (status: string) => {
    setSelectedStatus(status);
    onFilter(status);
  };

  const handleUpdateStatus = async (id: number, newStatus: string) => {
    const confirmMsg = newStatus === "Diterima" 
      ? "Yakin ingin MENERIMA/MENYETUJUI pengajuan ini?" 
      : "Yakin ingin MENOLAK/MEMBATALKAN pengajuan ini?";
    
    if (!confirm(confirmMsg)) return;

    try {
      setActionLoading(id);
      await updateStatusPengajuan(id, newStatus);
      onRefresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Terjadi kesalahan";
      alert("Gagal mengubah status: " + message);
    } finally {
      setActionLoading(null);
    }
  };

  // ✅ FULL STATUS MAPPING dengan arbitrary hex values
  const getStatusConfig = (status: string) => {
    const map: Record<string, { 
      icon: React.ElementType; 
      bg: string; text: string; label: string; dot: string; border: string;
      canApprove: boolean;
    }> = {
      "Menunggu Konfirmasi": { 
        icon: Clock, 
        bg: "bg-[#fef3c7]", 
        text: "text-[#92400e]", 
        label: "Menunggu", 
        dot: "bg-[#f59e0b]",
        border: "border-[#fcd34d]",
        canApprove: true
      },
      "Diproses": { 
        icon: Package, 
        bg: "bg-[#dbeafe]", 
        text: "text-[#1e40af]", 
        label: "Diproses", 
        dot: "bg-[#3b82f6]",
        border: "border-[#93c5fd]",
        canApprove: false
      },
      "Dibatalkan Pembeli": { 
        icon: UserX, 
        bg: "bg-[#ffedd5]", 
        text: "text-[#9a3412]", 
        label: "Dibatalkan Pembeli", 
        dot: "bg-[#f97316]",
        border: "border-[#fdba74]",
        canApprove: false
      },
      "Dibatalkan Penjual": { 
        icon: Store, 
        bg: "bg-[#fee2e2]", 
        text: "text-[#991b1b]", 
        label: "Dibatalkan Penjual", 
        dot: "bg-[#ef4444]",
        border: "border-[#f87171]",
        canApprove: false
      },
      "Bermasalah": { 
        icon: AlertTriangle, 
        bg: "bg-[#f3e8ff]", 
        text: "text-[#6b21a8]", 
        label: "Bermasalah", 
        dot: "bg-[#a855f7]",
        border: "border-[#d8b4fe]",
        canApprove: false
      },
      "Diterima": { 
        icon: CheckCircle, 
        bg: "bg-[#dcfce7]", 
        text: "text-[#166534]", 
        label: "Diterima", 
        dot: "bg-[#22c55e]",
        border: "border-[#86efac]",
        canApprove: false
      },
    };
    return map[status] || { 
      icon: AlertCircle, 
      bg: "bg-[#f1f5f9]", 
      text: "text-[#475569]", 
      label: status,
      dot: "bg-[#94a3b8]",
      border: "border-[#cbd5e1]",
      canApprove: false
    };
  };

  const selectedDetail = data.find((d) => d.id === detailId) || null;

  const documentFields = [
    { key: "url_ktp" as const, label: "KTP", icon: "🪪", type: "image" as const },
    { key: "url_kk" as const, label: "Kartu Keluarga", icon: "🏠", type: "image" as const },
    { key: "url_npwp" as const, label: "NPWP", icon: "📋", type: "file" as const },
    { key: "url_slip_gaji" as const, label: "Slip Gaji", icon: "💰", type: "file" as const },
    { key: "url_foto" as const, label: "Foto Diri", icon: "📷", type: "image" as const },
  ] as const;

  // ALL STATUS OPTIONS untuk filter
  const statusOptions = [
    { value: "all", label: "Semua" },
    { value: "Menunggu Konfirmasi", label: "Menunggu" },
    { value: "Diproses", label: "Diproses" },
    { value: "Dibatalkan Pembeli", label: "Dibatalkan Pembeli" },
    { value: "Dibatalkan Penjual", label: "Dibatalkan Penjual" },
    { value: "Bermasalah", label: "Bermasalah" },
    { value: "Diterima", label: "Diterima" },
  ];

  if (data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 bg-white rounded-2xl border border-slate-200 shadow-sm">
        <div className="bg-slate-100 p-4 rounded-full mb-4">
          <Search className="w-10 h-10 text-slate-400" />
        </div>
        <h3 className="text-lg font-semibold text-slate-800">Tidak ada data pengajuan</h3>
        <p className="text-slate-500 mt-2 text-sm text-center max-w-sm">
          Coba ubah kata kunci pencarian, filter status, atau refresh halaman.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* ========== Filter & Search Bar ========== */}
      <div className="flex flex-col md:flex-row gap-3 justify-between items-start md:items-center bg-white p-4 rounded-2xl border border-slate-200 shadow-sm">
        <form onSubmit={handleSearch} className="relative w-full md:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Cari nama, motor, atau ID..."
            className="w-full pl-10 pr-4 py-2.5 text-sm border border-slate-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-[#4f46e5] focus:border-transparent transition-all"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </form>
        <div className="flex gap-2 flex-wrap">
          {statusOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => handleStatusFilter(opt.value === "all" ? "" : opt.value)}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg transition-all ${
                selectedStatus === opt.value
                  ? "bg-[#4f46e5] text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* ========== Table ========== */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50/80 text-slate-700 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">Tanggal</th>
                <th className="px-6 py-4">Pelanggan</th>
                <th className="px-6 py-4">Motor</th>
                <th className="px-6 py-4">DP & Cicilan</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {data.map((item) => {
                const statusConfig = getStatusConfig(item.status_pengajuan);
                const StatusIcon = statusConfig.icon;
                
                return (
                  <tr key={item.id} className="hover:bg-blue-50/30 transition-colors group">
                    <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                      {format(new Date(item.tgl_pengajuan_kredit || item.created_at), "dd MMM yyyy", { locale: id })}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-900">{item.pelanggan?.nama_pelanggan || "-"}</div>
                      <div className="text-xs text-slate-500">{item.pelanggan?.email || item.pelanggan?.no_telp || "-"}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{item.motor?.nama_motor || "-"}</div>
                      <div className="text-xs text-slate-500">{item.jenis_cicilan?.lama_cicilan || 0} bulan</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-800">DP: {formatRupiah(item.dp)}</div>
                      <div className="text-xs text-slate-500">Cicilan: {formatRupiah(item.cicilan_perbulan)}/bln</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold border ${statusConfig.bg} ${statusConfig.text} ${statusConfig.border}`}>
                        <span className={`w-2 h-2 rounded-full ${statusConfig.dot} ${item.status_pengajuan === "Menunggu Konfirmasi" ? "animate-pulse" : ""}`} />
                        <StatusIcon className="w-3.5 h-3.5" /> 
                        {statusConfig.label}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button 
                          onClick={() => setDetailId(item.id)} 
                          className="p-2 text-slate-500 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all" 
                          title="Lihat Detail & Dokumen"
                        >
                          <Eye className="w-4.5 h-4.5" />
                        </button>
                        
                        {/* Action buttons HANYA untuk "Menunggu Konfirmasi" */}
                        {statusConfig.canApprove && (
                          <>
                            <button 
                              onClick={() => handleUpdateStatus(item.id, "Diterima")}
                              disabled={actionLoading === item.id}
                              className="p-2 text-slate-500 hover:text-[#166534] hover:bg-[#dcfce7] rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
                              title="Terima Pengajuan"
                            >
                              {actionLoading === item.id ? (
                                <Loader2 className="w-4.5 h-4.5 animate-spin text-[#22c55e]" />
                              ) : (
                                <CheckCircle className="w-4.5 h-4.5" />
                              )}
                            </button>
                            <button 
                              onClick={() => handleUpdateStatus(item.id, "Dibatalkan Penjual")}
                              disabled={actionLoading === item.id}
                              className="p-2 text-slate-500 hover:text-[#991b1b] hover:bg-[#fee2e2] rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed" 
                              title="Batalkan sebagai Penjual"
                            >
                              {actionLoading === item.id ? (
                                <Loader2 className="w-4.5 h-4.5 animate-spin text-[#ef4444]" />
                              ) : (
                                <XCircle className="w-4.5 h-4.5" />
                              )}
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between px-6 py-4 bg-slate-50/50 border-t border-slate-200 gap-4">
          <span className="text-sm text-slate-600">Menampilkan <strong>{data.length}</strong> dari <strong>{total}</strong> data</span>
          <div className="flex gap-2">
            <button 
              onClick={() => onPageChange(page - 1)} 
              disabled={page <= 1} 
              className="px-4 py-2 text-sm font-medium rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              ← Sebelumnya
            </button>
            <button 
              onClick={() => onPageChange(page + 1)} 
              disabled={page >= totalPages} 
              className="px-4 py-2 text-sm font-medium rounded-xl bg-white border border-slate-300 text-slate-700 hover:bg-slate-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
            >
              Selanjutnya →
            </button>
          </div>
        </div>
      </div>

      {/* ========== Detail Modal ========== */}
      {selectedDetail && (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50" 
          onClick={() => { setDetailId(null); setPreviewImage(null); }}
        >
          <div 
            className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[95vh] overflow-hidden flex flex-col" 
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex justify-between items-start bg-slate-50/50">
              <div>
                <h2 className="text-xl font-bold text-slate-800">Detail Pengajuan #{selectedDetail.id}</h2>
                <p className="text-sm text-slate-500 mt-1">
                  Diajukan pada: {format(new Date(selectedDetail.tgl_pengajuan_kredit || selectedDetail.created_at), "dd MMMM yyyy HH:mm", { locale: id })}
                </p>
              </div>
              <button 
                onClick={() => { setDetailId(null); setPreviewImage(null); }} 
                className="text-slate-400 hover:text-slate-600 p-2 rounded-lg hover:bg-slate-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-5 space-y-6 overflow-y-auto flex-1">
              
              {/* Status Banner */}
              {(() => {
                const s = getStatusConfig(selectedDetail.status_pengajuan);
                const Icon = s.icon;
                return (
                  <div className={`p-4 rounded-xl border-2 ${s.bg} ${s.border} flex items-center gap-3`}>
                    <div className={`p-2 rounded-lg ${s.bg}`}>
                      <Icon className={`w-5 h-5 ${s.text}`} />
                    </div>
                    <div>
                      <p className={`font-semibold ${s.text}`}>Status: {s.label}</p>
                      {selectedDetail.keterangan_status_pengajuan && (
                        <p className="text-sm text-slate-600 mt-0.5">{selectedDetail.keterangan_status_pengajuan}</p>
                      )}
                    </div>
                  </div>
                );
              })()}

              {/* Info Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">👤 Pelanggan</p>
                  <p className="font-semibold text-slate-800 mt-2">{selectedDetail.pelanggan?.nama_pelanggan || "-"}</p>
                  <p className="text-sm text-slate-600 mt-1">📧 {selectedDetail.pelanggan?.email || "-"}</p>
                  <p className="text-sm text-slate-600">📱 {selectedDetail.pelanggan?.no_telp || "-"}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">🏍️ Motor</p>
                  <p className="font-semibold text-slate-800 mt-2">{selectedDetail.motor?.nama_motor || "-"}</p>
                  <p className="text-sm text-slate-600 mt-1">💰 Harga Cash: {formatRupiah(selectedDetail.harga_cash)}</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">💳 Simulasi Kredit</p>
                  <p className="font-semibold text-slate-800 mt-2">DP: {formatRupiah(selectedDetail.dp)}</p>
                  <p className="text-sm text-slate-600 mt-1">Cicilan: {formatRupiah(selectedDetail.cicilan_perbulan)} × {selectedDetail.jenis_cicilan?.lama_cicilan} bln</p>
                </div>
                <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">🛡️ Asuransi</p>
                  <p className="font-semibold text-slate-800 mt-2">{selectedDetail.asuransi?.nama_asuransi || "Tidak dipilih"}</p>
                  <p className="text-sm text-slate-600">
                    Biaya: {selectedDetail.biaya_asuransi_perbulan != null && selectedDetail.biaya_asuransi_perbulan > 0 
                      ? formatRupiah(selectedDetail.biaya_asuransi_perbulan) + "/bln" 
                      : "-"}
                  </p>
                </div>
              </div>

              {/* Documents Section */}
              <div>
                <h3 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  Dokumen Pendukung (Cloudinary)
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
                  {documentFields.map((doc) => {
                    const rawUrl = selectedDetail[doc.key];
                    const previewUrl = getDocumentPreviewUrl(rawUrl);
                    const thumbnailUrl = getDocumentThumbnailUrl(rawUrl, 150, 150);
                    const hasDocument = !!previewUrl;
                    const canPreviewInline = hasDocument && doc.type === "image" && isPreviewableImage(rawUrl);

                    return (
                      <div key={doc.key} className="group">
                        <a
                          href={previewUrl || "#"}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => {
                            if (!hasDocument) {
                              e.preventDefault();
                              alert(`📄 Dokumen ${doc.label} belum diunggah.`);
                            } else if (canPreviewInline) {
                              e.preventDefault();
                              setPreviewImage(previewUrl);
                            }
                          }}
                          className={`
                            flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all duration-200 h-full
                            ${hasDocument 
                              ? "border-[#86efac] bg-[#f0fdf4]/50 hover:bg-[#dcfce7] hover:border-[#22c55e] cursor-pointer" 
                              : "border-[#cbd5e1] bg-[#f8fafc] text-slate-400 cursor-not-allowed"
                            }
                          `}
                        >
                          <span className="text-2xl mb-2">{doc.icon}</span>
                          <span className={`text-[11px] font-medium text-center leading-tight ${hasDocument ? "text-[#166534]" : "text-slate-400"}`}>
                            {doc.label}
                          </span>
                          
                          {hasDocument ? (
                            <>
                              {thumbnailUrl && doc.type === "image" ? (
                                <div className="mt-2 w-12 h-12 rounded-lg overflow-hidden border border-[#86efac] bg-white">
                                  <Image 
                                    src={thumbnailUrl} 
                                    alt={doc.label}
                                    width={48}
                                    height={48}
                                    className="w-full h-full object-cover"
                                    unoptimized={thumbnailUrl.includes("res.cloudinary.com")}
                                    onError={(e) => {
                                      (e.target as HTMLImageElement).style.display = "none";
                                      (e.target as HTMLImageElement).parentElement?.classList.add("bg-[#f1f5f9]");
                                    }}
                                  />
                                </div>
                              ) : (
                                <div className="mt-2 w-12 h-12 rounded-lg bg-[#dcfce7] flex items-center justify-center">
                                  {doc.type === "image" ? <ImageIcon className="w-6 h-6 text-[#166534]" /> : <FileIcon className="w-6 h-6 text-[#166534]" />}
                                </div>
                              )}
                              <span className="mt-1.5 inline-flex items-center gap-1 text-[10px] text-[#166534] font-medium">
                                {canPreviewInline ? <Eye className="w-3 h-3" /> : <ExternalLink className="w-3 h-3" />}
                                {canPreviewInline ? "Preview" : "Buka"}
                              </span>
                            </>
                          ) : (
                            <>
                              <div className="mt-2 w-12 h-12 rounded-lg bg-[#f1f5f9] flex items-center justify-center">
                                <FileText className="w-6 h-6 text-slate-300" />
                              </div>
                              <span className="mt-1.5 text-[10px] text-slate-400">Belum diunggah</span>
                            </>
                          )}
                        </a>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Modal Footer - Actions (hanya untuk "Menunggu Konfirmasi") */}
            {getStatusConfig(selectedDetail.status_pengajuan).canApprove && (
              <div className="p-4 border-t border-slate-200 bg-slate-50/50 flex justify-end gap-3">
                <button
                  onClick={() => handleUpdateStatus(selectedDetail.id, "Dibatalkan Penjual")}
                  disabled={actionLoading === selectedDetail.id}
                  className="px-4 py-2.5 text-sm font-medium rounded-xl bg-white border-2 border-[#f87171] text-[#991b1b] hover:bg-[#fee2e2] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2"
                >
                  {actionLoading === selectedDetail.id && <Loader2 className="w-4 h-4 animate-spin" />}
                  <XCircle className="w-4 h-4" />
                  Batalkan
                </button>
                <button
                  onClick={() => handleUpdateStatus(selectedDetail.id, "Diterima")}
                  disabled={actionLoading === selectedDetail.id}
                  className="px-4 py-2.5 text-sm font-medium rounded-xl bg-[#22c55e] text-white hover:bg-[#16a34a] disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center gap-2 shadow-sm"
                >
                  {actionLoading === selectedDetail.id ? <Loader2 className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
                  Terima
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========== Image Preview Modal (Lightbox) ========== */}
      {previewImage && (
        <div 
          className="fixed inset-0 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 z-60"
          onClick={() => setPreviewImage(null)}
        >
          <button 
            onClick={() => setPreviewImage(null)}
            className="absolute top-4 right-4 text-white/80 hover:text-white p-2 rounded-full hover:bg-white/10 transition-colors z-10"
          >
            <X className="w-6 h-6" />
          </button>
          
          <div className="relative max-w-[90vw] max-h-[90vh]">
            <Image
              src={previewImage}
              alt="Preview Dokumen"
              width={1200}
              height={800}
              className="rounded-lg shadow-2xl object-contain"
              unoptimized={previewImage.includes("res.cloudinary.com")}
              onClick={(e) => e.stopPropagation()}
            />
          </div>
          
          <p className="absolute bottom-4 text-white/70 text-sm">Klik di luar atau tekan ✕ untuk menutup</p>
        </div>
      )}
    </div>
  );
}