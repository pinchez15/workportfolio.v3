import type { NextConfig } from "next";

const securityHeaders = [
  {
    key: "Content-Security-Policy",
    value: [
      "default-src 'self'",
      // Scripts: self + Clerk (including custom domain) + Calendly + PostHog
      "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://clerk.com https://*.clerk.com https://*.clerk.accounts.dev https://clerk.workportfolio.io https://assets.calendly.com https://us-assets.i.posthog.com",
      // Styles: self + inline (needed for Tailwind/emotion)
      "style-src 'self' 'unsafe-inline' https://assets.calendly.com",
      // Images: self + data URIs + common image sources + Clerk
      "img-src 'self' data: blob: https: http:",
      // Fonts: self + Google Fonts
      "font-src 'self' data: https://fonts.gstatic.com",
      // Connect: API calls to self + Clerk + Supabase + PostHog + Calendly
      "connect-src 'self' https://*.clerk.com https://*.clerk.accounts.dev https://clerk.workportfolio.io https://*.supabase.co wss://*.supabase.co https://us.i.posthog.com https://us-assets.i.posthog.com https://calendly.com https://api.calendly.com",
      // Frames: Calendly embeds + Clerk
      "frame-src 'self' https://calendly.com https://*.clerk.accounts.dev https://clerk.workportfolio.io",
      // Workers for service workers
      "worker-src 'self' blob:",
      // Media
      "media-src 'self' blob: data:",
    ].join("; "),
  },
  {
    key: "X-Frame-Options",
    value: "SAMEORIGIN",
  },
  {
    key: "X-Content-Type-Options",
    value: "nosniff",
  },
  {
    key: "Referrer-Policy",
    value: "strict-origin-when-cross-origin",
  },
  {
    key: "Permissions-Policy",
    value: "camera=(), microphone=(), geolocation=()",
  },
];

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'via.placeholder.com',
      },
    ],
  },
  headers: async () => [
    {
      source: "/(.*)",
      headers: securityHeaders,
    },
  ],
  async rewrites() {
    return [
      {
        source: "/ingest/static/:path*",
        destination: "https://us-assets.i.posthog.com/static/:path*",
      },
      {
        source: "/ingest/:path*",
        destination: "https://us.i.posthog.com/:path*",
      },
      {
        source: "/ingest/decide",
        destination: "https://us.i.posthog.com/decide",
      },
    ];
  },
  // This is required to support PostHog trailing slash API requests
  skipTrailingSlashRedirect: true,
};

export default nextConfig;
