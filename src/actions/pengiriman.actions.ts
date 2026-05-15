"use server";

import { supabase } from "@/lib/supabase";
import { revalidatePath } from "next/cache";

export interface ActionResponse {
  success: boolean;
  message: string;
}

export interface KreditSiapKirim {
  id: number;
  nama_motor: string | null;
  nama_pelanggan: string | null;
  sisa_kredit: number | null;
}
interface KreditWithRelations {
  id: number;
  sisa_kredit: number | null;
  pengajuan_kredit: Array<{
    motor: Array<{ nama_motor: string | null }>;
    pelanggan: Array<{ nama_pelanggan: string | null }>;
  }> | null;
}

export async function getKreditSiapKirim(): Promise<KreditSiapKirim[]> {
  const { data, error } = await supabase
    .from("kredit")
    .select(`
      id,
      sisa_kredit,
      pengajuan_kredit!inner (
        motor!inner (nama_motor),
        pelanggan!inner (nama_pelanggan)
      )
    `)
    .in("status_kredit", ["Dicicil", "Lancar"])
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Gagal fetch kredit siap kirim:", error);
    return [];
  }

return (data || []).map((item: KreditWithRelations): KreditSiapKirim => ({
  id: item.id,
  nama_motor:
    item.pengajuan_kredit?.[0]?.motor?.[0]?.nama_motor ?? null,
  nama_pelanggan:
    item.pengajuan_kredit?.[0]?.pelanggan?.[0]?.nama_pelanggan ?? null,
  sisa_kredit: item.sisa_kredit,
}));
}

export async function createPengiriman(formData: FormData): Promise<ActionResponse> {
  // ✅ FIX: Destructuring yang benar untuk auth
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    return { success: false, message: "Unauthorized" };
  }
  const user = authData.user;

  // Cek role user
  const { data: userData, error: roleError } = await supabase
    .from("users")
    .select("role")
    .eq("id", user.id)
    .single();
  
  if (roleError || (userData?.role !== "admin" && userData?.role !== "staff")) {
    return { success: false, message: "Forbidden" };
  }

  // Parse form data
  const id_kredit = Number(formData.get("id_kredit"));
  const no_invoice = formData.get("no_invoice") as string;
  const nama_kurir = formData.get("nama_kurir") as string;
  const telpon_kurir = formData.get("telpon_kurir") as string | null;
  const tgl_kirim = formData.get("tgl_kirim") as string;
  const status_kirim = formData.get("status_kirim") as string;
  const keterangan = formData.get("keterangan") as string | null;
  const buktiFile = formData.get("bukti_foto") as File | null;

  // Validasi field wajib
  if (!id_kredit || !no_invoice || !nama_kurir || !tgl_kirim) {
    return { success: false, message: "Data wajib harus diisi" };
  }

  // Upload foto jika ada
  let buktiUrl: string | null = null;
  if (buktiFile && buktiFile.size > 0) {
    const fileExt = buktiFile.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from("pengiriman-bukti")
      .upload(fileName, buktiFile);
      
    if (uploadError) {
      return { success: false, message: "Gagal upload foto: " + uploadError.message };
    }
    
    const { data: urlData } = supabase.storage
      .from("pengiriman-bukti")
      .getPublicUrl(fileName);
    buktiUrl = urlData.publicUrl;
  }

  // Insert ke database
  const { error: insertError } = await supabase
    .from("pengiriman")
    .insert({
      id_kredit,
      no_invoice,
      nama_kurir,
      telpon_kurir,
      tgl_kirim: new Date(tgl_kirim).toISOString(),
      status_kirim,
      keterangan,
      bukti_foto: buktiUrl,
    });

  if (insertError) {
    return { success: false, message: insertError.message };
  }

  revalidatePath("/(dashboard)/admin/pengiriman");
  return { success: true, message: "Pengiriman berhasil dibuat" };
}

export async function updatePengiriman(formData: FormData): Promise<ActionResponse> {
  // ✅ FIX: Destructuring yang benar
  const { data: authData, error: authError } = await supabase.auth.getUser();
  if (authError || !authData.user) {
    return { success: false, message: "Unauthorized" };
  }

  const id = Number(formData.get("id"));
  const status_kirim = formData.get("status_kirim") as string;
  const tgl_tiba = formData.get("tgl_tiba") as string | null;
  const keterangan = formData.get("keterangan") as string | null;
  const buktiFile = formData.get("bukti_foto") as File | null;

  // Build update object
  const updateData: Record<string, unknown> = {
    status_kirim,
    updated_at: new Date().toISOString(),
  };

  if (tgl_tiba) updateData.tgl_tiba = new Date(tgl_tiba).toISOString();
  if (keterangan) updateData.keterangan = keterangan;

  // Upload foto baru jika ada
  if (buktiFile && buktiFile.size > 0) {
    const fileExt = buktiFile.name.split(".").pop();
    const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
    
    const { error: uploadError } = await supabase.storage
      .from("pengiriman-bukti")
      .upload(fileName, buktiFile);
      
    if (!uploadError) {
      const { data: urlData } = supabase.storage
        .from("pengiriman-bukti")
        .getPublicUrl(fileName);
      updateData.bukti_foto = urlData.publicUrl;
    }
  }

  const { error } = await supabase
    .from("pengiriman")
    .update(updateData)
    .eq("id", id);

  if (error) {
    return { success: false, message: error.message };
  }

  revalidatePath("/(dashboard)/admin/pengiriman");
  return { success: true, message: "Data pengiriman berhasil diupdate" };
}