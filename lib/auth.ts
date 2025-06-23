import { createClient } from "@supabase/supabase-js"
import bcrypt from "bcryptjs"

const supabase = createClient(process.env.SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)

export interface AdminUser {
  id: string
  email: string
  name: string
  role: string
  is_active: boolean
}

export async function authenticateAdmin(email: string, password: string): Promise<AdminUser | null> {
  try {
    const { data: user, error } = await supabase
      .from("admin_users")
      .select("*")
      .eq("email", email)
      .eq("is_active", true)
      .single()

    if (error || !user) {
      return null
    }

    const isValidPassword = await bcrypt.compare(password, user.password_hash)
    if (!isValidPassword) {
      return null
    }

    // Update last login
    await supabase.from("admin_users").update({ last_login: new Date().toISOString() }).eq("id", user.id)

    return {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      is_active: user.is_active,
    }
  } catch (error) {
    console.error("Authentication error:", error)
    return null
  }
}

export async function createAdminUser(email: string, password: string, name: string, role = "admin") {
  try {
    const passwordHash = await bcrypt.hash(password, 10)

    const { data, error } = await supabase
      .from("admin_users")
      .insert({
        email,
        password_hash: passwordHash,
        name,
        role,
      })
      .select()
      .single()

    if (error) throw error
    return data
  } catch (error) {
    console.error("Error creating admin user:", error)
    throw error
  }
}
