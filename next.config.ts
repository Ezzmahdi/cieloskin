import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'wnonbktmlntllniyfdpx.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/product-images/**',
      },
    ],
  },
  serverExternalPackages: ['@supabase/supabase-js'],

};

export default nextConfig;
