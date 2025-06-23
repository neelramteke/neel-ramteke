import { type NextRequest, NextResponse } from "next/server"
import { createServerComponentClient, getAdminProfile } from "@/lib/supabase-auth"

export async function GET(request: NextRequest) {
  try {
    const supabase = await createServerComponentClient()

    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user) {
      return NextResponse.json({ user: null })
    }

    // Get admin profile
    const profile = await getAdminProfile(user.id)

    if (!profile) {
      return NextResponse.json({ user: null })
    }

    return NextResponse.json({
      user: {
        id: user.id,
        email: user.email,
        name: profile.name,
        role: profile.role,
      },
    })
  } catch (error) {
    console.error("Session error:", error)
    return NextResponse.json({ user: null })
  }
}
