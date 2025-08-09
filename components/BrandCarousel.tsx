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
      <div className="py-4 sm:py-6">
        <div className="flex items-center justify-center gap-2 sm:gap-4 overflow-hidden">
          {[...Array(6)].map((_, i) => (
            <div
              key={i}
              className="flex-shrink-0 w-12 h-12 sm:w-16 sm:h-16 bg-gray-200 rounded-xl animate-pulse"
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
  const shouldScroll = brands.length > 1
  // Duplicate multiple times to ensure visible movement even with few brands
  const copies = 6
  const displayBrands = shouldScroll
    ? Array.from({ length: copies }).flatMap(() => brands)
    : brands

  return (
    <div className="py-4 sm:py-6">
      <div className="relative carousel-group">
        <div className="overflow-hidden mask-fade-x">
          <div 
            ref={carouselRef}
            className={`flex items-center gap-4 sm:gap-6 md:gap-10 ${
              shouldScroll 
                ? 'animate-infinite-scroll' 
                : 'justify-center'
            }`}
            style={{
              // Faster animation for mobile, slower for desktop
              animationDuration: shouldScroll ? `${Math.max(12, brands.length * 1.5)}s` : undefined
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
                      ? "ring-2 ring-green-400 ring-opacity-60"
                      : ""
                  }`}
                  title={`Filter by ${brand.name}`}
                >
                  <div className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 bg-white rounded-xl sm:rounded-2xl shadow-sm border border-gray-100 p-2 sm:p-3 group-hover:shadow-md transition-all group-hover:border-green-200">
                    {brand.logo_url ? (
                      <Image
                        src={brand.logo_url}
                        alt={brand.name}
                        width={96}
                        height={96}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <div className="w-full h-full bg-gradient-to-br from-gray-100 to-gray-200 rounded-xl flex items-center justify-center">
                        <span className="text-gray-500 text-base font-semibold">
                          {brand.name.charAt(0).toUpperCase()}
                        </span>
                      </div>
                    )}
                  </div>
                  <p className="text-xs sm:text-sm text-gray-600 mt-1 sm:mt-2 text-center font-medium group-hover:text-green-600 transition-colors truncate max-w-[64px] sm:max-w-[80px] md:max-w-[96px]">
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
