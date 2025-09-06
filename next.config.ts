import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    unoptimized: true,
    domains: ['res.cloudinary.com'],
  },
  experimental: {
    optimizePackageImports: ['lucide-react'],
  },
  // Fix domain redirect issues
  async redirects() {
    return [
      {
        source: '/api/:path*',
        destination: 'https://www.zeynix.in/api/:path*',
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
