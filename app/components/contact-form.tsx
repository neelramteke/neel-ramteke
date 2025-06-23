"use client"

import type React from "react"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CardContent } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { submitContactForm } from "../actions/contact-action"
import { Mail, User, MessageSquare, Send, CheckCircle, AlertCircle } from "lucide-react"

interface FormData {
  name: string
  email: string
  subject: string
  message: string
}

interface FormErrors {
  name?: string
  email?: string
  subject?: string
  message?: string
}

export default function ContactForm() {
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    subject: "",
    message: "",
  })
  const [errors, setErrors] = useState<FormErrors>({})
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitStatus, setSubmitStatus] = useState<"idle" | "success" | "error">("idle")
  const [submitMessage, setSubmitMessage] = useState("")

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {}

    // Name validation
    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    } else if (formData.name.trim().length < 2) {
      newErrors.name = "Name must be at least 2 characters"
    }

    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!emailRegex.test(formData.email)) {
      newErrors.email = "Please enter a valid email address"
    }

    // Subject validation
    if (!formData.subject.trim()) {
      newErrors.subject = "Subject is required"
    } else if (formData.subject.trim().length < 5) {
      newErrors.subject = "Subject must be at least 5 characters"
    }

    // Message validation
    if (!formData.message.trim()) {
      newErrors.message = "Message is required"
    } else if (formData.message.trim().length < 10) {
      newErrors.message = "Message must be at least 10 characters"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }))

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: undefined }))
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!validateForm()) {
      return
    }

    setIsSubmitting(true)
    setSubmitStatus("idle")

    try {
      const formDataObj = new FormData()
      Object.entries(formData).forEach(([key, value]) => {
        formDataObj.append(key, value)
      })

      const result = await submitContactForm(formDataObj)

      if (result.success) {
        setSubmitStatus("success")
        setSubmitMessage(result.message)
        setFormData({ name: "", email: "", subject: "", message: "" })
      } else {
        setSubmitStatus("error")
        setSubmitMessage(result.message)
      }
    } catch (error) {
      setSubmitStatus("error")
      setSubmitMessage("An unexpected error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto">
      <div className="backdrop-blur-xl bg-black/60 border border-[#2A2A2A] rounded-2xl p-6 md:p-8 shadow-xl">
        <CardContent className="p-0">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Name Field */}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-gray-300 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-400" />
                Full Name
              </Label>
              <Input
                id="name"
                type="text"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                className={`bg-[#1A1A1A]/80 border-[#2A2A2A] text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl ${
                  errors.name ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""
                }`}
                placeholder="Enter your full name"
              />
              {errors.name && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email Field */}
            <div className="space-y-2">
              <Label htmlFor="email" className="text-gray-300 flex items-center gap-2">
                <Mail className="w-4 h-4 text-blue-400" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleInputChange("email", e.target.value)}
                className={`bg-[#1A1A1A]/80 border-[#2A2A2A] text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl ${
                  errors.email ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""
                }`}
                placeholder="your.email@example.com"
              />
              {errors.email && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Subject Field */}
            <div className="space-y-2">
              <Label htmlFor="subject" className="text-gray-300 flex items-center gap-2">
                <MessageSquare className="w-4 h-4 text-blue-400" />
                Subject
              </Label>
              <Input
                id="subject"
                type="text"
                value={formData.subject}
                onChange={(e) => handleInputChange("subject", e.target.value)}
                className={`bg-[#1A1A1A]/80 border-[#2A2A2A] text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl ${
                  errors.subject ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""
                }`}
                placeholder="What would you like to discuss?"
              />
              {errors.subject && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.subject}
                </p>
              )}
            </div>

            {/* Message Field */}
            <div className="space-y-2">
              <Label htmlFor="message" className="text-gray-300">
                Message
              </Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) => handleInputChange("message", e.target.value)}
                className={`bg-[#1A1A1A]/80 border-[#2A2A2A] text-white placeholder-gray-500 focus:border-blue-500 focus:ring-blue-500/20 rounded-xl min-h-[120px] resize-none ${
                  errors.message ? "border-red-400 focus:border-red-400 focus:ring-red-400/20" : ""
                }`}
                placeholder="Tell me about your project, goals, or how I can help you..."
              />
              {errors.message && (
                <p className="text-red-400 text-sm flex items-center gap-1">
                  <AlertCircle className="w-3 h-3" />
                  {errors.message}
                </p>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-500 hover:to-purple-500 text-white py-4 rounded-2xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold hover:scale-105 hover:shadow-xl"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Sending Message...
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <Send className="w-4 h-4" />
                  Send Message
                </div>
              )}
            </Button>

            {/* Status Messages */}
            {submitStatus === "success" && (
              <div className="p-4 bg-green-500/20 border border-green-500/30 rounded-xl backdrop-blur-sm">
                <p className="text-green-400 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5" />
                  {submitMessage}
                </p>
              </div>
            )}

            {submitStatus === "error" && (
              <div className="p-4 bg-red-500/20 border border-red-500/30 rounded-xl">
                <p className="text-red-400 flex items-center gap-2">
                  <AlertCircle className="w-5 h-5" />
                  {submitMessage}
                </p>
              </div>
            )}
          </form>
        </CardContent>
      </div>
    </div>
  )
}
