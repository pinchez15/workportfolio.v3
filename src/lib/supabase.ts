import { createClient } from '@supabase/supabase-js';
import { createBrowserClient } from '@supabase/ssr';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://quhyropwodgwdqykzmtj.supabase.co';
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InF1aHlyb3B3b2Rnd2RxeWt6bXRqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI1NTQ0NjksImV4cCI6MjA2ODEzMDQ2OX0.t30RznWb31d1A-9_TksgAsuZPhm0zVQoGyM_f-w4kaU';



export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export function createClientComponentClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
}

export function createServerComponentClient() {
  return createBrowserClient(supabaseUrl, supabaseAnonKey);
} 