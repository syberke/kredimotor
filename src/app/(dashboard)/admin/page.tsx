"use client";

import { Users, Bike, Settings, PlusCircle, Activity } from "lucide-react";

export default function AdminDashboard() {
  return (
    <div className="p-8">
      <div className="flex justify-between items-center mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Sistem Administrator</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola data master dan staff S-LOG.</p>
        </div>
        <button className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-xl text-sm font-medium transition-all shadow-lg shadow-blue-200 flex items-center gap-2">
          <PlusCircle size={18} />
          Tambah Staff
        </button>
      </div>
      
      {/* Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center shrink-0">
            <Users size={28} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Total Staff Aktif</p>
            <h3 className="text-2xl font-bold text-slate-800">12 Orang</h3>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-purple-50 text-purple-600 rounded-full flex items-center justify-center shrink-0">
            <Bike size={28} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Katalog Motor</p>
            <h3 className="text-2xl font-bold text-slate-800">45 Tipe</h3>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm flex items-center gap-4">
          <div className="w-14 h-14 bg-emerald-50 text-emerald-600 rounded-full flex items-center justify-center shrink-0">
            <Settings size={28} />
          </div>
          <div>
            <p className="text-slate-500 text-sm font-medium">Metode Pembayaran</p>
            <h3 className="text-2xl font-bold text-slate-800">8 Bank/Instansi</h3>
          </div>
        </div>
      </div>

      {/* Log Aktivitas Terakhir */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <h2 className="font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Activity size={20} className="text-blue-500" />
          Aktivitas Sistem Terakhir
        </h2>
        <div className="space-y-4">
          <div className="flex justify-between items-center pb-4 border-b border-slate-50">
            <div>
              <p className="text-sm font-medium text-slate-700">Budi (Marketing) menambahkan motor baru</p>
              <p className="text-xs text-slate-400">Yamaha NMAX 2024</p>
            </div>
            <span className="text-xs text-slate-400">10 mnt lalu</span>
          </div>
          <div className="flex justify-between items-center pb-4 border-b border-slate-50">
            <div>
              <p className="text-sm font-medium text-slate-700">Sistem mengupdate stok otomatis</p>
              <p className="text-xs text-slate-400">Honda Vario 160</p>
            </div>
            <span className="text-xs text-slate-400">1 jam lalu</span>
          </div>
        </div>
      </div>
    </div>
  );
}