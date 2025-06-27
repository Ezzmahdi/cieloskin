import { NextResponse } from "next/server"
import { supabaseServer } from "@/lib/supabase-server"

// Helper to return JSON with proper status
function json(data: unknown, status = 200) {
  return NextResponse.json(data, { status })
}

// CREATE ──────────────────────────────────────────────────────────
export async function POST(req: Request) {
  const body = await req.json()
  const { error } = await supabaseServer
    .from("products")
    .insert([{ ...body, created_at: new Date().toISOString(), updated_at: new Date().toISOString() }])

  if (error) return json({ error: error.message }, 500)
  return json({ success: true })
}

// UPDATE ──────────────────────────────────────────────────────────
export async function PUT(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return json({ error: "Missing product id" }, 400)

  const body = await req.json()
  const { error } = await supabaseServer
    .from("products")
    .update({ ...body, updated_at: new Date().toISOString() })
    .eq("id", id)

  if (error) return json({ error: error.message }, 500)
  return json({ success: true })
}

// DELETE ──────────────────────────────────────────────────────────
export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url)
  const id = searchParams.get("id")
  if (!id) return json({ error: "Missing product id" }, 400)

  const { error } = await supabaseServer.from("products").delete().eq("id", id)

  if (error) return json({ error: error.message }, 500)
  return json({ success: true })
}
