"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
  Settings,
  User,
  Palette,
  Briefcase,
  Code,
  GraduationCap,
  Award,
  BarChart3,
  Mail,
  Rocket,
  FileText,
  Home,
  Info,
  LogOut,
} from "lucide-react"

// Import all editor components
import SiteSettingsEditor from "./components/site-settings-editor"
import HeroSectionEditor from "./components/hero-section-editor"
import AboutSectionEditor from "./components/about-section-editor"
import PersonalInfoEditor from "./components/personal-info-editor"
import SkillsEditor from "./components/skills-editor"
import ToolsEditor from "./components/tools-editor"
import ExperiencesEditor from "./components/experiences-editor"
import ProductsEditor from "./components/products-editor"
import ProjectsEditor from "./components/projects-editor"
import CaseStudiesEditor from "./components/case-studies-editor"
import EducationEditor from "./components/education-editor"
import CertificationsEditor from "./components/certifications-editor"
import AnimatedStatsEditor from "./components/animated-stats-editor"
import ContactMessages from "./components/contact-messages"

export default function SuperAdminDashboard() {
  const [activeTab, setActiveTab] = useState("site-settings")

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST" })
      window.location.href = "/superadmin/login"
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  const tabItems = [
    { id: "site-settings", label: "Site Settings", icon: Settings, component: SiteSettingsEditor },
    { id: "hero-section", label: "Hero Section", icon: Home, component: HeroSectionEditor },
    { id: "about-section", label: "About Section", icon: Info, component: AboutSectionEditor },
    { id: "personal-info", label: "Personal Info", icon: User, component: PersonalInfoEditor },
    { id: "skills", label: "Skills", icon: Palette, component: SkillsEditor },
    { id: "tools", label: "Tools", icon: Code, component: ToolsEditor },
    { id: "experiences", label: "Experience", icon: Briefcase, component: ExperiencesEditor },
    { id: "products", label: "Products", icon: Rocket, component: ProductsEditor },
    { id: "projects", label: "Projects", icon: Code, component: ProjectsEditor },
    { id: "case-studies", label: "Case Studies", icon: FileText, component: CaseStudiesEditor },
    { id: "education", label: "Education", icon: GraduationCap, component: EducationEditor },
    { id: "certifications", label: "Certifications", icon: Award, component: CertificationsEditor },
    { id: "animated-stats", label: "Stats", icon: BarChart3, component: AnimatedStatsEditor },
    { id: "contact-messages", label: "Messages", icon: Mail, component: ContactMessages },
  ]

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header */}
      <div className="border-b border-[#2A2A2A] bg-[#1A1A1A]">
        <div className="flex items-center justify-between px-6 py-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Portfolio Admin</h1>
            <p className="text-gray-400">Manage your portfolio content</p>
          </div>
          <div className="flex items-center gap-4">
            <Button
              onClick={() => window.open("/", "_blank")}
              variant="outline"
              className="border-blue-500 text-blue-400 hover:bg-blue-500 hover:text-white"
            >
              View Portfolio
            </Button>
            <Button
              onClick={handleLogout}
              variant="outline"
              className="border-red-500 text-red-400 hover:bg-red-500 hover:text-white"
            >
              <LogOut className="w-4 h-4 mr-2" />
              Logout
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex">
        {/* Sidebar */}
        <div className="w-64 bg-[#1A1A1A] border-r border-[#2A2A2A] min-h-screen">
          <div className="p-4">
            <nav className="space-y-2">
              {tabItems.map((item) => {
                const Icon = item.icon
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveTab(item.id)}
                    className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === item.id
                        ? "bg-blue-600 text-white"
                        : "text-gray-400 hover:text-white hover:bg-[#2A2A2A]"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    {item.label}
                  </button>
                )
              })}
            </nav>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {tabItems.map((item) => {
              const Component = item.component
              return (
                <div key={item.id} className={activeTab === item.id ? "block" : "hidden"}>
                  <Component />
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
