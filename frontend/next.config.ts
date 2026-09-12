import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    // Falls back to localhost for local dev if the env variable is missing
    const destinationUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";
    
    return [
      {
        source: "/api/v1/:path*",
        destination: `${destinationUrl}/api/v1/:path*`, 
      },
    ];
  },
};

export default nextConfig;