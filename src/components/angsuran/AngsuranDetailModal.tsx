// src/components/angsuran/AngsuranDetailModal.tsx
"use client";

import { useEffect } from "react";
import { X, Calendar, User, Bike, CreditCard, FileText, Hash } from "lucide-react";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { AngsuranItem } from "@/services/angsuran.service";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  angsuran: AngsuranItem | null;
};

// ✅ Field component moved OUTSIDE main component to fix "static-components" error
const DetailField = ({ label, value, icon: Icon }: { 
  label: string; 
  value: string | number | undefined; 
  icon?: React.ComponentType<{ size?: number }>; 
}) => (
  <div className="flex justify-between items-center py-2 border-b border-slate-100 last:border-0">
    <div className="flex items-center gap-2 text-slate-500 text-sm">
      {Icon && <Icon size={14} />}
      <span>{label}</span>
    </div>
    <span className="font-medium text-slate-800 text-sm text-right">{value || "-"}</span>
  </div>
);

export default function AngsuranDetailModal({ isOpen, onClose, angsuran }: Props) {
  useEffect(() => {
    if (!isOpen) return;
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen || !angsuran) return null;

  const getStatusColor = (status?: string) => {
    switch (status) {
      case "Lunas": return "bg-emerald-100 text-emerald-700 border-emerald-200";
      case "Dicicil": return "bg-amber-100 text-amber-700 border-amber-200";
      default: return "bg-slate-100 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm" onClick={onClose} />
      
      <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-5 border-b border-slate-100">
          <div>
            <h3 className="text-xl font-bold text-slate-800">Detail Angsuran</h3>
            <p className="text-sm text-slate-500 mt-0.5">Informasi pembayaran cicilan</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-slate-100 rounded-xl transition-colors" aria-label="Tutup">
            <X size={20} className="text-slate-500" />
          </button>
        </div>

        <div className="p-5 space-y-6 overflow-y-auto max-h-[60vh]">
          <div className="flex items-center justify-between p-4 bg-slate-50 rounded-xl">
            <span className="text-sm text-slate-500">Status Kredit</span>
            <span className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(angsuran.kredit?.status_kredit)}`}>
              {angsuran.kredit?.status_kredit || "Macet"}
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
              <div className="flex items-center gap-2 text-blue-700 mb-2">
                <CreditCard size={18} />
                <span className="text-sm font-medium">Total Pembayaran</span>
              </div>
              <p className="text-2xl font-bold text-slate-800">Rp {angsuran.total_bayar?.toLocaleString("id-ID")}</p>
            </div>
            <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-100">
              <div className="flex items-center gap-2 text-emerald-700 mb-2">
                <Calendar size={18} />
                <span className="text-sm font-medium">Tanggal Bayar</span>
              </div>
              <p className="text-lg font-semibold text-slate-800">
                {angsuran.tgl_bayar ? format(new Date(angsuran.tgl_bayar), "dd MMMM yyyy", { locale: id }) : "-"}
              </p>
            </div>
          </div>

          <div className="space-y-3">
            <h4 className="font-semibold text-slate-700 flex items-center gap-2"><Hash size={18} /> Informasi Cicilan</h4>
            <div className="bg-slate-50 rounded-xl overflow-hidden">
              <DetailField label="Angsuran Ke-" value={`#${angsuran.angsuran_ke}`} />
              <DetailField label="Sisa Kredit" value={`Rp ${angsuran.kredit?.sisa_kredit?.toLocaleString("id-ID") || "0"}`} />
              <DetailField label="ID Kredit" value={angsuran.id_kredit} />
              <DetailField label="ID Angsuran" value={angsuran.id} />
            </div>
          </div>

          {angsuran.kredit?.pengajuan_kredit?.pelanggan && (
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-700 flex items-center gap-2"><User size={18} /> Data Pelanggan</h4>
              <div className="bg-slate-50 rounded-xl overflow-hidden p-4 space-y-2">
                <DetailField label="Nama" value={angsuran.kredit.pengajuan_kredit.pelanggan.nama_pelanggan} />
                <DetailField label="Telepon" value={angsuran.kredit.pengajuan_kredit.pelanggan.no_telp} />
                <DetailField label="Alamat" value={angsuran.kredit.pengajuan_kredit.pelanggan.alamat1} />
              </div>
            </div>
          )}

          {angsuran.kredit?.pengajuan_kredit?.motor && (
            <div className="space-y-3">
              <h4 className="font-semibold text-slate-700 flex items-center gap-2"><Bike size={18} /> Data Motor</h4>
              <div className="bg-slate-50 rounded-xl overflow-hidden p-4 space-y-2">
                <DetailField label="Nama Motor" value={angsuran.kredit.pengajuan_kredit.motor.nama_motor} />
                <DetailField label="Warna" value={angsuran.kredit.pengajuan_kredit.motor.warna} />
                <DetailField label="Tahun Produksi" value={angsuran.kredit.pengajuan_kredit.motor.tahun_produksi} />
              </div>
            </div>
          )}

          {angsuran.keterangan && (
            <div className="space-y-2">
              <h4 className="font-semibold text-slate-700 flex items-center gap-2"><FileText size={18} /> Keterangan</h4>
              <p className="p-4 bg-slate-50 rounded-xl text-sm text-slate-600">{angsuran.keterangan}</p>
            </div>
          )}
        </div>

        <div className="flex justify-end gap-3 p-5 border-t border-slate-100 bg-slate-50">
          <button onClick={onClose} className="px-5 py-2.5 text-slate-700 hover:bg-slate-200 rounded-xl font-medium transition-colors">Tutup</button>
        </div>
      </div>
    </div>
  );
}