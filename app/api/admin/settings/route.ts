import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

// Helper to return JSON with proper status
function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

// GET settings
export async function GET() {
  try {
    const { data, error } = await supabaseServer.from("settings").select("*")

    if (error) {
      console.error("Settings fetch error:", error)
      return json({ error: error.message }, 500)
    }

    // Always return an array, even if empty
    return json(data || [])
  } catch (error) {
    console.error("Settings API error:", error)
    return json({ error: "Internal server error" }, 500)
  }
}

// UPDATE setting
export async function PUT(req: Request) {
  try {
    const { key, value } = await req.json()

    if (!key || value === undefined || value === null || value.trim() === "") {
      return json({ error: "Missing key or empty value" }, 400)
    }

    console.log(`Updating setting: ${key} = ${value}`)

    const { data, error } = await supabaseServer
      .from("settings")
      .upsert(
        {
          key,
          value: value.trim(),
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "key",
        },
      )
      .select()

    if (error) {
      console.error("Supabase error:", error)
      return json({ error: error.message }, 500)
    }

    console.log("Setting updated successfully:", data)
    return json({ success: true, data })
  } catch (error) {
    console.error("API error:", error)
    return json({ error: "Internal server error" }, 500)
  }
}
