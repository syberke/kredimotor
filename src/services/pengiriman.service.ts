// src/services/pengiriman.service.ts

// ❌ HAPUS import ini:
// import { supabaseAdmin } from "@/lib/supabase-admin";

// ✅ GANTI dengan import client biasa:
import { supabase } from "@/lib/supabase";

export async function getPengirimanData() {
  console.log("🔍 Fetching pengiriman data...");
  
  const { data, error } = await supabase
    .from("pengiriman")
    .select(`
      *,
      kredit (
        pengajuan_kredit (
          pelanggan (nama_pelanggan, email),
          motor (nama_motor, foto1)
        )
      )
    `)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("❌ Supabase error:", error);
    return [];
  }
  
  console.log("✅ Data fetched:", data?.length || 0, "rows");
  return data || [];
}