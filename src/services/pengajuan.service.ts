import { supabase } from "@/lib/supabase";

export async function getPengajuanKredit() {
  const { data, error } = await supabase
    .from("pengajuan_kredit")
    .select(`
      *,
      pelanggan (
        nama_pelanggan,
        email
      ),
      motor (
        nama_motor,
        harga_jual,
        foto1
      ),
      jenis_cicilan (
        lama_cicilan
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}