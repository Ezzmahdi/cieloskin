import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

// Helper to return JSON with proper status
function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

// GET settings from admins singleton row, return as key/value array for backward compatibility
export async function GET() {
  try {
    // Ensure one admins row exists or read the first
    const { data, error } = await supabaseServer
      .from("admins")
      .select("id, whatsapp_number, business_name, business_email")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle()

    if (error && error.code !== "PGRST116") { // ignore no rows error
      console.error("Admins fetch error:", error)
      return json({ error: error.message }, 500)
    }

    const settingsArray = [
      { key: "whatsapp_number", value: data?.whatsapp_number || "" },
      { key: "business_name", value: data?.business_name || "" },
      { key: "business_email", value: data?.business_email || "" },
    ]

    return json(settingsArray)
  } catch (error) {
    console.error("Settings API error:", error)
    return json({ error: "Internal server error" }, 500)
  }
}

// UPDATE setting: accepts { key, value } and upserts into admins singleton row
export async function PUT(req: Request) {
  try {
    const { key, value } = await req.json()

    if (!key || value === undefined || value === null || value.trim() === "") {
      return json({ error: "Missing key or empty value" }, 400)
    }

    console.log(`Updating admin field: ${key} = ${value}`)

    // Validate supported keys
    const allowed = ["whatsapp_number", "business_name", "business_email"]
    if (!allowed.includes(key)) {
      return json({ error: "Invalid setting key" }, 400)
    }

    // Fetch or create singleton row
    const { data: existing, error: fetchErr } = await supabaseServer
      .from("admins")
      .select("id")
      .order("created_at", { ascending: true })
      .limit(1)
      .maybeSingle()

    if (fetchErr && fetchErr.code !== "PGRST116") {
      console.error("Admins read error:", fetchErr)
      return json({ error: fetchErr.message }, 500)
    }

    const updates: Record<string, string> = { [key]: value.trim() }

    let upsertError
    if (existing?.id) {
      const { error } = await supabaseServer
        .from("admins")
        .update({ ...updates, updated_at: new Date().toISOString() })
        .eq("id", existing.id)
      upsertError = error ?? null
    } else {
      const { error } = await supabaseServer
        .from("admins")
        .insert({ ...updates })
      upsertError = error ?? null
    }

    if (upsertError) {
      console.error("Supabase error:", upsertError)
      return json({ error: upsertError.message }, 500)
    }

    console.log("Admin field updated successfully")
    return json({ success: true })
  } catch (error) {
    console.error("API error:", error)
    return json({ error: "Internal server error" }, 500)
  }
}
