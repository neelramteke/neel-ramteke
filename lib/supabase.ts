import { createClient } from "@supabase/supabase-js"

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface PersonalInfo {
  id: string
  name: string
  title: string
  description: string
  email: string
  phone: string
  linkedin: string
  github: string
  profile_image_url: string
  resume_url: string
  created_at: string
  updated_at: string
}

export interface Skill {
  id: string
  name: string
  level: number
  icon: string
  category: string
  order_index: number
  created_at: string
  updated_at: string
}

export interface Tool {
  id: string
  name: string
  color: string
  text_color: string
  order_index: number
  created_at: string
  updated_at: string
}

export interface Experience {
  id: string
  title: string
  company: string
  period: string
  description: string
  achievements: string[]
  order_index: number
  created_at: string
  updated_at: string
}

export interface Product {
  id: string
  title: string
  description: string
  status: string
  users: string
  impact: string
  icon: string
  order_index: number
  created_at: string
  updated_at: string
}

export interface Project {
  id: string
  title: string
  description: string
  tech: string[]
  duration: string
  role: string
  order_index: number
  created_at: string
  updated_at: string
}

export interface CaseStudy {
  id: string
  title: string
  description: string
  industry: string
  impact: string
  timeline: string
  filename: string
  file_url: string
  order_index: number
  created_at: string
  updated_at: string
}

export interface Education {
  id: string
  degree: string
  school: string
  period: string
  focus: string
  achievements: string[]
  order_index: number
  created_at: string
  updated_at: string
}

export interface Certification {
  id: string
  title: string
  issuer: string
  date: string
  badge: string
  color: string
  order_index: number
  created_at: string
  updated_at: string
}

export interface AnimatedStat {
  id: string
  label: string
  value: number
  suffix: string
  prefix: string
  icon: string
  color: string
  description: string
  order_index: number
  created_at: string
  updated_at: string
}
