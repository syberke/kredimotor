// src/app/kredit/[id]/bayar/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, CreditCard, Calculator, Save, Loader2, AlertCircle, CheckCircle2 } from "lucide-react";
import { getKreditDetailById } from "@/services/kredit.service";
import { supabase } from "@/lib/supabase";
import { Kredit, PengajuanKredit, Pelanggan, Motor, JenisCicilan, MetodeBayar } from "@/types/kredit.types";

// ✅ Type untuk response detail yang include nested relations
type KreditDetail = Kredit & {
  pengajuan_kredit: PengajuanKredit & {
    jenis_cicilan: JenisCicilan | null;
    pelanggan: Pelanggan;
    motor: Motor;
  };
  metode_bayar: MetodeBayar;
};

type PaymentFormData = {
  tgl_bayar: string;
  total_bayar: number;
  angsuran_ke: number;
  keterangan: string;
};

export default function BayarCicilanPage() {
  const router = useRouter();
  const params = useParams();
  const kreditId = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [kredit, setKredit] = useState<KreditDetail | null>(null); // ✅ Ganti any → KreditDetail
  const [lastAngsuran, setLastAngsuran] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState<PaymentFormData>({
    tgl_bayar: new Date().toISOString().split("T")[0],
    total_bayar: 0,
    angsuran_ke: 1,
    keterangan: "",
  });

  useEffect(() => {
    const fetchData = async () => {
      const data = await getKreditDetailById(kreditId);
      if (data) {
        setKredit(data as KreditDetail); // ✅ Type assertion yang aman
        
        // Fetch last angsuran number
        const { data: angsuranData } = await supabase
          .from("angsuran")
          .select("angsuran_ke")
          .eq("id_kredit", kreditId)
          .order("angsuran_ke", { ascending: false })
          .limit(1);
        
        const lastKe = angsuranData && angsuranData.length > 0 ? angsuranData[0].angsuran_ke : 0;
        setLastAngsuran(lastKe);
        
        // Set default cicilan amount
        setFormData(prev => ({
          ...prev,
          angsuran_ke: lastKe + 1,
          total_bayar: data.pengajuan_kredit?.cicilan_perbulan || 0,
        }));
      }
      setLoading(false);
    };
    fetchData();
  }, [kreditId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);

    try {
      if (!kredit) throw new Error("Data kredit tidak ditemukan");

      // 1. Insert angsuran record
      const { error: angsuranError } = await supabase
        .from("angsuran")
        .insert({
          id_kredit: kreditId,
          tgl_bayar: formData.tgl_bayar,
          angsuran_ke: formData.angsuran_ke,
          total_bayar: formData.total_bayar,
          keterangan: formData.keterangan,
          created_at: new Date().toISOString(),
        });

      if (angsuranError) throw angsuranError;

      // 2. Update sisa_kredit
      const newSisa = (kredit.sisa_kredit || 0) - formData.total_bayar;
      const newStatus = newSisa <= 0 ? "Lunas" : kredit.status_kredit;

      const { error: updateError } = await supabase
        .from("kredit")
        .update({
          sisa_kredit: newSisa,
          status_kredit: newStatus,
          updated_at: new Date().toISOString(),
        })
        .eq("id", kreditId);

      if (updateError) throw updateError;

      setSuccess(true);
      
      setTimeout(() => {
        router.push(`/admin/kredit/${kreditId}`);
        router.refresh();
      }, 2000);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Gagal menyimpan pembayaran";
      setError(message);
    } finally {
      setSaving(false);
    }
  };

  const fmt = (n: number | null | undefined) =>
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n ?? 0);

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="w-8 h-8 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4" />
        <p className="text-slate-500">Memuat data...</p>
      </div>
    );
  }

  if (!kredit) {
    return (
      <div className="p-8 text-center text-red-600">
        <AlertCircle className="w-12 h-12 mx-auto mb-4" />
        <p>Data kredit tidak ditemukan</p>
      </div>
    );
  }

  const p = kredit.pengajuan_kredit;

  return (
    <div className="p-6 lg:p-8 max-w-4xl mx-auto">
      {/* Header */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div>
          <h1 className="text-2xl font-black text-slate-800">Bayar Cicilan</h1>
          <p className="text-slate-500 text-sm">Kredit #{kredit.id} - {p?.pelanggan?.nama_pelanggan}</p>
        </div>
      </div>

      {/* Info Card */}
      <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white mb-6 shadow-lg">
        <div className="flex items-center gap-3 mb-4">
          <CreditCard className="w-6 h-6" />
          <h2 className="text-lg font-bold">Info Kredit</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <p className="text-blue-100 text-xs mb-1">Total Kredit</p>
            <p className="font-semibold">{fmt(p?.harga_kredit)}</p>
          </div>
          <div>
            <p className="text-blue-100 text-xs mb-1">Sisa Kredit</p>
            <p className="font-semibold text-yellow-300">{fmt(kredit.sisa_kredit)}</p>
          </div>
          <div>
            <p className="text-blue-100 text-xs mb-1">Cicilan/Bulan</p>
            <p className="font-semibold">{fmt(p?.cicilan_perbulan)}</p>
          </div>
          <div>
            <p className="text-blue-100 text-xs mb-1">Angsuran Ke-</p>
            <p className="font-semibold">{formData.angsuran_ke} dari {p?.jenis_cicilan?.lama_cicilan}</p>
          </div>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 p-6 space-y-6 shadow-sm">
        {success && (
          <div className="flex items-center gap-3 p-4 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-700">
            <CheckCircle2 className="w-5 h-5 shrink-0" />
            <div>
              <p className="font-medium">Pembayaran berhasil disimpan!</p>
              <p className="text-sm text-emerald-600">Mengalihkan ke halaman detail...</p>
            </div>
          </div>
        )}

        {error && (
          <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Tanggal Bayar */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Tanggal Pembayaran *</label>
            <input
              type="date"
              required
              value={formData.tgl_bayar}
              onChange={(e) => setFormData({ ...formData, tgl_bayar: e.target.value })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>

          {/* Angsuran Ke- */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Angsuran Ke- *</label>
            <input
              type="number"
              required
              min={lastAngsuran + 1}
              max={p?.jenis_cicilan?.lama_cicilan || 999}
              value={formData.angsuran_ke}
              onChange={(e) => setFormData({ ...formData, angsuran_ke: Number(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
            <p className="text-xs text-slate-500">Angsuran terakhir: {lastAngsuran}</p>
          </div>

          {/* Total Bayar */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700 flex items-center gap-2">
              <Calculator className="w-4 h-4" /> Jumlah Bayar (Rp) *
            </label>
            <input
              type="number"
              required
              min="1"
              max={kredit.sisa_kredit || 999999999}
              value={formData.total_bayar || ""}
              onChange={(e) => setFormData({ ...formData, total_bayar: Number(e.target.value) })}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 text-lg font-semibold"
              placeholder="0"
            />
            <p className="text-xs text-slate-500">Sisa kredit saat ini: {fmt(kredit.sisa_kredit)}</p>
          </div>

          {/* Sisa Setelah Bayar */}
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Sisa Setelah Pembayaran</label>
            <input
              type="text"
              readOnly
              value={fmt((kredit.sisa_kredit || 0) - formData.total_bayar)}
              className="w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-200 text-slate-800 font-semibold"
            />
          </div>
        </div>

        {/* Keterangan */}
        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Keterangan (Opsional)</label>
          <textarea
            rows={3}
            value={formData.keterangan}
            onChange={(e) => setFormData({ ...formData, keterangan: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
            placeholder="Contoh: Pembayaran cicilan bulan ke-3 via transfer BCA..."
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button
            type="button"
            onClick={() => router.back()}
            disabled={saving || success}
            className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium transition disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="submit"
            disabled={saving || success}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</>
            ) : success ? (
              <><CheckCircle2 className="w-4 h-4" /> Berhasil!</>
            ) : (
              <><Save className="w-4 h-4" /> Simpan Pembayaran</>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}