"use client"

import type React from "react"
import { useState, useRef } from "react"
import { supabase, type Product } from "@/lib/supabase"
import { Upload, X, Save, ArrowLeft, ImageIcon } from "lucide-react"
import Image from "next/image"

interface ProductFormProps {
  product?: Product | null
  onSave: () => void
  onCancel: () => void
}

export default function ProductForm({ product, onSave, onCancel }: ProductFormProps) {
  const [formData, setFormData] = useState({
    name: product?.name || "",
    price: product?.price || 0,
    description: product?.description || "",
    short_description: product?.short_description || "",
    category: product?.category || "",
    slug: product?.slug || "",
    whatsapp_message: product?.whatsapp_message || "",
    image_url: product?.image_url || "",
  })
  const [loading, setLoading] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const generateSlug = (name: string) => {
    return name
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .trim()
  }

  const handleNameChange = (name: string) => {
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }))
  }

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setUploading(true)
    try {
      const fileExt = file.name.split(".").pop()
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `${fileName}`

      // Upload file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from("product-images")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        })

      if (uploadError) {
        console.error("Upload error:", uploadError)
        throw uploadError
      }

      // Get public URL
      const { data: urlData } = supabase.storage.from("product-images").getPublicUrl(filePath)

      setFormData((prev) => ({
        ...prev,
        image_url: urlData.publicUrl,
      }))
    } catch (error) {
      console.error("Error uploading image:", error)
      alert("Error uploading image. Please try again.")
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const endpoint = "/api/admin/products" + (product ? `?id=${product.id}` : "")
      const method = product ? "PUT" : "POST"

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error || "Failed")

      onSave()
    } catch (error) {
      console.error("Error saving product:", error)
      alert("Error saving product")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={onCancel}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft size={20} />
            </button>
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{product ? "Edit Product" : "Add New Product"}</h2>
              <p className="text-gray-600">
                {product ? "Update product information" : "Create a new product for your store"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="product-form"
              disabled={loading || uploading}
              className="px-6 py-2 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              <Save size={16} />
              {loading ? "Saving..." : product ? "Update Product" : "Create Product"}
            </button>
          </div>
        </div>
      </div>

      <form id="product-form" onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Product Image */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <ImageIcon size={20} />
                Product Image
              </h3>

              {formData.image_url ? (
                <div className="relative group">
                  <div className="aspect-square relative rounded-lg overflow-hidden bg-gray-100">
                    <Image
                      src={formData.image_url || "/placeholder.svg"}
                      alt="Product preview"
                      fill
                      className="object-cover"
                    />
                  </div>
                  <button
                    type="button"
                    onClick={() => setFormData((prev) => ({ ...prev, image_url: "" }))}
                    className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <X size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="absolute inset-0 bg-black/50 text-white rounded-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <Upload size={24} />
                    <span className="ml-2">Change Image</span>
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => fileInputRef.current?.click()}
                  className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-green-400 hover:bg-green-50 transition-colors"
                >
                  <Upload size={48} className="text-gray-400 mb-4" />
                  <p className="text-gray-600 text-center font-medium">
                    {uploading ? "Uploading..." : "Click to upload image"}
                  </p>
                  <p className="text-gray-400 text-sm mt-1">PNG, JPG up to 10MB</p>
                </div>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                className="hidden"
                disabled={uploading}
              />

              {uploading && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    <span className="text-blue-700 text-sm">Uploading image...</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Product Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Product Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleNameChange(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
                    placeholder="Enter product name"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Price *</label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500">$</span>
                    <input
                      type="number"
                      step="0.01"
                      value={formData.price}
                      onChange={(e) =>
                        setFormData((prev) => ({ ...prev, price: Number.parseFloat(e.target.value) || 0 }))
                      }
                      className="w-full pl-8 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category *</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData((prev) => ({ ...prev, category: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
                    placeholder="e.g., Face Care, Body Care"
                    required
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">URL Slug *</label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData((prev) => ({ ...prev, slug: e.target.value }))}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
                    placeholder="product-url-slug"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">This will be used in the product URL</p>
                </div>
              </div>
            </div>

            {/* Descriptions */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Product Descriptions</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Short Description *</label>
                  <textarea
                    value={formData.short_description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, short_description: e.target.value }))}
                    rows={3}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
                    placeholder="Brief description for product cards (1-2 sentences)"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Full Description *</label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
                    rows={8}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
                    placeholder="Detailed product description with benefits, ingredients, usage instructions..."
                    required
                  />
                </div>
              </div>
            </div>

            {/* WhatsApp Integration */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">WhatsApp Integration</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">WhatsApp Message Template</label>
                <textarea
                  value={formData.whatsapp_message}
                  onChange={(e) => setFormData((prev) => ({ ...prev, whatsapp_message: e.target.value }))}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
                  placeholder="Hi! I&apos;m interested in [Product Name]. Can you tell me more about it?"
                />
                <p className="text-xs text-gray-500 mt-1">
                  This message will be pre-filled when customers click the WhatsApp button
                </p>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
