export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[]

export interface Database {
  public: {
    Tables: {
      personal_info: {
        Row: {
          id: string
          name: string
          title: string
          description: string
          profile_image_url: string | null
          resume_url: string | null
          email: string | null
          phone: string | null
          linkedin_url: string | null
          github_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          title: string
          description: string
          profile_image_url?: string | null
          resume_url?: string | null
          email?: string | null
          phone?: string | null
          linkedin_url?: string | null
          github_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          title?: string
          description?: string
          profile_image_url?: string | null
          resume_url?: string | null
          email?: string | null
          phone?: string | null
          linkedin_url?: string | null
          github_url?: string | null
          created_at?: string
          updated_at?: string
        }
      }
      skills: {
        Row: {
          id: string
          name: string
          level: number
          icon: string
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          level: number
          icon: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          level?: number
          icon?: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      tools: {
        Row: {
          id: string
          name: string
          color: string
          text_color: string
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          color: string
          text_color: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          color?: string
          text_color?: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      experiences: {
        Row: {
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
        Insert: {
          id?: string
          title: string
          company: string
          period: string
          description: string
          achievements: string[]
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          company?: string
          period?: string
          description?: string
          achievements?: string[]
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      products: {
        Row: {
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
        Insert: {
          id?: string
          title: string
          description: string
          status: string
          users: string
          impact: string
          icon: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          status?: string
          users?: string
          impact?: string
          icon?: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      projects: {
        Row: {
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
        Insert: {
          id?: string
          title: string
          description: string
          tech: string[]
          duration: string
          role: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          tech?: string[]
          duration?: string
          role?: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      case_studies: {
        Row: {
          id: string
          title: string
          description: string
          industry: string
          impact: string
          timeline: string
          filename: string
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          description: string
          industry: string
          impact: string
          timeline: string
          filename: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          description?: string
          industry?: string
          impact?: string
          timeline?: string
          filename?: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      education: {
        Row: {
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
        Insert: {
          id?: string
          degree: string
          school: string
          period: string
          focus: string
          achievements: string[]
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          degree?: string
          school?: string
          period?: string
          focus?: string
          achievements?: string[]
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      certifications: {
        Row: {
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
        Insert: {
          id?: string
          title: string
          issuer: string
          date: string
          badge: string
          color: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          issuer?: string
          date?: string
          badge?: string
          color?: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
      animated_stats: {
        Row: {
          id: string
          title: string
          value: string
          icon: string
          gradient: string
          order_index: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          title: string
          value: string
          icon: string
          gradient: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          title?: string
          value?: string
          icon?: string
          gradient?: string
          order_index?: number
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}
