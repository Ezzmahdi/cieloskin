"use client"

import { useState, useEffect, useRef } from "react"
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
  const carouselRef = useRef<HTMLDivElement>(null)

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
      <div className="py-6">
        <div className="flex items-center justify-center gap-4 overflow-hidden">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-16 h-16 bg-gray-200 rounded-xl animate-pulse"
            />
          ))}
        </div>
      </div>
    )
  }

  if (brands.length === 0) {
    return null
  }

  // Create display array - if few brands, show them centered; if many, create infinite scroll
  const shouldScroll = brands.length > 6
  const displayBrands = shouldScroll ? [...brands, ...brands, ...brands] : brands

  return (
    <div className="py-6">
      <div className="relative">
        <div className="overflow-hidden">
          <div 
            ref={carouselRef}
            className={`flex items-center gap-6 ${
              shouldScroll 
                ? 'animate-infinite-scroll' 
                : 'justify-center'
            }`}
            style={{
              animationDuration: shouldScroll ? `${brands.length * 4}s` : undefined
            }}
          >
            {displayBrands.map((brand, index) => {
              // For infinite scroll, use index to ensure unique keys
              const key = shouldScroll ? `${brand.id}-${index}` : brand.id
              
              return (
                <button
                  key={key}
                  onClick={() => onBrandClick(brand.name)}
                  className={`flex-shrink-0 group transition-all duration-300 hover:scale-110 ${
                    selectedBrand === brand.name
                      ? "ring-3 ring-green-400 ring-opacity-60"
                      : ""
                  }`}
                  title={`Filter by ${brand.name}`}
                >
                  <div className="w-16 h-16 bg-white rounded-xl shadow-sm border border-gray-100 p-2 group-hover:shadow-md transition-all group-hover:border-green-200">
                    {brand.logo_url ? (
                      <Image
                        src={brand.logo_url}
                        alt={brand.name}
                        width={64}
                        height={64}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg flex items-center justify-center">
                        <span className="text-gray-500 text-sm font-semibold">
                          {brand.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-gray-600 mt-2 text-center font-medium group-hover:text-green-600 transition-colors truncate max-w-[64px]">
                    {brand.name}
                  </p>
                </button>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}
