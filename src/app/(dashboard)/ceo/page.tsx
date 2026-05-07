"use client";

import { TrendingUp, CreditCard, AlertTriangle, ArrowUpRight } from "lucide-react";

export default function CeoDashboard() {
  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800">Laporan Strategis CEO</h1>
        <p className="text-slate-500 text-sm mt-1">Ringkasan performa finansial dan operasional S-LOG.</p>
      </div>
      
      {/* Big Finance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="bg-slate-800 p-8 rounded-3xl text-white shadow-xl relative overflow-hidden">
          {/* Ornamen background */}
          <div className="absolute right-0 top-0 w-32 h-32 bg-white opacity-5 rounded-full -translate-y-1/2 translate-x-1/3"></div>
          
          <p className="text-slate-400 text-sm font-medium uppercase tracking-wider mb-2">Total Piutang Berjalan</p>
          <h2 className="text-4xl lg:text-5xl font-bold">Rp 2.45B</h2>
          
          <div className="mt-6 flex items-center gap-2 text-sm">
            <span className="bg-emerald-500/20 text-emerald-400 px-2 py-1 rounded flex items-center gap-1 font-medium">
              <TrendingUp size={14} /> +12.5%
            </span>
            <span className="text-slate-400">dibandingkan bulan lalu</span>
          </div>
        </div>

        <div className="bg-white p-8 rounded-3xl border border-slate-100 shadow-sm flex flex-col justify-center relative">
          <p className="text-slate-500 text-sm font-bold uppercase tracking-wider mb-2">Kolektibilitas Angsuran</p>
          <div className="flex items-end gap-3">
            <span className="text-5xl font-black text-slate-800">98.2%</span>
            <span className="text-emerald-500 font-bold mb-2">Sangat Sehat</span>
          </div>
          
          <div className="mt-6 flex items-center justify-between border-t border-slate-100 pt-4">
             <div className="flex items-center gap-2 text-slate-600">
               <AlertTriangle size={16} className="text-orange-500" />
               <span className="text-sm font-medium">Kredit Macet: 1.8%</span>
             </div>
             <button className="text-sm font-bold text-blue-600 flex items-center hover:text-blue-800">
               Lihat Detail <ArrowUpRight size={16} />
             </button>
          </div>
        </div>
      </div>

      {/* Rangkuman Motor Terlaris */}
      <div className="bg-white rounded-3xl border border-slate-100 shadow-sm p-8">
        <h2 className="font-bold text-slate-800 mb-6 flex items-center gap-2">
          <CreditCard size={20} className="text-purple-500" />
          Unit Terlaris Bulan Ini
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-xs text-slate-400 font-bold mb-1">Peringkat 1</p>
            <h4 className="font-bold text-slate-800">Honda Beat CBS</h4>
            <p className="text-xl font-black text-blue-600 mt-2">124 <span className="text-sm text-slate-500 font-medium">Unit</span></p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-xs text-slate-400 font-bold mb-1">Peringkat 2</p>
            <h4 className="font-bold text-slate-800">Yamaha NMAX Connected</h4>
            <p className="text-xl font-black text-blue-600 mt-2">89 <span className="text-sm text-slate-500 font-medium">Unit</span></p>
          </div>
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100">
            <p className="text-xs text-slate-400 font-bold mb-1">Peringkat 3</p>
            <h4 className="font-bold text-slate-800">Honda Scoopy</h4>
            <p className="text-xl font-black text-blue-600 mt-2">65 <span className="text-sm text-slate-500 font-medium">Unit</span></p>
          </div>
        </div>
      </div>
    </div>
  );
}