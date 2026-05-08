import { supabase } from "@/lib/supabase";

/* =========================
   GET ALL MOTOR
========================= */
export async function getMotorData() {
  const { data, error } = await supabase
    .from("motor")
    .select(`
      *,
      jenis_motor (
        jenis,
        merk
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
   CREATE MOTOR
========================= */
export async function createMotor(payload: {
  nama_motor: string;
  id_jenis: number;
  harga_jual: number;
  warna: string;
  kapasitas_mesin: string;
  tahun_produksi: string;
  stok: number;
  foto1: string;
}) {
  return await supabase
    .from("motor")
    .insert(payload);
}

/* =========================
   DELETE MOTOR
========================= */
export async function deleteMotor(id: number) {
  return await supabase
    .from("motor")
    .delete()
    .eq("id", id);
}