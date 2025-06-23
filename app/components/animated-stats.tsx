"use client"

import type React from "react"

import { useState, useEffect, useRef } from "react"
import { TrendingUp, Rocket, DollarSign, Target, BarChart3, Zap } from "lucide-react"

interface StatItem {
  id: string
  label: string
  value: number
  suffix: string
  prefix: string
  icon: React.ComponentType<{ className?: string }>
  color: string
  description: string
}

interface AnimatedCounterProps {
  end: number
  duration: number
  prefix: string
  suffix: string
  isVisible: boolean
}

function AnimatedCounter({ end, duration, prefix, suffix, isVisible }: AnimatedCounterProps) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (!isVisible) return

    let startTime: number
    let animationFrame: number

    const animate = (currentTime: number) => {
      if (!startTime) startTime = currentTime
      const progress = Math.min((currentTime - startTime) / duration, 1)

      // Easing function for smooth animation
      const easeOutQuart = 1 - Math.pow(1 - progress, 4)
      const currentCount = Math.floor(easeOutQuart * end)

      setCount(currentCount)

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate)
      }
    }

    animationFrame = requestAnimationFrame(animate)

    return () => {
      if (animationFrame) {
        cancelAnimationFrame(animationFrame)
      }
    }
  }, [end, duration, isVisible])

  return (
    <span className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent">
      {prefix}
      {count.toLocaleString()}
      {suffix}
    </span>
  )
}

export default function AnimatedStats() {
  const [isVisible, setIsVisible] = useState(false)
  const sectionRef = useRef<HTMLDivElement>(null)

  const stats: StatItem[] = [
    {
      id: "products",
      label: "Products Launched",
      value: 15,
      suffix: "+",
      prefix: "",
      icon: Rocket,
      color: "from-purple-500 to-pink-500",
      description: "Successful product launches from concept to market",
    },
    {
      id: "revenue",
      label: "Revenue Generated",
      value: 10,
      suffix: "M+",
      prefix: "₹",
      icon: DollarSign,
      color: "from-green-500 to-emerald-500",
      description: "Direct revenue impact through product initiatives",
    },
    {
      id: "growth",
      label: "User Growth",
      value: 300,
      suffix: "%",
      prefix: "",
      icon: TrendingUp,
      color: "from-indigo-500 to-purple-500",
      description: "Average user base growth across products",
    },
    {
      id: "projects",
      label: "Projects Completed",
      value: 25,
      suffix: "+",
      prefix: "",
      icon: Target,
      color: "from-teal-500 to-blue-500",
      description: "Successfully delivered strategic initiatives",
    },
    {
      id: "analytics",
      label: "Data Points Analyzed",
      value: 1,
      suffix: "M+",
      prefix: "",
      icon: BarChart3,
      color: "from-yellow-500 to-orange-500",
      description: "Data-driven insights and decision making",
    },
    {
      id: "efficiency",
      label: "Process Efficiency",
      value: 40,
      suffix: "%",
      prefix: "+",
      icon: Zap,
      color: "from-pink-500 to-rose-500",
      description: "Average improvement in operational efficiency",
    },
  ]

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
        }
      },
      {
        threshold: 0.3,
        rootMargin: "0px 0px -100px 0px",
      },
    )

    if (sectionRef.current) {
      observer.observe(sectionRef.current)
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current)
      }
    }
  }, [])

  return (
    <div
      ref={sectionRef}
      className="backdrop-blur-xl bg-[#1A1A1A]/80 border border-[#2A2A2A] rounded-3xl p-12 shadow-2xl animate-fade-in-up"
    >
      <div className="text-center mb-16">
        <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent animate-slide-in-down">
          Impact & Achievements
        </h2>
        <p className="text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed animate-fade-in-up-delay">
          Numbers that tell the story of innovation, leadership, and measurable business impact across my product
          management journey.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {stats.map((stat, index) => {
          const Icon = stat.icon
          return (
            <div
              key={stat.id}
              className="backdrop-blur-xl bg-black/60 border border-[#2A2A2A] rounded-2xl p-8 text-center hover:bg-[#1A1A1A]/60 transition-all duration-500 hover:scale-105 group animate-fade-in-up"
              style={{
                animationDelay: `${index * 100}ms`,
              }}
            >
              {/* Icon */}
              <div className="mb-6 flex justify-center">
                <div
                  className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${stat.color} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </div>
              </div>

              {/* Animated Counter */}
              <div className="mb-4">
                <AnimatedCounter
                  end={stat.value}
                  duration={2000 + index * 200}
                  prefix={stat.prefix}
                  suffix={stat.suffix}
                  isVisible={isVisible}
                />
              </div>

              {/* Label */}
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-blue-300 transition-colors duration-300">
                {stat.label}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
                {stat.description}
              </p>

              {/* Animated Progress Bar */}
              <div className="mt-6">
                <div className="w-full bg-[#2A2A2A] rounded-full h-1">
                  <div
                    className={`h-1 rounded-full bg-gradient-to-r ${stat.color} transition-all duration-2000 ease-out`}
                    style={{
                      width: isVisible ? "100%" : "0%",
                      transitionDelay: `${index * 100}ms`,
                    }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </div>

      {/* Additional Metrics Row */}
      <div className="mt-16 grid grid-cols-2 md:grid-cols-3 gap-8">
        <div className="text-center animate-fade-in-up" style={{ animationDelay: "0.5s" }}>
          <div className="text-2xl font-bold text-blue-400 mb-2">
            <AnimatedCounter end={98} duration={2500} prefix="" suffix="%" isVisible={isVisible} />
          </div>
          <p className="text-gray-400 text-sm">Customer Satisfaction</p>
        </div>
        <div className="text-center animate-fade-in-up" style={{ animationDelay: "0.6s" }}>
          <div className="text-2xl font-bold text-green-400 mb-2">
            <AnimatedCounter end={85} duration={2700} prefix="" suffix="%" isVisible={isVisible} />
          </div>
          <p className="text-gray-400 text-sm">On-Time Delivery</p>
        </div>
        <div className="text-center animate-fade-in-up" style={{ animationDelay: "0.7s" }}>
          <div className="text-2xl font-bold text-orange-400 mb-2">
            <AnimatedCounter end={95} duration={2600} prefix="" suffix="%" isVisible={isVisible} />
          </div>
          <p className="text-gray-400 text-sm">Stakeholder Approval</p>
        </div>
      </div>

      {/* Achievement Highlights */}
      <div className="mt-16 grid md:grid-cols-2 gap-6">
        <div className="backdrop-blur-xl bg-black/40 border border-[#2A2A2A] rounded-xl p-6 text-center animate-slide-in-left">
          <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <TrendingUp className="w-6 h-6 text-white" />
          </div>
          <h4 className="text-lg font-bold text-white mb-2">Innovation Leader</h4>
          <p className="text-gray-400 text-sm">Led breakthrough AI initiatives that transformed user experience</p>
        </div>
        <div className="backdrop-blur-xl bg-black/40 border border-[#2A2A2A] rounded-xl p-6 text-center animate-slide-in-right">
          <div className="w-12 h-12 bg-gradient-to-r from-green-500 to-teal-500 rounded-xl flex items-center justify-center mx-auto mb-4">
            <Target className="w-6 h-6 text-white" />
          </div>
          <h4 className="text-lg font-bold text-white mb-2">Strategic Vision</h4>
          <p className="text-gray-400 text-sm">Successfully executed long-term product roadmaps</p>
        </div>
      </div>
    </div>
  )
}
