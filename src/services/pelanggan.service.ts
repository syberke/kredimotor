import { supabase } from "@/lib/supabase";

export async function getPelanggan() {
  const { data, error } = await supabase
    .from("pelanggan")
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