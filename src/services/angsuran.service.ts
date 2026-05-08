import { supabase } from "@/lib/supabase";

/* =========================
   GET ALL ANGSURAN
========================= */
export async function getAngsuranData() {
  const { data, error } = await supabase
    .from("angsuran")
    .select(`
      *,
      kredit (
        sisa_kredit,
        status_kredit,
        pengajuan_kredit (
          pelanggan (
            nama_pelanggan
          ),
          motor (
            nama_motor
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

/* =========================
   CREATE ANGSURAN
========================= */
export async function createAngsuran(payload: {
  id_kredit: number;
  angsuran_ke: number;
  total_bayar: number;
  keterangan?: string;
}) {
  // 1. insert angsuran
  const { data, error } = await supabase
    .from("angsuran")
    .insert({
      ...payload,
      tgl_bayar: new Date(),
    })
    .select()
    .single();

  if (error) {
    return { error };
  }

  // 2. ambil data kredit
  const { data: kredit } = await supabase
    .from("kredit")
    .select("sisa_kredit")
    .eq("id", payload.id_kredit)
    .single();

  const sisaBaru =
    (kredit?.sisa_kredit || 0) -
    payload.total_bayar;

  // 3. update kredit
  await supabase
    .from("kredit")
    .update({
      sisa_kredit: sisaBaru <= 0 ? 0 : sisaBaru,

      status_kredit:
        sisaBaru <= 0
          ? "Lunas"
          : "Dicicil",
    })
    .eq("id", payload.id_kredit);

  return { data };
}