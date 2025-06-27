"use client"

import Image from "next/image"
import Link from "next/link"
import { MessageCircle } from "lucide-react"
import { useState, useEffect } from "react"
import type { Product } from "@/lib/supabase"

interface ProductCardProps {
  product: Product
}

export default function ProductCard({ product }: ProductCardProps) {
  const [whatsappNumber, setWhatsappNumber] = useState("+1234567890")

  useEffect(() => {
    // Fetch WhatsApp number from settings
    const fetchWhatsAppNumber = async () => {
      try {
        const res = await fetch("/api/admin/settings")
        const data = await res.json()

        // Handle both array and error responses
        if (Array.isArray(data)) {
          const whatsappSetting = data.find((s: { key: string; value: string }) => s.key === "whatsapp_number")
          if (whatsappSetting) {
            setWhatsappNumber(whatsappSetting.value)
          }
        } else if (data.error) {
          console.log("Settings not configured yet, using default WhatsApp number")
        }
      } catch (error) {
        console.error("Error fetching WhatsApp number:", error)
      }
    }

    fetchWhatsAppNumber()
  }, [])

  const handleWhatsAppClick = () => {
    const message = product.whatsapp_message || `Hi! I&apos;m interested in ${product.name}!`
    const cleanNumber = whatsappNumber.replace(/[^0-9]/g, "")
    const whatsappUrl = `https://wa.me/${cleanNumber}?text=${encodeURIComponent(message)}`
    window.open(whatsappUrl, "_blank")
  }

  return (
    <div className="bg-white rounded-2xl shadow-sm card-hover overflow-hidden border border-pink-100">
      <Link href={`/product/${product.slug}`}>
        <div className="aspect-square relative overflow-hidden">
          <Image
            src={product.image_url || "/placeholder.svg?height=300&width=300"}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 hover:scale-105"
          />
        </div>
      </Link>

      <div className="p-4 sm:p-6">
        <Link href={`/product/${product.slug}`}>
          <h3 className="font-semibold text-base sm:text-lg text-gray-800 mb-2 hover:text-pink-400 transition-colors line-clamp-2">
            {product.name}
          </h3>
        </Link>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2">{product.short_description}</p>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <span className="text-xl sm:text-2xl font-bold text-gray-800">${product.price.toFixed(2)}</span>

          <button onClick={handleWhatsAppClick} className="btn-whatsapp text-sm w-full sm:w-auto justify-center">
            <MessageCircle size={16} />
            WhatsApp
          </button>
        </div>
      </div>
    </div>
  )
}
