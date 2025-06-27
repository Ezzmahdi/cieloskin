import { createClient, type SupabaseClient } from "@supabase/supabase-js"

/**
 * Returns a singleton Supabase client.
 * – In production you **must** provide NEXT_PUBLIC_SUPABASE_URL
 *   and NEXT_PUBLIC_SUPABASE_ANON_KEY.
 * – During local/preview (when env vars are often undefined) we
 *   create a mock client that returns empty data.
 */

let supabaseClient: SupabaseClient | null = null

export function getSupabaseClient() {
  if (supabaseClient) return supabaseClient

  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    /* eslint-disable no-console */
    console.warn(
      "⚠️  Supabase env vars are missing – using mock client. " +
        "Add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY " +
        "to .env.local for full functionality.",
    )
    
    // Create a mock client with a non-existent URL to prevent actual requests
    supabaseClient = createClient("https://mock.supabase.co", "mock-key")
    return supabaseClient
  }

  supabaseClient = createClient(supabaseUrl, supabaseAnonKey)
  return supabaseClient
}

export const supabase = getSupabaseClient()

// ---------- Types ----------
export type Product = {
  id: string
  name: string
  price: number
  description: string
  short_description: string
  category: string
  image_url: string
  slug: string
  whatsapp_message: string
  created_at: string
  updated_at: string
}

export type Category = {
  id: string
  name: string
  slug: string
}
