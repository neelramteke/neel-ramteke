"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Save, Loader2 } from "lucide-react"
import { getPersonalInfo, uploadFile } from "@/lib/supabase-admin"
import { useToast } from "@/hooks/use-toast"
import { updatePersonalInfoServer } from "@/app/superadmin/actions/personal-info"

export default function PersonalInfoEditor() {
  const [personalInfo, setPersonalInfo] = useState({
    name: "",
    title: "",
    description: "",
    email: "",
    phone: "",
    linkedin_url: "",
    github_url: "",
    profile_image_url: "",
    resume_url: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [profileImageFile, setProfileImageFile] = useState<File | null>(null)
  const [resumeFile, setResumeFile] = useState<File | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadPersonalInfo()
  }, [])

  const loadPersonalInfo = async () => {
    try {
      setIsLoading(true)
      const data = await getPersonalInfo()
      if (data) {
        setPersonalInfo(data)
      }
    } catch (error) {
      console.error("Error loading personal info:", error)
      toast({
        title: "Error",
        description: "Failed to load personal information",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)

      const updatedInfo = { ...personalInfo }

      // Upload profile image if selected
      if (profileImageFile) {
        const imageUrl = await uploadFile(
          profileImageFile,
          "portfolio-images",
          `profile/${Date.now()}-${profileImageFile.name}`,
        )
        updatedInfo.profile_image_url = imageUrl
      }

      // Upload resume if selected
      if (resumeFile) {
        const resumeUrl = await uploadFile(resumeFile, "portfolio-documents", `resume/${Date.now()}-${resumeFile.name}`)
        updatedInfo.resume_url = resumeUrl
      }

      await updatePersonalInfoServer(updatedInfo)
      setPersonalInfo(updatedInfo)

      toast({
        title: "Success",
        description: "Personal information updated successfully",
      })
    } catch (error) {
      console.error("Error saving personal info:", error)
      toast({
        title: "Error",
        description: "Failed to save personal information",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <Loader2 className="w-8 h-8 animate-spin text-blue-400" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <Label htmlFor="name" className="text-white">
              Full Name
            </Label>
            <Input
              id="name"
              value={personalInfo.name}
              onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
              className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
            />
          </div>

          <div>
            <Label htmlFor="title" className="text-white">
              Professional Title
            </Label>
            <Input
              id="title"
              value={personalInfo.title}
              onChange={(e) => setPersonalInfo({ ...personalInfo, title: e.target.value })}
              className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
            />
          </div>

          <div>
            <Label htmlFor="description" className="text-white">
              Description
            </Label>
            <Textarea
              id="description"
              value={personalInfo.description}
              onChange={(e) => setPersonalInfo({ ...personalInfo, description: e.target.value })}
              className="bg-[#2A2A2A] border-[#3A3A3A] text-white min-h-[100px]"
            />
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <Label htmlFor="email" className="text-white">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              value={personalInfo.email}
              onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
              className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
            />
          </div>

          <div>
            <Label htmlFor="phone" className="text-white">
              Phone
            </Label>
            <Input
              id="phone"
              value={personalInfo.phone}
              onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
              className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
            />
          </div>

          <div>
            <Label htmlFor="linkedin" className="text-white">
              LinkedIn URL
            </Label>
            <Input
              id="linkedin"
              value={personalInfo.linkedin_url}
              onChange={(e) => setPersonalInfo({ ...personalInfo, linkedin_url: e.target.value })}
              className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
            />
          </div>

          <div>
            <Label htmlFor="github" className="text-white">
              GitHub URL
            </Label>
            <Input
              id="github"
              value={personalInfo.github_url}
              onChange={(e) => setPersonalInfo({ ...personalInfo, github_url: e.target.value })}
              className="bg-[#2A2A2A] border-[#3A3A3A] text-white"
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
          <CardContent className="p-4">
            <Label className="text-white">Profile Image</Label>
            <div className="mt-2 space-y-2">
              {personalInfo.profile_image_url && (
                <img
                  src={personalInfo.profile_image_url || "/placeholder.svg"}
                  alt="Profile"
                  className="w-20 h-20 rounded-full object-cover"
                />
              )}
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setProfileImageFile(e.target.files?.[0] || null)}
                className="bg-[#3A3A3A] border-[#4A4A4A] text-white"
              />
            </div>
          </CardContent>
        </Card>

        <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
          <CardContent className="p-4">
            <Label className="text-white">Resume</Label>
            <div className="mt-2 space-y-2">
              {personalInfo.resume_url && (
                <a
                  href={personalInfo.resume_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-400 hover:text-blue-300 text-sm"
                >
                  View Current Resume
                </a>
              )}
              <Input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) => setResumeFile(e.target.files?.[0] || null)}
                className="bg-[#3A3A3A] border-[#4A4A4A] text-white"
              />
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white">
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
