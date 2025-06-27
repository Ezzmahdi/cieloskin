"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { Save, SettingsIcon, Phone, Mail, Building } from "lucide-react"

interface Setting {
  key: string
  value: string
}

export default function AdminSettings() {
  const [settings, setSettings] = useState<Record<string, string>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState<Record<string, boolean>>({})

  useEffect(() => {
    fetchSettings()
  }, [])

  const fetchSettings = async () => {
    try {
      const res = await fetch("/api/admin/settings")
      const data = await res.json()

      // Handle both array and error responses
      if (Array.isArray(data)) {
        const settingsMap: Record<string, string> = {}
        data.forEach((setting: Setting) => {
          settingsMap[setting.key] = setting.value
        })
        setSettings(settingsMap)
      } else if (data.error) {
        console.error("Settings fetch error:", data.error)
        // Initialize with empty settings if table doesn't exist yet
        setSettings({})
      } else {
        console.error("Unexpected response format:", data)
        setSettings({})
      }
    } catch (error) {
      console.error("Error fetching settings:", error)
      setSettings({})
    } finally {
      setLoading(false)
    }
  }

  const updateSingleSetting = async (key: string, value: string) => {
    if (!value || value.trim() === "") {
      alert("Please enter a value before saving")
      return
    }

    setSaving((prev) => ({ ...prev, [key]: true }))
    try {
      const res = await fetch("/api/admin/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ key, value: value.trim() }),
      })

      const result = await res.json()

      if (!res.ok) {
        throw new Error(result.error || "Failed to update setting")
      }

      setSettings((prev) => ({ ...prev, [key]: value.trim() }))
      alert(`${key.replace("_", " ")} updated successfully!`)
    } catch (error: unknown) {
      console.error("Error updating setting:", error)
      const errorMessage = error instanceof Error ? error.message : "Unknown error"
      alert(`Error updating ${key.replace("_", " ")}: ${errorMessage}`)
    } finally {
      setSaving((prev) => ({ ...prev, [key]: false }))
    }
  }

  const handleInputKeyPress = (e: React.KeyboardEvent, key: string) => {
    if (e.key === "Enter") {
      const target = e.target as HTMLInputElement
      updateSingleSetting(key, target.value)
    }
  }

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Loading settings...</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-green-100 rounded-lg">
            <SettingsIcon className="text-green-600" size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Business Settings</h2>
            <p className="text-gray-600">Configure your store&apos;s contact information and WhatsApp integration</p>
          </div>
        </div>
      </div>

      {/* Settings Form */}
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="space-y-6">
          {/* WhatsApp Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Phone size={16} />
              WhatsApp Business Number
            </label>
            <div className="flex gap-2">
              <input
                type="tel"
                id="whatsapp_number"
                defaultValue={settings.whatsapp_number || ""}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
                placeholder="+1234567890"
                onKeyPress={(e) => handleInputKeyPress(e, "whatsapp_number")}
              />
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById("whatsapp_number") as HTMLInputElement
                  updateSingleSetting("whatsapp_number", input.value)
                }}
                disabled={saving.whatsapp_number}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={16} />
                {saving.whatsapp_number ? "Saving..." : "Save"}
              </button>
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Include country code (e.g., +1 for US). Press Enter or click Save to update.
            </p>
          </div>

          {/* Business Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Building size={16} />
              Business Name
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                id="business_name"
                defaultValue={settings.business_name || ""}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
                placeholder="CieloSkin"
                onKeyPress={(e) => handleInputKeyPress(e, "business_name")}
              />
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById("business_name") as HTMLInputElement
                  updateSingleSetting("business_name", input.value)
                }}
                disabled={saving.business_name}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={16} />
                {saving.business_name ? "Saving..." : "Save"}
              </button>
            </div>
          </div>

          {/* Business Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2 flex items-center gap-2">
              <Mail size={16} />
              Business Email
            </label>
            <div className="flex gap-2">
              <input
                type="email"
                id="business_email"
                defaultValue={settings.business_email || ""}
                className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300 focus:border-transparent"
                placeholder="hello@cieloskin.com"
                onKeyPress={(e) => handleInputKeyPress(e, "business_email")}
              />
              <button
                type="button"
                onClick={() => {
                  const input = document.getElementById("business_email") as HTMLInputElement
                  updateSingleSetting("business_email", input.value)
                }}
                disabled={saving.business_email}
                className="flex items-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Save size={16} />
                {saving.business_email ? "Saving..." : "Save"}
              </button>
            </div>
          </div>
        </div>

        {/* Preview */}
        <div className="mt-8 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-medium text-gray-800 mb-2">WhatsApp Link Preview:</h4>
          <p className="text-sm text-gray-600 break-all">
            https://wa.me/{settings.whatsapp_number?.replace(/[^0-9]/g, "") || "XXXXXXXXXX"}?text=Hi! I&apos;m interested in
            your products.
          </p>
        </div>
      </div>
    </div>
  )
}
