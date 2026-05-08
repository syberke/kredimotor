// src/app/api/kredit/route.ts
import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { KreditFormData } from "@/types/kredit.types";

type CreateKreditBody = KreditFormData & {
  cicilan_perbulan: number; // ✅ Tambahkan ini
  sisa_kredit: number;
  status_kredit: string;
  keterangan?: string;
};

export async function POST(request: Request) {
  try {
    const body: CreateKreditBody = await request.json();
    const { 
      id_pelanggan, id_motor, harga_kredit, dp, id_jenis_cicilan, 
      cicilan_perbulan, id_metode_bayar, tgl_mulai_kredit, 
      sisa_kredit, status_kredit, keterangan 
    } = body;

    // Create pengajuan_kredit
    const { data: pengajuan, error: pengajuanError } = await supabase
      .from("pengajuan_kredit")
      .insert({
        id_pelanggan, id_motor, harga_kredit, dp, id_jenis_cicilan, cicilan_perbulan,
        status_pengajuan: "Disetujui",
        tgl_pengajuan_kredit: new Date().toISOString().split("T")[0],
      })
      .select("id")
      .single();

    if (pengajuanError) throw pengajuanError;

    // Create kredit
    const { error: kreditError } = await supabase
      .from("kredit")
      .insert({
        id_pengajuan_kredit: pengajuan.id,
        id_metode_bayar,
        tgl_mulai_kredit,
        status_kredit,
        sisa_kredit,
        keterangan_status_kredit: keterangan,
      });

    if (kreditError) throw kreditError;

    return NextResponse.json({ success: true, id: pengajuan.id });
  } catch (error: unknown) {
    console.error("API POST kredit error:", error);
    const message = error instanceof Error ? error.message : "Failed to create";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}