// src/services/auth.service.ts
import { supabase } from "@/lib/supabase";
import { insertUserAdmin } from "@/actions/user.action"; // Import Server Action

/* ================= REGISTER ================= */
export async function register(
  email: string,
  password: string,
  nama: string,
  role: string
) {
  // 1. Buat user di sistem Auth (Pakai client biasa)
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  });

  if (error) return { error };

  // 2. Jika sukses buat akun, masukkan profil ke tabel users pakai Service Role
  if (data.user) {
    const { error: insertError } = await insertUserAdmin(
      data.user.id,
      email,
      nama,
      role
    );

    if (insertError) {
      console.error("Gagal insert pakai admin role");
    }
  }

  return { data };
}

/* ================= LOGIN ================= */
export async function login(email: string, password: string) {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) return { error };

  const userId = data.user?.id;

  // Cek data user di tabel 'users' untuk mendapatkan role-nya
  const { data: userData, error: userError } = await supabase
    .from("users")
    .select("role")
    .eq("id", userId)
    .single();

  if (userError || !userData) {
    console.error("Error dari RLS Supabase:", userError.message);
    return { error: { message: "Akun tidak ditemukan di database internal." } };
  }

  // Kembalikan role asli dari database (admin, marketing, atau ceo)
  return { role: userData.role };
}

/* ================= LOGOUT ================= */
export async function logout() {
  return await supabase.auth.signOut();
}