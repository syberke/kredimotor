"use client";

import { Download, ArrowRight } from "lucide-react";
import { useState } from "react";

export interface DashboardStats {
  totalPengajuan: number;
  totalKreditAktif: number;
  totalKreditLunas: number;
  totalKreditMacet: number;
  totalMotor: number;
  totalPelanggan: number;
  totalAngsuran: number;
}

export default function DashboardActions({ stats }: { stats: DashboardStats }) {
  const [isExporting, setIsExporting] = useState(false);

  // 📤 Export to CSV Handler
  const exportToCSV = () => {
    const headers = ["Metric", "Value", "Timestamp"];
    const rows = [
      ["Total Pengajuan", stats.totalPengajuan.toString(), new Date().toISOString()],
      ["Kredit Aktif", stats.totalKreditAktif.toString(), new Date().toISOString()],
      ["Kredit Lunas", stats.totalKreditLunas.toString(), new Date().toISOString()],
      ["Kredit Macet", stats.totalKreditMacet.toString(), new Date().toISOString()],
      ["Total Motor", stats.totalMotor.toString(), new Date().toISOString()],
      ["Total Pelanggan", stats.totalPelanggan.toString(), new Date().toISOString()],
      ["Total Angsuran (Rp)", stats.totalAngsuran.toString(), new Date().toISOString()],
    ];

    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `kredimotor-dashboard-${new Date().toISOString().split("T")[0]}.csv`);
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const handleExport = () => {
    setIsExporting(true);
    setTimeout(() => {
      exportToCSV();
      setIsExporting(false);
    }, 300);
  };

  const handleDetail = () => {
    // Navigate to angsuran page with current month filter
    const startOfMonth = new Date();
    startOfMonth.setDate(1);
    const dateFilter = `?from=${startOfMonth.toISOString().split("T")[0]}`;
    window.location.href = `/admin/angsuran${dateFilter}`;
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={handleExport}
        disabled={isExporting}
        className="px-5 py-2.5 bg-white/10 hover:bg-white/20 backdrop-blur rounded-xl text-sm font-medium transition border border-white/20 flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isExporting ? (
          <>
            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            Exporting...
          </>
        ) : (
          <>
            <Download size={16} /> Export
          </>
        )}
      </button>
      <button
        onClick={handleDetail}
        className="px-5 py-2.5 bg-white text-blue-600 hover:bg-blue-50 rounded-xl text-sm font-semibold transition shadow-lg flex items-center gap-2"
      >
        Detail <ArrowRight size={16} />
      </button>
    </div>
  );
}