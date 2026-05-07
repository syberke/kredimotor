"use client";

import Link from "next/link";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen bg-white shadow p-4">
      <h2 className="font-bold text-lg mb-6">Kredit Motor</h2>

      <nav className="space-y-2">
        <Link href="/pelanggan" className="block hover:text-blue-600">
          Dashboard
        </Link>

        <Link href="/pelanggan/motor" className="block hover:text-blue-600">
          Motor
        </Link>

        <Link href="/pelanggan/kredit" className="block hover:text-blue-600">
          Kredit Saya
        </Link>
      </nav>
    </div>
  );
}