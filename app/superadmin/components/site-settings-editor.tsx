"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { getSiteSettings, updateSiteSettings, uploadFile } from "@/lib/supabase-admin"
import { useToast } from "@/hooks/use-toast"
import { Save, Loader2, Palette, Globe, Code } from "lucide-react"

export default function SiteSettingsEditor() {
  const [settings, setSettings] = useState({
    site_title: "",
    site_description: "",
    favicon_url: "",
    logo_url: "",
    primary_color: "#3B82F6",
    secondary_color: "#8B5CF6",
    background_color: "#000000",
    text_color: "#FFFFFF",
    font_family: "Inter",
    custom_css: "",
    google_analytics_id: "",
  })
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [faviconFile, setFaviconFile] = useState<File | null>(null)
  const [logoFile, setLogoFile] = useState<File | null>(null)
  const { toast } = useToast()

  useEffect(() => {
    loadSettings()
  }, [])

  const loadSettings = async () => {
    try {
      setIsLoading(true)
      const data = await getSiteSettings()
      if (data) {
        setSettings(data)
      }
    } catch (error) {
      console.error("Error loading settings:", error)
      toast({
        title: "Error",
        description: "Failed to load site settings",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      setIsSaving(true)

      const updatedSettings = { ...settings }

      // Upload favicon if selected
      if (faviconFile) {
        const faviconUrl = await uploadFile(faviconFile, "portfolio-images", `site/favicon-${Date.now()}.ico`)
        updatedSettings.favicon_url = faviconUrl
      }

      // Upload logo if selected
      if (logoFile) {
        const logoUrl = await uploadFile(logoFile, "portfolio-images", `site/logo-${Date.now()}.png`)
        updatedSettings.logo_url = logoUrl
      }

      await updateSiteSettings(updatedSettings)
      setSettings(updatedSettings)

      toast({
        title: "Success",
        description: "Site settings updated successfully",
      })
    } catch (error) {
      console.error("Error saving settings:", error)
      toast({
        title: "Error",
        description: "Failed to save site settings",
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
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-white">Site Settings</h2>
        <Button onClick={handleSave} disabled={isSaving} className="bg-blue-600 hover:bg-blue-700 text-white">
          {isSaving ? (
            <>
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="w-4 h-4 mr-2" />
              Save Settings
            </>
          )}
        </Button>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList className="grid w-full grid-cols-4 bg-[#2A2A2A]">
          <TabsTrigger value="general" className="text-white">
            <Globe className="w-4 h-4 mr-2" />
            General
          </TabsTrigger>
          <TabsTrigger value="branding" className="text-white">
            <Palette className="w-4 h-4 mr-2" />
            Branding
          </TabsTrigger>
          <TabsTrigger value="styling" className="text-white">
            <Code className="w-4 h-4 mr-2" />
            Styling
          </TabsTrigger>
          <TabsTrigger value="analytics" className="text-white">
            Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="general">
          <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
            <CardHeader>
              <CardTitle className="text-white">General Settings</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="site_title" className="text-gray-300">
                    Site Title
                  </Label>
                  <Input
                    id="site_title"
                    value={settings.site_title}
                    onChange={(e) => setSettings({ ...settings, site_title: e.target.value })}
                    className="bg-[#1A1A1A] border-[#3A3A3A] text-white"
                    placeholder="My Portfolio"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="site_description" className="text-gray-300">
                    Site Description
                  </Label>
                  <Input
                    id="site_description"
                    value={settings.site_description}
                    onChange={(e) => setSettings({ ...settings, site_description: e.target.value })}
                    className="bg-[#1A1A1A] border-[#3A3A3A] text-white"
                    placeholder="Professional Portfolio Website"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-gray-300">Favicon</Label>
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept=".ico,.png,.jpg,.jpeg"
                      onChange={(e) => setFaviconFile(e.target.files?.[0] || null)}
                      className="bg-[#1A1A1A] border-[#3A3A3A] text-white"
                    />
                    {settings.favicon_url && (
                      <img
                        src={settings.favicon_url || "/placeholder.svg"}
                        alt="Favicon"
                        className="w-8 h-8 object-cover rounded"
                      />
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label className="text-gray-300">Logo</Label>
                  <div className="flex gap-2">
                    <Input
                      type="file"
                      accept=".png,.jpg,.jpeg,.svg"
                      onChange={(e) => setLogoFile(e.target.files?.[0] || null)}
                      className="bg-[#1A1A1A] border-[#3A3A3A] text-white"
                    />
                    {settings.logo_url && (
                      <img
                        src={settings.logo_url || "/placeholder.svg"}
                        alt="Logo"
                        className="w-8 h-8 object-cover rounded"
                      />
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="branding">
          <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
            <CardHeader>
              <CardTitle className="text-white">Brand Colors</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="primary_color" className="text-gray-300">
                    Primary Color
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="primary_color"
                      type="color"
                      value={settings.primary_color}
                      onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                      className="w-12 h-10 p-1 bg-[#1A1A1A] border-[#3A3A3A]"
                    />
                    <Input
                      value={settings.primary_color}
                      onChange={(e) => setSettings({ ...settings, primary_color: e.target.value })}
                      className="bg-[#1A1A1A] border-[#3A3A3A] text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="secondary_color" className="text-gray-300">
                    Secondary Color
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="secondary_color"
                      type="color"
                      value={settings.secondary_color}
                      onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                      className="w-12 h-10 p-1 bg-[#1A1A1A] border-[#3A3A3A]"
                    />
                    <Input
                      value={settings.secondary_color}
                      onChange={(e) => setSettings({ ...settings, secondary_color: e.target.value })}
                      className="bg-[#1A1A1A] border-[#3A3A3A] text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="background_color" className="text-gray-300">
                    Background Color
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="background_color"
                      type="color"
                      value={settings.background_color}
                      onChange={(e) => setSettings({ ...settings, background_color: e.target.value })}
                      className="w-12 h-10 p-1 bg-[#1A1A1A] border-[#3A3A3A]"
                    />
                    <Input
                      value={settings.background_color}
                      onChange={(e) => setSettings({ ...settings, background_color: e.target.value })}
                      className="bg-[#1A1A1A] border-[#3A3A3A] text-white"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="text_color" className="text-gray-300">
                    Text Color
                  </Label>
                  <div className="flex gap-2">
                    <Input
                      id="text_color"
                      type="color"
                      value={settings.text_color}
                      onChange={(e) => setSettings({ ...settings, text_color: e.target.value })}
                      className="w-12 h-10 p-1 bg-[#1A1A1A] border-[#3A3A3A]"
                    />
                    <Input
                      value={settings.text_color}
                      onChange={(e) => setSettings({ ...settings, text_color: e.target.value })}
                      className="bg-[#1A1A1A] border-[#3A3A3A] text-white"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="font_family" className="text-gray-300">
                  Font Family
                </Label>
                <Input
                  id="font_family"
                  value={settings.font_family}
                  onChange={(e) => setSettings({ ...settings, font_family: e.target.value })}
                  className="bg-[#1A1A1A] border-[#3A3A3A] text-white"
                  placeholder="Inter, Arial, sans-serif"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="styling">
          <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
            <CardHeader>
              <CardTitle className="text-white">Custom CSS</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="custom_css" className="text-gray-300">
                  Custom CSS Code
                </Label>
                <Textarea
                  id="custom_css"
                  value={settings.custom_css}
                  onChange={(e) => setSettings({ ...settings, custom_css: e.target.value })}
                  className="bg-[#1A1A1A] border-[#3A3A3A] text-white font-mono min-h-[200px]"
                  placeholder="/* Add your custom CSS here */"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="analytics">
          <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
            <CardHeader>
              <CardTitle className="text-white">Analytics & Tracking</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="google_analytics_id" className="text-gray-300">
                  Google Analytics ID
                </Label>
                <Input
                  id="google_analytics_id"
                  value={settings.google_analytics_id}
                  onChange={(e) => setSettings({ ...settings, google_analytics_id: e.target.value })}
                  className="bg-[#1A1A1A] border-[#3A3A3A] text-white"
                  placeholder="G-XXXXXXXXXX"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
