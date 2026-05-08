import { supabase } from "@/lib/supabase";

export async function getJenisMotor() {
  const { data, error } = await supabase
    .from("jenis_motor")
    .select("*")
    .order("created_at", {
      ascending: false,
    });

  if (error) {
    console.error(error);
    return [];
  }

  return data;
}