// src/lib/supabase-admin.ts
import { createClient } from '@supabase/supabase-js';

// Perhatikan: Kita pakai process.env.SUPABASE_SERVICE_ROLE_KEY (Tanpa NEXT_PUBLIC)
export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! 
);