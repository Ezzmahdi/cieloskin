"use client"

import { useState, useEffect } from "react"
import { supabase, type Product, type Brand } from "@/lib/supabase"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ProductGrid from "@/components/ProductGrid"
import BrandCarousel from "@/components/BrandCarousel"
import { Search, Filter } from "lucide-react"

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [brands, setBrands] = useState<Brand[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("all")
  const [selectedBrand, setSelectedBrand] = useState<string>("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  useEffect(() => {
    filterProducts()
  }, [products, selectedCategory, selectedBrand, searchQuery])

  const fetchProducts = async () => {
    try {
      // Fetch products with brand information
      const { data: productsData, error: productsError } = await supabase
        .from("products")
        .select(`
          *,
          brand:brands(id, name, slug, logo_url)
        `)
        .order("created_at", { ascending: false })

      if (productsError) throw productsError

      setProducts(productsData || [])

      // Fetch all brands separately for the filter dropdown
      const { data: brandsData, error: brandsError } = await supabase
        .from("brands")
        .select("*")
        .order("name")

      if (brandsError) throw brandsError

      // Extract unique categories from products
      const uniqueCategories = [...new Set(productsData?.map((p) => p.category) || [])]
      setCategories(uniqueCategories)
      setBrands(brandsData || [])
    } catch (error) {
      console.error("Error fetching data:", error)
    } finally {
      setLoading(false)
    }
  }

  const filterProducts = () => {
    let filtered = products

    // Filter by category
    if (selectedCategory !== "all") {
      filtered = filtered.filter((product) => product.category === selectedCategory)
    }

    // Filter by brand
    if (selectedBrand !== "all") {
      filtered = filtered.filter((product) => product.brand?.name === selectedBrand)
    }

    // Filter by search query
    if (searchQuery) {
      filtered = filtered.filter(
        (product) =>
          product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.brand?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
          product.category.toLowerCase().includes(searchQuery.toLowerCase()),
      )
    }

    setFilteredProducts(filtered)
  }

  const handleBrandClick = (brandName: string) => {
    if (brandName === "all") {
      setSelectedBrand("all")
    } else {
      setSelectedBrand(brandName)
    }
    // Clear search query when filtering by brand
    setSearchQuery("")
    setSelectedCategory("all")
  }

  if (loading) {
    return (
      <div className="min-h-screen">
        <Header />
        <div className="container mx-auto px-4 py-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-pink-400 mx-auto"></div>
            <p className="mt-4 text-gray-600">Loading products...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen">
      <Header />

      <main className="py-8">
        <div className="container mx-auto px-4">
          {/* Page Header */}
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-4">Our Products</h1>
            <p className="text-gray-600 max-w-2xl mx-auto">
              Explore our complete collection of premium skincare products
            </p>
          </div>

          {/* Brand Carousel */}
          <BrandCarousel onBrandClick={handleBrandClick} selectedBrand={selectedBrand} />

          {/* Search and Filter */}
          <div className="mb-8 space-y-4">
            {/* Search */}
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by product name, brand, category, or description..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-4 border border-pink-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300 text-lg"
              />
            </div>

            {/* Filters */}
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <div className="flex items-center gap-2">
                <Filter size={20} className="text-gray-600" />
                <span className="text-sm font-medium text-gray-700">Filters:</span>
              </div>
              
              {/* Category Filter */}
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-2 border border-pink-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
              >
                <option value="all">All Categories</option>
                {categories.map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>

              {/* Brand Filter */}
              <select
                value={selectedBrand}
                onChange={(e) => setSelectedBrand(e.target.value)}
                className="px-4 py-2 border border-pink-200 rounded-full focus:outline-none focus:ring-2 focus:ring-pink-300 bg-white"
              >
                <option value="all">All Brands</option>
                {brands.map((brand) => (
                  <option key={brand.id} value={brand.name}>
                    {brand.name}
                  </option>
                ))}
              </select>

              {/* Clear Filters */}
              {(selectedCategory !== "all" || selectedBrand !== "all" || searchQuery) && (
                <button
                  onClick={() => {
                    setSelectedCategory("all")
                    setSelectedBrand("all")
                    setSearchQuery("")
                  }}
                  className="px-4 py-2 text-sm text-pink-600 hover:text-pink-800 hover:bg-pink-50 rounded-full transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
          </div>

          {/* Results Count */}
          <div className="mb-6">
            <p className="text-gray-600">
              Showing {filteredProducts.length} of {products.length} products
            </p>
          </div>

          {/* Products Grid */}
          <ProductGrid products={filteredProducts} />
        </div>
      </main>

      <Footer />
    </div>
  )
}
