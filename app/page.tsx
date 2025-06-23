"use client"

import type React from "react"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  BrainCircuit,
  Brain,
  BarChart3,
  Users,
  Lightbulb,
  Mail,
  Linkedin,
  Github,
  ChevronDown,
  Zap,
  Target,
  TrendingUp,
  Database,
  GraduationCap,
  Award,
  FileText,
  Star,
  Download,
  Phone,
} from "lucide-react"
import ContactForm from "./components/contact-form"
import Navbar from "./components/navbar"
import AnimatedStats from "./components/animated-stats"
import {
  getSiteSettings,
  getHeroSection,
  getAboutSection,
  getPersonalInfo,
  getSkills,
  getTools,
  getExperiences,
  getProducts,
  getProjects,
  getCaseStudies,
  getEducation,
  getCertifications,
  getAnimatedStats,
} from "@/lib/supabase-client"

// Icon mapping function for skills
const getSkillIcon = (iconName: string) => {
  const iconMap: { [key: string]: React.ComponentType<{ className?: string }> } = {
    Target,
    BarChart3,
    Users,
    BrainCircuit,
    Brain,
    TrendingUp,
    Database,
    Zap,
    Lightbulb,
  }
  return iconMap[iconName] || Target
}

// Scramble Text Effect Hook
function useScrambleText(text: string, duration = 2000) {
  const [displayText, setDisplayText] = useState("")
  const [isComplete, setIsComplete] = useState(false)

  useEffect(() => {
    const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*"
    let iteration = 0
    const interval = setInterval(() => {
      setDisplayText(
        text
          .split("")
          .map((char, index) => {
            if (index < iteration) {
              return text[index]
            }
            return characters[Math.floor(Math.random() * characters.length)]
          })
          .join(""),
      )

      if (iteration >= text.length) {
        clearInterval(interval)
        setIsComplete(true)
      }

      iteration += 1
    }, 15)

    return () => clearInterval(interval)
  }, [text, duration])

  return { displayText, isComplete }
}

export default function Portfolio() {
  const [isVisible, setIsVisible] = useState(false)
  const [skillsInView, setSkillsInView] = useState(false)
  const [portfolioData, setPortfolioData] = useState({
    siteSettings: null,
    heroSection: null,
    aboutSection: null,
    personalInfo: null,
    skills: [],
    tools: [],
    experiences: [],
    products: [],
    projects: [],
    caseStudies: [],
    education: [],
    certifications: [],
    animatedStats: [],
  })
  const [isLoading, setIsLoading] = useState(true)

  const { displayText: scrambledName, isComplete } = useScrambleText(
    portfolioData.heroSection?.main_heading || portfolioData.personalInfo?.name || "Your Name",
    500,
  )

  // Apply custom styles from site settings
  useEffect(() => {
    const siteSettings = portfolioData.siteSettings
    if (siteSettings) {
      document.title = siteSettings.site_title || "Portfolio"

      // Apply custom CSS
      if (siteSettings.custom_css) {
        const styleElement = document.createElement("style")
        styleElement.textContent = siteSettings.custom_css
        document.head.appendChild(styleElement)

        return () => {
          document.head.removeChild(styleElement)
        }
      }
    }
  }, [portfolioData.siteSettings])

  // Intersection Observer for Skills Section
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSkillsInView(true)
        }
      },
      { threshold: 0.3 },
    )

    const skillsSection = document.getElementById("skills")
    if (skillsSection) {
      observer.observe(skillsSection)
    }

    return () => {
      if (skillsSection) {
        observer.unobserve(skillsSection)
      }
    }
  }, [])

  useEffect(() => {
    loadPortfolioData()
  }, [])

  // Make hero section visible on mount
  useEffect(() => {
    setIsVisible(true)
  }, [])

  const loadPortfolioData = async () => {
    try {
      setIsLoading(true)
      const [
        siteSettings,
        heroSection,
        aboutSection,
        personalInfo,
        skills,
        tools,
        experiences,
        products,
        projects,
        caseStudies,
        education,
        certifications,
        animatedStats,
      ] = await Promise.all([
        getSiteSettings(),
        getHeroSection(),
        getAboutSection(),
        getPersonalInfo(),
        getSkills(),
        getTools(),
        getExperiences(),
        getProducts(),
        getProjects(),
        getCaseStudies(),
        getEducation(),
        getCertifications(),
        getAnimatedStats(),
      ])

      setPortfolioData({
        siteSettings,
        heroSection,
        aboutSection,
        personalInfo,
        skills: skills || [],
        tools: tools || [],
        experiences: experiences || [],
        products: products || [],
        projects: projects || [],
        caseStudies: caseStudies || [],
        education: education || [],
        certifications: certifications || [],
        animatedStats: animatedStats || [],
      })
    } catch (error) {
      console.error("Error loading portfolio data:", error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDownloadResume = () => {
    const resumeUrl = portfolioData.personalInfo?.resume_url || portfolioData.heroSection?.cta_button_url
    if (resumeUrl) {
      const link = document.createElement("a")
      link.href = resumeUrl
      link.download = "Resume.pdf"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  const handleDownloadCaseStudy = (filename: string) => {
    const link = document.createElement("a")
    link.href = `/case-studies/${filename}`
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading portfolio...</p>
        </div>
      </div>
    )
  }

  const skillsData =
    portfolioData.skills.length > 0
      ? portfolioData.skills.map((skill) => ({
          ...skill,
          icon: getSkillIcon(skill.icon_name || "Target"),
          level: skill.proficiency_level || skill.level || 90,
        }))
      : [
          { name: "Product Strategy", icon: Target, level: 95 },
          { name: "Data Analysis", icon: BarChart3, level: 90 },
          { name: "User Research", icon: Users, level: 85 },
          { name: "AI/ML Integration", icon: BrainCircuit, level: 80 },
          { name: "Market Research", icon: TrendingUp, level: 88 },
          { name: "SQL & Analytics", icon: Database, level: 92 },
        ]

  return (
    <div
      className="min-h-screen text-white relative"
      style={{
        backgroundColor: portfolioData.siteSettings?.background_color || "#000000",
        color: portfolioData.siteSettings?.text_color || "#FFFFFF",
        fontFamily: portfolioData.siteSettings?.font_family || "Inter, sans-serif",
      }}
    >
      {/* Dots Background with Fade Center Mask */}
      <div className="fixed inset-0 z-0">
        <div
          className="absolute inset-0"
          style={{ backgroundColor: portfolioData.siteSettings?.background_color || "#000000" }}
        />
        <div
          className="absolute inset-0 opacity-80"
          style={{
            backgroundImage: `radial-gradient(circle, #333 1px, transparent 1px)`,
            backgroundSize: "30px 30px",
            maskImage: "radial-gradient(ellipse 80% 50% at 50% 50%, black 40%, transparent 100%)",
            WebkitMaskImage: "radial-gradient(ellipse 80% 50% at 50% 50%, black 40%, transparent 100%)",
          }}
        />
      </div>

      <Navbar />

      {/* Hero Section */}
      <section id="home" className="min-h-screen flex items-center justify-center px-4 py-20 pt-32 relative z-10">
        <div className="max-w-7xl mx-auto w-full">
          <div
            className={`text-center transition-all duration-2000 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"}`}
          >
            <div className="backdrop-blur-xl bg-[#1A1A1A]/80 border border-[#2A2A2A] rounded-3xl p-8 md:p-12 shadow-2xl animate-fade-in-up">
              <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
                {/* Left side - Text content */}
                <div className="text-left">
                  <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold mb-6 bg-gradient-to-r from-white via-blue-200 to-purple-300 bg-clip-text text-transparent italic animate-slide-in-left">
                    {isComplete
                      ? portfolioData.heroSection?.main_heading || portfolioData.personalInfo?.name || "Your Name"
                      : scrambledName}
                  </h1>
                  <p className="text-lg md:text-xl lg:text-2xl text-gray-300 mb-4 font-semibold animate-slide-in-right">
                    {portfolioData.heroSection?.sub_heading ||
                      portfolioData.personalInfo?.title ||
                      "Your Professional Title"}
                  </p>
                  <p className="text-base md:text-lg text-gray-400 mb-8 leading-relaxed animate-fade-in-up-delay">
                    {portfolioData.heroSection?.description ||
                      portfolioData.personalInfo?.description ||
                      "Your professional description here..."}
                  </p>

                  {portfolioData.heroSection?.show_animated_text &&
                    portfolioData.heroSection?.animated_words?.length > 0 && (
                      <div className="flex flex-wrap gap-3 md:gap-4 mb-8 animate-fade-in-up-delay-2">
                        {portfolioData.heroSection.animated_words.map((word, index) => (
                          <Badge
                            key={index}
                            className="bg-blue-500/20 border-blue-500/30 text-blue-300 px-4 md:px-6 py-2 md:py-3 text-xs md:text-sm font-medium hover:scale-105 transition-transform duration-300"
                          >
                            <Zap className="w-3 h-3 md:w-4 md:h-4 mr-2" />
                            {word}
                          </Badge>
                        ))}
                      </div>
                    )}
                </div>

                {/* Right side - Profile image */}
                <div className="flex flex-col items-center animate-fade-in-up">
                  <div className="relative mb-8">
                    {/* Profile image in circular frame */}
                    <div className="w-56 h-56 md:w-64 md:h-64 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 p-2 relative z-10 mx-8 my-8">
                      <div className="w-full h-full rounded-full overflow-hidden bg-black">
                        <img
                          src={
                            portfolioData.heroSection?.profile_image_url ||
                            portfolioData.personalInfo?.profile_image_url ||
                            "/images/profile-photo.png" ||
                            "/placeholder.svg" ||
                            "/placeholder.svg"
                          }
                          alt={`${portfolioData.personalInfo?.name || "Profile"} - ${portfolioData.personalInfo?.title || "Professional"}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                  </div>

                  {/* CTA Button */}
                  {(portfolioData.heroSection?.cta_button_text || portfolioData.personalInfo?.resume_url) && (
                    <div className="animate-fade-in-up-delay-3">
                      <Button
                        onClick={handleDownloadResume}
                        className="bg-gradient-to-r from-green-600 to-teal-600 hover:from-green-500 hover:to-teal-500 text-white px-6 md:px-8 py-3 md:py-4 rounded-2xl text-base md:text-lg font-semibold shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-xl"
                      >
                        <Download className="w-4 h-4 md:w-5 md:h-5 mr-2" />
                        {portfolioData.heroSection?.cta_button_text || "Download Resume"}
                      </Button>
                    </div>
                  )}
                </div>
              </div>

              <div className="mt-12 animate-bounce">
                <ChevronDown className="w-8 h-8 mx-auto text-gray-500" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* About Me Section */}
      <section id="about" className="py-16 md:py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-xl bg-[#1A1A1A]/80 border border-[#2A2A2A] rounded-3xl p-8 md:p-12 shadow-2xl animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 md:mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-slide-in-down">
              {portfolioData.aboutSection?.section_title || "About Me"}
            </h2>
            <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
              <div className="space-y-6 animate-slide-in-left">
                <div className="text-base md:text-lg text-gray-300 leading-relaxed">
                  {portfolioData.aboutSection?.main_content?.split("\n").map((paragraph, index) => (
                    <p key={index} className="mb-4">
                      {paragraph}
                    </p>
                  )) || <p>I'm a passionate professional with expertise in product management and data analysis.</p>}
                </div>

                {portfolioData.aboutSection?.highlights && portfolioData.aboutSection.highlights.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-bold text-white">Key Highlights</h3>
                    <div className="space-y-2">
                      {portfolioData.aboutSection.highlights.map((highlight, index) => (
                        <div
                          key={index}
                          className="flex items-center gap-3 animate-fade-in-left"
                          style={{ animationDelay: `${index * 0.1}s` }}
                        >
                          <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                          <span className="text-gray-300">{highlight}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex flex-wrap gap-4 pt-4">
                  {portfolioData.personalInfo?.email && (
                    <Button className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-500 hover:to-cyan-500 text-white rounded-xl transition-all duration-300 hover:scale-105">
                      <Mail className="w-4 h-4 mr-2" />
                      Email Me
                    </Button>
                  )}
                  {portfolioData.personalInfo?.linkedin_url && (
                    <Button
                      onClick={() => window.open(portfolioData.personalInfo.linkedin_url, "_blank")}
                      className="bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      <Linkedin className="w-4 h-4 mr-2" />
                      LinkedIn
                    </Button>
                  )}
                  {portfolioData.personalInfo?.github_url && (
                    <Button
                      onClick={() => window.open(portfolioData.personalInfo.github_url, "_blank")}
                      className="bg-gradient-to-r from-gray-800 to-gray-900 hover:from-gray-700 hover:to-gray-800 text-white rounded-xl transition-all duration-300 hover:scale-105"
                    >
                      <Github className="w-4 h-4 mr-2" />
                      GitHub
                    </Button>
                  )}
                </div>
              </div>

              <div className="backdrop-blur-xl bg-black/60 border border-[#2A2A2A] rounded-2xl p-6 md:p-8 animate-slide-in-right">
                {portfolioData.aboutSection?.image_url && (
                  <img
                    src={portfolioData.aboutSection.image_url || "/placeholder.svg"}
                    alt="About"
                    className="w-full h-64 object-cover rounded-lg mb-6"
                  />
                )}

                {portfolioData.aboutSection?.show_stats && (
                  <div className="grid grid-cols-2 gap-4">
                    {portfolioData.aboutSection.years_experience > 0 && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-400">
                          {portfolioData.aboutSection.years_experience}+
                        </div>
                        <div className="text-gray-400 text-sm">Years Experience</div>
                      </div>
                    )}
                    {portfolioData.aboutSection.projects_completed > 0 && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-400">
                          {portfolioData.aboutSection.projects_completed}+
                        </div>
                        <div className="text-gray-400 text-sm">Projects</div>
                      </div>
                    )}
                    {portfolioData.aboutSection.clients_served > 0 && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-400">
                          {portfolioData.aboutSection.clients_served}+
                        </div>
                        <div className="text-gray-400 text-sm">Clients</div>
                      </div>
                    )}
                    {portfolioData.aboutSection.awards_won > 0 && (
                      <div className="text-center">
                        <div className="text-2xl font-bold text-yellow-400">
                          {portfolioData.aboutSection.awards_won}+
                        </div>
                        <div className="text-gray-400 text-sm">Awards</div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Animated Stats Section */}
      {portfolioData.animatedStats.length > 0 && (
        <section className="py-16 md:py-20 px-4 relative z-10">
          <div className="max-w-7xl mx-auto">
            <AnimatedStats />
          </div>
        </section>
      )}

      {/* Certifications & Badges Section */}
      <section className="py-16 md:py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-xl bg-[#1A1A1A]/80 border border-[#2A2A2A] rounded-3xl p-8 md:p-12 shadow-2xl animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 md:mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-slide-in-down">
              Certifications & Badges
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {portfolioData.certifications.map((cert, index) => (
                <div
                  key={index}
                  className="backdrop-blur-xl bg-black/60 border border-[#2A2A2A] rounded-2xl p-6 md:p-8 hover:bg-[#1A1A1A]/60 transition-all duration-300 hover:scale-105 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                      {/* Space for certification image - user will add */}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold text-white">{cert.title}</h3>
                      <p className="text-gray-400 text-sm">{cert.issuer}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center">
                    <Badge className={`${cert.color} px-3 py-1`}>Certified</Badge>
                    <span className="text-gray-500 text-sm">{cert.date}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Skills Section */}
      <section id="skills" className="py-16 md:py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-xl bg-[#1A1A1A]/80 border border-[#2A2A2A] rounded-3xl p-8 md:p-12 shadow-2xl animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 md:mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-slide-in-down">
              Core Skills
            </h2>
            <div className="grid md:grid-cols-2 gap-6 md:gap-8">
              {skillsData.map((skill, index) => {
                const Icon = skill.icon
                return (
                  <div
                    key={skill.name || skill.skill_name}
                    className="backdrop-blur-xl bg-black/60 border border-[#2A2A2A] rounded-2xl p-6 animate-slide-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                          <Icon className="w-6 h-6 text-white" />
                        </div>
                        <span className="text-lg md:text-xl font-semibold text-white">
                          {skill.name || skill.skill_name}
                        </span>
                      </div>
                      <span className="text-lg font-bold text-gray-400">{skill.level}%</span>
                    </div>
                    <div className="w-full bg-[#2A2A2A] rounded-full h-3 overflow-hidden relative">
                      {/* Loading skeleton */}
                      {!skillsInView && (
                        <div className="absolute inset-0 bg-gradient-to-r from-gray-700 via-gray-600 to-gray-700 animate-pulse"></div>
                      )}
                      {/* Actual progress bar */}
                      <div
                        className={`h-3 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 transition-all duration-2000 ease-out relative ${
                          skillsInView ? "opacity-100" : "opacity-0"
                        }`}
                        style={{
                          width: skillsInView ? `${skill.level}%` : "0%",
                          animationDelay: `${index * 0.2}s`,
                        }}
                      >
                        {/* Loading shimmer effect */}
                        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-shimmer"></div>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-16 md:py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-xl bg-[#1A1A1A]/80 border border-[#2A2A2A] rounded-3xl p-8 md:p-12 shadow-2xl animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 md:mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-slide-in-down">
              Tools & Technologies
            </h2>
            <div className="flex flex-wrap gap-3 md:gap-4 justify-center">
              {portfolioData.tools.map((tool, index) => (
                <div
                  key={tool.name}
                  className={`${tool.color} ${tool.textColor} px-4 md:px-6 py-2 md:py-3 rounded-2xl font-semibold text-sm shadow-lg hover:scale-105 transition-transform duration-200 cursor-pointer hover:shadow-xl animate-fade-in-up`}
                  style={{ animationDelay: `${index * 0.05}s` }}
                >
                  {tool.name}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Experience Section */}
      <section id="experience" className="py-16 md:py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-xl bg-[#1A1A1A]/80 border border-[#2A2A2A] rounded-3xl p-8 md:p-12 shadow-2xl animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 md:mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-slide-in-down">
              Professional Experience
            </h2>
            <div className="space-y-8">
              {portfolioData.experiences.map((exp, index) => (
                <div
                  key={index}
                  className="backdrop-blur-xl bg-black/60 border border-[#2A2A2A] rounded-2xl p-6 md:p-8 hover:bg-[#1A1A1A]/60 transition-all duration-300 animate-slide-in-left"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <div>
                      <h3 className="text-xl md:text-2xl font-bold text-white mb-2">{exp.title}</h3>
                      <p className="text-lg md:text-xl text-blue-400 font-semibold">{exp.company}</p>
                    </div>
                    <Badge className="bg-blue-500/20 border-blue-500/30 text-blue-300 px-4 py-2 w-fit mt-2 md:mt-0">
                      {exp.period}
                    </Badge>
                  </div>
                  <p className="text-gray-300 mb-6 leading-relaxed text-base md:text-lg">{exp.description}</p>
                  <div className="flex flex-wrap gap-3">
                    {exp.achievements.map((achievement, i) => (
                      <Badge
                        key={i}
                        className="bg-green-500/20 border-green-500/30 text-green-300 px-4 py-2 animate-fade-in-up"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      >
                        <Star className="w-3 h-3 mr-1" />
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* My Products Section */}
      <section id="products" className="py-16 md:py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-xl bg-[#1A1A1A]/80 border border-[#2A2A2A] rounded-3xl p-8 md:p-12 shadow-2xl animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 md:mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-slide-in-down">
              My Products
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {portfolioData.products.map((product, index) => {
                const Icon = product.icon
                return (
                  <div
                    key={index}
                    className="backdrop-blur-xl bg-black/60 border border-[#2A2A2A] rounded-2xl p-6 md:p-8 hover:bg-[#1A1A1A]/60 transition-all duration-300 hover:scale-105 animate-fade-in-up"
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-2xl flex items-center justify-center mb-6">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-3">{product.title}</h3>
                    <p className="text-gray-400 mb-4 leading-relaxed">{product.description}</p>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Status:</span>
                        <Badge
                          className={`${
                            product.status === "Live"
                              ? "bg-green-500/20 border-green-500/30 text-green-300"
                              : product.status === "Beta"
                                ? "bg-yellow-500/20 border-yellow-500/30 text-yellow-300"
                                : "bg-blue-500/20 border-blue-500/30 text-blue-300"
                          }`}
                        >
                          {product.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-500">Users:</span>
                        <span className="text-sm font-semibold text-gray-300">{product.users}</span>
                      </div>
                      <div className="pt-2">
                        <span className="text-sm font-semibold text-green-400">{product.impact}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>
      </section>

      {/* My Projects Section */}
      <section id="projects" className="py-16 md:py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-xl bg-[#1A1A1A]/80 border border-[#2A2A2A] rounded-3xl p-8 md:p-12 shadow-2xl animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 md:mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-slide-in-down">
              Featured Projects
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {portfolioData.projects.map((project, index) => (
                <div
                  key={index}
                  className="backdrop-blur-xl bg-black/60 border border-[#2A2A2A] rounded-2xl p-6 hover:bg-[#1A1A1A]/60 transition-all duration-300 hover:scale-105 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <h3 className="text-xl font-bold text-white mb-3">{project.title}</h3>
                  <p className="text-gray-400 mb-4 text-sm leading-relaxed">{project.description}</p>
                  <div className="space-y-3">
                    <div>
                      <span className="text-xs text-gray-500 uppercase tracking-wide">Technologies</span>
                      <div className="flex flex-wrap gap-2 mt-1">
                        {project.tech.map((tech, i) => (
                          <Badge key={i} className="bg-purple-500/20 border-purple-500/30 text-purple-300 text-xs">
                            {tech}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    <div className="flex justify-between items-center pt-2">
                      <span className="text-sm text-gray-500">Duration: {project.duration}</span>
                    </div>
                    <div className="text-sm font-semibold text-blue-400">{project.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Case Studies Section */}
      <section className="py-16 md:py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-xl bg-[#1A1A1A]/80 border border-[#2A2A2A] rounded-3xl p-8 md:p-12 shadow-2xl animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 md:mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-slide-in-down">
              Case Studies
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
              {portfolioData.caseStudies.map((study, index) => (
                <div
                  key={index}
                  className="backdrop-blur-xl bg-black/60 border border-[#2A2A2A] rounded-2xl p-6 md:p-8 hover:bg-[#1A1A1A]/60 transition-all duration-300 hover:scale-105 animate-fade-in-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center mb-6">
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3">{study.title}</h3>
                  <p className="text-gray-400 mb-4 text-sm leading-relaxed">{study.description}</p>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Industry:</span>
                      <Badge className="bg-blue-500/20 border-blue-500/30 text-blue-300 text-xs">
                        {study.industry}
                      </Badge>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-gray-500">Timeline:</span>
                      <span className="text-xs font-semibold text-gray-300">{study.timeline}</span>
                    </div>
                    <div className="pt-2">
                      <span className="text-sm font-bold text-green-400">{study.impact}</span>
                    </div>
                  </div>
                  <Button
                    onClick={() => handleDownloadCaseStudy(study.filename)}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white rounded-xl transition-all duration-300 hover:scale-105"
                  >
                    <Download className="w-4 h-4 mr-2" />
                    Download Case Study
                  </Button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Education Section */}
      <section id="education" className="py-16 md:py-20 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-xl bg-[#1A1A1A]/80 border border-[#2A2A2A] rounded-3xl p-8 md:p-12 shadow-2xl animate-fade-in-up">
            <h2 className="text-4xl md:text-5xl font-bold text-center mb-8 md:mb-12 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-slide-in-down">
              Education
            </h2>
            <div className="space-y-8">
              {portfolioData.education.map((edu, index) => (
                <div
                  key={index}
                  className="backdrop-blur-xl bg-black/60 border border-[#2A2A2A] rounded-2xl p-6 md:p-8 hover:bg-[#1A1A1A]/60 transition-all duration-300 animate-slide-in-left"
                  style={{ animationDelay: `${index * 0.2}s` }}
                >
                  <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-2xl flex items-center justify-center">
                        <GraduationCap className="w-8 h-8 text-white" />
                      </div>
                      <div>
                        <h3 className="text-xl md:text-2xl font-bold text-white">{edu.degree}</h3>
                        <p className="text-lg md:text-xl text-blue-400 font-semibold">{edu.school}</p>
                        <p className="text-gray-400">{edu.focus}</p>
                      </div>
                    </div>
                    <Badge className="bg-purple-500/20 border-purple-500/30 text-purple-300 px-4 py-2 w-fit mt-2 md:mt-0">
                      {edu.period}
                    </Badge>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {edu.achievements.map((achievement, i) => (
                      <Badge
                        key={i}
                        className="bg-yellow-500/20 border-yellow-500/30 text-yellow-300 px-4 py-2 animate-fade-in-up"
                        style={{ animationDelay: `${i * 0.1}s` }}
                      >
                        <Award className="w-3 h-3 mr-1" />
                        {achievement}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-16 md:py-20 px-4 relative z-10">
        <div className="max-w-5xl mx-auto">
          <div className="backdrop-blur-xl bg-[#1A1A1A]/80 border border-[#2A2A2A] rounded-3xl p-8 md:p-12 shadow-2xl animate-fade-in-up">
            <div className="text-center mb-8 md:mb-12">
              <h2 className="text-4xl md:text-5xl font-bold mb-6 md:mb-8 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-slide-in-down">
                Let's Connect
              </h2>
              <p className="text-lg md:text-xl text-gray-300 mb-6 md:mb-8 max-w-2xl mx-auto leading-relaxed animate-fade-in-up-delay">
                Ready to transform your product vision into reality? Let's discuss how data-driven insights can
                accelerate your business growth and create exceptional user experiences.
              </p>
            </div>
            <ContactForm />

            {/* Alternative Contact Methods */}
            <div className="mt-8 text-center">
              <p className="text-gray-400 mb-4">Or reach out directly:</p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <a
                  href="mailto:neel.ramteke@email.com"
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <Mail className="w-4 h-4" />
                  neel.ramteke@email.com
                </a>
                <a
                  href="tel:+1234567890"
                  className="inline-flex items-center gap-2 text-green-400 hover:text-green-300 transition-colors"
                >
                  <Phone className="w-4 h-4" />
                  +1 (234) 567-8900
                </a>
                <a
                  href="https://linkedin.com/in/neelramteke"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                  </svg>
                  LinkedIn Profile
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 relative z-10">
        <div className="max-w-7xl mx-auto">
          <div className="backdrop-blur-xl bg-[#1A1A1A]/80 border border-[#2A2A2A] rounded-3xl p-6 md:p-8 shadow-2xl text-center animate-fade-in-up">
            <p className="text-gray-400 text-base md:text-lg">
              Crafted with passion for innovation and data-driven excellence by{" "}
              {portfolioData.personalInfo?.name || "Professional"} ⚡
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
}
