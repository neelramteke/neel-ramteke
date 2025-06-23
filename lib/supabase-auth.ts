import { createClient } from "@supabase/supabase-js"
import { cookies } from "next/headers"

// Client-side Supabase client
export const createClientComponentClient = () => {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)
}

// Server-side Supabase client
export const createServerComponentClient = async () => {
  const cookieStore = await cookies()

  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, {
    cookies: {
      get(name: string) {
        return cookieStore.get(name)?.value
      },
    },
  })
}

// Admin client with service role
export const createAdminClient = () => {
  return createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.SUPABASE_SERVICE_ROLE_KEY!)
}

export interface AdminProfile {
  id: string
  email: string
  name: string
  role: string
  is_active: boolean
}

export async function getAdminProfile(userId: string): Promise<AdminProfile | null> {
  const supabase = createAdminClient()

  const { data, error } = await supabase
    .from("admin_profiles")
    .select("*")
    .eq("id", userId)
    .eq("is_active", true)
    .single()

  if (error || !data) {
    return null
  }

  return data
}

export async function createAdminUser(email: string, password: string, name: string) {
  const supabase = createAdminClient()

  // Create user in Supabase Auth
  const { data: authData, error: authError } = await supabase.auth.admin.createUser({
    email,
    password,
    user_metadata: { name },
    email_confirm: true,
  })

  if (authError) {
    throw new Error(`Failed to create user: ${authError.message}`)
  }

  return authData.user
}
