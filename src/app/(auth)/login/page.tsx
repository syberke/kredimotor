"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/services/auth.service";
import Swal from "sweetalert2";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    const { role, error } = await login(email, password);

    setIsLoading(false); // Matikan loading setelah proses selesai

    if (error) {
      Swal.fire("Error", error.message, "error");
    } else {
      Swal.fire({
        title: "Success",
        text: `Login berhasil sebagai ${role.toUpperCase()}`,
        icon: "success",
        timer: 1500,
        showConfirmButton: false,
      }).then(() => {
        // Arahkan routing sesuai dengan role internal
        if (role === "admin") {
          router.push("/admin/");
        } else if (role === "ceo") {
          router.push("/ceo/");
        } else if (role === "marketing") {
          router.push("/marketing/");
        } else {
          router.push("/dashboard"); // Fallback routing
        }
      });
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 p-4 font-sans relative overflow-hidden">
      {/* Background Ornaments (Blobs) */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 -translate-x-1/2 -translate-y-1/2"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-300 rounded-full mix-blend-multiply filter blur-3xl opacity-40 translate-x-1/3 translate-y-1/3"></div>

      {/* Card Form */}
      <div className="bg-white w-full max-w-md rounded-[2rem] shadow-2xl overflow-hidden relative z-10">
        {/* Header / Logo Area */}
        <div className="pt-10 px-8 pb-4 text-center border-b border-gray-100">
          <div className="mx-auto flex items-center justify-center">
            <img
              src="/logo_slog_nobg.png"
              alt="Logo"
              className="h-40 w-auto object-contain" 
            />
          </div>
        </div>

        {/* Form Area */}
        <div className="p-8">
          <form onSubmit={handleLogin} className="space-y-5">
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
              <input
                type="email"
                required
                className="w-full bg-slate-50 border border-slate-200 text-gray-800 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent outline-none transition-all"
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
                className="w-full bg-slate-50 border border-slate-200 text-gray-800 px-4 py-3 rounded-xl focus:ring-2 focus:ring-blue-500 focus:bg-white focus:border-transparent outline-none transition-all"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between pt-1">
              <label className="flex items-center text-sm text-gray-500 cursor-pointer hover:text-gray-700 transition-colors">
                <input type="checkbox" className="mr-2 w-4 h-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500 cursor-pointer" />
                Remember me
              </label>
              <a href="#" className="text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors">
                Forgot Password?
              </a>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-blue-200 disabled:opacity-70 disabled:cursor-not-allowed mt-4"
            >
              {isLoading ? "Memproses..." : "Sign In"}
            </button>
          </form>

          {/* Footer Area */}
          <div className="mt-8 text-center">
            <p className="text-sm text-gray-500">
              Belum punya akun?{" "}
              <Link href="/register" className="font-bold text-blue-600 hover:text-blue-800 transition-colors">
                Daftar sekarang
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}