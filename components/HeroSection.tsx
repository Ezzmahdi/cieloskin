import Link from "next/link"
import Image from "next/image"
import { Star, ShoppingBag } from "lucide-react"

export default function HeroSection() {
  return (
    <section className="bg-gradient-to-br from-green-50 via-white to-pink-50 py-12 sm:py-20">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="text-center lg:text-left order-2 lg:order-1">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 bg-green-100 text-green-600 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <span className="w-2 h-2 bg-green-500 rounded-full"></span>
              NATURAL SKINCARE
              <span className="text-green-500">🌿</span>
            </div>

            {/* Main Heading */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              <span className="text-green-600">Glow Like</span>
              <br />
              <span className="text-pink-400">The Sky</span>
            </h1>

            {/* Description */}
            <p className="text-base sm:text-lg text-gray-600 mb-8 max-w-lg mx-auto lg:mx-0 leading-relaxed">
              Experience the beauty of nature with CieloSkin's premium collection of botanical skincare products
              designed to reveal your natural radiance.
            </p>

            {/* Buttons */}
            <div className="flex justify-center lg:justify-start mb-8 sm:mb-12">
              <Link
                href="/products"
                className="bg-green-500 hover:bg-green-600 text-white font-medium py-4 px-8 rounded-full transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 text-base sm:text-lg"
              >
                <ShoppingBag size={20} />
                Shop Now
              </Link>
            </div>

            {/* Stats */}
            <div className="flex flex-col sm:flex-row gap-6 sm:gap-8 justify-center lg:justify-start">
              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">10K+</div>
                <div className="text-sm text-gray-600">Happy Customers</div>
              </div>

              <div className="text-center lg:text-left">
                <div className="text-2xl sm:text-3xl font-bold text-green-600 mb-1">100%</div>
                <div className="text-sm text-gray-600">Natural</div>
              </div>

              <div className="text-center lg:text-left">
                <div className="flex items-center justify-center lg:justify-start gap-1 mb-1">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} className="fill-pink-400 text-pink-400" />
                  ))}
                  <span className="text-lg font-bold text-gray-800 ml-2">4.9/5</span>
                </div>
                <div className="text-sm text-gray-600">Rating</div>
              </div>
            </div>
          </div>

          {/* Product Image */}
          <div className="relative order-1 lg:order-2">
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-br from-gray-100 to-gray-200 p-4 sm:p-8">
              <Image
                src="/images/hero-products.png"
                alt="CieloSkin Premium Skincare Products"
                width={600}
                height={600}
                className="w-full h-auto object-cover"
                priority
              />

              {/* Floating Badge */}
              <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 bg-white/90 backdrop-blur-sm px-3 sm:px-4 py-2 rounded-full shadow-lg">
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 bg-pink-400 rounded-full"></span>
                  <span className="text-xs sm:text-sm font-medium text-pink-400">Sky-Inspired Beauty</span>
                </div>
              </div>

              {/* Top Badge */}
              <div className="absolute top-4 sm:top-6 right-4 sm:right-6 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                100% Botanical
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
