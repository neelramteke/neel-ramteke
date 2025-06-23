/**
 * Browser-safe Supabase client for portfolio data fetching
 */
import { createClient, type PostgrestSingleResponse } from "@supabase/supabase-js"
import type { Database } from "./types_db"

export const supabase = createClient<Database>(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string,
  {
    auth: { persistSession: true },
  },
)

/* ───────────────────────────────────────── helpers ─────────────────── */
async function safeSelect<T>(table: string, orderBy?: { column: string; ascending?: boolean }): Promise<T[]> {
  let query = supabase.from<T>(table).select("*")
  if (orderBy) query = query.order(orderBy.column, { ascending: orderBy.ascending })

  const { data, error } = (await query) as PostgrestSingleResponse<T[]>

  if (error?.code === "42P01") return []
  if (error) throw error
  return data ?? []
}

async function safeSelectSingle<T>(table: string): Promise<T | null> {
  const { data, error } = await supabase.from<T>(table).select("*").single()

  if (error?.code === "42P01") return null
  if (error && error.code !== "PGRST116") throw error
  return data as T | null
}

/* ───────────────────────────── public API (read-only) ──────────────── */
export const getSiteSettings = () => safeSelectSingle<any>("site_settings")
export const getHeroSection = () => safeSelectSingle<any>("hero_section")
export const getAboutSection = () => safeSelectSingle<any>("about_section")

export const getPersonalInfo = async () => {
  const { data, error } = await supabase.from("personal_info").select("*")

  if (error?.code === "42P01") return null
  if (error) throw error

  return (data && data.length > 0 ? data[0] : null) as typeof data extends (infer U)[] ? U : null
}

export const getSkills = () => safeSelect<any>("skills", { column: "order_index" })
export const getTools = () => safeSelect<any>("tools", { column: "order_index" })
export const getExperiences = () => safeSelect<any>("experiences", { column: "order_index" })
export const getProducts = () => safeSelect<any>("products", { column: "order_index" })
export const getProjects = () => safeSelect<any>("projects", { column: "order_index" })
export const getCaseStudies = () => safeSelect<any>("case_studies", { column: "order_index" })
export const getEducation = () => safeSelect<any>("education", { column: "order_index" })
export const getCertifications = () => safeSelect<any>("certifications", { column: "order_index" })
export const getAnimatedStats = () => safeSelect<any>("animated_stats", { column: "order_index" })

// Contact form submission
export const submitContactMessage = async (message: any) => {
  const { data, error } = await supabase.from("contact_messages").insert(message).select().single()
  if (error) throw error
  return data
}
