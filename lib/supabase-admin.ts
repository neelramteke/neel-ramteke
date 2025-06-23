/**
 * Server-side Supabase client and comprehensive admin functions
 * for complete portfolio CMS management
 */

import { createClient, type PostgrestSingleResponse } from "@supabase/supabase-js"
import type { Database } from "./types_db"

/* ───────────────────────── env-safe client ────────────────────────── */
const supabaseUrl = process.env.SUPABASE_URL ?? process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY ?? process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  throw new Error("Supabase credentials are missing. Check SUPABASE_URL / KEY env vars.")
}

const supabase = createClient<Database>(supabaseUrl, supabaseKey, {
  auth: { persistSession: false },
})

/* ────────────────────────────────────────── helpers ─────────────────── */
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

/* ───────────────────────────── Site Settings ─────────────────────────── */
export const getSiteSettings = () => safeSelectSingle<any>("site_settings")
export const updateSiteSettings = async (payload: any) => {
  const { error } = await supabase.from("site_settings").upsert(payload)
  if (error) throw error
}

/* ───────────────────────────── Hero Section ─────────────────────────── */
export const getHeroSection = () => safeSelectSingle<any>("hero_section")
export const updateHeroSection = async (payload: any) => {
  const { error } = await supabase.from("hero_section").upsert(payload)
  if (error) throw error
}

/* ───────────────────────────── About Section ─────────────────────────── */
export const getAboutSection = () => safeSelectSingle<any>("about_section")
export const updateAboutSection = async (payload: any) => {
  const { error } = await supabase.from("about_section").upsert(payload)
  if (error) throw error
}

/* ───────────────────────────── Personal Info ─────────────────────────── */
export const getPersonalInfo = async () => {
  const { data, error } = await supabase.from("personal_info").select("*")

  if (error?.code === "42P01") return null
  if (error) throw error

  return data && data.length > 0 ? (data[0] as (typeof data)[number]) : null
}

export const updatePersonalInfo = async (payload: any) => {
  const { error } = await supabase.from("personal_info").upsert(payload)
  if (error) throw error
}

/* ───────────────────────────── Skills ─────────────────────────── */
export const getSkills = () => safeSelect<any>("skills", { column: "order_index" })
export const createSkill = async (row: any) => {
  const { data, error } = await supabase.from("skills").insert(row).select().single()
  if (error) throw error
  return data
}
export const updateSkill = async (id: string, row: any) => {
  const { error } = await supabase.from("skills").update(row).eq("id", id)
  if (error) throw error
}
export const deleteSkill = async (id: string) => {
  const { error } = await supabase.from("skills").delete().eq("id", id)
  if (error) throw error
}

/* ───────────────────────────── Tools ─────────────────────────── */
export const getTools = () => safeSelect<any>("tools", { column: "order_index" })
export const createTool = async (row: any) => {
  const { data, error } = await supabase.from("tools").insert(row).select().single()
  if (error) throw error
  return data
}
export const updateTool = async (id: string, row: any) => {
  const { error } = await supabase.from("tools").update(row).eq("id", id)
  if (error) throw error
}
export const deleteTool = async (id: string) => {
  const { error } = await supabase.from("tools").delete().eq("id", id)
  if (error) throw error
}

/* ───────────────────────────── Experiences ─────────────────────────── */
export const getExperiences = () => safeSelect<any>("experiences", { column: "order_index" })
export const createExperience = async (row: any) => {
  const { data, error } = await supabase.from("experiences").insert(row).select().single()
  if (error) throw error
  return data
}
export const updateExperience = async (id: string, row: any) => {
  const { error } = await supabase.from("experiences").update(row).eq("id", id)
  if (error) throw error
}
export const deleteExperience = async (id: string) => {
  const { error } = await supabase.from("experiences").delete().eq("id", id)
  if (error) throw error
}

/* ───────────────────────────── Products ─────────────────────────── */
export const getProducts = () => safeSelect<any>("products", { column: "order_index" })
export const createProduct = async (row: any) => {
  const { data, error } = await supabase.from("products").insert(row).select().single()
  if (error) throw error
  return data
}
export const updateProduct = async (id: string, row: any) => {
  const { error } = await supabase.from("products").update(row).eq("id", id)
  if (error) throw error
}
export const deleteProduct = async (id: string) => {
  const { error } = await supabase.from("products").delete().eq("id", id)
  if (error) throw error
}

/* ───────────────────────────── Projects ─────────────────────────── */
export const getProjects = () => safeSelect<any>("projects", { column: "order_index" })
export const createProject = async (row: any) => {
  const { data, error } = await supabase.from("projects").insert(row).select().single()
  if (error) throw error
  return data
}
export const updateProject = async (id: string, row: any) => {
  const { error } = await supabase.from("projects").update(row).eq("id", id)
  if (error) throw error
}
export const deleteProject = async (id: string) => {
  const { error } = await supabase.from("projects").delete().eq("id", id)
  if (error) throw error
}

/* ───────────────────────────── Case Studies ─────────────────────────── */
export const getCaseStudies = () => safeSelect<any>("case_studies", { column: "order_index" })
export const createCaseStudy = async (row: any) => {
  const { data, error } = await supabase.from("case_studies").insert(row).select().single()
  if (error) throw error
  return data
}
export const updateCaseStudy = async (id: string, row: any) => {
  const { error } = await supabase.from("case_studies").update(row).eq("id", id)
  if (error) throw error
}
export const deleteCaseStudy = async (id: string) => {
  const { error } = await supabase.from("case_studies").delete().eq("id", id)
  if (error) throw error
}

/* ───────────────────────────── Education ─────────────────────────── */
export const getEducation = () => safeSelect<any>("education", { column: "order_index" })
export const createEducation = async (row: any) => {
  const { data, error } = await supabase.from("education").insert(row).select().single()
  if (error) throw error
  return data
}
export const updateEducation = async (id: string, row: any) => {
  const { error } = await supabase.from("education").update(row).eq("id", id)
  if (error) throw error
}
export const deleteEducation = async (id: string) => {
  const { error } = await supabase.from("education").delete().eq("id", id)
  if (error) throw error
}

/* ───────────────────────────── Certifications ─────────────────────────── */
export const getCertifications = () => safeSelect<any>("certifications", { column: "order_index" })
export const createCertification = async (row: any) => {
  const { data, error } = await supabase.from("certifications").insert(row).select().single()
  if (error) throw error
  return data
}
export const updateCertification = async (id: string, row: any) => {
  const { error } = await supabase.from("certifications").update(row).eq("id", id)
  if (error) throw error
}
export const deleteCertification = async (id: string) => {
  const { error } = await supabase.from("certifications").delete().eq("id", id)
  if (error) throw error
}

/* ───────────────────────────── Animated Stats ─────────────────────────── */
export const getAnimatedStats = () => safeSelect<any>("animated_stats", { column: "order_index" })
export const createAnimatedStat = async (row: any) => {
  const { data, error } = await supabase.from("animated_stats").insert(row).select().single()
  if (error) throw error
  return data
}
export const updateAnimatedStat = async (id: string, row: any) => {
  const { error } = await supabase.from("animated_stats").update(row).eq("id", id)
  if (error) throw error
}
export const deleteAnimatedStat = async (id: string) => {
  const { error } = await supabase.from("animated_stats").delete().eq("id", id)
  if (error) throw error
}

/* ───────────────────────────── Contact Messages ─────────────────────────── */
export const getContactMessages = () => safeSelect<any>("contact_messages", { column: "created_at", ascending: false })
export const createContactMessage = async (row: any) => {
  const { data, error } = await supabase.from("contact_messages").insert(row).select().single()
  if (error) throw error
  return data
}
export const updateContactMessage = async (id: string, row: any) => {
  const { error } = await supabase.from("contact_messages").update(row).eq("id", id)
  if (error) throw error
}
export const deleteContactMessage = async (id: string) => {
  const { error } = await supabase.from("contact_messages").delete().eq("id", id)
  if (error) throw error
}

/* ───────────────────────────── Admin Profiles ─────────────────────────── */
export const getAdminProfiles = () => safeSelect<any>("admin_profiles", { column: "created_at" })
export const createAdminProfile = async (row: any) => {
  const { data, error } = await supabase.from("admin_profiles").insert(row).select().single()
  if (error) throw error
  return data
}
export const updateAdminProfile = async (id: string, row: any) => {
  const { error } = await supabase.from("admin_profiles").update(row).eq("id", id)
  if (error) throw error
}
export const deleteAdminProfile = async (id: string) => {
  const { error } = await supabase.from("admin_profiles").delete().eq("id", id)
  if (error) throw error
}

/* ───────────────────────────── Storage Helpers ─────────────────────────── */
export const uploadFile = async (file: File, bucket: string, path: string) => {
  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: "3600",
    upsert: true,
  })

  if (error) throw error

  const {
    data: { publicUrl },
  } = supabase.storage.from(bucket).getPublicUrl(path)

  return publicUrl
}

export const deleteFile = async (bucket: string, path: string) => {
  const { error } = await supabase.storage.from(bucket).remove([path])
  if (error) throw error
}

export const uploadMultipleFiles = async (files: File[], bucket: string, folder: string) => {
  const uploadPromises = files.map(async (file, index) => {
    const fileName = `${folder}/${Date.now()}-${index}-${file.name}`
    return uploadFile(file, bucket, fileName)
  })

  return Promise.all(uploadPromises)
}
