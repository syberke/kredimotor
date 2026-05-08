// src/services/pengajuan.service.ts
import { supabase } from "@/lib/supabase";

// ============ TYPES ============
export interface Pelanggan {
  nama_pelanggan: string | null;
  email: string | null;
  no_telp: string | null;
}

export interface Motor {
  nama_motor: string | null;
  harga_jual: number | null;
  foto1: string | null;
}

export interface JenisCicilan {
  lama_cicilan: number | null;
}

export interface Asuransi {
  nama_perusahaan_asuransi: string | null;
  nama_asuransi: string | null;
}

export interface Pengajuan {
  id: number;
  tgl_pengajuan_kredit: string | null;
  harga_cash: number | null;
  dp: number | null;
  harga_kredit: number | null;
  cicilan_perbulan: number | null;
  biaya_asuransi_perbulan: number | null;
  status_pengajuan: string;
  keterangan_status_pengajuan: string | null;
  url_ktp: string | null;
  url_kk: string | null;
  url_npwp: string | null;
  url_slip_gaji: string | null;
  url_foto: string | null;
  pelanggan: Pelanggan | null;
  motor: Motor | null;
  jenis_cicilan: JenisCicilan | null;
  asuransi: Asuransi | null;
  created_at: string;
}

export interface PengajuanResponse {
  data: Pengajuan[];
  total: number;
  page: number;
  totalPages: number;
}

export interface PengajuanQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
}

// ============ FUNCTIONS ============
export async function getPengajuanKredit(params: PengajuanQueryParams = {}): Promise<PengajuanResponse> {
  const { page = 1, limit = 10, search = "", status = "" } = params;
  const from = (page - 1) * limit;
  const to = from + limit - 1;

  let query = supabase
    .from("pengajuan_kredit")
    .select(`
      *,
      pelanggan (nama_pelanggan, email, no_telp),
      motor (nama_motor, harga_jual, foto1),
      jenis_cicilan (lama_cicilan),
      asuransi (nama_perusahaan_asuransi, nama_asuransi)
    `, { count: "exact" })
    .order("created_at", { ascending: false })
    .range(from, to);

  if (search.trim()) {
    query = query.or(
      `pelanggan.nama_pelanggan.ilike.%${search.trim()}%,` +
      `motor.nama_motor.ilike.%${search.trim()}%,` +
      `id.eq.${search.trim()}`
    );
  }
  if (status && status !== "all") {
    query = query.eq("status_pengajuan", status);
  }

  const { data, error, count } = await query;

  if (error) {
    console.error("[Supabase] Error fetching pengajuan:", error.message);
    return { data: [], total: 0, page, totalPages: 0 };
  }

  return {
    data: (data as Pengajuan[]) || [],
    total: count || 0,
    page,
    totalPages: Math.ceil((count || 0) / limit),
  };
}

export async function updateStatusPengajuan(id: number, status: string, keterangan?: string) {
  const { error } = await supabase
    .from("pengajuan_kredit")
    .update({ 
      status_pengajuan: status, 
      keterangan_status_pengajuan: keterangan || `Status diubah pada ${new Date().toLocaleString("id-ID")}`,
      updated_at: new Date().toISOString()
    })
    .eq("id", id);
    
  if (error) throw new Error(error.message);
  return true;
}