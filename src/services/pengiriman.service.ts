import { supabase } from "@/lib/supabase";

export async function getPengirimanData() {
  const { data, error } = await supabase
    .from("pengiriman")
    .select(`
      *,
      kredit (
        pengajuan_kredit (
          pelanggan (
            nama_pelanggan,
            email
          ),
          motor (
            nama_motor,
            foto1
          )
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