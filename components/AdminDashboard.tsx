"use client"

import { useState, useEffect } from "react"
import { supabase, type Product } from "@/lib/supabase"
import {
  LayoutDashboard,
  Package,
  Plus,
  Edit,
  Trash2,
  LogOut,
  BarChart3,
  Eye,
  Search,
  Filter,
  TrendingUp,
  DollarSign,
  SettingsIcon,
} from "lucide-react"
import ProductForm from "./ProductForm"
import AdminSettings from "./AdminSettings"
import Image from "next/image"

interface AdminDashboardProps {
  onLogout: () => void
}

export default function AdminDashboard({ onLogout }: AdminDashboardProps) {
  const [activeTab, setActiveTab] = useState("dashboard")
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)
  const [showProductForm, setShowProductForm] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase.from("products").select("*").order("created_at", { ascending: false })

      if (error) throw error
      setProducts(data || [])
    } catch (error) {
      console.error("Error fetching products:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    onLogout()
  }

  const handleDeleteProduct = async (id: string) => {
    if (!confirm("Are you sure you want to delete this product?")) return

    try {
      const res = await fetch(`/api/admin/products?id=${id}`, { method: "DELETE" })
      if (!res.ok) {
        const result = await res.json()
        throw new Error(result.error || "Failed")
      }

      setProducts(products.filter((p) => p.id !== id))
    } catch (error) {
      console.error("Error deleting product:", error)
      alert("Error deleting product")
    }
  }

  const handleEditProduct = (product: Product) => {
    setEditingProduct(product)
    setShowProductForm(true)
  }

  const handleAddProduct = () => {
    setEditingProduct(null)
    setShowProductForm(true)
  }

  const handleProductSaved = () => {
    setShowProductForm(false)
    setEditingProduct(null)
    fetchProducts()
  }

  const categories = [...new Set(products.map((p) => p.category))].filter(Boolean)
  const filteredProducts = products.filter((product) => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase())
    const matchesCategory = selectedCategory === "all" || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  // Calculate real stats from actual data
  const stats = {
    totalProducts: products.length,
    totalCategories: categories.length,
    avgPrice: products.length > 0 ? products.reduce((sum, p) => sum + p.price, 0) / products.length : 0,
    totalValue: products.reduce((sum, p) => sum + p.price, 0),
    recentProducts: products.filter((p) => {
      const productDate = new Date(p.created_at)
      const weekAgo = new Date()
      weekAgo.setDate(weekAgo.getDate() - 7)
      return productDate > weekAgo
    }).length,
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Enhanced Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="px-4 sm:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3 sm:gap-4">
              <Image
                src="/images/cieloskin-logo-new.png"
                alt="CieloSkin Logo"
                width={40}
                height={40}
                className="w-8 h-8 sm:w-10 sm:h-10 object-contain"
              />
              <div>
                <h1 className="text-lg sm:text-xl font-bold text-gray-800">CieloSkin Admin</h1>
                <p className="text-xs sm:text-sm text-gray-600 hidden sm:block">Manage your skincare products</p>
              </div>
            </div>

            <div className="flex items-center gap-2 sm:gap-4">
              <div className="hidden md:flex items-center gap-2 bg-gray-100 px-3 py-2 rounded-lg">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-sm text-gray-600">Admin Online</span>
              </div>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 text-gray-600 hover:text-red-600 transition-colors px-2 sm:px-3 py-2 rounded-lg hover:bg-red-50"
              >
                <LogOut size={16} />
                <span className="hidden sm:inline">Logout</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-col lg:flex-row">
        {/* Enhanced Sidebar */}
        <aside className="w-full lg:w-64 bg-white shadow-sm border-b lg:border-r lg:border-b-0 lg:min-h-screen">
          <nav className="p-4">
            <div className="flex lg:flex-col space-x-2 lg:space-x-0 lg:space-y-2 overflow-x-auto lg:overflow-x-visible">
              <button
                onClick={() => setActiveTab("dashboard")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
                  activeTab === "dashboard"
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <LayoutDashboard size={20} />
                <span className="font-medium">Dashboard</span>
              </button>

              <button
                onClick={() => setActiveTab("products")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
                  activeTab === "products"
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <Package size={20} />
                <span className="font-medium">Products</span>
                {products.length > 0 && (
                  <span
                    className={`text-xs px-2 py-1 rounded-full ${
                      activeTab === "products" ? "bg-white/20 text-white" : "bg-gray-200 text-gray-700"
                    }`}
                  >
                    {products.length}
                  </span>
                )}
              </button>

              <button
                onClick={() => setActiveTab("settings")}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
                  activeTab === "settings"
                    ? "bg-gradient-to-r from-green-500 to-green-600 text-white shadow-lg"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                <SettingsIcon size={20} />
                <span className="font-medium">Settings</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Enhanced Main Content */}
        <main className="flex-1 p-4 sm:p-6">
          {activeTab === "settings" && <AdminSettings />}

          {activeTab === "dashboard" && !showProductForm && (
            <div className="space-y-6">
              {/* Welcome Section */}
              <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-2xl p-4 sm:p-6 text-white">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-xl sm:text-2xl font-bold mb-2">Welcome back, Admin! 👋</h2>
                    <p className="text-green-100 text-sm sm:text-base">
                      {products.length === 0
                        ? "Ready to add your first product to the store?"
                        : "Here's what's happening with your store today."}
                    </p>
                  </div>
                  <div className="hidden sm:block">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 bg-white/20 rounded-full flex items-center justify-center">
                      <TrendingUp size={32} className="text-white" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Total Products</p>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{stats.totalProducts}</p>
                    </div>
                    <div className="p-2 sm:p-3 bg-blue-100 rounded-lg self-end sm:self-auto">
                      <Package className="text-blue-600" size={20} />
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-4 flex items-center text-xs sm:text-sm">
                    {stats.recentProducts > 0 ? (
                      <span className="text-green-600 font-medium">+{stats.recentProducts} this week</span>
                    ) : (
                      <span className="text-gray-500">No new products this week</span>
                    )}
                  </div>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Categories</p>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">{stats.totalCategories}</p>
                    </div>
                    <div className="p-2 sm:p-3 bg-purple-100 rounded-lg self-end sm:self-auto">
                      <BarChart3 className="text-purple-600" size={20} />
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-4 flex items-center text-xs sm:text-sm">
                    <span className="text-gray-500">
                      {stats.totalCategories === 0 ? "No categories yet" : "Active categories"}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Avg Price</p>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                        ${stats.avgPrice > 0 ? stats.avgPrice.toFixed(2) : "0.00"}
                      </p>
                    </div>
                    <div className="p-2 sm:p-3 bg-green-100 rounded-lg self-end sm:self-auto">
                      <DollarSign className="text-green-600" size={20} />
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-4 flex items-center text-xs sm:text-sm">
                    <span className="text-gray-500">
                      {stats.avgPrice > 0 ? "Average product price" : "Add products to see pricing"}
                    </span>
                  </div>
                </div>

                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <p className="text-xs sm:text-sm font-medium text-gray-600">Total Value</p>
                      <p className="text-2xl sm:text-3xl font-bold text-gray-900 mt-1">
                        ${stats.totalValue > 0 ? stats.totalValue.toFixed(2) : "0.00"}
                      </p>
                    </div>
                    <div className="p-2 sm:p-3 bg-orange-100 rounded-lg self-end sm:self-auto">
                      <TrendingUp className="text-orange-600" size={20} />
                    </div>
                  </div>
                  <div className="mt-2 sm:mt-4 flex items-center text-xs sm:text-sm">
                    <span className="text-gray-500">
                      {stats.totalValue > 0 ? "Total catalog value" : "Start adding products"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Recent Products or Empty State */}
              <div className="bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="p-4 sm:p-6 border-b border-gray-100">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <h3 className="text-lg font-semibold text-gray-800">
                      {products.length > 0 ? "Recent Products" : "Your Products"}
                    </h3>
                    <button
                      onClick={handleAddProduct}
                      className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors w-full sm:w-auto"
                    >
                      <Plus size={16} />
                      Add Product
                    </button>
                  </div>
                </div>
                <div className="p-4 sm:p-6">
                  {products.length === 0 ? (
                    <div className="text-center py-8 sm:py-12">
                      <Package size={48} className="text-gray-400 mx-auto mb-4" />
                      <h4 className="text-lg font-medium text-gray-800 mb-2">No products yet</h4>
                      <p className="text-gray-500 mb-6 text-sm sm:text-base">
                        Start building your skincare catalog by adding your first product.
                      </p>
                      <button
                        onClick={handleAddProduct}
                        className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors w-full sm:w-auto"
                      >
                        Add Your First Product
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {products.slice(0, 5).map((product) => (
                        <div
                          key={product.id}
                          className="flex items-center gap-3 sm:gap-4 p-3 sm:p-4 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Image
                            src={product.image_url || "/placeholder.svg?height=60&width=60"}
                            alt={product.name}
                            width={60}
                            height={60}
                            className="w-12 h-12 sm:w-15 sm:h-15 rounded-lg object-cover"
                          />
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-800 text-sm sm:text-base truncate">{product.name}</h4>
                            <p className="text-xs sm:text-sm text-gray-600">{product.category}</p>
                          </div>
                          <div className="text-right">
                            <p className="font-semibold text-gray-800 text-sm sm:text-base">
                              ${product.price.toFixed(2)}
                            </p>
                            <p className="text-xs text-gray-500 hidden sm:block">
                              {new Date(product.created_at).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2">
                            <button
                              onClick={() => handleEditProduct(product)}
                              className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            >
                              <Edit size={14} />
                            </button>
                            <a
                              href={`/product/${product.slug}`}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                            >
                              <Eye size={14} />
                            </a>
                          </div>
                        </div>
                      ))}
                      {products.length > 5 && (
                        <div className="text-center pt-4 border-t border-gray-100">
                          <button
                            onClick={() => setActiveTab("products")}
                            className="text-green-600 hover:text-green-700 font-medium text-sm sm:text-base"
                          >
                            View all {products.length} products →
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {activeTab === "products" && !showProductForm && (
            <div className="space-y-6">
              {/* Products Header */}
              <div className="flex flex-col gap-4">
                <div>
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-800">Products</h2>
                  <p className="text-gray-600 text-sm sm:text-base">
                    {products.length === 0
                      ? "Start building your skincare product catalog"
                      : `Manage your ${products.length} skincare products`}
                  </p>
                </div>
                <button
                  onClick={handleAddProduct}
                  className="flex items-center justify-center gap-2 bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-lg transition-colors shadow-sm w-full sm:w-auto"
                >
                  <Plus size={20} />
                  Add New Product
                </button>
              </div>

              {products.length > 0 && (
                <>
                  {/* Search and Filter */}
                  <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex flex-col gap-4">
                      <div className="relative">
                        <Search
                          className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                          size={20}
                        />
                        <input
                          type="text"
                          placeholder="Search products..."
                          value={searchQuery}
                          onChange={(e) => setSearchQuery(e.target.value)}
                          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                        />
                      </div>
                      {categories.length > 0 && (
                        <div className="flex items-center gap-2">
                          <Filter size={20} className="text-gray-600" />
                          <select
                            value={selectedCategory}
                            onChange={(e) => setSelectedCategory(e.target.value)}
                            className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-300"
                          >
                            <option value="all">All Categories</option>
                            {categories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Products Grid for Mobile, Table for Desktop */}
                  {loading ? (
                    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-12 text-center">
                      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto mb-4"></div>
                      <p className="text-gray-600">Loading products...</p>
                    </div>
                  ) : (
                    <>
                      {/* Mobile Grid */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 lg:hidden">
                        {filteredProducts.map((product) => (
                          <div key={product.id} className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                            <div className="flex items-start gap-3">
                              <Image
                                src={product.image_url || "/placeholder.svg?height=60&width=60"}
                                alt={product.name}
                                width={60}
                                height={60}
                                className="w-15 h-15 rounded-lg object-cover"
                              />
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-gray-800 text-sm truncate">{product.name}</h4>
                                <p className="text-xs text-gray-600 mb-1">{product.category}</p>
                                <p className="font-semibold text-gray-800">${product.price.toFixed(2)}</p>
                                <p className="text-xs text-gray-500">
                                  {new Date(product.created_at).toLocaleDateString()}
                                </p>
                              </div>
                            </div>
                            <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                              <div className="flex items-center gap-2">
                                <a
                                  href={`/product/${product.slug}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                  title="View Product"
                                >
                                  <Eye size={16} />
                                </a>
                                <button
                                  onClick={() => handleEditProduct(product)}
                                  className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                  title="Edit Product"
                                >
                                  <Edit size={16} />
                                </button>
                                <button
                                  onClick={() => handleDeleteProduct(product.id)}
                                  className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                  title="Delete Product"
                                >
                                  <Trash2 size={16} />
                                </button>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Desktop Table */}
                      <div className="hidden lg:block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead className="bg-gray-50">
                              <tr>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Product
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Category
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Price
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Created
                                </th>
                                <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                  Actions
                                </th>
                              </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                              {filteredProducts.map((product) => (
                                <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <div className="flex items-center">
                                      <Image
                                        src={product.image_url || "/placeholder.svg?height=50&width=50"}
                                        alt={product.name}
                                        width={50}
                                        height={50}
                                        className="rounded-lg object-cover mr-4"
                                      />
                                      <div>
                                        <div className="text-sm font-medium text-gray-900">{product.name}</div>
                                        <div className="text-sm text-gray-500 max-w-xs truncate">
                                          {product.short_description}
                                        </div>
                                      </div>
                                    </div>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap">
                                    <span className="inline-flex px-3 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                                      {product.category}
                                    </span>
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                    ${product.price.toFixed(2)}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                    {new Date(product.created_at).toLocaleDateString()}
                                  </td>
                                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                                    <div className="flex items-center gap-2">
                                      <a
                                        href={`/product/${product.slug}`}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                        title="View Product"
                                      >
                                        <Eye size={16} />
                                      </a>
                                      <button
                                        onClick={() => handleEditProduct(product)}
                                        className="p-2 text-gray-600 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                                        title="Edit Product"
                                      >
                                        <Edit size={16} />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteProduct(product.id)}
                                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                                        title="Delete Product"
                                      >
                                        <Trash2 size={16} />
                                      </button>
                                    </div>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    </>
                  )}

                  {filteredProducts.length === 0 && searchQuery && (
                    <div className="text-center py-12">
                      <Search size={48} className="text-gray-400 mx-auto mb-4" />
                      <p className="text-gray-500 text-lg">No products found for "{searchQuery}"</p>
                      <p className="text-gray-400">Try adjusting your search terms</p>
                    </div>
                  )}
                </>
              )}

              {/* Empty State for Products Tab */}
              {products.length === 0 && !loading && (
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-8 sm:p-12 text-center">
                  <Package size={64} className="text-gray-400 mx-auto mb-6" />
                  <h3 className="text-xl font-semibold text-gray-800 mb-3">No products yet</h3>
                  <p className="text-gray-500 mb-8 max-w-md mx-auto text-sm sm:text-base">
                    Start building your CieloSkin catalog by adding your first skincare product. You can add product
                    images, descriptions, pricing, and WhatsApp integration.
                  </p>
                  <button
                    onClick={handleAddProduct}
                    className="bg-green-500 hover:bg-green-600 text-white px-8 py-3 rounded-lg transition-colors text-lg w-full sm:w-auto"
                  >
                    Add Your First Product
                  </button>
                </div>
              )}
            </div>
          )}

          {showProductForm && (
            <ProductForm
              product={editingProduct}
              onSave={handleProductSaved}
              onCancel={() => setShowProductForm(false)}
            />
          )}
        </main>
      </div>
    </div>
  )
}
