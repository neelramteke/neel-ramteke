"use server"

/**
 * Server-side bridge that updates the `personal_info` row
 * using the service-role Supabase client (bypasses RLS).
 */
import { updatePersonalInfo } from "@/lib/supabase-admin"

export async function updatePersonalInfoServer(payload: any) {
  // `payload` is already fully serialisable (plain JSON)
  await updatePersonalInfo(payload)
}
