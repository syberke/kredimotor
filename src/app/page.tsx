"use client";

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { 
  Bike, ArrowRight, ShieldCheck, Zap, 
  CreditCard, ChevronRight, Star, Play 
} from 'lucide-react';

export default function KrediMotorLanding() {
  return (
    <div className="min-h-screen bg-slate-50 text-gray-800 font-sans relative overflow-hidden selection:bg-blue-200 selection:text-blue-900">
      
      {/* Background Ornaments (Blobs) */}
      <div className="absolute top-0 left-0 w-[600px] h-[600px] bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-x-1/3 -translate-y-1/3 z-0"></div>
      <div className="absolute top-1/2 right-0 w-[500px] h-[500px] bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-50 translate-x-1/3 -translate-y-1/2 z-0"></div>

      {/* Navbar Glassmorphism */}
      <nav className="fixed w-full z-50 top-0 border-b border-slate-200 bg-white/80 backdrop-blur-xl">
        <div className="max-w-7xl mx-auto px-6 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-10 h-10 bg-blue-600 rounded-full shadow-md shadow-blue-200">
              <span className="text-white font-bold text-sm tracking-wider">KM</span>
            </div>
            <span className="text-2xl font-black text-gray-800 tracking-tight">
              Kredi<span className="text-blue-600">Motor</span>
            </span>
          </div>
          
          {/* Menu Links */}
          <div className="hidden md:flex items-center gap-10 text-sm font-semibold text-gray-500">
            <Link href="#katalog" className="hover:text-blue-600 transition-colors">Koleksi Motor</Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">Simulasi Kredit</Link>
            <Link href="#" className="hover:text-blue-600 transition-colors">Dealer Kami</Link>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <Link href="/login" className="text-sm font-bold text-blue-600 hover:text-blue-800 transition-colors px-4">
              Login
            </Link>
            <Link href="/register" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-md shadow-blue-200">
              Daftar Sekarang
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-40 pb-20 z-10">
        <div className="max-w-7xl mx-auto px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-100 px-4 py-2 rounded-full mb-6">
              <Zap className="w-4 h-4 text-blue-600 fill-blue-600" />
              <span className="text-xs font-bold text-blue-700 tracking-wide">Persetujuan Kurang Dari 24 Jam</span>
            </div>
            <h1 className="text-5xl md:text-7xl font-extrabold leading-[1.1] tracking-tight text-gray-900 mb-6">
              Wujudkan Motor Impian <br /> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">Lebih Cepat.</span>
            </h1>
            <p className="text-gray-500 text-lg max-w-md mb-10 leading-relaxed">
              Dominasi jalanan dengan motor impian Anda. Proses kredit transparan, bunga ringan, dan verifikasi secepat kilat.
            </p>
            <div className="flex flex-wrap gap-4">
              <button className="bg-blue-600 text-white px-8 py-4 rounded-xl font-bold flex items-center gap-3 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-200 transition-all">
                Ajukan Sekarang 
                <ArrowRight className="w-5 h-5" />
              </button>
              <button className="flex items-center gap-3 font-bold text-gray-700 px-6 py-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 transition-colors">
                <Play className="w-4 h-4 text-blue-600 fill-blue-600" />
                Cara Kerja
              </button>
            </div>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <img 
              src="https://images.unsplash.com/photo-1568772585407-9361f9bf3c87?q=80&w=1000" 
              alt="Superbike" 
              className="w-full h-auto object-contain drop-shadow-2xl rounded-3xl"
            />
            {/* Floating Stats Card */}
            <div className="absolute -bottom-6 -left-6 bg-white/90 backdrop-blur-xl border border-slate-100 p-6 rounded-3xl shadow-xl max-w-[220px]">
              <div className="flex gap-1 mb-2">
                {[1,2,3,4,5].map((i) => <Star key={i} className="w-4 h-4 text-orange-400 fill-orange-400" />)}
              </div>
              <p className="text-xs font-bold text-gray-400 mb-1">Layanan Terpercaya</p>
              <p className="text-lg font-black text-gray-800 leading-tight">Dipercaya oleh 10.000+ Pengendara</p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Brands */}
      <section className="py-16 border-y border-slate-200 bg-white/50 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-wrap justify-between items-center gap-8 opacity-40 grayscale hover:grayscale-0 transition-all duration-500">
            <span className="text-3xl font-black text-slate-800 tracking-tighter">YAMAHA</span>
            <span className="text-3xl font-black text-slate-800 tracking-tighter">HONDA</span>
            <span className="text-3xl font-black text-slate-800 tracking-tighter">KAWASAKI</span>
            <span className="text-3xl font-black text-slate-800 tracking-tighter">DUCATI</span>
            <span className="text-3xl font-black text-slate-800 tracking-tighter">BMW</span>
          </div>
        </div>
      </section>

      {/* Katalog / Koleksi */}
      <section id="katalog" className="py-24 relative z-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex flex-col md:flex-row md:justify-between md:items-end mb-16 gap-6">
            <div>
              <h2 className="text-sm font-bold text-blue-600 mb-2 uppercase tracking-widest">Koleksi Terbaru</h2>
              <h3 className="text-4xl md:text-5xl font-black text-gray-900 tracking-tight">Pilih Motor <span className="text-blue-600">Impianmu</span></h3>
            </div>
            <button className="text-sm font-bold text-gray-500 border-b-2 border-transparent hover:border-blue-600 hover:text-blue-600 transition-all pb-1 self-start md:self-auto">
              Lihat Semua Inventaris
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { name: "Kawasaki Ninja ZX-10R", price: "Rp 560 Juta", img: "https://images.unsplash.com/photo-1614165933026-0750f6029ef2?q=80&w=800" },
              { name: "Ducati Panigale V4", price: "Rp 800 Juta", img: "https://images.unsplash.com/photo-1591637333184-19aa84b3e01f?q=80&w=800" },
              { name: "Yamaha YZF R1", price: "Rp 605 Juta", img: "https://images.unsplash.com/photo-1621259182978-fbf93132d53d?q=80&w=800" },
            ].map((bike, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -8 }}
                className="group bg-white rounded-[2rem] p-6 border border-slate-100 shadow-lg hover:shadow-2xl transition-all"
              >
                <div className="flex justify-between items-start mb-6">
                  <h4 className="text-xl font-bold text-gray-900 leading-tight w-2/3">{bike.name}</h4>
                  <span className="text-blue-600 font-bold bg-blue-50 px-3 py-1 rounded-lg text-sm">{bike.price}</span>
                </div>
                
                <div className="overflow-hidden rounded-2xl mb-6">
                  <img src={bike.img} alt={bike.name} className="w-full h-48 object-cover group-hover:scale-110 transition-transform duration-700" />
                </div>
                
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Max Speed</p>
                    <p className="font-bold text-gray-800 text-sm">299 km/h</p>
                  </div>
                  <div className="bg-slate-50 rounded-xl p-3 text-center border border-slate-100">
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-1">Engine</p>
                    <p className="font-bold text-gray-800 text-sm">998 cc</p>
                  </div>
                </div>
                
                <button className="w-full py-3.5 rounded-xl bg-blue-50 text-blue-600 font-bold hover:bg-blue-600 hover:text-white transition-colors shadow-sm">
                  Cek Detail Kredit
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats / Process */}
      <section className="py-20 bg-gradient-to-r from-blue-600 to-indigo-700 text-white relative z-10 rounded-t-[3rem]">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-2 md:grid-cols-4 gap-12">
          {[
            { icon: <ShieldCheck className="w-8 h-8" />, label: "Keamanan Terjamin", val: "100%" },
            { icon: <CreditCard className="w-8 h-8" />, label: "Uang Muka", val: "Mulai 10%" },
            { icon: <Zap className="w-8 h-8" />, label: "Persetujuan", val: "24 Jam" },
            { icon: <ChevronRight className="w-8 h-8" />, label: "Tenor Fleksibel", val: "Maks 60 Bln" },
          ].map((stat, i) => (
            <div key={i} className="flex flex-col items-center text-center">
              <div className="mb-4 bg-white/10 p-4 rounded-2xl backdrop-blur-sm">{stat.icon}</div>
              <p className="text-3xl font-black mb-1">{stat.val}</p>
              <p className="text-sm font-medium text-blue-100">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-white relative z-10">
        <div className="max-w-7xl mx-auto px-6 text-center">
          <div className="flex justify-center items-center gap-3 mb-6">
            <div className="flex items-center justify-center w-8 h-8 bg-blue-600 rounded-full">
              <span className="text-white font-bold text-xs tracking-wider">KM</span>
            </div>
            <span className="text-xl font-black tracking-tight">
              Kredi<span className="text-blue-500">Motor</span>
            </span>
          </div>
          <p className="text-gray-400 text-sm max-w-sm mx-auto mb-8 leading-relaxed">
            Sistem Manajemen Kredit Motor Terpercaya dan Terdepan di Indonesia.
            
          </p>
          <div className="flex flex-wrap justify-center gap-8 text-sm font-medium text-gray-400">
            <Link href="#" className="hover:text-white transition-colors">Kebijakan Privasi</Link>
            <Link href="#" className="hover:text-white transition-colors">Syarat & Ketentuan</Link>
            <Link href="#" className="hover:text-white transition-colors">Bantuan Layanan</Link>
          </div>
          <p className="mt-12 text-xs text-gray-600">
            &copy; {new Date().getFullYear()} KrediMotor. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}