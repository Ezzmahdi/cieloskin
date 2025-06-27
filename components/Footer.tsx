import Image from "next/image"
import Link from "next/link"
import { Instagram, Facebook, Twitter } from "lucide-react"

export default function Footer() {
  return (
    <footer className="bg-gradient-to-r from-pink-50 to-purple-50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Image
              src="/images/cieloskin-logo-new.png"
              alt="CieloSkin Logo"
              width={150}
              height={75}
              className="h-16 w-auto mb-4"
            />
            <p className="text-gray-600 mb-4 max-w-md">
              Premium skincare products crafted with love and natural ingredients. Glow like the sky with CieloSkin.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-pink-400 hover:text-pink-500 transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-pink-400 hover:text-pink-500 transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-pink-400 hover:text-pink-500 transition-colors">
                <Twitter size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/products" className="text-gray-600 hover:text-pink-400 transition-colors">
                  Products
                </Link>
              </li>
              <li>
                <Link href="/" className="text-gray-600 hover:text-pink-400 transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link href="/admin" className="text-gray-600 hover:text-pink-400 transition-colors">
                  Admin
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold text-gray-800 mb-4">Contact</h3>
            <ul className="space-y-2 text-gray-600">
              <li>WhatsApp: +1 (555) 123-4567</li>
              <li>Email: hello@cieloskin.com</li>
              <li>Follow us on social media</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-pink-200 mt-8 pt-8 text-center text-gray-600">
          <p>&copy; 2024 CieloSkin. All rights reserved. Glow Like The Sky.</p>
        </div>
      </div>
    </footer>
  )
}
