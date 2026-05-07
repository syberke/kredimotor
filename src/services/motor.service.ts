import { supabase } from "@/lib/supabase";

export async function getMotors() {
  const { data, error } = await supabase.from("motor").select("*");

  if (error) throw error;

  return data;
}