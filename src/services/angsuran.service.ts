// src/services/angsuran.service.ts
import { supabase } from "@/lib/supabase";

// ========================
// TYPES
// ========================

export type AngsuranItem = {
  id: number;
  id_kredit: number;
  tgl_bayar: string;
  angsuran_ke: number;
  total_bayar: number;
  keterangan?: string;
  created_at: string;
  updated_at?: string;
  kredit?: {
    sisa_kredit: number;
    status_kredit: "Lunas" | "Dicicil" | "Macet";
    pengajuan_kredit?: {
      pelanggan?: { 
        nama_pelanggan?: string;
        no_telp?: string;
        alamat1?: string;
      };
      motor?: { 
        nama_motor?: string;
        warna?: string;
        tahun_produksi?: string;
      };
    };
  };
};

export type CreateAngsuranPayload = {
  id_kredit: number;
  angsuran_ke: number;
  total_bayar: number;
  keterangan?: string;
};

export type UpdateAngsuranPayload = Partial<CreateAngsuranPayload>;

export type ApiResult<T> = {
  data?: T;
  error?: { message: string; code?: string; details?: string };
};

export type KreditOption = {
  id: number;
  status_kredit: string;
  sisa_kredit: number;
  pengajuan_kredit?: {
    pelanggan?: { nama_pelanggan?: string };
    motor?: { nama_motor?: string };
  };
};

export type ChartPeriod = "week" | "month" | "year";

export type ChartData = {
  labels: string[];
  values: number[];
};
type RawPengajuan = {
  pelanggan?: {
    nama_pelanggan?: string;
    no_telp?: string;
    alamat1?: string;
  } | {
    nama_pelanggan?: string;
    no_telp?: string;
    alamat1?: string;
  }[];

  motor?: {
    nama_motor?: string;
    warna?: string;
    tahun_produksi?: string;
  } | {
    nama_motor?: string;
    warna?: string;
    tahun_produksi?: string;
  }[];
};

type RawKredit = {
  sisa_kredit?: number;
  status_kredit?: "Lunas" | "Dicicil" | "Macet";
  pengajuan_kredit?: RawPengajuan | RawPengajuan[];
};

type RawAngsuran = {
  id: number;
  id_kredit: number;
  tgl_bayar: string;
  angsuran_ke: number;
  total_bayar: number;
  keterangan?: string;
  created_at: string;
  updated_at?: string;
  kredit?: RawKredit;
};

type RawKreditOption = {
  id: number;
  status_kredit: string;
  sisa_kredit?: number;
  pengajuan_kredit?: RawPengajuan | RawPengajuan[];
};
type PaymentChartRow = {
  period_label: string;
  total_amount: number | string;
  transaction_count: number;
};
// ========================
// HELPERS
// ========================

const flattenRelation = <T>(item: T | T[] | null | undefined): T | undefined => {
  if (Array.isArray(item)) return item[0] ?? undefined;
  return item ?? undefined;
};

const transformAngsuran = (
  raw: RawAngsuran
): AngsuranItem => {
  const pengajuanRaw = raw.kredit?.pengajuan_kredit;
  const pengajuan = flattenRelation(pengajuanRaw);
  
  return {
    id: raw.id,
    id_kredit: raw.id_kredit,
    tgl_bayar: raw.tgl_bayar,
    angsuran_ke: raw.angsuran_ke,
    total_bayar: raw.total_bayar,
    keterangan: raw.keterangan,
    created_at: raw.created_at,
    updated_at: raw.updated_at,
    kredit: raw.kredit ? {
      sisa_kredit: raw.kredit.sisa_kredit ?? 0,
      status_kredit: (raw.kredit.status_kredit ?? "Macet") as "Lunas" | "Dicicil" | "Macet",
      pengajuan_kredit: pengajuan ? {
        pelanggan: flattenRelation(pengajuan.pelanggan),
        motor: flattenRelation(pengajuan.motor),
      } : undefined,
    } : undefined,
  };
};

const transformKreditOption = (
  raw: RawKreditOption
): KreditOption => {
  const pengajuanRaw = raw.pengajuan_kredit;
  const pengajuan = flattenRelation(pengajuanRaw);
  
  return {
    id: raw.id,
    status_kredit: raw.status_kredit,
    sisa_kredit: raw.sisa_kredit ?? 0,
    pengajuan_kredit: pengajuan ? {
      pelanggan: flattenRelation(pengajuan.pelanggan),
      motor: flattenRelation(pengajuan.motor),
    } : undefined,
  };
};

// ========================
// SERVICE FUNCTIONS
// ========================

export async function getAngsuranData(filters?: {
  startDate?: string;
  endDate?: string;
  status?: string;
  search?: string;
}): Promise<AngsuranItem[]> {
  try {
    let query = supabase
      .from("angsuran")
      .select(`
        *,
        kredit!inner (
          sisa_kredit,
          status_kredit,
          pengajuan_kredit!inner (
            pelanggan ( nama_pelanggan, no_telp, alamat1 ),
            motor ( nama_motor, warna, tahun_produksi )
          )
        )
      `)
      .order("created_at", { ascending: false });

   if (filters?.startDate)
  query = query.gte("tgl_bayar", filters.startDate);

if (filters?.endDate)
  query = query.lte("tgl_bayar", filters.endDate);

if (filters?.search)
  query = query.ilike("keterangan", `%${filters.search}%`);

    const { data, error } = await query;

    if (error) {
      console.error("Supabase error fetching angsuran:", {
        message: error.message, code: error.code, details: error.details, hint: error.hint,
      });
      return [];
    }

    if (!data || data.length === 0) return [];
    return data.map(transformAngsuran);
  } catch (err) {
    console.error("Unexpected error fetching angsuran:", err);
    return [];
  }
}

export async function getAngsuranById(id: number): Promise<AngsuranItem | null> {
  try {
    const { data, error } = await supabase
    
      .from("angsuran")
      .select(`
        *,
        kredit!inner (
          sisa_kredit,
          status_kredit,
          pengajuan_kredit!inner (
            pelanggan ( nama_pelanggan, no_telp, alamat1 ),
            motor ( nama_motor, warna, tahun_produksi )
          )
        )
      `)
      .eq("id", id)
      .single();

    if (error) {
      console.error("Error fetching angsuran by id:", error);
      return null;
    }
    return transformAngsuran(data);
  } catch (err) {
    console.error("Unexpected error:", err);
    return null;
  }
}

export async function createAngsuran(payload: CreateAngsuranPayload): Promise<ApiResult<AngsuranItem>> {
  try {
    const { data: angsuranData, error: insertError } = await supabase
      .from("angsuran")
      .insert({
        id_kredit: payload.id_kredit,
        angsuran_ke: payload.angsuran_ke,
        total_bayar: payload.total_bayar,
        keterangan: payload.keterangan,
        tgl_bayar: new Date().toISOString().split("T")[0],
      })
      .select()
      .single();

    if (insertError) return { error: { message: insertError.message, code: insertError.code, details: insertError.details } };

    const { data: kredit } = await supabase
      .from("kredit")
      .select("sisa_kredit")
      .eq("id", payload.id_kredit)
      .single();

    if (kredit) {
      const sisaBaru = Math.max(0, (kredit.sisa_kredit ?? 0) - payload.total_bayar);
      await supabase
        .from("kredit")
        .update({
          sisa_kredit: sisaBaru,
          status_kredit: sisaBaru <= 0 ? "Lunas" : "Dicicil",
          updated_at: new Date().toISOString(),
        })
        .eq("id", payload.id_kredit);
    }

    return { data: transformAngsuran(angsuranData) };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { error: { message } };
  }
}

export async function updateAngsuran(id: number, payload: UpdateAngsuranPayload): Promise<ApiResult<AngsuranItem>> {
  try {
    const { data: angsuran, error: fetchError } = await supabase
      .from("angsuran")
      .select("id_kredit, total_bayar")
      .eq("id", id)
      .single();

    if (fetchError || !angsuran) {
      return { error: { message: "Angsuran not found" } };
    }

    const { data: updatedData, error: updateError } = await supabase
      .from("angsuran")
      .update({ ...payload, updated_at: new Date().toISOString() })
      .eq("id", id)
      .select()
      .single();

    if (updateError) return { error: { message: updateError.message, code: updateError.code } };

    if (payload.total_bayar !== undefined || payload.id_kredit) {
      const kreditId = payload.id_kredit || angsuran.id_kredit;
      const { data: allAngsuran } = await supabase
        .from("angsuran")
        .select("total_bayar")
        .eq("id_kredit", kreditId);

      const { data: kredit } = await supabase
        .from("kredit")
        .select("harga_kredit")
        .eq("id", kreditId)
        .single();

      if (kredit) {
        const totalDibayar = (allAngsuran || []).reduce((acc: number, item: { total_bayar?: number }) => acc + (item.total_bayar || 0), 0);
        const sisaBaru = Math.max(0, (kredit.harga_kredit || 0) - totalDibayar);

        await supabase
          .from("kredit")
          .update({
            sisa_kredit: sisaBaru,
            status_kredit: sisaBaru <= 0 ? "Lunas" : "Dicicil",
            updated_at: new Date().toISOString(),
          })
          .eq("id", kreditId);
      }
    }

    return { data: transformAngsuran(updatedData) };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { error: { message } };
  }
}

export async function deleteAngsuran(id: number): Promise<ApiResult<void>> {
  try {
    const { data: angsuran } = await supabase
      .from("angsuran")
      .select("id_kredit, total_bayar")
      .eq("id", id)
      .single();

    if (!angsuran) return { error: { message: "Angsuran not found" } };

    const { error: deleteError } = await supabase.from("angsuran").delete().eq("id", id);
    if (deleteError) return { error: { message: deleteError.message, code: deleteError.code } };

    const { data: allAngsuran } = await supabase
      .from("angsuran")
      .select("total_bayar")
      .eq("id_kredit", angsuran.id_kredit);

    const { data: kredit } = await supabase
      .from("kredit")
      .select("harga_kredit")
      .eq("id", angsuran.id_kredit)
      .single();

    if (kredit) {
      const totalDibayar = (allAngsuran || []).reduce((acc: number, item: { total_bayar?: number }) => acc + (item.total_bayar || 0), 0);
      const sisaBaru = Math.max(0, (kredit.harga_kredit || 0) - totalDibayar);

      await supabase
        .from("kredit")
        .update({
          sisa_kredit: sisaBaru,
          status_kredit: sisaBaru <= 0 ? "Lunas" : "Dicicil",
          updated_at: new Date().toISOString(),
        })
        .eq("id", angsuran.id_kredit);
    }

    return { data: undefined };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    return { error: { message } };
  }
}

export async function getKreditOptions(): Promise<KreditOption[]> {
  try {
    const { data, error } = await supabase
      .from("kredit")
      .select(`
        id,
        status_kredit,
        sisa_kredit,
        pengajuan_kredit!inner (
          pelanggan ( nama_pelanggan ),
          motor ( nama_motor )
        )
      `)
      .in("status_kredit", ["Dicicil", "Macet"])
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase error fetching kredit options:", {
        message: error.message, code: error.code, details: error.details,
      });
      return [];
    }
    if (!data || data.length === 0) return [];
    return data.map(transformKreditOption);
  } catch (err) {
    console.error("Unexpected error fetching kredit options:", err);
    return [];
  }
}

export async function getPaymentChartData(
  period: ChartPeriod
): Promise<ChartData> {
  try {
    const { data, error } = await supabase.rpc(
      "get_payment_chart",
      {
        period_type: period,
      }
    );

    if (error) {
      console.error("Chart RPC Error:", error);

      return {
        labels: [],
        values: [],
      };
    }

    return {
labels: (data as PaymentChartRow[]).map(
  (item: PaymentChartRow) => item.period_label
),

values: (data as PaymentChartRow[]).map(
  (item: PaymentChartRow) => Number(item.total_amount)
),
    };
  } catch (err) {
    console.error("Unexpected chart error:", err);

    return {
      labels: [],
      values: [],
    };
  }
}