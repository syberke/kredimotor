"use client";

import { FileText, Clock, CheckCircle, Search } from "lucide-react";

export default function MarketingDashboard() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Halo, Tim Marketing! 👋</h1>
        <p className="text-slate-500 text-sm mt-1">Pantau pengajuan kredit pelanggan hari ini.</p>
      </div>
      
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 p-6 rounded-2xl text-white shadow-lg shadow-blue-200">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-blue-100 text-sm font-medium mb-1">Pengajuan Baru</p>
              <h3 className="text-4xl font-bold">12</h3>
            </div>
            <FileText className="text-blue-200" size={32} />
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">Menunggu Konfirmasi</p>
              <h3 className="text-3xl font-bold text-slate-800">5</h3>
            </div>
            <div className="w-12 h-12 bg-orange-50 text-orange-500 rounded-full flex items-center justify-center">
              <Clock size={24} />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
          <div className="flex justify-between items-start">
            <div>
              <p className="text-slate-500 text-sm font-medium mb-1">Disetujui Bulan Ini</p>
              <h3 className="text-3xl font-bold text-slate-800">48</h3>
            </div>
            <div className="w-12 h-12 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center">
              <CheckCircle size={24} />
            </div>
          </div>
        </div>
      </div>

      {/* Tabel Pengajuan */}
      <div className="bg-white rounded-2xl border border-slate-100 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-slate-800">Pengajuan Terakhir</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Cari nama pelanggan..." 
              className="pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
        
        <table className="w-full text-left text-sm">
          <thead>
            <tr className="text-slate-400 border-b border-slate-100">
              <th className="pb-3 font-medium">Pelanggan</th>
              <th className="pb-3 font-medium">Motor</th>
              <th className="pb-3 font-medium">DP (Rp)</th>
              <th className="pb-3 font-medium">Status</th>
              <th className="pb-3 font-medium">Aksi</th>
            </tr>
          </thead>
          <tbody className="text-slate-600">
            <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
              <td className="py-4 font-medium text-slate-800">Andi Wijaya</td>
              <td>Yamaha NMAX 2024</td>
              <td>5.000.000</td>
              <td>
                <span className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded-full text-xs font-medium">
                  Menunggu
                </span>
              </td>
              <td>
                <button className="text-blue-600 font-medium hover:text-blue-800">Proses</button>
              </td>
            </tr>
            <tr className="border-b border-slate-50 hover:bg-slate-50 transition-colors">
              <td className="py-4 font-medium text-slate-800">Siti Rahma</td>
              <td>Honda Scoopy</td>
              <td>3.500.000</td>
              <td>
                <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
                  Disetujui
                </span>
              </td>
              <td>
                <button className="text-blue-600 font-medium hover:text-blue-800">Lihat</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}