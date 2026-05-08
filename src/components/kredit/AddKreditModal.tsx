// src/components/kredit/AddKreditModal.tsx
"use client";

import { useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { KreditFormData, KreditOptions } from "@/types/kredit.types";
import { X, Loader2, AlertCircle, CheckCircle2, Calculator } from "lucide-react";

type Props = {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
  options: KreditOptions;
};

export default function AddKreditModal({ isOpen, onClose, onSuccess, options }: Props) {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState<KreditFormData>({
    id_pelanggan: "",
    id_motor: 0,
    harga_kredit: 0,
    dp: 0,
    id_jenis_cicilan: 0,
    id_metode_bayar: 0,
    tgl_mulai_kredit: new Date().toISOString().split("T")[0],
    keterangan: "",
  });

  // ✅ Auto-calculate cicilan synchronously (avoid useEffect setState)
  const calculatedCicilan = useMemo(() => {
    if (!form.harga_kredit || !form.dp || !form.id_jenis_cicilan) return 0;
    const selected = options.jenisCicilan.find(j => j.id === form.id_jenis_cicilan);
    if (!selected) return 0;
    
    const pokok = form.harga_kredit - form.dp;
    const margin = pokok * ((selected.margin_kredit ?? 0) / 100);
    const total = pokok + margin;
    return Math.round(total / (selected.lama_cicilan ?? 1));
  }, [form.harga_kredit, form.dp, form.id_jenis_cicilan, options.jenisCicilan]);

  const handleChange = (field: keyof KreditFormData, value: string | number) => {
    setForm(prev => ({ ...prev, [field]: value }));
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    try {
      const res = await fetch("/api/kredit", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          cicilan_perbulan: calculatedCicilan,
          sisa_kredit: form.harga_kredit - form.dp,
          status_kredit: "Dicicil",
          keterangan: form.keterangan,
        }),
      });

      if (!res.ok) {
        const err: { error?: string } = await res.json().catch(() => ({}));
        throw new Error(err.error || "Gagal menyimpan data");
      }

      setSuccess(true);
      onSuccess?.();
      
      setTimeout(() => {
        router.refresh();
        onClose();
        setSuccess(false);
        setForm({
          id_pelanggan: "", id_motor: 0, harga_kredit: 0, dp: 0,
          id_jenis_cicilan: 0, id_metode_bayar: 0,
          tgl_mulai_kredit: new Date().toISOString().split("T")[0],
          keterangan: "",
        });
      }, 1500);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Terjadi kesalahan";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!isOpen) return null;

  const selectedMotor = options.motor.find(m => m.id === form.id_motor);
  const selectedCicilan = options.jenisCicilan.find(j => j.id === form.id_jenis_cicilan);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50" onClick={onClose}>
      <div className="bg-white rounded-3xl w-full max-w-3xl max-h-[90vh] overflow-y-auto shadow-2xl" onClick={(e) => e.stopPropagation()}>
        {/* Header */}
        <div className="sticky top-0 bg-white/80 backdrop-blur-sm p-6 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-slate-800">Tambah Kredit Baru</h2>
            <p className="text-sm text-slate-500">Isi data pengajuan kredit pelanggan</p>
          </div>
          <button onClick={onClose} disabled={isSubmitting} className="p-2 hover:bg-slate-100 rounded-xl transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {success && (
            <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
              <CheckCircle2 className="w-5 h-5 shrink-0" />
              <span>Data kredit berhasil disimpan!</span>
            </div>
          )}
          {error && (
            <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <div className="grid md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Pelanggan *</label>
              <select required value={form.id_pelanggan} onChange={(e) => handleChange("id_pelanggan", e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                <option value="">Pilih Pelanggan</option>
                {options.pelanggan.map(p => <option key={p.id} value={p.id}>{p.nama_pelanggan} - {p.email}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Motor *</label>
              <select required value={form.id_motor} onChange={(e) => handleChange("id_motor", Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                <option value="">Pilih Motor</option>
                {options.motor.map(m => <option key={m.id} value={m.id}>{m.nama_motor} - Rp {m.harga_jual?.toLocaleString("id-ID")}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Harga Kredit *</label>
              <input type="number" required min="0" value={form.harga_kredit || ""} onChange={(e) => handleChange("harga_kredit", Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="0" />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Uang Muka (DP) *</label>
              <input type="number" required min="0" max={form.harga_kredit || undefined} value={form.dp || ""} onChange={(e) => handleChange("dp", Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" placeholder="0" />
              {form.harga_kredit && form.dp && <p className="text-xs text-slate-500">Sisa: Rp {(form.harga_kredit - form.dp).toLocaleString("id-ID")}</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Tenor Cicilan *</label>
              <select required value={form.id_jenis_cicilan} onChange={(e) => handleChange("id_jenis_cicilan", Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                <option value="">Pilih Tenor</option>
                {options.jenisCicilan.map(j => <option key={j.id} value={j.id}>{j.lama_cicilan} bulan (Margin {j.margin_kredit ?? 0}%)</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Metode Pembayaran *</label>
              <select required value={form.id_metode_bayar} onChange={(e) => handleChange("id_metode_bayar", Number(e.target.value))} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                <option value="">Pilih Metode</option>
                {options.metodeBayar.map(m => <option key={m.id} value={m.id}>{m.metode_pembayaran}</option>)}
              </select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
                <Calculator className="w-4 h-4" /> Cicilan Per Bulan
              </label>
              <input type="text" readOnly value={calculatedCicilan ? `Rp ${calculatedCicilan.toLocaleString("id-ID")}` : "-"} className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold" />
              {selectedCicilan && selectedMotor && <p className="text-xs text-slate-500">{selectedCicilan.lama_cicilan}x cicilan • Margin {selectedCicilan.margin_kredit ?? 0}%</p>}
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Tanggal Mulai Kredit *</label>
              <input type="date" required value={form.tgl_mulai_kredit} onChange={(e) => handleChange("tgl_mulai_kredit", e.target.value)} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500" />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Keterangan (Opsional)</label>
            <textarea value={form.keterangan || ""} onChange={(e) => handleChange("keterangan", e.target.value)} rows={3} className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none" placeholder="Catatan tambahan untuk kredit ini..." />
          </div>

          <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
            <button type="button" onClick={onClose} disabled={isSubmitting} className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition disabled:opacity-50">Batal</button>
            <button type="submit" disabled={isSubmitting || success} className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2">
              {isSubmitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : success ? <><CheckCircle2 className="w-4 h-4" /> Berhasil!</> : "Simpan Kredit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}