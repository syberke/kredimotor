// src/services/kredit.service.ts
import { supabase } from "@/lib/supabase";
import { Kredit } from "@/types/kredit.types";

export async function getKreditData(): Promise<Kredit[]> {
  const { data, error } = await supabase
    .from("kredit")
    .select(`
      *,
      metode_bayar (
        id,
        metode_pembayaran
      ),
      pengajuan_kredit (
        id,
        harga_kredit,
        dp,
        cicilan_perbulan,
        tgl_pengajuan_kredit,
        pelanggan (
          id,
          nama_pelanggan,
          email,
          no_telp,
          foto
        ),
        motor (
          id,
          nama_motor,
          foto1,
          warna,
          tahun_produksi,
          harga_jual,
          jenis_motor (
            id,
            merk,
            jenis
          )
        ),
        jenis_cicilan (
          id,
          lama_cicilan,
          margin_kredit
        )
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Error fetching kredit:", {
      message: error.message,
      details: error.details,
      hint: error.hint,
      code: error.code,
    });
    return [];
  }

  return (data as Kredit[]) ?? [];
}