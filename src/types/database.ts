export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      angsuran: {
        Row: {
          angsuran_ke: number | null
          created_at: string | null
          id: number
          id_kredit: number | null
          keterangan: string | null
          tgl_bayar: string | null
          total_bayar: number | null
          updated_at: string | null
        }
        Insert: {
          angsuran_ke?: number | null
          created_at?: string | null
          id?: number
          id_kredit?: number | null
          keterangan?: string | null
          tgl_bayar?: string | null
          total_bayar?: number | null
          updated_at?: string | null
        }
        Update: {
          angsuran_ke?: number | null
          created_at?: string | null
          id?: number
          id_kredit?: number | null
          keterangan?: string | null
          tgl_bayar?: string | null
          total_bayar?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "angsuran_id_kredit_fkey"
            columns: ["id_kredit"]
            isOneToOne: false
            referencedRelation: "kredit"
            referencedColumns: ["id"]
          },
        ]
      }
      asuransi: {
        Row: {
          created_at: string | null
          id: number
          margin_asuransi: number | null
          nama_asuransi: string | null
          nama_perusahaan_asuransi: string | null
          no_rekening: string | null
          updated_at: string | null
          url_logo: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          margin_asuransi?: number | null
          nama_asuransi?: string | null
          nama_perusahaan_asuransi?: string | null
          no_rekening?: string | null
          updated_at?: string | null
          url_logo?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          margin_asuransi?: number | null
          nama_asuransi?: string | null
          nama_perusahaan_asuransi?: string | null
          no_rekening?: string | null
          updated_at?: string | null
          url_logo?: string | null
        }
        Relationships: []
      }
      jenis_cicilan: {
        Row: {
          created_at: string | null
          id: number
          lama_cicilan: number | null
          margin_kredit: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          lama_cicilan?: number | null
          margin_kredit?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          lama_cicilan?: number | null
          margin_kredit?: number | null
          updated_at?: string | null
        }
        Relationships: []
      }
      jenis_motor: {
        Row: {
          created_at: string | null
          deskripsi_jenis: string | null
          id: number
          image_url: string | null
          jenis: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          deskripsi_jenis?: string | null
          id?: number
          image_url?: string | null
          jenis?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          deskripsi_jenis?: string | null
          id?: number
          image_url?: string | null
          jenis?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      kredit: {
        Row: {
          created_at: string | null
          id: number
          id_metode_bayar: number | null
          id_pengajuan_kredit: number | null
          keterangan_status_kredit: string | null
          sisa_kredit: number | null
          status_kredit: string | null
          tgl_mulai_kredit: string | null
          tgl_selesai_kredit: string | null
          total_kredit: number | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          id_metode_bayar?: number | null
          id_pengajuan_kredit?: number | null
          keterangan_status_kredit?: string | null
          sisa_kredit?: number | null
          status_kredit?: string | null
          tgl_mulai_kredit?: string | null
          tgl_selesai_kredit?: string | null
          total_kredit?: number | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          id_metode_bayar?: number | null
          id_pengajuan_kredit?: number | null
          keterangan_status_kredit?: string | null
          sisa_kredit?: number | null
          status_kredit?: string | null
          tgl_mulai_kredit?: string | null
          tgl_selesai_kredit?: string | null
          total_kredit?: number | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "kredit_id_metode_bayar_fkey"
            columns: ["id_metode_bayar"]
            isOneToOne: false
            referencedRelation: "metode_bayar"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kredit_id_pengajuan_kredit_fkey"
            columns: ["id_pengajuan_kredit"]
            isOneToOne: false
            referencedRelation: "pengajuan_kredit"
            referencedColumns: ["id"]
          },
        ]
      }
      metode_bayar: {
        Row: {
          created_at: string | null
          id: number
          metode_pembayaran: string | null
          no_rekening: string | null
          tempat_bayar: string | null
          updated_at: string | null
          url_logo: string | null
        }
        Insert: {
          created_at?: string | null
          id?: number
          metode_pembayaran?: string | null
          no_rekening?: string | null
          tempat_bayar?: string | null
          updated_at?: string | null
          url_logo?: string | null
        }
        Update: {
          created_at?: string | null
          id?: number
          metode_pembayaran?: string | null
          no_rekening?: string | null
          tempat_bayar?: string | null
          updated_at?: string | null
          url_logo?: string | null
        }
        Relationships: []
      }
      motor: {
        Row: {
          created_at: string | null
          deskripsi_motor: string | null
          foto1: string | null
          foto2: string | null
          foto3: string | null
          foto4: string | null
          foto5: string | null
          harga_jual: number | null
          id: number
          id_jenis: number | null
          kapasitas_mesin: string | null
          nama_motor: string | null
          stok: number | null
          tahun_produksi: string | null
          updated_at: string | null
          warna: string | null
        }
        Insert: {
          created_at?: string | null
          deskripsi_motor?: string | null
          foto1?: string | null
          foto2?: string | null
          foto3?: string | null
          foto4?: string | null
          foto5?: string | null
          harga_jual?: number | null
          id?: number
          id_jenis?: number | null
          kapasitas_mesin?: string | null
          nama_motor?: string | null
          stok?: number | null
          tahun_produksi?: string | null
          updated_at?: string | null
          warna?: string | null
        }
        Update: {
          created_at?: string | null
          deskripsi_motor?: string | null
          foto1?: string | null
          foto2?: string | null
          foto3?: string | null
          foto4?: string | null
          foto5?: string | null
          harga_jual?: number | null
          id?: number
          id_jenis?: number | null
          kapasitas_mesin?: string | null
          nama_motor?: string | null
          stok?: number | null
          tahun_produksi?: string | null
          updated_at?: string | null
          warna?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "motor_id_jenis_fkey"
            columns: ["id_jenis"]
            isOneToOne: false
            referencedRelation: "jenis_motor"
            referencedColumns: ["id"]
          },
        ]
      }
      pelanggan: {
        Row: {
          alamat1: string | null
          alamat2: string | null
          alamat3: string | null
          created_at: string | null
          email: string | null
          foto: string | null
          id: string
          kodepos1: string | null
          kodepos2: string | null
          kodepos3: string | null
          kota1: string | null
          kota2: string | null
          kota3: string | null
          nama_pelanggan: string | null
          no_telp: string | null
          propinsi1: string | null
          propinsi2: string | null
          propinsi3: string | null
          updated_at: string | null
        }
        Insert: {
          alamat1?: string | null
          alamat2?: string | null
          alamat3?: string | null
          created_at?: string | null
          email?: string | null
          foto?: string | null
          id: string
          kodepos1?: string | null
          kodepos2?: string | null
          kodepos3?: string | null
          kota1?: string | null
          kota2?: string | null
          kota3?: string | null
          nama_pelanggan?: string | null
          no_telp?: string | null
          propinsi1?: string | null
          propinsi2?: string | null
          propinsi3?: string | null
          updated_at?: string | null
        }
        Update: {
          alamat1?: string | null
          alamat2?: string | null
          alamat3?: string | null
          created_at?: string | null
          email?: string | null
          foto?: string | null
          id?: string
          kodepos1?: string | null
          kodepos2?: string | null
          kodepos3?: string | null
          kota1?: string | null
          kota2?: string | null
          kota3?: string | null
          nama_pelanggan?: string | null
          no_telp?: string | null
          propinsi1?: string | null
          propinsi2?: string | null
          propinsi3?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      pengajuan_kredit: {
        Row: {
          biaya_asuransi_perbulan: number | null
          cicilan_perbulan: number | null
          created_at: string | null
          dp: number | null
          harga_cash: number | null
          harga_kredit: number | null
          id: number
          id_asuransi: number | null
          id_jenis_cicilan: number | null
          id_motor: number | null
          id_pelanggan: string | null
          keterangan_status_pengajuan: string | null
          status_pengajuan: string | null
          tgl_pengajuan: string | null
          updated_at: string | null
          url_foto: string | null
          url_kk: string | null
          url_ktp: string | null
          url_npwp: string | null
          url_slip_gaji: string | null
        }
        Insert: {
          biaya_asuransi_perbulan?: number | null
          cicilan_perbulan?: number | null
          created_at?: string | null
          dp?: number | null
          harga_cash?: number | null
          harga_kredit?: number | null
          id?: number
          id_asuransi?: number | null
          id_jenis_cicilan?: number | null
          id_motor?: number | null
          id_pelanggan?: string | null
          keterangan_status_pengajuan?: string | null
          status_pengajuan?: string | null
          tgl_pengajuan?: string | null
          updated_at?: string | null
          url_foto?: string | null
          url_kk?: string | null
          url_ktp?: string | null
          url_npwp?: string | null
          url_slip_gaji?: string | null
        }
        Update: {
          biaya_asuransi_perbulan?: number | null
          cicilan_perbulan?: number | null
          created_at?: string | null
          dp?: number | null
          harga_cash?: number | null
          harga_kredit?: number | null
          id?: number
          id_asuransi?: number | null
          id_jenis_cicilan?: number | null
          id_motor?: number | null
          id_pelanggan?: string | null
          keterangan_status_pengajuan?: string | null
          status_pengajuan?: string | null
          tgl_pengajuan?: string | null
          updated_at?: string | null
          url_foto?: string | null
          url_kk?: string | null
          url_ktp?: string | null
          url_npwp?: string | null
          url_slip_gaji?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pengajuan_kredit_id_asuransi_fkey"
            columns: ["id_asuransi"]
            isOneToOne: false
            referencedRelation: "asuransi"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pengajuan_kredit_id_jenis_cicilan_fkey"
            columns: ["id_jenis_cicilan"]
            isOneToOne: false
            referencedRelation: "jenis_cicilan"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pengajuan_kredit_id_motor_fkey"
            columns: ["id_motor"]
            isOneToOne: false
            referencedRelation: "motor"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "pengajuan_kredit_id_pelanggan_fkey"
            columns: ["id_pelanggan"]
            isOneToOne: false
            referencedRelation: "pelanggan"
            referencedColumns: ["id"]
          },
        ]
      }
      pengiriman: {
        Row: {
          bukti_foto: string | null
          created_at: string | null
          id: number
          id_kredit: number | null
          keterangan: string | null
          nama_kurir: string | null
          no_invoice: string | null
          status_kirim: string | null
          telpon_kurir: string | null
          tgl_kirim: string | null
          tgl_tiba: string | null
          updated_at: string | null
        }
        Insert: {
          bukti_foto?: string | null
          created_at?: string | null
          id?: number
          id_kredit?: number | null
          keterangan?: string | null
          nama_kurir?: string | null
          no_invoice?: string | null
          status_kirim?: string | null
          telpon_kurir?: string | null
          tgl_kirim?: string | null
          tgl_tiba?: string | null
          updated_at?: string | null
        }
        Update: {
          bukti_foto?: string | null
          created_at?: string | null
          id?: number
          id_kredit?: number | null
          keterangan?: string | null
          nama_kurir?: string | null
          no_invoice?: string | null
          status_kirim?: string | null
          telpon_kurir?: string | null
          tgl_kirim?: string | null
          tgl_tiba?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "pengiriman_id_kredit_fkey"
            columns: ["id_kredit"]
            isOneToOne: false
            referencedRelation: "kredit"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          created_at: string | null
          email: string | null
          id: string
          name: string | null
          role: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          email?: string | null
          id?: string
          name?: string | null
          role?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
