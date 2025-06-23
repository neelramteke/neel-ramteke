"use client"

import { useState, useEffect } from "react"
import { getProducts, createProduct, updateProduct, deleteProduct } from "@/lib/supabase-admin"
import { useToast } from "@/hooks/use-toast"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Trash2,
  Edit,
  Plus,
  Save,
  X,
  Brain,
  TrendingUp,
  BarChart3,
  Target,
  Rocket,
  Zap,
  Settings,
  Code,
} from "lucide-react"

const iconOptions = [
  { name: "Brain", icon: Brain },
  { name: "TrendingUp", icon: TrendingUp },
  { name: "BarChart3", icon: BarChart3 },
  { name: "Target", icon: Target },
  { name: "Rocket", icon: Rocket },
  { name: "Zap", icon: Zap },
  { name: "Settings", icon: Settings },
  { name: "Code", icon: Code },
]

const statusOptions = ["Live", "Beta", "Development", "Planning", "Archived"]

export default function ProductsEditor() {
  const [products, setProducts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [editingProduct, setEditingProduct] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    status: "Development",
    users: "",
    impact: "",
    icon: "Brain",
  })
  const { toast } = useToast()

  useEffect(() => {
    loadProducts()
  }, [])

  const loadProducts = async () => {
    try {
      setIsLoading(true)
      const data = await getProducts()
      setProducts(data || [])
    } catch (error) {
      console.error("Error loading products:", error)
      toast({
        title: "Error",
        description: "Failed to load products",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSave = async () => {
    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, formData)
        toast({ title: "Success", description: "Product updated successfully" })
      } else {
        await createProduct({ ...formData, order_index: products.length })
        toast({ title: "Success", description: "Product created successfully" })
      }

      setEditingProduct(null)
      setIsCreating(false)
      setFormData({ title: "", description: "", status: "Development", users: "", impact: "", icon: "Brain" })
      loadProducts()
    } catch (error) {
      console.error("Error saving product:", error)
      toast({
        title: "Error",
        description: "Failed to save product",
        variant: "destructive",
      })
    }
  }

  const handleDelete = async (id) => {
    if (confirm("Are you sure you want to delete this product?")) {
      try {
        await deleteProduct(id)
        toast({ title: "Success", description: "Product deleted successfully" })
        loadProducts()
      } catch (error) {
        console.error("Error deleting product:", error)
        toast({
          title: "Error",
          description: "Failed to delete product",
          variant: "destructive",
        })
      }
    }
  }

  const startEdit = (product) => {
    setEditingProduct(product)
    setFormData({
      title: product.title,
      description: product.description,
      status: product.status,
      users: product.users,
      impact: product.impact,
      icon: product.icon,
    })
    setIsCreating(false)
  }

  const startCreate = () => {
    setIsCreating(true)
    setEditingProduct(null)
    setFormData({ title: "", description: "", status: "Development", users: "", impact: "", icon: "Brain" })
  }

  const cancelEdit = () => {
    setEditingProduct(null)
    setIsCreating(false)
    setFormData({ title: "", description: "", status: "Development", users: "", impact: "", icon: "Brain" })
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Live":
        return "bg-green-500/20 border-green-500/30 text-green-300"
      case "Beta":
        return "bg-yellow-500/20 border-yellow-500/30 text-yellow-300"
      case "Development":
        return "bg-blue-500/20 border-blue-500/30 text-blue-300"
      case "Planning":
        return "bg-purple-500/20 border-purple-500/30 text-purple-300"
      case "Archived":
        return "bg-gray-500/20 border-gray-500/30 text-gray-300"
      default:
        return "bg-blue-500/20 border-blue-500/30 text-blue-300"
    }
  }

  const getIcon = (iconName) => {
    const iconOption = iconOptions.find((opt) => opt.name === iconName)
    return iconOption ? iconOption.icon : Brain
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
        <h2 className="text-2xl font-bold text-white">Products & Services</h2>
        <Button onClick={startCreate} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="w-4 h-4 mr-2" />
          Add Product
        </Button>
      </div>

      {(isCreating || editingProduct) && (
        <Card className="bg-gray-800 border-gray-700">
          <CardHeader>
            <CardTitle className="text-white">{editingProduct ? "Edit Product" : "Add New Product"}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="title" className="text-gray-300">
                  Product Title
                </Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., AI Analytics Platform"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label className="text-gray-300">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData((prev) => ({ ...prev, status: value }))}
                >
                  <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-700 border-gray-600">
                    {statusOptions.map((status) => (
                      <SelectItem key={status} value={status} className="text-white">
                        {status}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="description" className="text-gray-300">
                Description
              </Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                placeholder="Brief description of your product..."
                className="bg-gray-700 border-gray-600 text-white"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="users" className="text-gray-300">
                  Users/Customers
                </Label>
                <Input
                  id="users"
                  value={formData.users}
                  onChange={(e) => setFormData((prev) => ({ ...prev, users: e.target.value }))}
                  placeholder="e.g., 10K+ active users"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
              <div>
                <Label htmlFor="impact" className="text-gray-300">
                  Impact/Results
                </Label>
                <Input
                  id="impact"
                  value={formData.impact}
                  onChange={(e) => setFormData((prev) => ({ ...prev, impact: e.target.value }))}
                  placeholder="e.g., 40% efficiency increase"
                  className="bg-gray-700 border-gray-600 text-white"
                />
              </div>
            </div>

            <div>
              <Label className="text-gray-300">Icon</Label>
              <Select
                value={formData.icon}
                onValueChange={(value) => setFormData((prev) => ({ ...prev, icon: value }))}
              >
                <SelectTrigger className="bg-gray-700 border-gray-600 text-white">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-700 border-gray-600">
                  {iconOptions.map((option) => {
                    const IconComponent = option.icon
                    return (
                      <SelectItem key={option.name} value={option.name} className="text-white">
                        <div className="flex items-center gap-2">
                          <IconComponent className="w-4 h-4" />
                          {option.name}
                        </div>
                      </SelectItem>
                    )
                  })}
                </SelectContent>
              </Select>
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
        {products.map((product) => {
          const IconComponent = getIcon(product.icon)
          return (
            <Card key={product.id} className="bg-gray-800 border-gray-700">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-blue-500/20 rounded-lg">
                        <IconComponent className="w-6 h-6 text-blue-400" />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-white">{product.title}</h3>
                        <span className={`px-2 py-1 rounded-full text-xs border ${getStatusColor(product.status)}`}>
                          {product.status}
                        </span>
                      </div>
                    </div>
                    <p className="text-gray-300 mb-3">{product.description}</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                      {product.users && (
                        <div>
                          <span className="text-gray-400">Users: </span>
                          <span className="text-white">{product.users}</span>
                        </div>
                      )}
                      {product.impact && (
                        <div>
                          <span className="text-gray-400">Impact: </span>
                          <span className="text-white">{product.impact}</span>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex gap-2 ml-4">
                    <Button onClick={() => startEdit(product)} size="sm" className="bg-yellow-600 hover:bg-yellow-700">
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button onClick={() => handleDelete(product.id)} size="sm" className="bg-red-600 hover:bg-red-700">
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {products.length === 0 && !isLoading && (
        <div className="text-center py-12">
          <Rocket className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <p className="text-gray-400 mb-4">No products added yet</p>
          <Button onClick={startCreate} className="bg-blue-600 hover:bg-blue-700">
            <Plus className="w-4 h-4 mr-2" />
            Add Your First Product
          </Button>
        </div>
      )}
    </div>
  )
}
