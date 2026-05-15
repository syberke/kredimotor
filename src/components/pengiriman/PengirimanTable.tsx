// src/components/pengiriman/PengirimanTable.tsx
"use client";

import Image from "next/image";
import { useState } from "react";

// Tipe data nested sesuai query Supabase
interface Pelanggan {
  nama_pelanggan: string | null;
  email: string | null;
}

interface Motor {
  nama_motor: string | null;
  foto1: string | null;
}

interface PengajuanKredit {
  pelanggan: Pelanggan | null;
  motor: Motor | null;
}

interface Kredit {
  pengajuan_kredit: PengajuanKredit | null;
}

export interface PengirimanItem {
  id: number;
  no_invoice: string | null;
  tgl_kirim: string | null;
  tgl_tiba: string | null;
  nama_kurir: string | null;
  telpon_kurir: string | null;
  bukti_foto: string | null;
  keterangan: string | null;
  status_kirim: "Sedang Dikirim" | "Tiba Di Tujuan" | string | null;
  kredit: Kredit | null;
}

interface Props {
  data: PengirimanItem[];           // ✅ FIX: Tambah "data:"
  userRole?: "admin" | "staff" | "pelanggan" | null;  // ✅ FIX: Tambah "userRole:"
  onEdit?: (item: PengirimanItem) => void;  // ✅ FIX: Tambah "onEdit:"
}

export default function PengirimanTable({ data, userRole, onEdit }: Props) {
  const formatDate = (dateStr: string | null) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleDateString("id-ID", {
      day: "numeric",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusBadge = (status: string | null) => {
    if (!status) return <span className="px-2 py-1 text-xs rounded-full bg-slate-100 text-slate-500">Tidak Diketahui</span>;
    if (status === "Sedang Dikirim") return <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-700 font-medium">🚚 Sedang Dikirim</span>;
    if (status === "Tiba Di Tujuan") return <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-700 font-medium">✅ Tiba Di Tujuan</span>;
    return <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-700 font-medium">{status}</span>;
  };

  const canEdit = userRole === "admin" || userRole === "staff";

  if (!data || data.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 bg-white rounded-xl border border-dashed border-slate-300">
        <p className="text-slate-500 font-medium">Belum ada data pengiriman</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-slate-200">
        <thead className="bg-slate-50">
          <tr>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Invoice</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Pelanggan</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Motor</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Jadwal</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Kurir</th>
            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Status</th>
            {canEdit && <th className="px-4 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wider">Aksi</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200">
          {data.map((item) => {
            const motorFoto = item.kredit?.pengajuan_kredit?.motor?.foto1;
            const motorNama = item.kredit?.pengajuan_kredit?.motor?.nama_motor;
            const pelangganNama = item.kredit?.pengajuan_kredit?.pelanggan?.nama_pelanggan;

            return (
              <tr key={item.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="px-4 py-3 text-sm font-medium text-slate-900 whitespace-nowrap">
                  {item.no_invoice || `INV-${item.id}`}
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  <div className="font-medium">{pelangganNama || "-"}</div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    {motorFoto ? (
                      <div className="relative w-9 h-9 rounded-md overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
                        <Image
                          src={motorFoto}
                          alt={motorNama || "Motor"}
                          fill
                          sizes="36px"
                          className="object-cover"
                          unoptimized={motorFoto.startsWith("http")}
                        />
                      </div>
                    ) : (
                      <div className="w-9 h-9 rounded-md bg-slate-100 flex items-center justify-center text-slate-400 text-xs shrink-0">🏍️</div>
                    )}
                    <span className="font-medium truncate max-w-36">{motorNama || "-"}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  <div>Kirim: <span className="font-medium">{formatDate(item.tgl_kirim)}</span></div>
                  <div className="text-xs text-slate-400">Tiba: {formatDate(item.tgl_tiba)}</div>
                </td>
                <td className="px-4 py-3 text-sm text-slate-600">
                  <div>{item.nama_kurir || "-"}</div>
                  <div className="text-xs text-slate-400">{item.telpon_kurir ? `📞 ${item.telpon_kurir}` : ""}</div>
                </td>
                <td className="px-4 py-3 text-sm">{getStatusBadge(item.status_kirim)}</td>
                {canEdit && onEdit && (
                  <td className="px-4 py-3 text-sm">
                    <button
                      onClick={() => onEdit(item)}
                      className="text-blue-600 hover:text-blue-800 text-xs font-medium bg-blue-50 px-2 py-1 rounded"
                    >
                      ✏️ Update
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}