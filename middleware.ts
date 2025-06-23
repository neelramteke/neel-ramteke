import { type NextRequest, NextResponse } from "next/server"

export async function middleware(request: NextRequest) {
  // Only protect /superadmin routes (except login)
  if (request.nextUrl.pathname.startsWith("/superadmin") && !request.nextUrl.pathname.includes("/login")) {
    try {
      // Check for session by calling our session API
      const sessionResponse = await fetch(new URL("/api/auth/session", request.url), {
        headers: {
          cookie: request.headers.get("cookie") || "",
        },
      })

      const sessionData = await sessionResponse.json()

      if (!sessionData.user) {
        return NextResponse.redirect(new URL("/superadmin/login", request.url))
      }
    } catch (error) {
      return NextResponse.redirect(new URL("/superadmin/login", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/superadmin/:path*"],
}
