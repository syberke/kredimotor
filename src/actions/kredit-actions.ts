// src/actions/kredit-actions.ts
"use server";

import { revalidatePath } from "next/cache";
import { supabase } from "@/lib/supabase";
import { KreditFormData, KreditOptions } from "@/types/kredit.types";

type CreateKreditInput = KreditFormData & { 
  cicilan_perbulan: number; // ✅ Tambahkan ini
  sisa_kredit: number; 
  status_kredit: string;
};

export async function createKredit(data: CreateKreditInput) {
  try {
    // 1. Create pengajuan_kredit first
    const { data: pengajuan, error: pengajuanError } = await supabase
      .from("pengajuan_kredit")
      .insert({
        id_pelanggan: data.id_pelanggan,
        id_motor: data.id_motor,
        harga_kredit: data.harga_kredit,
        dp: data.dp,
        id_jenis_cicilan: data.id_jenis_cicilan,
        cicilan_perbulan: data.cicilan_perbulan, // ✅ Sekarang valid
        status_pengajuan: "Disetujui",
        tgl_pengajuan_kredit: new Date().toISOString().split("T")[0],
      })
      .select("id")
      .single();

    if (pengajuanError) throw pengajuanError;

    // 2. Create kredit record
    const { error: kreditError } = await supabase
      .from("kredit")
      .insert({
        id_pengajuan_kredit: pengajuan.id,
        id_metode_bayar: data.id_metode_bayar,
        tgl_mulai_kredit: data.tgl_mulai_kredit,
        status_kredit: data.status_kredit,
        sisa_kredit: data.sisa_kredit,
        keterangan_status_kredit: data.keterangan,
      });

    if (kreditError) throw kreditError;

    revalidatePath("/kredit");
    return { success: true };
  } catch (error: unknown) {
    console.error("Create kredit error:", error);
    const message = error instanceof Error ? error.message : "Gagal menyimpan data";
    return { success: false, error: message };
  }
}

export async function deleteKredit(id: number) {
  try {
    const { data: kredit } = await supabase
      .from("kredit")
      .select("id_pengajuan_kredit")
      .eq("id", id)
      .single();

    if (!kredit) throw new Error("Kredit not found");

    const { error } = await supabase.from("kredit").delete().eq("id", id);
    if (error) throw error;

    revalidatePath("/kredit");
    return { success: true };
  } catch (error: unknown) {
    console.error("Delete kredit error:", error);
    const message = error instanceof Error ? error.message : "Gagal menghapus data";
    return { success: false, error: message };
  }
}

export async function getKreditOptions(): Promise<KreditOptions> {
  const [pelanggan, motor, metodeBayar, jenisCicilan] = await Promise.all([
    supabase.from("pelanggan").select("id, nama_pelanggan, email").order("nama_pelanggan"),
    supabase.from("motor").select("id, nama_motor, harga_jual").eq("stok", 1).order("nama_motor"),
    supabase.from("metode_bayar").select("id, metode_pembayaran"),
    supabase.from("jenis_cicilan").select("id, lama_cicilan, margin_kredit"),
  ]);

  return {
    pelanggan: pelanggan.data ?? [],
    motor: motor.data ?? [],
    metodeBayar: metodeBayar.data ?? [],
    jenisCicilan: jenisCicilan.data ?? [],
  };
}