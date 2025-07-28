"use client"

import { useState, useEffect } from "react"
import { supabase } from "@/lib/supabase"
import Image from "next/image"

interface Brand {
  id: string
  name: string
  slug: string
  logo_url: string
  description?: string
  website_url?: string
  created_at: string
  updated_at: string
}

interface BrandCarouselProps {
  onBrandClick: (brandName: string) => void
  selectedBrand?: string
}

export default function BrandCarousel({ onBrandClick, selectedBrand }: BrandCarouselProps) {
  const [brands, setBrands] = useState<Brand[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchBrands()
  }, [])

  const fetchBrands = async () => {
    try {
      const { data, error } = await supabase
        .from("brands")
        .select("*")
        .order("name", { ascending: true })

      if (error) throw error
      setBrands(data || [])
    } catch (error) {
      console.error("Error fetching brands:", error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="py-8">
        <div className="flex items-center gap-4 overflow-x-auto scrollbar-hide">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-20 h-20 bg-gray-200 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  if (brands.length === 0) {
    return null
  }

  return (
    <div className="py-8">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Shop by Brand</h2>
        <p className="text-gray-600">Click on a brand logo to see their products</p>
      </div>
      
      <div className="relative">
        {/* Moving carousel container */}
        <div className="overflow-hidden">
          <div className="flex items-center gap-6 animate-scroll">
            {/* Duplicate brands for seamless loop */}
            {[...brands, ...brands].map((brand, index) => (
              <button
                key={`${brand.id}-${index}`}
                onClick={() => onBrandClick(brand.name)}
                className={`flex-shrink-0 group transition-all duration-300 hover:scale-110 ${
                  selectedBrand === brand.name
                    ? "ring-4 ring-green-500 ring-opacity-50"
                    : ""
                }`}
                title={`View ${brand.name} products`}
              >
                <div className="w-20 h-20 bg-white rounded-xl shadow-md border border-gray-100 p-3 group-hover:shadow-lg transition-shadow">
                  {brand.logo_url ? (
                    <Image
                      src={brand.logo_url}
                      alt={brand.name}
                      width={80}
                      height={80}
                      className="w-full h-full object-contain"
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 rounded-lg flex items-center justify-center">
                      <span className="text-gray-400 text-xs font-medium">
                        {brand.name.charAt(0)}
                      </span>
                    </div>
                  )}
                </div>
                <p className="text-xs text-gray-600 mt-2 text-center font-medium group-hover:text-green-600 transition-colors">
                  {brand.name}
                </p>
              </button>
            ))}
          </div>
        </div>
        
        {/* Show all brands button */}
        <div className="text-center mt-6">
          <button
            onClick={() => onBrandClick("all")}
            className={`px-6 py-2 rounded-lg transition-colors ${
              selectedBrand === "all" || !selectedBrand
                ? "bg-green-500 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            Show All Brands
          </button>
        </div>
      </div>
    </div>
  )
}
