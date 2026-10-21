import type { NextConfig } from "next";

/**
 * Content Security Policy.
 * - 'unsafe-inline' on script-src is needed for the Next.js inline bootstrap,
 *   the theme script and the JSON-LD <script>. 'unsafe-eval' for Vercel Analytics.
 * - Google Fonts (via next/font) self-hosts, but the origins stay allowed.
 * - Vercel Insights endpoint is va.vercel-scripts.com + vitals.vercel-insights.com.
 */
const csp = [
  "default-src 'self'",
  "script-src 'self' 'unsafe-inline' 'unsafe-eval' https://va.vercel-scripts.com",
  "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
  "img-src 'self' data: blob: https:",
  "font-src 'self' data: https://fonts.gstatic.com",
  "connect-src 'self' https://vitals.vercel-insights.com https://va.vercel-scripts.com",
  "frame-ancestors 'none'",
  "base-uri 'self'",
  "form-action 'self'",
  "object-src 'none'",
  "upgrade-insecure-requests",
].join("; ");

const nextConfig: NextConfig = {
  /* The résumé lives in github.com/YashvanthSankar/resume and is published
     by GitHub Pages; this keeps the old URL working and always current. */
  async redirects() {
    return [
      {
        source: "/YashvanthS_Resume.pdf",
        destination: "https://yashvanthsankar.github.io/resume/resume.pdf",
        permanent: false,
      },
    ];
  },
  /* `curl yashvanth.com` gets a plain-text card instead of the HTML. */
  async rewrites() {
    return {
      beforeFiles: [
        {
          source: "/",
          has: [{ type: "header", key: "user-agent", value: "(curl|Wget|HTTPie)/.*" }],
          destination: "/api/card",
        },
      ],
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
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
      {
        source: "/(.*)\\.(js|css|woff2)",
        headers: [{ key: "Cache-Control", value: "public, max-age=31536000, immutable" }],
      },
    ];
  },
};

export default nextConfig;
