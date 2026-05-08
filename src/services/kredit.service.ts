import { supabase } from "@/lib/supabase";

export async function getKreditData() {
  const { data, error } = await supabase
    .from("kredit")
    .select(`
      *,
      metode_bayar (
        metode_pembayaran
      ),
      pengajuan_kredit (
        harga_kredit,
        cicilan_perbulan,
        pelanggan (
          nama_pelanggan,
          email
        ),
        motor (
          nama_motor,
          foto1
        )
      )
    `)
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}