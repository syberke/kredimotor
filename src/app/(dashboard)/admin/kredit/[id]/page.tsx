// src/app/(dashboard)/admin/kredit/[id]/page.tsx
import { notFound } from "next/navigation";
import { ArrowLeft, Calendar, CreditCard, MapPin, Phone, User, CheckCircle2, TrendingUp, Download } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getKreditDetailById, getAngsuranHistory } from "@/services/kredit.service";
import { Angsuran } from "@/types/kredit.types";
import KreditStatusBadge from "@/components/kredit/KreditStatusBadge";

export default async function KreditDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const kreditId = parseInt(id, 10);

  const [kredit, angsuranList] = await Promise.all([
    getKreditDetailById(kreditId),
    getAngsuranHistory(kreditId),
  ]);

  if (!kredit) notFound();

  const p = kredit.pengajuan_kredit;
  const pelanggan = p.pelanggan;
  const motor = p.motor;
  
  const totalKredit = p.harga_kredit;
  const sisaKredit = kredit.sisa_kredit;
  const sudahDibayar = totalKredit - sisaKredit;
  const progressPercent = totalKredit > 0 ? Math.round((sudahDibayar / totalKredit) * 100) : 0;
  const totalAngsuran = p.jenis_cicilan?.lama_cicilan || 0;
  const angsuranBerjalan = angsuranList?.length || 0;

  const fmt = (n: number | null | undefined) => 
    new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", maximumFractionDigits: 0 }).format(n ?? 0);

  return (
    <div className="p-6 lg:p-8 max-w-7xl mx-auto space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center gap-4">
          <Link href="/admin/kredit" className="p-2 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 transition">
            <ArrowLeft className="w-5 h-5 text-slate-600" />
          </Link>
          <div>
            <h1 className="text-2xl font-black text-slate-800">Detail Kredit #{kredit.id}</h1>
            <p className="text-slate-500 text-sm">Dibuat pada {new Date(kredit.created_at).toLocaleDateString("id-ID")}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <KreditStatusBadge status={kredit.status_kredit} size="md" />
          <Link 
            href={`/admin/kredit/${kredit.id}/edit`}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-medium transition"
          >
            Edit Data
          </Link>
        </div>
      </div>

      {/* STATISTIK */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500">Total Kredit</span>
            <div className="p-2 bg-blue-50 rounded-lg"><CreditCard className="w-5 h-5 text-blue-600" /></div>
          </div>
          <p className="text-2xl font-bold text-slate-800">{fmt(totalKredit)}</p>
          <p className="text-xs text-slate-400 mt-1">Cicilan: {fmt(p.cicilan_perbulan)}/bulan</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500">Sudah Dibayar</span>
            <div className="p-2 bg-emerald-50 rounded-lg"><TrendingUp className="w-5 h-5 text-emerald-600" /></div>
          </div>
          <p className="text-2xl font-bold text-emerald-600">{fmt(sudahDibayar)}</p>
          <p className="text-xs text-slate-400 mt-1">{angsuranBerjalan} dari {totalAngsuran} cicilan</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500">Sisa Kredit</span>
            <div className="p-2 bg-red-50 rounded-lg"><Download className="w-5 h-5 text-red-600" /></div>
          </div>
          <p className="text-2xl font-bold text-red-600">{fmt(sisaKredit)}</p>
          <p className="text-xs text-slate-400 mt-1">{totalAngsuran - angsuranBerjalan} cicilan tersisa</p>
        </div>
        <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-slate-500">Progress Lunas</span>
            <div className="p-2 bg-purple-50 rounded-lg"><CheckCircle2 className="w-5 h-5 text-purple-600" /></div>
          </div>
          <p className="text-2xl font-bold text-slate-800">{progressPercent}%</p>
          <div className="w-full bg-slate-100 rounded-full h-1.5 mt-2">
            <div className="bg-emerald-500 h-1.5 rounded-full transition-all duration-500" style={{ width: `${progressPercent}%` }} />
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* LEFT: Pelanggan & Motor */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <User className="w-5 h-5" /> Data Pelanggan
            </h3>
            <div className="flex items-center gap-4 mb-4">
              {pelanggan.foto ? (
                <Image src={pelanggan.foto} alt={pelanggan.nama_pelanggan} width={60} height={60} className="rounded-full object-cover" />
              ) : (
                <div className="w-14 h-14 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-xl">
                  {pelanggan.nama_pelanggan?.charAt(0)}
                </div>
              )}
              <div>
                <p className="font-semibold text-slate-800">{pelanggan.nama_pelanggan}</p>
                <p className="text-sm text-slate-500">{pelanggan.email}</p>
              </div>
            </div>
            <div className="space-y-2 text-sm">
              <p className="flex items-center gap-2 text-slate-600">
                <Phone className="w-4 h-4 text-slate-400" /> {pelanggan.no_telp || "-"}
              </p>
              <p className="flex items-start gap-2 text-slate-600">
                <MapPin className="w-4 h-4 text-slate-400 mt-0.5" /> 
                {pelanggan.alamat1}, {pelanggan.kota1}, {pelanggan.propinsi1}
              </p>
            </div>
          </div>

          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <CreditCard className="w-5 h-5" /> Unit Motor
            </h3>
            <div className="flex gap-4">
              <div className="relative w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                <Image src={motor.foto1 || "https://via.placeholder.com/100"} alt={motor.nama_motor} fill className="object-cover" />
              </div>
              <div>
                <p className="font-semibold text-slate-800">{motor.nama_motor}</p>
                <p className="text-sm text-slate-500">{motor.jenis_motor?.merk} • {motor.warna}</p>
                <p className="text-sm text-slate-500">Tahun: {motor.tahun_produksi || "-"}</p>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Kredit Terms & History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
              <Calendar className="w-5 h-5" /> Detail Kredit
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              <div>
                <p className="text-xs text-slate-500 uppercase">Tanggal Mulai</p>
                <p className="font-medium text-slate-800">{kredit.tgl_mulai_kredit ? new Date(kredit.tgl_mulai_kredit).toLocaleDateString("id-ID") : "-"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase">Tanggal Selesai</p>
                <p className="font-medium text-slate-800">{kredit.tgl_selesai_kredit ? new Date(kredit.tgl_selesai_kredit).toLocaleDateString("id-ID") : "-"}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase">Tenor</p>
                <p className="font-medium text-slate-800">{p.jenis_cicilan?.lama_cicilan} Bulan</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase">Margin Kredit</p>
                <p className="font-medium text-slate-800">{p.jenis_cicilan?.margin_kredit}%</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase">Metode Bayar</p>
                <p className="font-medium text-slate-800">{kredit.metode_bayar?.metode_pembayaran}</p>
              </div>
              <div>
                <p className="text-xs text-slate-500 uppercase">Asuransi</p>
                <p className="font-medium text-slate-800">{p.asuransi?.nama_asuransi || "-"}</p>
              </div>
            </div>
            {kredit.keterangan_status_kredit && (
              <div className="mt-4 p-3 bg-slate-50 rounded-xl text-sm text-slate-600">
                <strong>Catatan:</strong> {kredit.keterangan_status_kredit}
              </div>
            )}
          </div>

          {/* History Angsuran */}
          <div className="bg-white rounded-2xl border border-slate-100 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-800">Riwayat Pembayaran</h3>
              <span className="text-sm text-slate-500">{angsuranList?.length || 0} transaksi</span>
            </div>
            
            {angsuranList && angsuranList.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full text-sm text-left">
                  <thead className="bg-slate-50 text-slate-500">
                    <tr>
                      <th className="px-4 py-3 rounded-l-lg">Ke-</th>
                      <th className="px-4 py-3">Tanggal Bayar</th>
                      <th className="px-4 py-3">Nominal</th>
                      <th className="px-4 py-3 rounded-r-lg">Keterangan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {angsuranList.map((ang: Angsuran) => (
                      <tr key={ang.id} className="hover:bg-slate-50/50">
                        <td className="px-4 py-3 font-medium text-slate-800">#{ang.angsuran_ke}</td>
                        <td className="px-4 py-3 text-slate-600">{new Date(ang.tgl_bayar).toLocaleDateString("id-ID")}</td>
                        <td className="px-4 py-3 font-semibold text-emerald-600">{fmt(ang.total_bayar)}</td>
                        <td className="px-4 py-3 text-slate-500">{ang.keterangan || "-"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="text-center py-8 text-slate-400">
                <p>Belum ada riwayat pembayaran.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}