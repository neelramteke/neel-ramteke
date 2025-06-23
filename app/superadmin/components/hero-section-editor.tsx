"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getHeroSection, updateHeroSection, uploadFile } from "@/lib/supabase-admin"
import { useToast } from "@/hooks/use-toast"
import { Save, Loader2, Plus, X, Play } from "lucide-react"

export default function HeroSectionEditor() {
  const [heroData, setHeroData] = useState({
    main_heading: "",
    sub_heading: "",
    description: "",
    background_image_url: "",
    profile_image_url: "",
    cta_button_text: "",
    cta_button_url: "",
    show_animated_text: true,
    animated_words: [],
    background_video_url: "",
    overlay_opacity: 80,
    text_alignment: "center",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [backgroundFile, setBackgroundFile] = useState<File | null>(null)
  const [profileFile, setProfileFile] = useState<File | null>(null)
  const [videoFile, setVideoFile] = useState<File | null>(null)
  const [newAnimatedWord, setNewAnimatedWord] = useState("")
  const { toast } = useToast()

  useEffect(() => {
    loadHeroData()
  }, [])

  const loadHeroData = async () => {
    try {
      setIsLoading(true)
      const data = await getHeroSection()
      if (data) {
        setHeroData(data)
      }
    } catch (error) {
      console.error("Error loading hero data:", error)
      toast({
        title: "Error",
        description: "Failed to load hero section data",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)

      const updatedData = { ...heroData }

      // Upload background image if selected
      if (backgroundFile) {
        const bgUrl = await uploadFile(backgroundFile, "portfolio-images", `hero/bg-${Date.now()}.jpg`)
        updatedData.background_image_url = bgUrl
      }

      // Upload profile image if selected
      if (profileFile) {
        const profileUrl = await uploadFile(profileFile, "portfolio-images", `hero/profile-${Date.now()}.jpg`)
        updatedData.profile_image_url = profileUrl
      }

      // Upload video if selected
      if (videoFile) {
        const videoUrl = await uploadFile(videoFile, "portfolio-videos", `hero/video-${Date.now()}.mp4`)
        updatedData.background_video_url = videoUrl
      }

      await updateHeroSection(updatedData)
      setHeroData(updatedData)

      toast({
        title: "Success",
        description: "Hero section updated successfully",
      })
    } catch (error) {
      console.error("Error saving hero data:", error)
      toast({
        title: "Error",
        description: "Failed to save hero section",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const addAnimatedWord = () => {
    if (newAnimatedWord.trim()) {
      setHeroData({
        ...heroData,
        animated_words: [...heroData.animated_words, newAnimatedWord.trim()],
      })
      setNewAnimatedWord("")
    }
  }

  const removeAnimatedWord = (index: number) => {
    setHeroData({
      ...heroData,
      animated_words: heroData.animated_words.filter((_, i) => i !== index),
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
        <h2 className="text-xl font-semibold text-white">Hero Section</h2>
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
        {/* Text Content */}
        <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
          <CardHeader>
            <CardTitle className="text-white">Text Content</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="main_heading" className="text-gray-300">
                  Main Heading
                </Label>
                <Input
                  id="main_heading"
                  value={heroData.main_heading}
                  onChange={(e) => setHeroData({ ...heroData, main_heading: e.target.value })}
                  className="bg-[#1A1A1A] border-[#3A3A3A] text-white"
                  placeholder="Your Name"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="sub_heading" className="text-gray-300">
                  Sub Heading
                </Label>
                <Input
                  id="sub_heading"
                  value={heroData.sub_heading}
                  onChange={(e) => setHeroData({ ...heroData, sub_heading: e.target.value })}
                  className="bg-[#1A1A1A] border-[#3A3A3A] text-white"
                  placeholder="Your Professional Title"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-gray-300">
                Description
              </Label>
              <Textarea
                id="description"
                value={heroData.description}
                onChange={(e) => setHeroData({ ...heroData, description: e.target.value })}
                className="bg-[#1A1A1A] border-[#3A3A3A] text-white min-h-[100px]"
                placeholder="Your professional description..."
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="cta_button_text" className="text-gray-300">
                  CTA Button Text
                </Label>
                <Input
                  id="cta_button_text"
                  value={heroData.cta_button_text}
                  onChange={(e) => setHeroData({ ...heroData, cta_button_text: e.target.value })}
                  className="bg-[#1A1A1A] border-[#3A3A3A] text-white"
                  placeholder="Download Resume"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cta_button_url" className="text-gray-300">
                  CTA Button URL
                </Label>
                <Input
                  id="cta_button_url"
                  value={heroData.cta_button_url}
                  onChange={(e) => setHeroData({ ...heroData, cta_button_url: e.target.value })}
                  className="bg-[#1A1A1A] border-[#3A3A3A] text-white"
                  placeholder="/resume.pdf"
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Animated Text */}
        <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
          <CardHeader>
            <CardTitle className="text-white flex items-center gap-2">
              Animated Text
              <Switch
                checked={heroData.show_animated_text}
                onCheckedChange={(checked) => setHeroData({ ...heroData, show_animated_text: checked })}
              />
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex gap-2">
              <Input
                value={newAnimatedWord}
                onChange={(e) => setNewAnimatedWord(e.target.value)}
                className="bg-[#1A1A1A] border-[#3A3A3A] text-white"
                placeholder="Add animated word/phrase"
                onKeyPress={(e) => e.key === "Enter" && addAnimatedWord()}
              />
              <Button onClick={addAnimatedWord} size="sm" className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex flex-wrap gap-2">
              {heroData.animated_words?.map((word, index) => (
                <Badge key={index} variant="secondary" className="bg-blue-500/20 text-blue-400 border-blue-500/30">
                  {word}
                  <Button
                    onClick={() => removeAnimatedWord(index)}
                    size="sm"
                    variant="ghost"
                    className="ml-2 h-4 w-4 p-0 hover:bg-red-500/20"
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Media */}
        <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
          <CardHeader>
            <CardTitle className="text-white">Media</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label className="text-gray-300">Background Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setBackgroundFile(e.target.files?.[0] || null)}
                  className="bg-[#1A1A1A] border-[#3A3A3A] text-white"
                />
                {heroData.background_image_url && (
                  <img
                    src={heroData.background_image_url || "/placeholder.svg"}
                    alt="Background"
                    className="w-full h-32 object-cover rounded-lg"
                  />
                )}
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Profile Image</Label>
                <Input
                  type="file"
                  accept="image/*"
                  onChange={(e) => setProfileFile(e.target.files?.[0] || null)}
                  className="bg-[#1A1A1A] border-[#3A3A3A] text-white"
                />
                {heroData.profile_image_url && (
                  <img
                    src={heroData.profile_image_url || "/placeholder.svg"}
                    alt="Profile"
                    className="w-32 h-32 object-cover rounded-full mx-auto"
                  />
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-gray-300">Background Video (Optional)</Label>
              <Input
                type="file"
                accept="video/*"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                className="bg-[#1A1A1A] border-[#3A3A3A] text-white"
              />
              {heroData.background_video_url && (
                <div className="flex items-center gap-2 text-blue-400">
                  <Play className="w-4 h-4" />
                  <span className="text-sm">Video uploaded</span>
                </div>
              )}
            </div>

            <div className="space-y-2">
              <Label htmlFor="overlay_opacity" className="text-gray-300">
                Overlay Opacity: {heroData.overlay_opacity}%
              </Label>
              <input
                type="range"
                id="overlay_opacity"
                min="0"
                max="100"
                value={heroData.overlay_opacity}
                onChange={(e) => setHeroData({ ...heroData, overlay_opacity: Number.parseInt(e.target.value) })}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
