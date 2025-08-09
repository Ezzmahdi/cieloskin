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
    console.error(
      "❌ Supabase configuration error: Missing environment variables.\n" +
        "Please add NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY to your .env.local file.\n" +
        "Without these, the application cannot connect to Supabase."
    )
    
    // Throw an error instead of creating a mock client
    throw new Error(
      "Supabase configuration incomplete. Please check your environment variables."
    )
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
  how_to_use?: string
  category: string
  brand_id: string
  image_url: string
  slug: string
  whatsapp_message: string
  created_at: string
  updated_at: string
  // Relations
  brand?: Brand
}

export type Brand = {
  id: string
  name: string
  slug: string
  logo_url: string
  description?: string
  website_url?: string
  created_at: string
  updated_at: string
}

export type Category = {
  id: string
  name: string
  slug: string
}
