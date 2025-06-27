"use client"
import Link from "next/link"
import { useState } from "react"
import { Menu, X, ShoppingBag } from "lucide-react"
import Image from "next/image"

export default function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  return (
    <header className="bg-white/95 backdrop-blur-sm sticky top-0 z-50 border-b border-pink-100">
      <div className="container mx-auto px-4 py-3">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-3">
            <Image
              src="/images/cieloskin-logo-new.png"
              alt="CieloSkin Logo"
              width={50}
              height={50}
              className="w-12 h-12 object-contain"
            />
            <div className="hidden sm:block">
              <div className="text-xl font-bold text-green-600">CieloSkin</div>
              <div className="text-xs text-pink-400 -mt-1">Glow Like The Sky</div>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="/" className="text-gray-700 hover:text-green-500 transition-colors font-medium">
              Home
            </Link>
            <Link
              href="/products"
              className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-full transition-colors font-medium flex items-center gap-2"
            >
              <ShoppingBag size={18} />
              Shop Now
            </Link>
            <Link href="/admin" className="text-gray-700 hover:text-green-500 transition-colors font-medium">
              Admin
            </Link>
          </nav>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 text-gray-700 hover:text-green-500 transition-colors"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 pb-4 border-t border-pink-100">
            <nav className="flex flex-col space-y-4 mt-4">
              <Link
                href="/"
                className="text-gray-700 hover:text-green-500 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Home
              </Link>
              <Link
                href="/products"
                className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-full transition-colors font-medium flex items-center justify-center gap-2"
                onClick={() => setIsMenuOpen(false)}
              >
                <ShoppingBag size={18} />
                Shop Now
              </Link>
              <Link
                href="/admin"
                className="text-gray-700 hover:text-green-500 transition-colors py-2"
                onClick={() => setIsMenuOpen(false)}
              >
                Admin
              </Link>
            </nav>
          </div>
        )}
      </div>
    </header>
  )
}
