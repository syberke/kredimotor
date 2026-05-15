// src/types/kredit.types.ts

export type StatusKredit = "Dicicil" | "Lunas" | "Macet";

export interface Pelanggan {
  id: string;
  nama_pelanggan: string;
  email: string;
  no_telp?: string | null;
  foto?: string | null;
}

export interface JenisMotor {
  id: number;
  merk?: string | null;
  jenis?: string | null;
}

export interface Motor {
  id: number;
  nama_motor: string;
  foto1?: string | null;
  warna?: string | null;
  tahun_produksi?: string | null;
  harga_jual?: number | null;
  jenis_motor?: JenisMotor | null;
}

export interface JenisCicilan {
  id: number;
  lama_cicilan: number | null;
  margin_kredit: number | null;
}

export interface PengajuanKredit {
  id: number;
  harga_kredit: number;
  dp?: number | null;
  cicilan_perbulan: number;
  tgl_pengajuan_kredit?: string | null;
  pelanggan: Pelanggan;
  motor: Motor;
  jenis_cicilan?: JenisCicilan | null;
}

export interface MetodeBayar {
  id: number;
  metode_pembayaran: string;
}

export interface Kredit {
  id: number;
  status_kredit: StatusKredit;
  sisa_kredit: number;
  tgl_mulai_kredit?: string | null;
  created_at: string;
  pengajuan_kredit: PengajuanKredit;
  metode_bayar: MetodeBayar;
}

export interface KreditFormData {
  id_pelanggan: string;
  id_motor: number;
  harga_kredit: number;
  dp: number;
  id_jenis_cicilan: number;
  id_metode_bayar: number;
  tgl_mulai_kredit: string;
  keterangan?: string;
}


export interface Angsuran {
  id: number;
  id_kredit: number;
  tgl_bayar: string;
  angsuran_ke: number;
  total_bayar: number;
  keterangan?: string | null;
  created_at: string;
  updated_at: string;
}

export type UpdateKreditInput = {
  status_kredit?: StatusKredit;
  sisa_kredit?: number;
  tgl_mulai_kredit?: string | null;
  tgl_selesai_kredit?: string | null;
  keterangan_status_kredit?: string | null;
};

export interface KreditOptions {
  pelanggan: Array<{ id: string; nama_pelanggan: string; email: string }>;
  motor: Array<{ id: number; nama_motor: string; harga_jual: number | null }>;
  metodeBayar: Array<{ id: number; metode_pembayaran: string }>;
  jenisCicilan: Array<{ id: number; lama_cicilan: number; margin_kredit: number | null }>;
}