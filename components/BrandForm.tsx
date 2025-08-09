"use client"

import type React from "react"
import { useState, useRef } from "react"
import { supabase, type Brand } from "@/lib/supabase"
import { Upload, X, Save, ArrowLeft, ImageIcon } from "lucide-react"
import Image from "next/image"

interface BrandFormProps {
  brand?: Brand | null
  onSave: () => void
  onCancel: () => void
}

export default function BrandForm({ brand, onSave, onCancel }: BrandFormProps) {
  const [formData, setFormData] = useState({
    name: brand?.name || "",
    slug: brand?.slug || "",
    logo_url: brand?.logo_url || "",
    description: brand?.description || "",

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
    console.log('Name change triggered:', name)
    setFormData((prev) => ({
      ...prev,
      name,
      slug: generateSlug(name),
    }))
  }

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please select a valid image file.')
      return
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      alert('File size must be less than 5MB.')
      return
    }

    setUploading(true)
    try {
      console.log('Starting upload for file:', file.name, 'Size:', file.size, 'Type:', file.type)
      
      const fileExt = file.name.split(".").pop()
      const fileName = `brand-${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`
      const filePath = `brands/${fileName}` // Add folder structure

      console.log('Uploading to path:', filePath)
      console.log('Attempting direct upload to media bucket...')

      // Upload file to Supabase storage
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from("media")
        .upload(filePath, file, {
          cacheControl: "3600",
          upsert: false,
        })

      if (uploadError) {
        console.error("Upload error details:", {
          message: uploadError.message,
          error: uploadError,
          filePath,
          fileSize: file.size,
          fileType: file.type
        })
        throw new Error(`Upload failed: ${uploadError.message}`)
      }

      console.log('Upload successful:', uploadData)

      // Get public URL
      const { data: urlData } = supabase.storage.from("media").getPublicUrl(filePath)
      
      console.log('Public URL generated:', urlData.publicUrl)

      setFormData((prev) => ({
        ...prev,
        logo_url: urlData.publicUrl,
      }))
      
      alert('Logo uploaded successfully!')
    } catch (error) {
      console.error("Error uploading logo:", error)
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred'
      alert(`Error uploading logo: ${errorMessage}`)
    } finally {
      setUploading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const endpoint = "/api/admin/brands" + (brand ? `?id=${brand.id}` : "")
      const method = brand ? "PUT" : "POST"

      const res = await fetch(endpoint, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      const result = await res.json()
      if (!res.ok) throw new Error(result.error || "Failed")

      onSave()
    } catch (error) {
      console.error("Error saving brand:", error)
      alert("Error saving brand")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto">
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
              <h2 className="text-2xl font-bold text-gray-800">{brand ? "Edit Brand" : "Add New Brand"}</h2>
              <p className="text-gray-600">
                {brand ? "Update brand information" : "Create a new brand for your products"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onCancel}
              className="px-4 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="brand-form"
              disabled={loading}
              className="flex items-center gap-2 bg-green-500 hover:bg-green-600 disabled:bg-green-300 text-white px-6 py-2 rounded-lg transition-colors"
            >
              <Save size={16} />
              {loading ? "Saving..." : "Save Brand"}
            </button>
          </div>
        </div>
      </div>

      <form id="brand-form" onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left Column - Logo Upload */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Brand Logo</h3>
              
              {/* Logo Preview */}
              <div className="mb-4">
                {formData.logo_url ? (
                  <div className="relative">
                    <Image
                      src={formData.logo_url}
                      alt="Brand logo preview"
                      width={200}
                      height={200}
                      className="w-full h-48 object-contain bg-gray-50 rounded-lg border"
                    />
                    <button
                      type="button"
                      onClick={() => setFormData((prev) => ({ ...prev, logo_url: "" }))}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center bg-gray-50">
                    <div className="text-center">
                      <ImageIcon size={48} className="text-gray-400 mx-auto mb-2" />
                      <p className="text-gray-500">No logo uploaded</p>
                    </div>
                  </div>
                )}
              </div>

              {/* Upload Button */}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="w-full flex items-center justify-center gap-2 bg-blue-500 hover:bg-blue-600 disabled:bg-blue-300 text-white px-4 py-3 rounded-lg transition-colors"
              >
                <Upload size={20} />
                {uploading ? "Uploading..." : "Upload Logo"}
              </button>

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleLogoUpload}
                className="hidden"
                disabled={uploading}
              />

              {uploading && (
                <div className="mt-4 bg-blue-50 border border-blue-200 rounded-lg p-3">
                  <div className="flex items-center gap-2">
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-500"></div>
                    <span className="text-blue-700 text-sm">Uploading logo...</span>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right Column - Brand Details */}
          <div className="lg:col-span-2 space-y-6">
            {/* Basic Information */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => {
                      console.log('Input onChange event:', e.target.value)
                      handleNameChange(e.target.value)
                    }}
                    onFocus={() => console.log('Name input focused')}
                    onBlur={() => console.log('Name input blurred')}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
                    placeholder="Enter brand name"
                    required
                    autoComplete="off"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Brand Slug</label>
                  <input
                    type="text"
                    value={formData.slug}
                    readOnly
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-600"
                    placeholder="Auto-generated from brand name"
                  />
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="bg-white rounded-lg shadow-sm p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Brand Description</h3>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => {
                    console.log('Description change:', e.target.value)
                    setFormData((prev) => ({ ...prev, description: e.target.value }))
                  }}
                  onFocus={() => console.log('Description textarea focused')}
                  onBlur={() => console.log('Description textarea blurred')}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent resize-none"
                  placeholder="Brief description about the brand..."
                  autoComplete="off"
                />
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}
