import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Performance: Compress output
  compress: true,

  // Redirect old WordPress URLs if needed
  async redirects() {
    return [
      // Add any old WordPress URLs that need redirecting
      // {
      //   source: "/old-page",
      //   destination: "/",
      //   permanent: true,
      // },
    ];
  },

  // Security headers
  async headers() {
    return [
      {
        source: "/(.*)",
        headers: [
          { key: "X-Frame-Options", value: "DENY" },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          {
            key: "Content-Security-Policy",
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://connect.facebook.net",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: https://www.facebook.com",
              "connect-src 'self' https://*.supabase.co https://www.facebook.com https://graph.facebook.com",
              "font-src 'self' https://fonts.gstatic.com data:",
              "frame-src 'none'",
            ].join("; "),
          },
        ],
      },
    ];
  },
};

export default nextConfig;
