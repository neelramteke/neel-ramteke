"use client"

import { useState, useEffect } from "react"
import { getCaseStudies, createCaseStudy, updateCaseStudy, deleteCaseStudy, uploadFile } from "@/lib/supabase-admin"
import { useToast } from "@/hooks/use-toast"

export default function CaseStudiesEditor() {
  const [caseStudies, setCaseStudies] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingCaseStudy, setEditingCaseStudy] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    company: "",
    industry: "",
    challenge: "",
    solution: "",
    results: "",
    metrics: [""],
    tools_used: [""],
    duration: "",
    team_size: "",
    image_url: "",
    document_url: "",
    external_url: "",
    status: "published",
    order_index: 0,
  })
  const [imageFile, setImageFile] = useState(null)
  const [documentFile, setDocumentFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadCaseStudies()
  }, [])

  const loadCaseStudies = async () => {
    try {
      setIsLoading(true)
      const data = await getCaseStudies()
      setCaseStudies(data || [])
    } catch (error) {
      console.error("Error loading case studies:", error)
      toast({
        title: "Error",
        description: "Failed to load case studies",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleArrayChange = (field, index, value) => {
    const newArray = [...formData[field]]
    newArray[index] = value
    setFormData((prev) => ({ ...prev, [field]: newArray }))
  }

  const addArrayField = (field) => {
    setFormData((prev) => ({ ...prev, [field]: [...prev[field], ""] }))
  }

  const removeArrayField = (field, index) => {
    const newArray = formData[field].filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, [field]: newArray }))
  }

  const handleFileUpload = async (file, type) => {
    if (!file) return

    try {
      setIsUploading(true)
      const fileName = `case-studies/${type}/${Date.now()}-${file.name}`
      const fileUrl = await uploadFile(file, "portfolio-files", fileName)

      if (type === "image") {
        setFormData((prev) => ({ ...prev, image_url: fileUrl }))
      } else if (type === "document") {
        setFormData((prev) => ({ ...prev, document_url: fileUrl }))
      }

      toast({
        title: "Success",
        description: `${type} uploaded successfully`,
      })
    } catch (error) {
      console.error(`Error uploading ${type}:`, error)
      toast({
        title: "Error",
        description: `Failed to upload ${type}`,
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
        description: "Case study title is required",
        variant: "destructive",
      })
      return
    }

    try {
      const caseStudyData = {
        ...formData,
        metrics: formData.metrics.filter((m) => m.trim() !== ""),
        tools_used: formData.tools_used.filter((t) => t.trim() !== ""),
        order_index: formData.order_index || caseStudies.length,
      }

      if (editingCaseStudy) {
        await updateCaseStudy(editingCaseStudy.id, caseStudyData)
        toast({
          title: "Success",
          description: "Case study updated successfully",
        })
      } else {
        await createCaseStudy(caseStudyData)
        toast({
          title: "Success",
          description: "Case study created successfully",
        })
      }

      resetForm()
      loadCaseStudies()
    } catch (error) {
      console.error("Error saving case study:", error)
      toast({
        title: "Error",
        description: "Failed to save case study",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (caseStudy) => {
    setEditingCaseStudy(caseStudy)
    setFormData({
      title: caseStudy.title || "",
      description: caseStudy.description || "",
      company: caseStudy.company || "",
      industry: caseStudy.industry || "",
      challenge: caseStudy.challenge || "",
      solution: caseStudy.solution || "",
      results: caseStudy.results || "",
      metrics: caseStudy.metrics || [""],
      tools_used: caseStudy.tools_used || [""],
      duration: caseStudy.duration || "",
      team_size: caseStudy.team_size || "",
      image_url: caseStudy.image_url || "",
      document_url: caseStudy.document_url || "",
      external_url: caseStudy.external_url || "",
      status: caseStudy.status || "published",
      order_index: caseStudy.order_index || 0,
    })
    setIsCreating(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this case study?")) return

    try {
      await deleteCaseStudy(id)
      toast({
        title: "Success",
        description: "Case study deleted successfully",
      })
      loadCaseStudies()
    } catch (error) {
      console.error("Error deleting case study:", error)
      toast({
        title: "Error",
        description: "Failed to delete case study",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      company: "",
      industry: "",
      challenge: "",
      solution: "",
      results: "",
      metrics: [""],
      tools_used: [""],
      duration: "",
      team_size: "",
      image_url: "",
      document_url: "",
      external_url: "",
      status: "published",
      order_index: 0,
    })
    setEditingCaseStudy(null)
    setIsCreating(false)
    setImageFile(null)
    setDocumentFile(null)
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  return <div className="p-4 text-center text-gray-400">Case Studies Editor - Coming Soon</div>
}
