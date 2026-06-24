import { createClient } from '@supabase/supabase-js';

const url = ((import.meta.env.APP_SUPABASE_URL as string) || (import.meta.env.VITE_SUPABASE_URL as string) || '').trim();
const key = ((import.meta.env.APP_SUPABASE_ANON_KEY as string) || (import.meta.env.VITE_SUPABASE_ANON_KEY as string) || '').trim();

export const isSupabaseConfigured = Boolean(url && key);
export const supabase = isSupabaseConfigured ? createClient(url, key) : null;
