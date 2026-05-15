// src/services/kredit.service.ts
import { supabase } from "@/lib/supabase";
import { Kredit, Angsuran, UpdateKreditInput } from "@/types/kredit.types";

export async function getKreditData(): Promise<Kredit[]> {
  const { data, error } = await supabase
    .from("kredit")
    .select(`
      *,
      metode_bayar (id, metode_pembayaran),
      pengajuan_kredit (
        id,
        harga_kredit,
        dp,
        cicilan_perbulan,
        tgl_pengajuan_kredit,
        pelanggan (id, nama_pelanggan, email, no_telp, foto),
        motor (id, nama_motor, foto1, warna, tahun_produksi, harga_jual, jenis_motor (id, merk, jenis)),
        jenis_cicilan (id, lama_cicilan, margin_kredit)
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching kredit:", error);
    return [];
  }

  return (data as Kredit[]) ?? [];
}

export async function getKreditDetailById(id: number) {
  const { data, error } = await supabase
    .from("kredit")
    .select(`
      *,
      metode_bayar (id, metode_pembayaran, no_rekening),
      pengajuan_kredit (
        *,
        jenis_cicilan (lama_cicilan, margin_kredit),
        asuransi (nama_asuransi, nama_perusahaan_asuransi),
        pelanggan (*),
        motor (*, jenis_motor (*))
      )
    `)
    .eq("id", id)
    .single();

  if (error) return null;
  return data;
}

export async function getAngsuranHistory(kreditId: number): Promise<Angsuran[]> {
  const { data, error } = await supabase
    .from("angsuran")
    .select("*")
    .eq("id_kredit", kreditId)
    .order("angsuran_ke", { ascending: false });

  if (error) return [];
  return data as Angsuran[];
}

export async function updateKredit(id: number, updates: UpdateKreditInput) {
  const { error } = await supabase
    .from("kredit")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("id", id);
  
  if (error) throw error;
  return { success: true };
}