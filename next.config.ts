import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'standalone',
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'mysdhlitqyngkssyvwzb.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/media/**',
      },
    ],
  },
  serverExternalPackages: ['@supabase/supabase-js'],

};

export default nextConfig;
