// supabase/client.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://gmeynhwnsocfsliwhcqw.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'processo . env . SUPABASE_KEY'
if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Variáveis de ambiente NEXT_PUBLIC_SUPABASE_URL e NEXT_PUBLIC_SUPABASE_ANON_KEY não configuradas!'
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
