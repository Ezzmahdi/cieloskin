import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import ProductDetail from "@/components/ProductDetail"

interface PageProps {
  params: Promise<{
    slug: string
  }>
}

async function getProduct(slug: string) {
  const { data: product, error } = await supabase.from("products").select("*").eq("slug", slug).single()

  if (error || !product) {
    return null
  }

  return product
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    return {
      title: "Product Not Found - CieloSkin",
    }
  }

  return {
    title: `${product.name} - CieloSkin`,
    description: product.short_description,
    openGraph: {
      title: product.name,
      description: product.short_description,
      images: [product.image_url],
    },
  }
}

export default async function ProductPage({ params }: PageProps) {
  const { slug } = await params
  const product = await getProduct(slug)

  if (!product) {
    notFound()
  }

  return (
    <div className="min-h-screen">
      <Header />
      <ProductDetail product={product} />
      <Footer />
    </div>
  )
}
