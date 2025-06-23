"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getEducation, createEducation, updateEducation, deleteEducation } from "@/lib/supabase-admin"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, GraduationCap, Calendar, Award } from "lucide-react"

export default function EducationEditor() {
  const [education, setEducation] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingEducation, setEditingEducation] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    degree: "",
    school: "",
    period: "",
    focus: "",
    achievements: [""],
    order_index: 0,
  })
  const { toast } = useToast()

  useEffect(() => {
    loadEducation()
  }, [])

  const loadEducation = async () => {
    try {
      setIsLoading(true)
      const data = await getEducation()
      setEducation(data || [])
    } catch (error) {
      console.error("Error loading education:", error)
      toast({
        title: "Error",
        description: "Failed to load education records",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleAchievementChange = (index, value) => {
    const newAchievements = [...formData.achievements]
    newAchievements[index] = value
    setFormData((prev) => ({ ...prev, achievements: newAchievements }))
  }

  const addAchievement = () => {
    setFormData((prev) => ({ ...prev, achievements: [...prev.achievements, ""] }))
  }

  const removeAchievement = (index) => {
    const newAchievements = formData.achievements.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, achievements: newAchievements }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.degree.trim() || !formData.school.trim()) {
      toast({
        title: "Error",
        description: "Degree and school are required",
        variant: "destructive",
      })
      return
    }

    try {
      const educationData = {
        ...formData,
        achievements: formData.achievements.filter((a) => a.trim() !== ""),
        order_index: formData.order_index || education.length,
      }

      if (editingEducation) {
        await updateEducation(editingEducation.id, educationData)
        toast({
          title: "Success",
          description: "Education record updated successfully",
        })
      } else {
        await createEducation(educationData)
        toast({
          title: "Success",
          description: "Education record created successfully",
        })
      }

      resetForm()
      loadEducation()
    } catch (error) {
      console.error("Error saving education:", error)
      toast({
        title: "Error",
        description: "Failed to save education record",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (educationItem) => {
    setEditingEducation(educationItem)
    setFormData({
      degree: educationItem.degree || "",
      school: educationItem.school || "",
      period: educationItem.period || "",
      focus: educationItem.focus || "",
      achievements: educationItem.achievements || [""],
      order_index: educationItem.order_index || 0,
    })
    setIsCreating(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this education record?")) return

    try {
      await deleteEducation(id)
      toast({
        title: "Success",
        description: "Education record deleted successfully",
      })
      loadEducation()
    } catch (error) {
      console.error("Error deleting education:", error)
      toast({
        title: "Error",
        description: "Failed to delete education record",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      degree: "",
      school: "",
      period: "",
      focus: "",
      achievements: [""],
      order_index: 0,
    })
    setEditingEducation(null)
    setIsCreating(false)
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
        <h2 className="text-xl font-semibold text-white">Education Management</h2>
        <Button onClick={() => setIsCreating(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Education
        </Button>
      </div>

      {isCreating && (
        <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
          <CardHeader>
            <CardTitle className="text-white">{editingEducation ? "Edit Education" : "Add New Education"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="degree" className="text-gray-300">
                    Degree *
                  </Label>
                  <Input
                    id="degree"
                    value={formData.degree}
                    onChange={(e) => handleInputChange("degree", e.target.value)}
                    className="bg-[#1A1A1A] border-[#3A3A3A] text-white"
                    placeholder="Bachelor of Science"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="school" className="text-gray-300">
                    School/University *
                  </Label>
                  <Input
                    id="school"
                    value={formData.school}
                    onChange={(e) => handleInputChange("school", e.target.value)}
                    className="bg-[#1A1A1A] border-[#3A3A3A] text-white"
                    placeholder="University Name"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="period" className="text-gray-300">
                    Period
                  </Label>
                  <Input
                    id="period"
                    value={formData.period}
                    onChange={(e) => handleInputChange("period", e.target.value)}
                    className="bg-[#1A1A1A] border-[#3A3A3A] text-white"
                    placeholder="2018 - 2022"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="focus" className="text-gray-300">
                    Field of Study
                  </Label>
                  <Input
                    id="focus"
                    value={formData.focus}
                    onChange={(e) => handleInputChange("focus", e.target.value)}
                    className="bg-[#1A1A1A] border-[#3A3A3A] text-white"
                    placeholder="Computer Science"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Achievements</Label>
                {formData.achievements.map((achievement, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={achievement}
                      onChange={(e) => handleAchievementChange(index, e.target.value)}
                      className="bg-[#1A1A1A] border-[#3A3A3A] text-white"
                      placeholder="Achievement or honor"
                    />
                    {formData.achievements.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeAchievement(index)}
                        variant="outline"
                        size="sm"
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button
                  type="button"
                  onClick={addAchievement}
                  variant="outline"
                  size="sm"
                  className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Achievement
                </Button>
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                  {editingEducation ? "Update" : "Create"} Education
                </Button>
                <Button
                  type="button"
                  onClick={resetForm}
                  variant="outline"
                  className="border-gray-500 text-gray-300 hover:bg-gray-700"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {education.length === 0 ? (
          <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <GraduationCap className="w-12 h-12 text-gray-500 mb-4" />
              <p className="text-gray-400 text-center">
                No education records yet. Add your first education record to get started.
              </p>
            </CardContent>
          </Card>
        ) : (
          education.map((edu) => (
            <Card key={edu.id} className="bg-[#2A2A2A] border-[#3A3A3A]">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-start gap-3">
                    <div className="p-2 bg-blue-500/20 rounded-lg">
                      <GraduationCap className="w-5 h-5 text-blue-400" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{edu.degree}</h3>
                      <p className="text-blue-400 font-medium">{edu.school}</p>
                      {edu.focus && <p className="text-gray-400 text-sm">Focus: {edu.focus}</p>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      onClick={() => handleEdit(edu)}
                      size="sm"
                      variant="outline"
                      className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      onClick={() => handleDelete(edu.id)}
                      size="sm"
                      variant="outline"
                      className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {edu.period && (
                  <div className="flex items-center gap-2 mb-3">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300 text-sm">{edu.period}</span>
                  </div>
                )}

                {edu.achievements && edu.achievements.length > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Award className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-300 text-sm font-medium">Achievements:</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {edu.achievements.map((achievement, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-green-500/20 text-green-400 border-green-500/30"
                        >
                          {achievement}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
