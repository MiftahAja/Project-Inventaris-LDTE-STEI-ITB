import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable standalone output for Docker production deployment
  // This removes node_modules from the production build
  output: "standalone",

  // External packages that should not be bundled
  // These are loaded at runtime from node_modules
  serverExternalPackages: [
    "@prisma/client",
    "bcryptjs",
    "ioredis",
  ],

  // Image optimization
  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [],
  },

  // Compress responses for faster transfer
  compress: true,

  // Disable x-powered-by header for security
  poweredByHeader: false,

  // Security and performance headers
  async headers() {
    return [
      {
        // Security headers for all routes
        source: "/(.*)",
        headers: [
          {
            key: "X-Content-Type-Options",
            value: "nosniff",
          },
          {
            key: "X-Frame-Options",
            value: "DENY",
          },
          {
            key: "X-XSS-Protection",
            value: "1; mode=block",
          },
          {
            key: "Referrer-Policy",
            value: "strict-origin-when-cross-origin",
          },
        ],
      },
      {
        // Cache static assets for 1 year (immutable)
        source: "/(.*)\\.(ico|png|svg|jpg|jpeg|gif|webp|avif|woff|woff2|ttf|eot)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // Cache Next.js static assets for 1 year
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // No cache for API routes (handled by Redis)
        source: "/api/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "private, no-cache, no-store, must-revalidate",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
