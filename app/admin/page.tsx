"use client"

import { useState, useEffect } from "react"
import AdminLogin from "@/components/AdminLogin"
import AdminDashboard from "@/components/AdminDashboard"

export default function AdminPage() {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if admin is already logged in
    const loggedIn = localStorage.getItem("cieloskin_admin_logged_in") === "true"
    setIsLoggedIn(loggedIn)
    setLoading(false)
  }, [])

  const handleLogin = () => {
    setIsLoggedIn(true)
    localStorage.setItem("cieloskin_admin_logged_in", "true")
  }

  const handleLogout = () => {
    localStorage.removeItem("cieloskin_admin_logged_in")
    setIsLoggedIn(false)
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    )
  }

  if (!isLoggedIn) {
    return <AdminLogin onLogin={handleLogin} />
  }

  return <AdminDashboard onLogout={handleLogout} />
}
