"use client";

import { logout } from "@/services/auth.service";

export default function Navbar() {
  return (
    <div className="h-16 bg-white shadow flex items-center justify-end px-6">
      <button
        onClick={logout}
        className="bg-red-500 text-white px-4 py-1 rounded"
      >
        Logout
      </button>
    </div>
  );
}