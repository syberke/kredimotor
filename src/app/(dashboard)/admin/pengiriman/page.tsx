// src/app/(dashboard)/admin/pengiriman/page.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { getPengirimanData } from "@/services/pengiriman.service";
import PengirimanTable, { type PengirimanItem } from "@/components/pengiriman/PengirimanTable";
import PengirimanForm from "@/components/pengiriman/PengirimanForm";

export default function PengirimanPage() {
  const [data, setData] = useState<PengirimanItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editData, setEditData] = useState<{
    id: number;
    status_kirim: string;
    tgl_tiba: string | null;
    keterangan: string | null;
    bukti_foto: string | null;
  } | null>(null);
  
  const userRole: "admin" | "staff" | "pelanggan" | null = "admin";

  // ✅ FIX: Fungsi fetch dipisah, dipanggil di effect dengan eslint disable yang valid
  const loadData = useCallback(async () => {
    setLoading(true);
    try {
      const result = await getPengirimanData();
      setData(result);
    } catch (err) {
      console.error("Gagal load data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

 useEffect(() => {
  const loadData = async () => {
    setLoading(true);
    try {
      const result = await getPengirimanData();
      setData(result);
    } catch (err) {
      console.error("Gagal load data:", err);
    } finally {
      setLoading(false);
    }
  };

  loadData();
}, []);
  const handleEdit = useCallback((item: PengirimanItem) => {
    setEditData({
      id: item.id,
      status_kirim: item.status_kirim || "Sedang Dikirim",
      tgl_tiba: item.tgl_tiba,
      keterangan: item.keterangan,
      bukti_foto: item.bukti_foto,
    });
    setIsModalOpen(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setIsModalOpen(false);
    setEditData(null);
    loadData();
  }, [loadData]);

  if (loading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-black text-slate-800">Data Pengiriman</h1>
          <p className="text-slate-500 mt-1">Monitoring & Surat Jalan Pengiriman Motor</p>
        </div>
        <button 
          onClick={() => { setEditData(null); setIsModalOpen(true); }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 shadow-sm"
        >
          + Buat Surat Jalan
        </button>
      </div>

      <PengirimanTable 
        data={data} 
        userRole={userRole} 
        onEdit={handleEdit} 
      />

      <PengirimanForm 
        isOpen={isModalOpen} 
        onClose={handleCloseModal} 
        editData={editData} 
      />
    </div>
  );
}