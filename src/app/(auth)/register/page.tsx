"use client";

import React, { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { register } from "@/services/auth.service";
import Swal from "sweetalert2";

export default function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [nama, setNama] = useState("");
  const [role, setRole] = useState("marketing"); 
  const [isLoading, setIsLoading] = useState(false);
  
  // State baru untuk mengontrol buka-tutup custom dropdown
  const [isRoleOpen, setIsRoleOpen] = useState(false);
  
  const router = useRouter();

  // Daftar opsi role biar gampang di-map
  const roleOptions = [
    { value: "marketing", label: "Marketing" },
    { value: "admin", label: "Admin" },
    { value: "ceo", label: "CEO" },
  ];

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const { error } = await register(email, password, nama, role);

    setIsLoading(false);

    if (error) {
      Swal.fire("Error", error.message, "error");
    } else {
      Swal.fire({
        title: "Success",
        text: `Akun staff (${role.toUpperCase()}) berhasil dibuat! Silakan login.`,
        icon: "success",
        timer: 2000,
        showConfirmButton: false,
      }).then(() => {
        router.push("/login");
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans relative overflow-hidden">
      
      {/* Background Ornaments (Blobs) */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-rose-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 translate-x-1/3 -translate-y-1/3"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-orange-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 -translate-x-1/3 translate-y-1/3"></div>

      {/* Card Form */}
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden relative z-10 my-8">
        
        {/* Header / Logo Area */}
        <div className="pt-10 px-8 pb-4 text-center border-b border-gray-100">
          <div className="mx-auto flex items-center justify-center">
            <img
              src="/logo_slog_nobg.png"
              alt="Logo"
              className="h-32 w-auto object-contain" 
            />
          </div>
          <h2 className="text-xl font-bold text-gray-700 mt-2">Daftar Akun Staff</h2>
        </div>

        {/* Form Area */}
        <div className="p-8">
          <form onSubmit={handleRegister} className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Nama Lengkap</label>
              <input
                type="text"
                required
                placeholder="Masukkan nama lengkap"
                className="w-full bg-slate-50 border border-slate-200 text-gray-800 px-4 py-3 rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white focus:border-transparent outline-none transition-all"
                value={nama}
                onChange={(e) => setNama(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                className="w-full bg-slate-50 border border-slate-200 text-gray-800 px-4 py-3 rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white focus:border-transparent outline-none transition-all"
                placeholder="email@contoh.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Password</label>
              <input
                type="password"
                required
                className="w-full bg-slate-50 border border-slate-200 text-gray-800 px-4 py-3 rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {/* CUSTOM DROPDOWN DIMULAI DARI SINI */}
            <div className="relative">
              <label className="block text-sm font-bold text-gray-700 mb-1">Posisi / Role</label>
              
              {/* Tombol pemicu dropdown */}
              <button
                type="button"
                onClick={() => setIsRoleOpen(!isRoleOpen)}
                className="w-full bg-slate-50 border border-slate-200 text-gray-800 px-4 py-3 rounded-xl focus:ring-2 focus:ring-rose-500 focus:bg-white outline-none transition-all flex justify-between items-center"
              >
                <span>
                  {roleOptions.find((r) => r.value === role)?.label || "Pilih Role"}
                </span>
                
                {/* Ikon panah yang akan berputar saat diklik */}
                <svg 
                  className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${isRoleOpen ? 'rotate-180' : ''}`} 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {/* Kotak pilihan (muncul kalau isRoleOpen = true) */}
              {isRoleOpen && (
                <>
                  {/* Invisible overlay buat nutup dropdown kalau user klik di luar */}
                  <div 
                    className="fixed inset-0 z-10" 
                    onClick={() => setIsRoleOpen(false)}
                  ></div>

                  {/* List pilihan */}
                  <div className="absolute z-20 w-full mt-2 bg-white border border-slate-100 rounded-xl shadow-xl overflow-hidden transform opacity-100 scale-100 transition-all">
                    {roleOptions.map((option) => (
                      <div
                        key={option.value}
                        onClick={() => {
                          setRole(option.value);
                          setIsRoleOpen(false); // Tutup dropdown pas udah milih
                        }}
                        className={`px-4 py-3 cursor-pointer transition-colors flex items-center ${
                          role === option.value 
                            ? 'bg-rose-50 text-rose-600 font-bold' // Highlight yang terpilih
                            : 'text-gray-700 hover:bg-slate-50'
                        }`}
                      >
                        {option.label}
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
            {/* AKHIR CUSTOM DROPDOWN */}

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-rose-500 hover:bg-rose-600 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-rose-200 disabled:opacity-70 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? "Memproses..." : "Register Staff"}
            </button>
          </form>

          {/* Footer Area */}
          <div className="mt-8 text-center border-t border-gray-100 pt-6">
            <p className="text-sm text-gray-500">
              Sudah punya akun?{" "}
              <Link href="/login" className="font-bold text-rose-500 hover:text-rose-700 transition-colors">
                Sign In di sini
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}