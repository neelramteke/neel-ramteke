import { type NextRequest, NextResponse } from "next/server"
import { createAdminUser } from "@/lib/supabase-auth"

export async function POST(request: NextRequest) {
  try {
    // This endpoint should be protected in production
    const { email, password, name } = await request.json()

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Email, password, and name are required" }, { status: 400 })
    }

    const user = await createAdminUser(email, password, name)

    return NextResponse.json({
      success: true,
      message: "Admin user created successfully",
      userId: user.id,
    })
  } catch (error: any) {
    console.error("Create admin error:", error)
    return NextResponse.json({ error: error.message || "Failed to create admin user" }, { status: 500 })
  }
}
