export interface Pelanggan {
  nama_pelanggan: string;
  email: string;
  no_telp: string;
}

export interface Motor {
  nama_motor: string;
  harga_jual: number;
  foto1?: string;
}

export interface JenisCicilan {
  lama_cicilan: number;
}

export interface Asuransi {
  nama_perusahaan_asuransi: string;
  nama_asuransi: string;
}

export interface Pengajuan {
  id: number;
  tgl_pengajuan_kredit: string;
  harga_cash: number;
  dp: number;
  harga_kredit: number;
  cicilan_perbulan: number;
  biaya_asuransi_perbulan: number;
  status_pengajuan: string; // Enum: 'Menunggu Konfirmasi' | 'Disetujui' | 'Ditolak' | dll
  keterangan_status_pengajuan?: string;
  url_ktp?: string;
  url_kk?: string;
  url_npwp?: string;
  url_slip_gaji?: string;
  url_foto?: string;
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