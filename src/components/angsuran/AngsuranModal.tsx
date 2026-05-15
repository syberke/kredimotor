  // src/components/angsuran/AngsuranModal.tsx
  "use client";

  import { useState, useEffect } from "react";
  import { X, AlertCircle, Loader2 } from "lucide-react";
  import { toast } from "sonner";
  import { CreateAngsuranPayload, KreditOption, AngsuranItem } from "@/services/angsuran.service";

  type Props = {
    isOpen: boolean;
    onClose: () => void;
    onSubmit: (payload: CreateAngsuranPayload) => Promise<boolean>;
    kreditOptions: KreditOption[];
    initialData?: AngsuranItem;
    isEdit?: boolean;
  };

  type Form = { id_kredit: string; angsuran_ke: string; total_bayar: string; keterangan: string };

  const defaultForm: Form = {
    id_kredit: "",
    angsuran_ke: "",
    total_bayar: "",
    keterangan: "",
  };
  export default function AngsuranModal({ isOpen, onClose, onSubmit, kreditOptions, initialData, isEdit = false }: Props) {
    const [form, setForm] = useState<Form>(defaultForm);
    const [errors, setErrors] = useState<Record<string,string>>({});
    const [submitting, setSubmitting] = useState(false);
    const [selected, setSelected] = useState<KreditOption | null>(null);
const resetForm = () => {
  setForm(defaultForm);
  setErrors({});
  setSelected(null);
};
 useEffect(() => {
  document.body.style.overflow = isOpen ? "hidden" : "unset";

  return () => {
    document.body.style.overflow = "unset";
  };
}, [isOpen]);
  useEffect(() => {
    if (isOpen && isEdit && initialData) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setForm({
        id_kredit: String(initialData.id_kredit),
        angsuran_ke: String(initialData.angsuran_ke),
        total_bayar: String(initialData.total_bayar),
        keterangan: initialData.keterangan || "",
      });

      const sel =
        kreditOptions.find((k) => k.id === initialData.id_kredit) || null;

      setSelected(sel);
    }
  }, [isOpen, isEdit, initialData, kreditOptions]);
    if (!isOpen) return null;

    const validate = () => {
      const e: Record<string,string> = {};
      if (!form.id_kredit) e.id_kredit = "Pilih kredit";
      if (!form.angsuran_ke || +form.angsuran_ke < 1) e.angsuran_ke = "Nomor angsuran invalid";
      if (!form.total_bayar || +form.total_bayar <= 0) e.total_bayar = "Jumlah pembayaran invalid";
      setErrors(e);
      return Object.keys(e).length === 0;
    };

    const handleSubmit = async (ev: React.FormEvent) => {
      ev.preventDefault();
      if (!validate()) return;
      setSubmitting(true);
      
      const payload: CreateAngsuranPayload = {
        id_kredit: +form.id_kredit,
        angsuran_ke: +form.angsuran_ke,
        total_bayar: +form.total_bayar,
        keterangan: form.keterangan || undefined,
      };
      
      const ok = await onSubmit(payload);
      setSubmitting(false);
      
      if (ok) {
        resetForm();
onClose();
        toast.success(isEdit ? "Angsuran berhasil diperbarui!" : "Angsuran berhasil ditambahkan!");
      }
    };

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
      const id = +e.target.value;
      setForm(f => ({ ...f, id_kredit: e.target.value }));
      setSelected(kreditOptions.find(k => k.id === id) || null);
    };

    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"onClick={() => {
  resetForm();
  onClose();
}} />
        <div className="relative bg-white rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-hidden">
          <div className="flex items-center justify-between p-5 border-b">
            <div>
              <h3 className="text-xl font-bold">{isEdit ? "Edit Angsuran" : "Input Angsuran"}</h3>
              <p className="text-sm text-slate-500">{isEdit ? "Perbarui pembayaran cicilan" : "Tambah pembayaran cicilan"}</p>
            </div>
            <button onClick={() => {
  resetForm();
  onClose();
}} className="p-2 hover:bg-slate-100 rounded-xl"><X size={20} /></button>
          </div>
          
          <form onSubmit={handleSubmit} className="p-5 space-y-4 overflow-y-auto max-h-[60vh]">
            <div>
              <label className="block text-sm font-medium mb-1">Pilih Kredit *</label>
              <select 
                value={form.id_kredit} 
                onChange={handleChange}
                disabled={isEdit}
                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl focus:ring-2 focus:ring-blue-500/20 disabled:opacity-50 ${errors.id_kredit?"border-red-300":"border-slate-200"}`}
              >
                <option value="">-- Pilih --</option>
                {kreditOptions.map(k => (
                  <option key={k.id} value={k.id}>
                    {k.pengajuan_kredit?.pelanggan?.nama_pelanggan} - {k.pengajuan_kredit?.motor?.nama_motor} (Sisa: Rp {k.sisa_kredit?.toLocaleString("id-ID")})
                  </option>
                ))}
              </select>
              {errors.id_kredit && <p className="text-red-500 text-xs mt-1 flex items-center gap-1"><AlertCircle size={12}/>{errors.id_kredit}</p>}
            </div>
            
            {selected && !isEdit && (
              <div className="p-3 bg-blue-50 rounded-xl border border-blue-100 text-sm">
                <div className="flex justify-between"><span className="text-slate-500">Status:</span><span className="font-medium">{selected.status_kredit}</span></div>
                <div className="flex justify-between"><span className="text-slate-500">Sisa:</span><span className="font-medium">Rp {selected.sisa_kredit?.toLocaleString("id-ID")}</span></div>
              </div>
            )}
            
            <div>
              <label className="block text-sm font-medium mb-1">Angsuran Ke-*</label>
              <input 
                type="number" 
                min="1" 
                value={form.angsuran_ke} 
                onChange={e=>setForm(f=>({...f,angsuran_ke:e.target.value}))}
                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl ${errors.angsuran_ke?"border-red-300":"border-slate-200"}`} 
                placeholder="5" 
              />
              {errors.angsuran_ke && <p className="text-red-500 text-xs mt-1">{errors.angsuran_ke}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Total Bayar (Rp) *</label>
              <input 
                type="number" 
                min="1" 
                value={form.total_bayar} 
                onChange={e=>setForm(f=>({...f,total_bayar:e.target.value}))}
                className={`w-full px-4 py-3 bg-slate-50 border rounded-xl ${errors.total_bayar?"border-red-300":"border-slate-200"}`} 
                placeholder="1500000" 
              />
              {errors.total_bayar && <p className="text-red-500 text-xs mt-1">{errors.total_bayar}</p>}
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-1">Keterangan</label>
              <textarea 
                value={form.keterangan} 
                onChange={e=>setForm(f=>({...f,keterangan:e.target.value}))} 
                rows={2}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl resize-none" 
                placeholder="Opsional..." 
              />
            </div>
          </form>
          
          <div className="flex justify-end gap-3 p-5 border-t bg-slate-50">
            <button type="button"onClick={() => {
  resetForm();
  onClose();
}} disabled={submitting} className="px-5 py-2.5 rounded-xl hover:bg-slate-200">Batal</button>
            <button 
              onClick={handleSubmit} 
              disabled={submitting}
              className="flex items-center gap-2 px-6 py-2.5 bg-linear-to-r from-blue-600 to-blue-700 text-white rounded-xl font-semibold disabled:opacity-50"
            >
              {submitting ? <><Loader2 size={18} className="animate-spin"/>Menyimpan...</> : isEdit ? "Update" : "Simpan"}
            </button>
          </div>
        </div>
      </div>
    );
  }