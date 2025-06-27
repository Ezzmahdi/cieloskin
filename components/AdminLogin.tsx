"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { ArrowLeft, Lock } from "lucide-react"

interface AdminLoginProps {
  onLogin: () => void
}

export default function AdminLogin({ onLogin }: AdminLoginProps) {
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  // Pre-saved admin password - change this to your desired password
  const ADMIN_PASSWORD = "CieloSkin2024!"

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    // Simple password check
    if (password === ADMIN_PASSWORD) {
      // Store login state in localStorage
      localStorage.setItem("cieloskin_admin_logged_in", "true")
      onLogin()
    } else {
      setError("Incorrect password. Please try again.")
    }

    setLoading(false)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-pink-50 flex items-center justify-center py-12 px-4">
      <div className="max-w-md w-full">
        {/* Back to Home */}
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-green-500 hover:text-green-600 mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Home
        </Link>

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-br from-pink-300 to-green-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">🌸</span>
            </div>
            <h1 className="text-2xl font-bold text-gray-800">Admin Access</h1>
            <p className="text-gray-600">Enter your password to continue</p>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-6 text-center">
              {error}
            </div>
          )}

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Admin Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                  placeholder="Enter admin password"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? "Checking..." : "Access Dashboard"}
            </button>
          </form>

          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-500 text-center">
              This is a secure admin area. Only authorized personnel can access the dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
