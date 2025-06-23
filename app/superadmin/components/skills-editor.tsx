"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { getSkills, createSkill, updateSkill, deleteSkill } from "@/lib/supabase-admin"
import { useToast } from "@/hooks/use-toast"
import { Trash2, Edit, Plus, Save, X } from "lucide-react"

const iconOptions = [
  "Target",
  "BarChart3",
  "Users",
  "Brain",
  "TrendingUp",
  "Database",
  "Lightbulb",
  "Rocket",
  "Zap",
  "Settings",
  "Code",
  "Palette",
  "Monitor",
  "Smartphone",
  "Globe",
  "Shield",
  "Search",
  "PieChart",
  "LineChart",
  "Activity",
]

const categoryOptions = ["core", "technical", "analytical", "leadership", "creative", "business"]

export default function SkillsEditor() {
  const [skills, setSkills] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingSkill, setEditingSkill] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    skill_name: "",
    proficiency_level: 50,
    icon_name: "Target",
    category: "core",
  })
  const { toast } = useToast()

  useEffect(() => {
    loadSkills()
  }, [])

  const loadSkills = async () => {
    try {
      setIsLoading(true)
      const data = await getSkills()
      setSkills(data || [])
    } catch (error) {
      console.error("Error loading skills:", error)
      toast({
        title: "Error",
        description: "Failed to load skills",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      if (!formData.skill_name.trim()) {
        toast({
          title: "Error",
          description: "Skill name is required",
          variant: "destructive",
        })
        return
      }

      if (editingSkill) {
        await updateSkill(editingSkill.id, formData)
        toast({ title: "Success", description: "Skill updated successfully" })
      } else {
        await createSkill({ ...formData, order_index: skills.length })
        toast({ title: "Success", description: "Skill created successfully" })
      }

      setEditingSkill(null)
      setIsCreating(false)
      setFormData({ skill_name: "", proficiency_level: 50, icon_name: "Target", category: "core" })
      loadSkills()
    } catch (error) {
      console.error("Error saving skill:", error)
      toast({
        title: "Error",
        description: "Failed to save skill",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this skill?")) {
      try {
        await deleteSkill(id)
        toast({ title: "Success", description: "Skill deleted successfully" })
        loadSkills()
      } catch (error) {
        console.error("Error deleting skill:", error)
        toast({
          title: "Error",
          description: "Failed to delete skill",
          variant: "destructive",
        })
      }
    }
  }

  const startEdit = (skill) => {
    setEditingSkill(skill)
    setFormData({
      skill_name: skill.skill_name || skill.name,
      proficiency_level: skill.proficiency_level || skill.level,
      icon_name: skill.icon_name || skill.icon,
      category: skill.category,
    })
    setIsCreating(false)
  }

  const startCreate = () => {
    setIsCreating(true)
    setEditingSkill(null)
    setFormData({ skill_name: "", proficiency_level: 50, icon_name: "Target", category: "core" })
  }

  const cancelEdit = () => {
    setEditingSkill(null)
    setIsCreating(false)
    setFormData({ skill_name: "", proficiency_level: 50, icon_name: "Target", category: "core" })
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
      {/* Header */}
      <div className="flex justify-between items-center">
        <h3 className="text-2xl font-bold text-white">Skills Management</h3>
        <Button onClick={startCreate} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Skill
        </Button>
      </div>

      {/* Create/Edit Form */}
      {(isCreating || editingSkill) && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">{editingSkill ? "Edit Skill" : "Create New Skill"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="skill_name" className="text-gray-300">
                Skill Name
              </Label>
              <Input
                id="skill_name"
                value={formData.skill_name}
                onChange={(e) => setFormData({ ...formData, skill_name: e.target.value })}
                placeholder="e.g., Product Strategy"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label htmlFor="proficiency_level" className="text-gray-300">
                Proficiency Level: {formData.proficiency_level}%
              </Label>
              <Slider
                value={[formData.proficiency_level]}
                onValueChange={(value) => setFormData({ ...formData, proficiency_level: value[0] })}
                max={100}
                min={0}
                step={5}
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="icon_name" className="text-gray-300">
                Icon
              </Label>
              <Select
                value={formData.icon_name}
                onValueChange={(value) => setFormData({ ...formData, icon_name: value })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {iconOptions.map((icon) => (
                    <SelectItem key={icon} value={icon} className="text-white hover:bg-gray-600">
                      {icon}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="category" className="text-gray-300">
                Category
              </Label>
              <Select
                value={formData.category}
                onValueChange={(value) => setFormData({ ...formData, category: value })}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {categoryOptions.map((category) => (
                    <SelectItem key={category} value={category} className="text-white hover:bg-gray-600">
                      {category.charAt(0).toUpperCase() + category.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2 pt-4">
              <Button onClick={handleSave} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                Save
              </Button>
              <Button
                onClick={cancelEdit}
                variant="outline"
                className="border-gray-600 text-gray-300 hover:bg-gray-700"
              >
                <X className="w-4 h-4 mr-2" />
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Skills List */}
      <div className="grid gap-4">
        {skills.length === 0 ? (
          <Card className="bg-gray-800 border-gray-700">
            <CardContent className="p-8 text-center">
              <p className="text-gray-400">No skills found. Create your first skill!</p>
            </CardContent>
          </Card>
        ) : (
          skills.map((skill) => (
            <Card key={skill.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h4 className="text-lg font-semibold text-white">{skill.skill_name || skill.name}</h4>
                      <Badge className="bg-blue-600 text-blue-100">{skill.icon_name || skill.icon || "Target"}</Badge>
                      <Badge variant="outline" className="border-gray-600 text-gray-300">
                        {skill.category}
                      </Badge>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className="text-gray-400">Proficiency:</span>
                      <div className="flex-1 max-w-xs">
                        <div className="w-full bg-gray-700 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${skill.proficiency_level || skill.level}%` }}
                          ></div>
                        </div>
                      </div>
                      <span className="text-white font-semibold">{skill.proficiency_level || skill.level}%</span>
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button onClick={() => startEdit(skill)} size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => handleDelete(skill.id)} size="sm" className="bg-red-600 hover:bg-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  )
}
