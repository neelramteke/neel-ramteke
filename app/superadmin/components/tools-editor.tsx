"use client"

import { useState, useEffect } from "react"
import { getTools, createTool, updateTool, deleteTool } from "@/lib/supabase-admin"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Trash2, Edit, Plus, Save, X } from "lucide-react"

const colorOptions = [
  { name: "Blue", bg: "bg-blue-500", text: "text-blue-100" },
  { name: "Green", bg: "bg-green-500", text: "text-green-100" },
  { name: "Purple", bg: "bg-purple-500", text: "text-purple-100" },
  { name: "Orange", bg: "bg-orange-500", text: "text-orange-100" },
  { name: "Red", bg: "bg-red-500", text: "text-red-100" },
  { name: "Yellow", bg: "bg-yellow-500", text: "text-yellow-900" },
  { name: "Pink", bg: "bg-pink-500", text: "text-pink-100" },
  { name: "Indigo", bg: "bg-indigo-500", text: "text-indigo-100" },
  { name: "Cyan", bg: "bg-cyan-500", text: "text-cyan-100" },
  { name: "Gray", bg: "bg-gray-600", text: "text-gray-100" },
]

export default function ToolsEditor() {
  const [tools, setTools] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingTool, setEditingTool] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    color: "bg-blue-500",
    text_color: "text-blue-100",
  })
  const { toast } = useToast()

  useEffect(() => {
    loadTools()
  }, [])

  const loadTools = async () => {
    try {
      setIsLoading(true)
      const data = await getTools()
      setTools(data || [])
    } catch (error) {
      console.error("Error loading tools:", error)
      toast({
        title: "Error",
        description: "Failed to load tools",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      if (editingTool) {
        await updateTool(editingTool.id, formData)
        toast({ title: "Success", description: "Tool updated successfully" })
      } else {
        await createTool({ ...formData, order_index: tools.length })
        toast({ title: "Success", description: "Tool created successfully" })
      }

      setEditingTool(null)
      setIsCreating(false)
      setFormData({ name: "", color: "bg-blue-500", text_color: "text-blue-100" })
      loadTools()
    } catch (error) {
      console.error("Error saving tool:", error)
      toast({
        title: "Error",
        description: "Failed to save tool",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this tool?")) {
      try {
        await deleteTool(id)
        toast({ title: "Success", description: "Tool deleted successfully" })
        loadTools()
      } catch (error) {
        console.error("Error deleting tool:", error)
        toast({
          title: "Error",
          description: "Failed to delete tool",
          variant: "destructive",
        })
      }
    }
  }

  const startEdit = (tool) => {
    setEditingTool(tool)
    setFormData({
      name: tool.name,
      color: tool.color,
      text_color: tool.text_color,
    })
    setIsCreating(false)
  }

  const startCreate = () => {
    setIsCreating(true)
    setEditingTool(null)
    setFormData({ name: "", color: "bg-blue-500", text_color: "text-blue-100" })
  }

  const cancelEdit = () => {
    setEditingTool(null)
    setIsCreating(false)
    setFormData({ name: "", color: "bg-blue-500", text_color: "text-blue-100" })
  }

  const handleColorChange = (colorName) => {
    const selectedColor = colorOptions.find((c) => c.name === colorName)
    if (selectedColor) {
      setFormData((prev) => ({
        ...prev,
        color: selectedColor.bg,
        text_color: selectedColor.text,
      }))
    }
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
        <h2 className="text-2xl font-bold text-white">Tools & Technologies</h2>
        <Button onClick={startCreate} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Tool
        </Button>
      </div>

      {(isCreating || editingTool) && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">{editingTool ? "Edit Tool" : "Add New Tool"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name" className="text-gray-300">
                Tool Name
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
                placeholder="e.g., React, Python, Figma"
                className="bg-gray-700 border-gray-600 text-white"
              />
            </div>

            <div>
              <Label className="text-gray-300">Color Theme</Label>
              <Select onValueChange={handleColorChange}>
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue placeholder="Select a color" />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {colorOptions.map((color) => (
                    <SelectItem key={color.name} value={color.name} className="text-white">
                      <div className="flex items-center gap-2">
                        <div className={`w-4 h-4 rounded ${color.bg}`}></div>
                        {color.name}
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-gray-300">Preview:</span>
              <span className={`px-3 py-1 rounded-full text-sm ${formData.color} ${formData.text_color}`}>
                {formData.name || "Tool Name"}
              </span>
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
        {tools.map((tool) => (
          <Card key={tool.id} className="bg-gray-800 border-gray-700">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm ${tool.color} ${tool.text_color}`}>{tool.name}</span>
                </div>
                <div className="flex gap-2">
                  <Button onClick={() => startEdit(tool)} size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button onClick={() => handleDelete(tool.id)} size="sm" className="bg-red-600 hover:bg-red-700">
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {tools.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-4">No tools added yet</p>
          <Button onClick={startCreate} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Tool
          </Button>
        </div>
      )}
    </div>
  )
}
