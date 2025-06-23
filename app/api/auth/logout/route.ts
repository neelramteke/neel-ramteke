import { type NextRequest, NextResponse } from "next/server"
import { createServerComponentClient } from "@/lib/supabase-auth"

export async function POST(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient()

    // Sign out from Supabase
    await supabase.auth.signOut()

    const response = NextResponse.json({ success: true })

    // Clear cookies
    response.cookies.delete("sb-access-token")
    response.cookies.delete("sb-refresh-token")

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
