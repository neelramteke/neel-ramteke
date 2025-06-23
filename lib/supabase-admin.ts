/**
 * Server-side Supabase client with admin privileges
 */
import { createClient } from "@supabase/supabase-js"
import type { Database } from "./types_db"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

export const supabaseAdmin = createClient<Database>(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// File upload helper
export async function uploadFile(file: File, bucket: string, fileName: string): Promise<string> {
  const { data, error } = await supabaseAdmin.storage.from(bucket).upload(fileName, file, {
    upsert: true,
  })

  if (error) throw error

  const { data: urlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(data.path)
  return urlData.publicUrl
}

// Site Settings
export async function getSiteSettings() {
  const { data, error } = await supabaseAdmin.from("site_settings").select("*").single()
  if (error && error.code !== "PGRST116") throw error
  return data
}

export async function updateSiteSettings(settings: any) {
  const { data, error } = await supabaseAdmin
    .from("site_settings")
    .upsert(settings, { onConflict: "id" })
    .select()
    .single()
  if (error) throw error
  return data
}

// Hero Section
export async function getHeroSection() {
  const { data, error } = await supabaseAdmin.from("hero_section").select("*").single()
  if (error && error.code !== "PGRST116") throw error
  return data
}

export async function updateHeroSection(heroData: any) {
  const { data, error } = await supabaseAdmin
    .from("hero_section")
    .upsert(heroData, { onConflict: "id" })
    .select()
    .single()
  if (error) throw error
  return data
}

// About Section
export async function getAboutSection() {
  const { data, error } = await supabaseAdmin.from("about_section").select("*").single()
  if (error && error.code !== "PGRST116") throw error
  return data
}

export async function updateAboutSection(aboutData: any) {
  const { data, error } = await supabaseAdmin
    .from("about_section")
    .upsert(aboutData, { onConflict: "id" })
    .select()
    .single()
  if (error) throw error
  return data
}

// Personal Info
export async function getPersonalInfo() {
  const { data, error } = await supabaseAdmin.from("personal_info").select("*").limit(1).single()
  if (error && error.code !== "PGRST116") throw error
  return data
}

export async function updatePersonalInfo(personalData: any) {
  // First try to get existing record
  const existing = await getPersonalInfo()
  
  if (existing) {
    const { data, error } = await supabaseAdmin
      .from("personal_info")
      .update(personalData)
      .eq("id", existing.id)
      .select()
      .single()
    if (error) throw error
    return data
  } else {
    const { data, error } = await supabaseAdmin
      .from("personal_info")
      .insert(personalData)
      .select()
      .single()
    if (error) throw error
    return data
  }
}

// Skills
export async function getSkills() {
  const { data, error } = await supabaseAdmin.from("skills").select("*").order("order_index")
  if (error) throw error
  return data
}

export async function createSkill(skillData: any) {
  const { data, error } = await supabaseAdmin.from("skills").insert(skillData).select().single()
  if (error) throw error
  return data
}

export async function updateSkill(id: string, skillData: any) {
  const { data, error } = await supabaseAdmin.from("skills").update(skillData).eq("id", id).select().single()
  if (error) throw error
  return data
}

export async function deleteSkill(id: string) {
  const { error } = await supabaseAdmin.from("skills").delete().eq("id", id)
  if (error) throw error
}

// Tools
export async function getTools() {
  const { data, error } = await supabaseAdmin.from("tools").select("*").order("order_index")
  if (error) throw error
  return data
}

export async function createTool(toolData: any) {
  const { data, error } = await supabaseAdmin.from("tools").insert(toolData).select().single()
  if (error) throw error
  return data
}

export async function updateTool(id: string, toolData: any) {
  const { data, error } = await supabaseAdmin.from("tools").update(toolData).eq("id", id).select().single()
  if (error) throw error
  return data
}

export async function deleteTool(id: string) {
  const { error } = await supabaseAdmin.from("tools").delete().eq("id", id)
  if (error) throw error
}

// Experiences
export async function getExperiences() {
  const { data, error } = await supabaseAdmin.from("experiences").select("*").order("order_index")
  if (error) throw error
  return data
}

export async function createExperience(experienceData: any) {
  const { data, error } = await supabaseAdmin.from("experiences").insert(experienceData).select().single()
  if (error) throw error
  return data
}

export async function updateExperience(id: string, experienceData: any) {
  const { data, error } = await supabaseAdmin.from("experiences").update(experienceData).eq("id", id).select().single()
  if (error) throw error
  return data
}

export async function deleteExperience(id: string) {
  const { error } = await supabaseAdmin.from("experiences").delete().eq("id", id)
  if (error) throw error
}

// Products
export async function getProducts() {
  const { data, error } = await supabaseAdmin.from("products").select("*").order("order_index")
  if (error) throw error
  return data
}

export async function createProduct(productData: any) {
  const { data, error } = await supabaseAdmin.from("products").insert(productData).select().single()
  if (error) throw error
  return data
}

export async function updateProduct(id: string, productData: any) {
  const { data, error } = await supabaseAdmin.from("products").update(productData).eq("id", id).select().single()
  if (error) throw error
  return data
}

export async function deleteProduct(id: string) {
  const { error } = await supabaseAdmin.from("products").delete().eq("id", id)
  if (error) throw error
}

// Projects
export async function getProjects() {
  const { data, error } = await supabaseAdmin.from("projects").select("*").order("order_index")
  if (error) throw error
  return data
}

export async function createProject(projectData: any) {
  const { data, error } = await supabaseAdmin.from("projects").insert(projectData).select().single()
  if (error) throw error
  return data
}

export async function updateProject(id: string, projectData: any) {
  const { data, error } = await supabaseAdmin.from("projects").update(projectData).eq("id", id).select().single()
  if (error) throw error
  return data
}

export async function deleteProject(id: string) {
  const { error } = await supabaseAdmin.from("projects").delete().eq("id", id)
  if (error) throw error
}

// Case Studies
export async function getCaseStudies() {
  const { data, error } = await supabaseAdmin.from("case_studies").select("*").order("order_index")
  if (error) throw error
  return data
}

export async function createCaseStudy(caseStudyData: any) {
  const { data, error } = await supabaseAdmin.from("case_studies").insert(caseStudyData).select().single()
  if (error) throw error
  return data
}

export async function updateCaseStudy(id: string, caseStudyData: any) {
  const { data, error } = await supabaseAdmin.from("case_studies").update(caseStudyData).eq("id", id).select().single()
  if (error) throw error
  return data
}

export async function deleteCaseStudy(id: string) {
  const { error } = await supabaseAdmin.from("case_studies").delete().eq("id", id)
  if (error) throw error
}

// Education
export async function getEducation() {
  const { data, error } = await supabaseAdmin.from("education").select("*").order("order_index")
  if (error) throw error
  return data
}

export async function createEducation(educationData: any) {
  const { data, error } = await supabaseAdmin.from("education").insert(educationData).select().single()
  if (error) throw error
  return data
}

export async function updateEducation(id: string, educationData: any) {
  const { data, error } = await supabaseAdmin.from("education").update(educationData).eq("id", id).select().single()
  if (error) throw error
  return data
}

export async function deleteEducation(id: string) {
  const { error } = await supabaseAdmin.from("education").delete().eq("id", id)
  if (error) throw error
}

// Certifications
export async function getCertifications() {
  const { data, error } = await supabaseAdmin.from("certifications").select("*").order("order_index")
  if (error) throw error
  return data
}

export async function createCertification(certificationData: any) {
  const { data, error } = await supabaseAdmin.from("certifications").insert(certificationData).select().single()
  if (error) throw error
  return data
}

export async function updateCertification(id: string, certificationData: any) {
  const { data, error } = await supabaseAdmin.from("certifications").update(certificationData).eq("id", id).select().single()
  if (error) throw error
  return data
}

export async function deleteCertification(id: string) {
  const { error } = await supabaseAdmin.from("certifications").delete().eq("id", id)
  if (error) throw error
}

// Animated Stats
export async function getAnimatedStats() {
  const { data, error } = await supabaseAdmin.from("animated_stats").select("*").order("order_index")
  if (error) throw error
  return data
}

export async function createAnimatedStat(statData: any) {
  const { data, error } = await supabaseAdmin.from("animated_stats").insert(statData).select().single()
  if (error) throw error
  return data
}

export async function updateAnimatedStat(id: string, statData: any) {
  const { data, error } = await supabaseAdmin.from("animated_stats").update(statData).eq("id", id).select().single()
  if (error) throw error
  return data
}

export async function deleteAnimatedStat(id: string) {
  const { error } = await supabaseAdmin.from("animated_stats").delete().eq("id", id)
  if (error) throw error
}

// Contact Messages
export async function getContactMessages() {
  const { data, error } = await supabaseAdmin.from("contact_messages").select("*").order("created_at", { ascending: false })
  if (error) throw error
  return data
}

export async function updateContactMessage(id: string, messageData: any) {
  const { data, error } = await supabaseAdmin.from("contact_messages").update(messageData).eq("id", id).select().single()
  if (error) throw error
  return data
}

export async function deleteContactMessage(id: string) {
  const { error } = await supabaseAdmin.from("contact_messages").delete().eq("id", id)
  if (error) throw error
}