"use client"

import { useState, useEffect } from "react"
import {
  getCertifications,
  createCertification,
  updateCertification,
  deleteCertification,
  uploadFile,
} from "@/lib/supabase-admin"
import { useToast } from "@/hooks/use-toast"

export default function CertificationsEditor() {
  const [certifications, setCertifications] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingCertification, setEditingCertification] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    issuing_organization: "",
    issue_date: "",
    expiration_date: "",
    credential_id: "",
    credential_url: "",
    description: "",
    skills: [""],
    image_url: "",
    status: "active",
    order_index: 0,
  })
  const [imageFile, setImageFile] = useState(null)
  const [isUploading, setIsUploading] = useState(false)
  const { toast } = useToast()

  useEffect(() => {
    loadCertifications()
  }, [])

  const loadCertifications = async () => {
    try {
      setIsLoading(true)
      const data = await getCertifications()
      setCertifications(data || [])
    } catch (error) {
      console.error("Error loading certifications:", error)
      toast({
        title: "Error",
        description: "Failed to load certifications",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }))
  }

  const handleSkillChange = (index, value) => {
    const newSkills = [...formData.skills]
    newSkills[index] = value
    setFormData((prev) => ({ ...prev, skills: newSkills }))
  }

  const addSkillField = () => {
    setFormData((prev) => ({ ...prev, skills: [...prev.skills, ""] }))
  }

  const removeSkillField = (index) => {
    const newSkills = formData.skills.filter((_, i) => i !== index)
    setFormData((prev) => ({ ...prev, skills: newSkills }))
  }

  const handleImageUpload = async (file) => {
    if (!file) return

    try {
      setIsUploading(true)
      const fileName = `certifications/${Date.now()}-${file.name}`
      const imageUrl = await uploadFile(file, "portfolio-images", fileName)
      setFormData((prev) => ({ ...prev, image_url: imageUrl }))
      toast({
        title: "Success",
        description: "Certificate image uploaded successfully",
      })
    } catch (error) {
      console.error("Error uploading image:", error)
      toast({
        title: "Error",
        description: "Failed to upload certificate image",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (!formData.name.trim() || !formData.issuing_organization.trim()) {
      toast({
        title: "Error",
        description: "Certification name and issuing organization are required",
        variant: "destructive",
      })
      return
    }

    try {
      const certificationData = {
        ...formData,
        skills: formData.skills.filter((s) => s.trim() !== ""),
        order_index: formData.order_index || certifications.length,
      }

      if (editingCertification) {
        await updateCertification(editingCertification.id, certificationData)
        toast({
          title: "Success",
          description: "Certification updated successfully",
        })
      } else {
        await createCertification(certificationData)
        toast({
          title: "Success",
          description: "Certification created successfully",
        })
      }

      resetForm()
      loadCertifications()
    } catch (error) {
      console.error("Error saving certification:", error)
      toast({
        title: "Error",
        description: "Failed to save certification",
        variant: "destructive",
      })
    }
  }

  const handleEdit = (certification) => {
    setEditingCertification(certification)
    setFormData({
      name: certification.name || "",
      issuing_organization: certification.issuing_organization || "",
      issue_date: certification.issue_date || "",
      expiration_date: certification.expiration_date || "",
      credential_id: certification.credential_id || "",
      credential_url: certification.credential_url || "",
      description: certification.description || "",
      skills: certification.skills || [""],
      image_url: certification.image_url || "",
      status: certification.status || "active",
      order_index: certification.order_index || 0,
    })
    setIsCreating(true)
  }

  const handleDelete = async (id) => {
    if (!confirm("Are you sure you want to delete this certification?")) return

    try {
      await deleteCertification(id)
      toast({
        title: "Success",
        description: "Certification deleted successfully",
      })
      loadCertifications()
    } catch (error) {
      console.error("Error deleting certification:", error)
      toast({
        title: "Error",
        description: "Failed to delete certification",
        variant: "destructive",
      })
    }
  }

  const resetForm = () => {
    setFormData({
      name: "",
      issuing_organization: "",
      issue_date: "",
      expiration_date: "",
      credential_id: "",
      credential_url: "",
      description: "",
      skills: [""],
      image_url: "",
      status: "active",
      order_index: 0,
    })
    setEditingCertification(null)
    setIsCreating(false)
    setImageFile(null)
  }

  const formatDate = (dateString) => {
    if (!dateString) return ""
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
    })
  }

  const isExpired = (expirationDate) => {
    if (!expirationDate) return false
    return new Date(expirationDate) < new Date()
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  return <div className="p-4 text-center text-gray-400">Certifications Editor - Coming Soon</div>
}
