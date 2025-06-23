"use client"

import { useState, useEffect } from "react"
import { getExperiences, createExperience, updateExperience, deleteExperience } from "@/lib/supabase-admin"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Trash2, Edit, Plus, Save, X, Briefcase } from "lucide-react"

export default function ExperiencesEditor() {
  const [experiences, setExperiences] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingExperience, setEditingExperience] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    company: "",
    period: "",
    description: "",
    achievements: [""],
  })
  const { toast } = useToast()

  useEffect(() => {
    loadExperiences()
  }, [])

  const loadExperiences = async () => {
    try {
      setIsLoading(true)
      const data = await getExperiences()
      setExperiences(data || [])
    } catch (error) {
      console.error("Error loading experiences:", error)
      toast({
        title: "Error",
        description: "Failed to load experiences",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      const dataToSave = {
        ...formData,
        achievements: formData.achievements.filter((a) => a.trim() !== ""),
      }

      if (editingExperience) {
        await updateExperience(editingExperience.id, dataToSave)
        toast({ title: "Success", description: "Experience updated successfully" })
      } else {
        await createExperience({ ...dataToSave, order_index: experiences.length })
        toast({ title: "Success", description: "Experience created successfully" })
      }

      setEditingExperience(null)
      setIsCreating(false)
      setFormData({ title: "", company: "", period: "", description: "", achievements: [""] })
      loadExperiences()
    } catch (error) {
      console.error("Error saving experience:", error)
      toast({
        title: "Error",
        description: "Failed to save experience",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this experience?")) {
      try {
        await deleteExperience(id)
        toast({ title: "Success", description: "Experience deleted successfully" })
        loadExperiences()
      } catch (error) {
        console.error("Error deleting experience:", error)
        toast({
          title: "Error",
          description: "Failed to delete experience",
          variant: "destructive",
        })
      }
    }
  }

  const startEdit = (experience) => {
    setEditingExperience(experience)
    setFormData({
      title: experience.title,
      company: experience.company,
      period: experience.period,
      description: experience.description,
      achievements: experience.achievements.length > 0 ? experience.achievements : [""],
    })
    setIsCreating(false)
  }

  const startCreate = () => {
    setIsCreating(true)
    setEditingExperience(null)
    setFormData({ title: "", company: "", period: "", description: "", achievements: [""] })
  }

  const cancelEdit = () => {
    setEditingExperience(null)
    setIsCreating(false)
    setFormData({ title: "", company: "", period: "", description: "", achievements: [""] })
  }

  const addAchievement = () => {
    setFormData((prev) => ({ ...prev, achievements: [...prev.achievements, ""] }))
  }

  const removeAchievement = (index) => {
    setFormData((prev) => ({
      ...prev,
      achievements: prev.achievements.filter((_, i) => i !== index),
    }))
  }

  const updateAchievement = (index, value) => {
    setFormData((prev) => ({
      ...prev,
      achievements: prev.achievements.map((achievement, i) => (i === index ? value : achievement)),
    }))
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white">Work Experience</h2>
        <Button onClick={startCreate} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Experience
        </Button>
      </div>

      {(isCreating || editingExperience) && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">{editingExperience ? "Edit Experience" : "Add New Experience"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-gray-300">
                  Job Title
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Senior Product Manager"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="company" className="text-gray-300">
                  Company
                </Label>
                <Input
                  id="company"
                  value={formData.company}
                  onChange={(e) => setFormData((prev) => ({ ...prev, company: e.target.value }))}
                  placeholder="e.g., Tech Corp"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="period" className="text-gray-300">
                Period
              </Label>
              <Input
                id="period"
                value={formData.period}
                onChange={(e) => setFormData((prev) => ({ ...prev, period: e.target.value }))}
                placeholder="e.g., Jan 2020 - Present"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="description" className="text-gray-300">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of your role and responsibilities..."
                className="bg-gray-700 border-gray-600 text-white"
                rows={3}
              />
            </div>

            <div>
              <Label className="text-gray-300">Key Achievements</Label>
              {formData.achievements.map((achievement, index) => (
                <div key={index} className="flex gap-2 mt-2">
                  <Input
                    value={achievement}
                    onChange={(e) => updateAchievement(index, e.target.value)}
                    placeholder="e.g., Increased user engagement by 40%"
                    className="bg-gray-700 border-gray-600 text-white"
                  />
                  <Button
                    onClick={() => removeAchievement(index)}
                    size="sm"
                    variant="outline"
                    className="border-gray-600 text-gray-300"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              <Button
                onClick={addAchievement}
                size="sm"
                variant="outline"
                className="mt-2 border-gray-600 text-gray-300"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Achievement
              </Button>
            </div>

            <div className="flex gap-2">
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button onClick={cancelEdit} variant="outline" className="border-gray-600 text-gray-300">
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {experiences.map((experience) => (
          <Card key={experience.id} className="bg-gray-800 border-gray-700">
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Briefcase className="w-5 h-5 text-blue-400" />
                    <h3 className="text-lg font-semibold text-white">{experience.title}</h3>
                  </div>
                  <p className="text-blue-400 font-medium">{experience.company}</p>
                  <p className="text-gray-400 text-sm mb-3">{experience.period}</p>
                  <p className="text-gray-300 mb-3">{experience.description}</p>
                  {experience.achievements && experience.achievements.length > 0 && (
                    <div>
                      <h4 className="text-white font-medium mb-2">Key Achievements:</h4>
                      <ul className="list-disc list-inside space-y-1">
                        {experience.achievements.map((achievement, index) => (
                          <li key={index} className="text-gray-300 text-sm">
                            {achievement}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
                <div className="flex gap-2 ml-4">
                  <Button onClick={() => startEdit(experience)} size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button onClick={() => handleDelete(experience.id)} size="sm" className="bg-red-600 hover:bg-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {experiences.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">No work experience added yet</p>
          <Button onClick={startCreate} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Experience
          </Button>
        </div>
      )}
    </div>
  )
}
