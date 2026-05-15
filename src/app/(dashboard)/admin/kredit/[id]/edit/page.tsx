// src/app/(dashboard)/admin/kredit/[id]/edit/page.tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { ArrowLeft, Save, Loader2 } from "lucide-react";
import { getKreditDetailById, updateKredit } from "@/services/kredit.service";
import { StatusKredit } from "@/types/kredit.types";

type FormData = {
  status_kredit: StatusKredit;
  sisa_kredit: number;
  tgl_mulai_kredit: string;
  tgl_selesai_kredit: string;
  keterangan_status_kredit: string;
};

export default function EditKreditPage() {
  const router = useRouter();
  const params = useParams();
  const kreditId = Number(params.id);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState<FormData>({
    status_kredit: "Dicicil",
    sisa_kredit: 0,
    tgl_mulai_kredit: "",
    tgl_selesai_kredit: "",
    keterangan_status_kredit: "",
  });

  useEffect(() => {
    const fetch = async () => {
      const data = await getKreditDetailById(kreditId);
      if (data) {
        setFormData({
          status_kredit: data.status_kredit,
          sisa_kredit: data.sisa_kredit,
          tgl_mulai_kredit: data.tgl_mulai_kredit || "",
          tgl_selesai_kredit: data.tgl_selesai_kredit || "",
          keterangan_status_kredit: data.keterangan_status_kredit || "",
        });
      }
      setLoading(false);
    };
    fetch();
  }, [kreditId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateKredit(kreditId, {
        status_kredit: formData.status_kredit,
        sisa_kredit: formData.sisa_kredit,
        tgl_mulai_kredit: formData.tgl_mulai_kredit || null,
        tgl_selesai_kredit: formData.tgl_selesai_kredit || null,
        keterangan_status_kredit: formData.keterangan_status_kredit,
      });
      alert("✅ Data berhasil diupdate!");
      router.push(`/kredit/${kreditId}`);
      router.refresh();
    } catch (error: unknown) {
      const message = error instanceof Error ? error.message : "Gagal update";
      alert(`❌ Gagal: ${message}`);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-8 text-center">Memuat...</div>;

  return (
    <div className="p-6 lg:p-8 max-w-3xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => router.back()} className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-black text-slate-800">Edit Kredit #{kreditId}</h1>
      </div>

      <form onSubmit={handleSubmit} className="bg-white rounded-2xl border border-slate-100 p-6 space-y-6 shadow-sm">
        <div className="grid md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Status Kredit</label>
            <select 
              value={formData.status_kredit} 
              onChange={e => setFormData({...formData, status_kredit: e.target.value as StatusKredit})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="Dicicil">Dicicil</option>
              <option value="Lunas">Lunas</option>
              <option value="Macet">Macet</option>
            </select>
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Sisa Kredit (Rp)</label>
            <input 
              type="number" 
              value={formData.sisa_kredit}
              onChange={e => setFormData({...formData, sisa_kredit: Number(e.target.value)})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Tanggal Mulai</label>
            <input 
              type="date" 
              value={formData.tgl_mulai_kredit}
              onChange={e => setFormData({...formData, tgl_mulai_kredit: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Tanggal Selesai</label>
            <input 
              type="date" 
              value={formData.tgl_selesai_kredit}
              onChange={e => setFormData({...formData, tgl_selesai_kredit: e.target.value})}
              className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-slate-700">Keterangan / Catatan</label>
          <textarea 
            rows={4}
            value={formData.keterangan_status_kredit}
            onChange={e => setFormData({...formData, keterangan_status_kredit: e.target.value})}
            className="w-full px-4 py-3 rounded-xl border border-slate-200 focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 resize-none"
            placeholder="Contoh: Pelanggan request pelunasan di bulan depan..."
          />
        </div>

        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100">
          <button type="button" onClick={() => router.back()} className="px-6 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-medium">Batal</button>
          <button type="submit" disabled={saving} className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium disabled:opacity-50">
            {saving ? <><Loader2 className="w-4 h-4 animate-spin" /> Menyimpan...</> : <><Save className="w-4 h-4" /> Simpan Perubahan</>}
          </button>
        </div>
      </form>
    </div>
  );
}