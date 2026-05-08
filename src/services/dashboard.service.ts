import { supabase } from "@/lib/supabase";

export interface DashboardStats {
  totalPengajuan: number;
  totalKreditAktif: number;
  totalKreditLunas: number;
  totalKreditMacet: number;
  totalMotor: number;
  totalPelanggan: number;
  totalAngsuran: number;
}

export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    const [
      pengajuan,
      kreditAktif,
      kreditLunas,
      kreditMacet,
      motor,
      pelanggan,
      angsuran,
    ] = await Promise.all([
      // ✅ Query sesuai struktur database Anda
      supabase.from("pengajuan_kredit").select("*", { count: "exact", head: true }),
      supabase.from("kredit").select("*", { count: "exact", head: true }).eq("status_kredit", "Dicicil"),
      supabase.from("kredit").select("*", { count: "exact", head: true }).eq("status_kredit", "Lunas"),
      supabase.from("kredit").select("*", { count: "exact", head: true }).eq("status_kredit", "Macet"),
      supabase.from("motor").select("*", { count: "exact", head: true }),
      supabase.from("pelanggan").select("*", { count: "exact", head: true }),
      supabase.from("angsuran").select("total_bayar"),
    ]);

    // ✅ Error handling per query
    const queries = [pengajuan, kreditAktif, kreditLunas, kreditMacet, motor, pelanggan, angsuran];
    const hasError = queries.some(q => q.error);
    if (hasError) {
      const errMsg = queries.find(q => q.error)?.error?.message;
      console.error("Supabase error:", errMsg);
      // Return fallback agar UI tidak crash
      return getFallbackStats();
    }

    const totalAngsuran = angsuran.data?.reduce(
      (acc, item) => acc + (item.total_bayar || 0), 0
    ) || 0;

    return {
      totalPengajuan: pengajuan.count || 0,
      totalKreditAktif: kreditAktif.count || 0,
      totalKreditLunas: kreditLunas.count || 0,
      totalKreditMacet: kreditMacet.count || 0,
      totalMotor: motor.count || 0,
      totalPelanggan: pelanggan.count || 0,
      totalAngsuran,
    };
  } catch (error) {
    console.error("Dashboard service error:", error);
    return getFallbackStats();
  }
}

// 🛡️ Fallback data jika query gagal
function getFallbackStats(): DashboardStats {
  return {
    totalPengajuan: 0, totalKreditAktif: 0, totalKreditLunas: 0,
    totalKreditMacet: 0, totalMotor: 0, totalPelanggan: 0, totalAngsuran: 0,
  };
}