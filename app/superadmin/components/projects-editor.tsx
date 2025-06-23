"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { getProjects, createProject, updateProject, deleteProject, uploadFile } from "@/lib/supabase-admin"
import { useToast } from "@/hooks/use-toast"
import { Plus, Edit, Trash2, Code, ExternalLink, Github, Upload, Clock, CheckCircle } from "lucide-react"

export default function ProjectsEditor() {
  const [projects, setProjects] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingProject, setEditingProject] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    tech: [""],
    duration: "",
    role: "",
    image_url: "",
    project_url: "",
    github_url: "",
    status: "completed",
    order_index: 0,
  })
  const [imageFile, setImageFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  const statusOptions = [
    { value: "completed", label: "Completed", color: "bg-green-500/20 text-green-400" },
    { value: "in-progress", label: "In Progress", color: "bg-blue-500/20 text-blue-400" },
    { value: "planning", label: "Planning", color: "bg-yellow-500/20 text-yellow-400" },
    { value: "on-hold", label: "On Hold", color: "bg-gray-500/20 text-gray-400" },
  ]

  useEffect(() => {
    loadProjects()
  }, [])

  const loadProjects = async () => {
    try {
      setIsLoading(true)
      const data = await getProjects()
      setProjects(data || [])
    } catch (error) {
      console.error("Error loading projects:", error)
      toast({
        title: "Error",
        description: "Failed to load projects",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleTechChange = (index, value) => {
    const newTech = [...formData.tech]
    newTech[index] = value
    setFormData((prev) => ({ ...prev, tech: newTech }))
  }

  const addTechField = () => {
    setFormData((prev) => ({ ...prev, tech: [...prev.tech, ""] }))
  }

  const removeTechField = (index) => {
    const newTech = formData.tech.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, tech: newTech }))
  }

  const handleImageUpload = async (file) => {
    if (!file) return

    try {
      setIsUploading(true)
      const fileName = `projects/${Date.now()}-${file.name}`
      const imageUrl = await uploadFile(file, "portfolio-images", fileName)
      setFormData((prev) => ({ ...prev, image_url: imageUrl }))
      toast({
        title: "Success",
        description: "Image uploaded successfully",
      })
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error",
        description: "Failed to upload image",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.title.trim()) {
      toast({
        title: "Error",
        description: "Project title is required",
        variant: "destructive",
      })
      return
    }

    try {
      const projectData = {
        ...formData,
        tech: formData.tech.filter((t) => t.trim() !== ""),
        order_index: formData.order_index || projects.length,
      }

      if (editingProject) {
        await updateProject(editingProject.id, projectData)
        toast({
          title: "Success",
          description: "Project updated successfully",
        })
      } else {
        await createProject(projectData)
        toast({
          title: "Success",
          description: "Project created successfully",
        })
      }

      resetForm()
      loadProjects()
    } catch (error) {
      console.error("Error saving project:", error)
      toast({
        title: "Error",
        description: "Failed to save project",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (project) => {
    setEditingProject(project)
    setFormData({
      title: project.title || "",
      description: project.description || "",
      tech: project.tech || [""],
      duration: project.duration || "",
      role: project.role || "",
      image_url: project.image_url || "",
      project_url: project.project_url || "",
      github_url: project.github_url || "",
      status: project.status || "completed",
      order_index: project.order_index || 0,
    })
    setIsCreating(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this project?")) return

    try {
      await deleteProject(id)
      toast({
        title: "Success",
        description: "Project deleted successfully",
      })
      loadProjects()
    } catch (error) {
      console.error("Error deleting project:", error)
      toast({
        title: "Error",
        description: "Failed to delete project",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      tech: [""],
      duration: "",
      role: "",
      image_url: "",
      project_url: "",
      github_url: "",
      status: "completed",
      order_index: 0,
    })
    setEditingProject(null)
    setIsCreating(false)
    setImageFile(null)
  }

  const getStatusBadge = (status) => {
    const statusOption = statusOptions.find((opt) => opt.value === status)
    return statusOption || statusOptions[0]
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
        <h2 className="text-xl font-semibold text-white">Projects Management</h2>
        <Button onClick={() => setIsCreating(true)} className="bg-blue-600 hover:bg-blue-700 text-white">
          <Plus className="w-4 h-4 mr-2" />
          Add Project
        </Button>
      </div>

      {isCreating && (
        <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
          <CardHeader>
            <CardTitle className="text-white">{editingProject ? "Edit Project" : "Add New Project"}</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-gray-300">
                    Project Title *
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    className="bg-[#1A1A1A] border-[#3A3A3A] text-white"
                    placeholder="My Awesome Project"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="status" className="text-gray-300">
                    Status
                  </Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                    <SelectTrigger className="bg-[#1A1A1A] border-[#3A3A3A] text-white">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-[#1A1A1A] border-[#3A3A3A]">
                      {statusOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value} className="text-white">
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="duration" className="text-gray-300">
                    Duration
                  </Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => handleInputChange("duration", e.target.value)}
                    className="bg-[#1A1A1A] border-[#3A3A3A] text-white"
                    placeholder="3 months"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="role" className="text-gray-300">
                    Your Role
                  </Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    className="bg-[#1A1A1A] border-[#3A3A3A] text-white"
                    placeholder="Full Stack Developer"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="project_url" className="text-gray-300">
                    Project URL
                  </Label>
                  <Input
                    id="project_url"
                    value={formData.project_url}
                    onChange={(e) => handleInputChange("project_url", e.target.value)}
                    className="bg-[#1A1A1A] border-[#3A3A3A] text-white"
                    placeholder="https://myproject.com"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="github_url" className="text-gray-300">
                    GitHub URL
                  </Label>
                  <Input
                    id="github_url"
                    value={formData.github_url}
                    onChange={(e) => handleInputChange("github_url", e.target.value)}
                    className="bg-[#1A1A1A] border-[#3A3A3A] text-white"
                    placeholder="https://github.com/username/repo"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description" className="text-gray-300">
                  Description
                </Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  className="bg-[#1A1A1A] border-[#3A3A3A] text-white min-h-[100px]"
                  placeholder="Describe your project..."
                />
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Technologies Used</Label>
                {formData.tech.map((tech, index) => (
                  <div key={index} className="flex gap-2">
                    <Input
                      value={tech}
                      onChange={(e) => handleTechChange(index, e.target.value)}
                      className="bg-[#1A1A1A] border-[#3A3A3A] text-white"
                      placeholder="React, Node.js, etc."
                    />
                    {formData.tech.length > 1 && (
                      <Button
                        type="button"
                        onClick={() => removeTechField(index)}
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
                  onClick={addTechField}
                  variant="outline"
                  size="sm"
                  className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Add Technology
                </Button>
              </div>

              <div className="space-y-2">
                <Label className="text-gray-300">Project Image</Label>
                <div className="flex gap-2">
                  <Input
                    type="file"
                    accept="image/*"
                    onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                    className="bg-[#1A1A1A] border-[#3A3A3A] text-white"
                  />
                  <Button
                    type="button"
                    onClick={() => imageFile && handleImageUpload(imageFile)}
                    disabled={!imageFile || isUploading}
                    variant="outline"
                    className="border-blue-500 text-blue-500 hover:bg-blue-500 hover:text-white"
                  >
                    {isUploading ? (
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-400" />
                    ) : (
                      <Upload className="w-4 h-4" />
                    )}
                  </Button>
                </div>
                {formData.image_url && (
                  <div className="mt-2">
                    <img
                      src={formData.image_url || "/placeholder.svg"}
                      alt="Project preview"
                      className="w-32 h-20 object-cover rounded-lg border border-[#3A3A3A]"
                    />
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button type="submit" className="bg-green-600 hover:bg-green-700 text-white">
                  {editingProject ? "Update" : "Create"} Project
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
        {projects.length === 0 ? (
          <Card className="bg-[#2A2A2A] border-[#3A3A3A]">
            <CardContent className="flex flex-col items-center justify-center py-12">
              <Code className="w-12 h-12 text-gray-500 mb-4" />
              <p className="text-gray-400 text-center">No projects yet. Add your first project to get started.</p>
            </CardContent>
          </Card>
        ) : (
          projects.map((project) => {
            const statusBadge = getStatusBadge(project.status)
            return (
              <Card key={project.id} className="bg-[#2A2A2A] border-[#3A3A3A]">
                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex items-start gap-3">
                      {project.image_url ? (
                        <img
                          src={project.image_url || "/placeholder.svg"}
                          alt={project.title}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                      ) : (
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                          <Code className="w-5 h-5 text-blue-400" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-lg font-semibold text-white">{project.title}</h3>
                        <p className="text-gray-400 text-sm mb-2">{project.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-400">
                          {project.role && (
                            <span className="flex items-center gap-1">
                              <Code className="w-3 h-3" />
                              {project.role}
                            </span>
                          )}
                          {project.duration && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {project.duration}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Badge className={statusBadge.color}>
                        {project.status === "completed" && <CheckCircle className="w-3 h-3 mr-1" />}
                        {statusBadge.label}
                      </Badge>
                      <Button
                        onClick={() => handleEdit(project)}
                        size="sm"
                        variant="outline"
                        className="border-yellow-500 text-yellow-500 hover:bg-yellow-500 hover:text-black"
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                      <Button
                        onClick={() => handleDelete(project.id)}
                        size="sm"
                        variant="outline"
                        className="border-red-500 text-red-500 hover:bg-red-500 hover:text-white"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>

                  {project.tech && project.tech.length > 0 && (
                    <div className="flex flex-wrap gap-2 mb-3">
                      {project.tech.map((tech, index) => (
                        <Badge
                          key={index}
                          variant="secondary"
                          className="bg-blue-500/20 text-blue-400 border-blue-500/30"
                        >
                          {tech}
                        </Badge>
                      ))}
                    </div>
                  )}

                  <div className="flex gap-2">
                    {project.project_url && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-green-500 text-green-500 hover:bg-green-500 hover:text-white"
                        onClick={() => window.open(project.project_url, "_blank")}
                      >
                        <ExternalLink className="w-3 h-3 mr-1" />
                        Live Demo
                      </Button>
                    )}
                    {project.github_url && (
                      <Button
                        size="sm"
                        variant="outline"
                        className="border-gray-500 text-gray-400 hover:bg-gray-500 hover:text-white"
                        onClick={() => window.open(project.github_url, "_blank")}
                      >
                        <Github className="w-3 h-3 mr-1" />
                        GitHub
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })
        )}
      </div>
    </div>
  )
}
