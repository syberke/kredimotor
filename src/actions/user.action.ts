// src/actions/user.action.ts
"use server";

import { supabaseAdmin } from "@/lib/supabase-admin";

export async function insertUserAdmin(id: string, email: string, name: string, role: string) {
  // Karena pakai supabaseAdmin, operasi ini akan menembus semua RLS!
  const { error } = await supabaseAdmin.from("users").insert({
    id,
    email,
    name,
    role
  });

  if (error) {
    console.error("Error insert admin:", error.message);
    return { error };
  }
  return { success: true };
}