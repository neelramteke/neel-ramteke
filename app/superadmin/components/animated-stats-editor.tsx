"use client"

import { useState, useEffect } from "react"
import { getAnimatedStats, createAnimatedStat, updateAnimatedStat, deleteAnimatedStat } from "@/lib/supabase-admin"
import { useToast } from "@/hooks/use-toast"

const iconOptions = [
  "Rocket",
  "DollarSign",
  "TrendingUp",
  "Target",
  "BarChart3",
  "Zap",
  "Users",
  "Award",
  "Star",
  "Trophy",
]

const colorOptions = [
  "from-purple-500 to-pink-500",
  "from-green-500 to-emerald-500",
  "from-indigo-500 to-purple-500",
  "from-teal-500 to-blue-500",
  "from-yellow-500 to-orange-500",
  "from-pink-500 to-rose-500",
  "from-blue-500 to-cyan-500",
  "from-red-500 to-pink-500",
]

export default function AnimatedStatsEditor() {
  const [stats, setStats] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingStat, setEditingStat] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    label: "",
    value: 0,
    suffix: "",
    prefix: "",
    icon: "Rocket",
    color: "from-purple-500 to-pink-500",
    description: "",
  })
  const { toast } = useToast()

  useEffect(() => {
    loadStats()
  }, [])

  const loadStats = async () => {
    try {
      setIsLoading(true)
      const data = await getAnimatedStats()
      setStats(data || [])
    } catch (error) {
      console.error("Error loading stats:", error)
      toast({
        title: "Error",
        description: "Failed to load animated stats",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      if (editingStat) {
        await updateAnimatedStat(editingStat.id, formData)
        toast({ title: "Success", description: "Stat updated successfully" })
      } else {
        await createAnimatedStat({ ...formData, order_index: stats.length })
        toast({ title: "Success", description: "Stat created successfully" })
      }

      setEditingStat(null)
      setIsCreating(false)
      setFormData({
        label: "",
        value: 0,
        suffix: "",
        prefix: "",
        icon: "Rocket",
        color: "from-purple-500 to-pink-500",
        description: "",
      })
      loadStats()
    } catch (error) {
      console.error("Error saving stat:", error)
      toast({
        title: "Error",
        description: "Failed to save stat",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this stat?")) {
      try {
        await deleteAnimatedStat(id)
        toast({ title: "Success", description: "Stat deleted successfully" })
        loadStats()
      } catch (error) {
        console.error("Error deleting stat:", error)
        toast({
          title: "Error",
          description: "Failed to delete stat",
          variant: "destructive",
        })
      }
    }
  }

  const startEdit = (stat) => {
    setEditingStat(stat)
    setFormData({
      label: stat.label,
      value: stat.value,
      suffix: stat.suffix,
      prefix: stat.prefix,
      icon: stat.icon,
      color: stat.color,
      description: stat.description,
    })
    setIsCreating(false)
  }

  const startCreate = () => {
    setIsCreating(true)
    setEditingStat(null)
    setFormData({
      label: "",
      value: 0,
      suffix: "",
      prefix: "",
      icon: "Rocket",
      color: "from-purple-500 to-pink-500",
      description: "",
    })
  }

  const cancelEdit = () => {
    setEditingStat(null)
    setIsCreating(false)
    setFormData({
      label: "",
      value: 0,
      suffix: "",
      prefix: "",
      icon: "Rocket",
      color: "from-purple-500 to-pink-500",
      description: "",
    })
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-400"></div>
      </div>
    )
  }

  return <div className="p-4 text-center text-gray-400">Animated Stats Editor - Coming Soon</div>
}
