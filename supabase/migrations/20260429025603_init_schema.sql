-- =========================
-- EXTENSION
-- =========================
create extension if not exists "pgcrypto";

-- =========================
-- PELANGGAN (LINK AUTH)
-- =========================
create table pelanggan (
  id uuid primary key references auth.users(id) on delete cascade,

  nama_pelanggan text,
  email text,
  no_telp text,

  alamat1 text,
  kota1 text,
  propinsi1 text,
  kodepos1 text,

  alamat2 text,
  kota2 text,
  propinsi2 text,
  kodepos2 text,

  alamat3 text,
  kota3 text,
  propinsi3 text,
  kodepos3 text,

  foto text,

  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- =========================
-- JENIS MOTOR
-- =========================
create table jenis_motor (
  id bigserial primary key,
  jenis text,
  deskripsi_jenis text,
  image_url text,
  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- =========================
-- MOTOR
-- =========================
create table motor (
  id bigserial primary key,
  nama_motor text,
  id_jenis bigint references jenis_motor(id),

  harga_jual int,
  deskripsi_motor text,
  warna text,
  kapasitas_mesin text,
  tahun_produksi text,

  foto1 text,
  foto2 text,
  foto3 text,
  foto4 text,
  foto5 text,

  stok int default 0,

  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- =========================
-- JENIS CICILAN
-- =========================
create table jenis_cicilan (
  id bigserial primary key,
  lama_cicilan int,
  margin_kredit numeric(8,2),

  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- =========================
-- ASURANSI
-- =========================
create table asuransi (
  id bigserial primary key,

  nama_perusahaan_asuransi text,
  nama_asuransi text,
  margin_asuransi numeric(8,2),

  no_rekening text,
  url_logo text,

  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- =========================
-- METODE BAYAR
-- =========================
create table metode_bayar (
  id bigserial primary key,

  metode_pembayaran text,
  tempat_bayar text,
  no_rekening text,
  url_logo text,

  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- =========================
-- PENGAJUAN KREDIT
-- =========================
create table pengajuan_kredit (
  id bigserial primary key,

  tgl_pengajuan date default current_date,

  id_pelanggan uuid references pelanggan(id) on delete cascade,
  id_motor bigint references motor(id),

  harga_cash int,
  dp int,

  id_jenis_cicilan bigint references jenis_cicilan(id),
  harga_kredit double precision,

  id_asuransi bigint references asuransi(id),
  biaya_asuransi_perbulan double precision,
  cicilan_perbulan double precision,

  url_ktp text,
  url_kk text,
  url_npwp text,
  url_slip_gaji text,
  url_foto text,

  status_pengajuan text default 'Menunggu Konfirmasi',
  keterangan_status_pengajuan text,

  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- =========================
-- KREDIT
-- =========================
create table kredit (
  id bigserial primary key,

  id_pengajuan_kredit bigint references pengajuan_kredit(id) on delete cascade,
  id_metode_bayar bigint references metode_bayar(id),

  tgl_mulai_kredit date,
  tgl_selesai_kredit date,

  total_kredit double precision,
  sisa_kredit double precision,

  status_kredit text default 'Dicair',
  keterangan_status_kredit text,

  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- =========================
-- ANGSURAN
-- =========================
create table angsuran (
  id bigserial primary key,

  id_kredit bigint references kredit(id) on delete cascade,

  tgl_bayar date,
  angsuran_ke int,
  total_bayar double precision,

  keterangan text,

  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- =========================
-- PENGIRIMAN
-- =========================
create table pengiriman (
  id bigserial primary key,

  no_invoice text,

  tgl_kirim timestamp,
  tgl_tiba timestamp,

  status_kirim text,
  nama_kurir text,
  telpon_kurir text,

  bukti_foto text,
  keterangan text,

  id_kredit bigint references kredit(id) on delete cascade,

  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- =========================
-- ADMIN USERS
-- =========================
create table users (
  id uuid primary key default gen_random_uuid(),

  name text,
  email text,
  role text default 'admin',

  created_at timestamp default now(),
  updated_at timestamp default now()
);

-- =========================
-- INDEXING (BIAR CEPAT)
-- =========================
create index idx_pengajuan_pelanggan on pengajuan_kredit(id_pelanggan);
create index idx_kredit_pengajuan on kredit(id_pengajuan_kredit);
create index idx_angsuran_kredit on angsuran(id_kredit);

-- =========================
-- AUTO UPDATE TIMESTAMP
-- =========================
create or replace function set_updated_at()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

-- trigger semua tabel penting
create trigger trg_pelanggan before update on pelanggan for each row execute procedure set_updated_at();
create trigger trg_motor before update on motor for each row execute procedure set_updated_at();
create trigger trg_pengajuan before update on pengajuan_kredit for each row execute procedure set_updated_at();
create trigger trg_kredit before update on kredit for each row execute procedure set_updated_at();
create trigger trg_angsuran before update on angsuran for each row execute procedure set_updated_at();

-- =========================
-- RLS ENABLE
-- =========================
alter table pelanggan enable row level security;
alter table pengajuan_kredit enable row level security;
alter table kredit enable row level security;
alter table angsuran enable row level security;

-- =========================
-- BASIC POLICY (DEV MODE)
-- =========================
create policy "Allow all pelanggan" on pelanggan for all using (true);
create policy "Allow all pengajuan" on pengajuan_kredit for all using (true);
create policy "Allow all kredit" on kredit for all using (true);
create policy "Allow all angsuran" on angsuran for all using (true);