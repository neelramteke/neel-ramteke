"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getAboutSection, updateAboutSection, uploadFile } from "@/lib/supabase-admin"
import { useToast } from "@/hooks/use-toast"
import { Save, Loader2, Plus, X } from "lucide-react"

export default function AboutSectionEditor() {
  const [aboutData, setAboutData] = useState({
    section_title: "",
    main_content: "",
    highlights: [],
    image_url: "",
    years_experience: 0,
    projects_completed: 0,
    clients_served: 0,
    awards_won: 0,
    show_stats: true,
    layout_type: "side-by-side",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [newHighlight, setNewHighlight] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    loadAboutData()
  }, [])

  const loadAboutData = async () => {
    try {
      setIsLoading(true)
      const data = await getAboutSection()
      if (data) {
        setAboutData(data)
      }
    } catch (error) {
      console.error("Error loading about data:", error)
      toast({
        title: "Error",
        description: "Failed to load about section data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)

      const updatedData = { ...aboutData }

      // Upload image if selected
      if (imageFile) {
        const imageUrl = await uploadFile(imageFile, "portfolio-images", `about/image-${Date.now()}.jpg`)
        updatedData.image_url = imageUrl
      }

      await updateAboutSection(updatedData)
      setAboutData(updatedData)

      toast({
        title: "Success",
        description: "About section updated successfully",
      })
    } catch (error) {
      console.error("Error saving about data:", error)
      toast({
        title: "Error",
        description: "Failed to save about section",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const addHighlight = () => {
    if (newHighlight.trim()) {
      setAboutData({
        ...aboutData,
        highlights: [...aboutData.highlights, newHighlight.trim()],
      })
      setNewHighlight("")
    }
  }

  const removeHighlight = (index: number) => {
    setAboutData({
      ...aboutData,
      highlights: aboutData.highlights.filter((_, i) => i !== index),
    })
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
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">About Section</h2>
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

      <div className="grid gap-6">
        {/* Content */}
        <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
          <CardHeader>
            <CardTitle className="text-white">Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="section_title" className="text-gray-300">
                Section Title
              </Label>
              <Input
                id="section_title"
                value={aboutData.section_title}
                onChange={(e) => setAboutData({ ...aboutData, section_title: e.target.value })}
                className="bg-[#1A1A1A] border-[#3A3A3A] text-white"
                placeholder="About Me"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="main_content" className="text-gray-300">
                Main Content
              </Label>
              <Textarea
                id="main_content"
                value={aboutData.main_content}
                onChange={(e) => setAboutData({ ...aboutData, main_content: e.target.value })}
                className="bg-[#1A1A1A] border-[#3A3A3A] text-white min-h-[150px]"
                placeholder="Write about yourself..."
              />
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Key Highlights</Label>
              <div className="flex gap-2">
                <Input
                  value={newHighlight}
                  onChange={(e) => setNewHighlight(e.target.value)}
                  className="bg-[#1A1A1A] border-[#3A3A3A] text-white"
                  placeholder="Add a highlight"
                  onKeyPress={(e) => e.key === "Enter" && addHighlight()}
                />
                <Button onClick={addHighlight} size="sm" className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4" />
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                {aboutData.highlights?.map((highlight, index) => (
                  <Badge key={index} variant="secondary" className="bg-green-500/20 text-green-400 border-green-500/30">
                    {highlight}
                    <Button
                      onClick={() => removeHighlight(index)}
                      size="sm"
                      variant="ghost"
                      className="ml-2 h-4 w-4 p-0 hover:bg-red-500/20"
                    >
                      <X className="w-3 h-3" />
                    </Button>
                  </Badge>
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">About Image</Label>
              <Input
                type="file"
                accept="image/*"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="bg-[#1A1A1A] border-[#3A3A3A] text-white"
              />
              {aboutData.image_url && (
                <img
                  src={aboutData.image_url || "/placeholder.svg"}
                  alt="About"
                  className="w-full h-48 object-cover rounded-lg"
                />
              )}
            </div>
          </CardContent>
        </Card>

        {/* Statistics */}
        <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              Statistics
              <Switch
                checked={aboutData.show_stats}
                onCheckedChange={(checked) => setAboutData({ ...aboutData, show_stats: checked })}
              />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="space-y-2">
                <Label htmlFor="years_experience" className="text-gray-300">
                  Years Experience
                </Label>
                <Input
                  id="years_experience"
                  type="number"
                  value={aboutData.years_experience}
                  onChange={(e) =>
                    setAboutData({ ...aboutData, years_experience: Number.parseInt(e.target.value) || 0 })
                  }
                  className="bg-[#1A1A1A] border-[#3A3A3A] text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="projects_completed" className="text-gray-300">
                  Projects Completed
                </Label>
                <Input
                  id="projects_completed"
                  type="number"
                  value={aboutData.projects_completed}
                  onChange={(e) =>
                    setAboutData({ ...aboutData, projects_completed: Number.parseInt(e.target.value) || 0 })
                  }
                  className="bg-[#1A1A1A] border-[#3A3A3A] text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="clients_served" className="text-gray-300">
                  Clients Served
                </Label>
                <Input
                  id="clients_served"
                  type="number"
                  value={aboutData.clients_served}
                  onChange={(e) => setAboutData({ ...aboutData, clients_served: Number.parseInt(e.target.value) || 0 })}
                  className="bg-[#1A1A1A] border-[#3A3A3A] text-white"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="awards_won" className="text-gray-300">
                  Awards Won
                </Label>
                <Input
                  id="awards_won"
                  type="number"
                  value={aboutData.awards_won}
                  onChange={(e) => setAboutData({ ...aboutData, awards_won: Number.parseInt(e.target.value) || 0 })}
                  className="bg-[#1A1A1A] border-[#3A3A3A] text-white"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
