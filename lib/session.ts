import { cookies } from "next/headers"
import { SignJWT, jwtVerify } from "jose"
import type { AdminUser } from "./auth"

const secretKey = process.env.JWT_SECRET || "your-secret-key-change-in-production"
const encodedKey = new TextEncoder().encode(secretKey)

export async function createSession(user: AdminUser) {
  const payload = {
    userId: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
  }

  const session = await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("24h")
    .sign(encodedKey)

  const cookieStore = await cookies()
  cookieStore.set("admin-session", session, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24, // 24 hours
  })
}

export async function getSession(): Promise<AdminUser | null> {
  try {
    const cookieStore = await cookies()
    const session = cookieStore.get("admin-session")?.value

    if (!session) return null

    const { payload } = await jwtVerify(session, encodedKey)
    return payload as AdminUser
  } catch (error) {
    return null
  }
}

export async function deleteSession() {
  const cookieStore = await cookies()
  cookieStore.delete("admin-session")
}
