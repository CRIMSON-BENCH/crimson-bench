import { createClient } from '@supabase/supabase-js'

// Public, browser-safe values (anon key is meant to be exposed; RLS protects data).
// Override via env if the backend ever moves.
const url = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://vlnnwejmnmccpqvznsbw.supabase.co'
const anon =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ||
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InZsbm53ZWptbm1jY3Bxdnpuc2J3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODAzNDYzNzgsImV4cCI6MjA5NTkyMjM3OH0.Kz_KBrT02YhGJgPQMMYNseeomBG3HaCxwX6H74fzJg8'

export const supabase = createClient(url, anon, {
  auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true },
})
