// src/components/pengiriman/PengirimanForm.tsx
"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { createPengiriman, updatePengiriman, getKreditSiapKirim, type ActionResponse } from "@/actions/pengiriman.actions";

interface KreditOption {
  id: number;
  nama_motor: string | null;
  nama_pelanggan: string | null;
  sisa_kredit: number | null;
}

interface EditData {
  id: number;
  status_kirim: string;
  tgl_tiba: string | null;
  keterangan: string | null;
  bukti_foto: string | null;
}

interface Props {
  isOpen: boolean;
  onClose: () => void;
  editData?: EditData | null;
}

// ✅ FIX: Fungsi helper murni
const generateInvoiceNumber = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0");
  const random = Math.floor(Math.random() * 900) + 100;
  return `INV/${year}/${month}/${random}`;
};

export default function PengirimanForm({ isOpen, onClose, editData }: Props) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);
  const [kreditList, setKreditList] = useState<KreditOption[]>([]);
  
  // ✅ FIX: Generate invoice lazily hanya saat dibutuhkan (bukan di effect)
  const defaultInvoice = useMemo(() => generateInvoiceNumber(), []);

  // ✅ FIX: Effect hanya untuk fetch data eksternal, bukan set state lokal
  useEffect(() => {
    if (!isOpen || editData) return;
    
    // Hanya fetch kredit list dari server (external system)
    getKreditSiapKirim().then(setKreditList);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isOpen, editData]);

  const handleSubmit = useCallback(async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const formData = new FormData(e.currentTarget);
    const res: ActionResponse = editData 
      ? await updatePengiriman(formData) 
      : await createPengiriman(formData);

    setMessage({ 
      type: res.success ? "success" : "error", 
      text: res.message || "Terjadi kesalahan" 
    });
    
    if (res.success) {
      setTimeout(onClose, 1500);
    }
    setLoading(false);
  }, [editData, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="p-6 border-b border-slate-200 flex justify-between items-center sticky top-0 bg-white z-10">
          <h2 className="text-xl font-bold text-slate-800">
            {editData ? "Update Status Pengiriman" : "Buat Surat Jalan Baru"}
          </h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-2xl">&times;</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {editData && <input type="hidden" name="id" value={editData.id} />}

          {!editData && (
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Pilih Kredit / Pelanggan</label>
              <select name="id_kredit" required className="w-full border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 outline-none">
                <option value="">-- Pilih Data Kredit --</option>
                {kreditList.map(k => (
                  <option key={k.id} value={k.id}>
                    {k.nama_pelanggan} - {k.nama_motor} (Sisa: Rp {k.sisa_kredit?.toLocaleString("id-ID")})
                  </option>
                ))}
              </select>
            </div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">No Invoice</label>
              <input 
                name="no_invoice" 
                defaultValue={editData ? undefined : defaultInvoice} 
                required={!editData} 
                readOnly={!!editData} 
                className="w-full border border-slate-300 rounded-lg px-3 py-2 bg-slate-50" 
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Nama Kurir</label>
              <input name="nama_kurir" required={!editData} className="w-full border border-slate-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Telepon Kurir</label>
              <input name="telpon_kurir" type="tel" className="w-full border border-slate-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Status Pengiriman</label>
              <select name="status_kirim" defaultValue={editData?.status_kirim || "Sedang Dikirim"} className="w-full border border-slate-300 rounded-lg px-3 py-2">
                <option value="Sedang Dikirim">🚚 Sedang Dikirim</option>
                <option value="Tiba Di Tujuan">✅ Tiba Di Tujuan</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Kirim</label>
              <input name="tgl_kirim" type="datetime-local" required={!editData} className="w-full border border-slate-300 rounded-lg px-3 py-2" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tanggal Tiba (Opsional)</label>
              <input name="tgl_tiba" type="datetime-local" defaultValue={editData?.tgl_tiba ? new Date(editData.tgl_tiba).toISOString().slice(0, 16) : ""} className="w-full border border-slate-300 rounded-lg px-3 py-2" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Keterangan / Catatan Serah Terima</label>
            <textarea name="keterangan" rows={3} defaultValue={editData?.keterangan || ""} placeholder="Contoh: Motor diterima oleh istri pelanggan, kondisi mulus..." className="w-full border border-slate-300 rounded-lg px-3 py-2" />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Upload Bukti Foto</label>
            <input name="bukti_foto" type="file" accept="image/*" className="w-full text-sm text-slate-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" />
            {editData?.bukti_foto && (
              <p className="text-xs text-slate-400 mt-1">Foto lama: <a href={editData.bukti_foto} target="_blank" rel="noopener noreferrer" className="text-blue-600 underline">Lihat</a></p>
            )}
          </div>

          {message && (
            <div className={`p-3 rounded-lg text-sm ${message.type === "success" ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}`}>
              {message.text}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-4 border-t border-slate-200 sticky bottom-0 bg-white py-3">
            <button type="button" onClick={onClose} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Batal</button>
            <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 flex items-center gap-2">
              {loading && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>}
              {editData ? "Update Data" : "Simpan Surat Jalan"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}