// src/lib/supabase.ts
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
const supabaseServiceKey = import.meta.env.VITE_SUPABASE_SERVICE_ROLE_KEY;

console.log('🔍 Environment check:');
console.log('Supabase URL:', supabaseUrl);
console.log('Anon Key exists:', !!supabaseAnonKey);
console.log('Service Key exists:', !!supabaseServiceKey);

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('❌ Missing Supabase environment variables');
  throw new Error('Missing Supabase environment variables');
}

// Regular client for normal operations
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
  }
});

// Service role client for admin operations (bypasses RLS)
export const supabaseAdmin = supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
      global: {
        headers: {
          'apikey': supabaseServiceKey,
          'Authorization': `Bearer ${supabaseServiceKey}`,
        },
      },
    })
  : supabase;

console.log('✅ Supabase client initialized');
console.log('🔑 Admin client available:', !!supabaseServiceKey);

export interface DoctorProfile {
  id: string;
  user_id: string;
  full_name: string;
  date_of_birth: string | null;
  email: string;
  phone_number: string;
  gender: string | null;
  languages: string | null;
  specialization: string | null;
  qualification: string | null;
  registration_number: string | null;
  years_of_experience: string | null;
  about_me: string | null;
  consultation_fee: string | null;
  timings: string | null;
  role: 'doctor';
  is_verified: boolean;
  created_at: string;
  updated_at: string;
}