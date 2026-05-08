import { supabase } from "@/lib/supabase";

export async function getDashboardStats() {
  const [
    pengajuan,
    kreditAktif,
    kreditLunas,
    kreditMacet,
    motor,
    pelanggan,
    angsuran,
  ] = await Promise.all([
    supabase.from("pengajuan_kredit").select("*", { count: "exact", head: true }),

    supabase
      .from("kredit")
      .select("*", { count: "exact", head: true })
      .eq("status_kredit", "Dicicil"),

    supabase
      .from("kredit")
      .select("*", { count: "exact", head: true })
      .eq("status_kredit", "Lunas"),

    supabase
      .from("kredit")
      .select("*", { count: "exact", head: true })
      .eq("status_kredit", "Macet"),

    supabase.from("motor").select("*", { count: "exact", head: true }),

    supabase.from("pelanggan").select("*", { count: "exact", head: true }),

    supabase.from("angsuran").select("total_bayar"),
  ]);

  // total uang angsuran
  const totalAngsuran =
    angsuran.data?.reduce(
      (acc, item) => acc + (item.total_bayar || 0),
      0
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
}