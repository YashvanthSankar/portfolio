import type { NextConfig } from "next";

/**
 * Content Security Policy.
 * - 'unsafe-inline' on script-src is needed for Next.js inline bootstrap and our
 *   JSON-LD <script> tags. 'unsafe-eval' is needed for Vercel Analytics.
 * - Google Fonts requires fonts.googleapis.com (style) + fonts.gstatic.com (font).
 * - Vercel Insights endpoint is va.vercel-scripts.com + *.vercel-analytics.com.
 */
const lilMoneyApiOrigin = (() => {
  try { const url = new URL(process.env.NEXT_PUBLIC_LILMONEY_API_URL || ''); return url.protocol === 'https:' ? url.origin : ''; }
  catch { return ''; }
})();
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  `connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com ${lilMoneyApiOrigin}`,
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  async redirects() {
    return [{ source: '/littlemoney/:path*', destination: '/lilmoney/:path*', permanent: true }];
  },
  async rewrites() {
    // Keep the portfolio root intact on its original domains.
    // The LilMoney alias opens the product at its own root.
    return {
      beforeFiles: ['', '/privacy', '/terms', '/delete-account', '/support'].map(path => ({
        source: path || '/',
        has: [{ type: 'host' as const, value: 'lilmoney\\.vercel\\.app' }],
        destination: `/lilmoney${path}`,
      })),
    };
  },
  images: {
    qualities: [75, 85, 95],
    formats: ["image/avif", "image/webp"],
  },
  compress: true,
  poweredByHeader: false,
  async headers() {
    return [
      {
        source: '/downloads/:file*.apk',
        headers: [
          { key: 'Content-Type', value: 'application/vnd.android.package-archive' },
          { key: 'Content-Disposition', value: 'attachment' },
          { key: 'Cache-Control', value: 'public, max-age=3600' },
        ],
      },
      {
        source: "/(.*)",
        headers: [
          { key: "Content-Security-Policy", value: csp },
          { key: "X-Content-Type-Options", value: "nosniff" },
          { key: "X-Frame-Options", value: "DENY" },
          { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
          { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=(), browsing-topics=()" },
          { key: "Strict-Transport-Security", value: "max-age=63072000; includeSubDomains; preload" },
          { key: "X-DNS-Prefetch-Control", value: "on" },
        ],
      },
      {
        source: "/(.*)\\.(jpg|jpeg|png|gif|ico|svg|webp|avif)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/(.*)\\.(js|css|woff2)",
        headers: [
          { key: "Cache-Control", value: "public, max-age=31536000, immutable" },
        ],
      },
      {
        source: "/YashvanthS_Resume.pdf",
        headers: [
          { key: "Cache-Control", value: "public, max-age=86400" },
        ],
      },
    ];
  },
};

export default nextConfig;
