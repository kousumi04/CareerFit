import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Explicitly using 127.0.0.1 instead of localhost to prevent IPv6 drops
    const destinationUrl = process.env.NEXT_PUBLIC_API_URL || "http://127.0.0.1:8000";
    
    return [
      {
        source: "/api/v1/:path*",
        destination: `${destinationUrl}/api/v1/:path*`, 
      },
    ];
  },
};

export default nextConfig;