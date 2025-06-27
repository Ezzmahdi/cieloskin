"use client"

import Image from "next/image"
import { MessageCircle, Share2, ArrowLeft } from "lucide-react"
import { useState, useEffect } from "react"
import type { Product } from "@/lib/supabase"
import Link from "next/link"

interface ProductDetailProps {
  product: Product
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const [whatsappNumber, setWhatsappNumber] = useState("+1234567890")

  useEffect(() => {
    // Fetch WhatsApp number from settings
    const fetchWhatsAppNumber = async () => {
      try {
        const res = await fetch("/api/admin/settings")
        const settings = await res.json()
        const whatsappSetting = settings.find((s: { key: string; value: string }) => s.key === "whatsapp_number")
        if (whatsappSetting) {
          setWhatsappNumber(whatsappSetting.value)
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

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: product.name,
          text: product.short_description,
          url: window.location.href,
        })
      } catch (error) {
        console.log("Error sharing:", error)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href)
      alert("Link copied to clipboard!")
    }
  }

  return (
    <main className="py-4 sm:py-8">
      <div className="container mx-auto px-4">
        {/* Back Button */}
        <Link
          href="/products"
          className="inline-flex items-center gap-2 text-pink-400 hover:text-pink-500 mb-6 sm:mb-8 transition-colors"
        >
          <ArrowLeft size={20} />
          Back to Products
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Product Image */}
          <div className="aspect-square relative rounded-2xl overflow-hidden bg-gradient-to-br from-pink-50 to-purple-50">
            <Image
              src={product.image_url || "/placeholder.svg?height=600&width=600"}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            <div className="mb-6">
              <span className="inline-block bg-pink-100 text-pink-600 px-3 py-1 rounded-full text-sm font-medium mb-4">
                {product.category}
              </span>
              <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
              <p className="text-xl sm:text-2xl font-bold text-gray-800 mb-6">${product.price.toFixed(2)}</p>
            </div>

            <div className="mb-8">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3">Description</h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-line text-sm sm:text-base">
                {product.description}
              </p>
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-4 mt-auto">
              <button onClick={handleWhatsAppClick} className="btn-whatsapp justify-center text-base sm:text-lg py-4">
                <MessageCircle size={20} />
                Buy on WhatsApp
              </button>

              <button
                onClick={handleShare}
                className="border-2 border-pink-300 text-pink-400 hover:bg-pink-300 hover:text-gray-800 font-medium py-4 px-6 rounded-full transition-all duration-300 flex items-center justify-center gap-2"
              >
                <Share2 size={20} />
                Share
              </button>
            </div>

            {/* Additional Info */}
            <div className="mt-8 p-4 sm:p-6 bg-gradient-to-r from-pink-50 to-purple-50 rounded-2xl">
              <h3 className="font-semibold text-gray-800 mb-2">Why Choose CieloSkin?</h3>
              <ul className="text-sm text-gray-600 space-y-1">
                <li>• Premium natural ingredients</li>
                <li>• Dermatologist tested</li>
                <li>• Cruelty-free products</li>
                <li>• Fast WhatsApp support</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}
