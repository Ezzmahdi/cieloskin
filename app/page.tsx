import { supabase } from "@/lib/supabase"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import HeroSection from "@/components/HeroSection"
import ProductGrid from "@/components/ProductGrid"
import Image from "next/image"

async function getFeaturedProducts() {
  try {
    const { data: products, error } = await supabase
      .from("products")
      .select("*")
      .limit(8)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching products:", error)
      return []
    }

    return products || []
  } catch (error) {
    console.error("Error in getFeaturedProducts:", error)
    return []
  }
}

export default async function HomePage() {
  const featuredProducts = await getFeaturedProducts()

  return (
    <div className="min-h-screen">
      <Header />

      <main>
        <HeroSection />

        {/* Featured Products */}
        <section className="py-16">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">Featured Products</h2>
              <p className="text-gray-600 max-w-2xl mx-auto">
                Discover our most popular skincare essentials, carefully selected to help you achieve that natural glow.
              </p>
            </div>

            {featuredProducts.length > 0 ? (
              <ProductGrid products={featuredProducts} />
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">No products available at the moment.</p>
                <p className="text-gray-400 text-sm mt-2">Please check back later!</p>
              </div>
            )}
          </div>
        </section>

        {/* About Section */}
        <section className="py-16 bg-gradient-to-r from-pink-50 to-purple-50">
          <div className="container mx-auto px-4">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
              <div className="order-2 lg:order-1">
                <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-6">Natural Beauty, Naturally You</h2>
                <p className="text-gray-600 mb-6">
                  At CieloSkin, we believe that true beauty comes from healthy, radiant skin. Our carefully curated
                  collection of premium skincare products is designed to nourish, protect, and enhance your natural
                  glow.
                </p>
                <p className="text-gray-600 mb-8">
                  Each product is crafted with the finest natural ingredients, ensuring that your skin receives the
                  gentle care it deserves.
                </p>
                <button className="btn-primary">Learn Our Story</button>
              </div>
              <div className="order-1 lg:order-2">
                <div className="relative w-full h-[300px] sm:h-[400px] lg:h-[500px] rounded-2xl overflow-hidden">
                  <Image
                    src="/images/natural-beauty-products.png"
                    alt="Natural skincare products arranged on wooden tray with botanical elements"
                    fill
                    className="object-cover object-center"
                  />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  )
}
