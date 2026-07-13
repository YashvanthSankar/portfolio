import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next";

const geistSans = Geist({
  variable: "--font-display",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

const geistMono = Geist_Mono({
  variable: "--font-mono",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#FAFAFA" },
    { media: "(prefers-color-scheme: dark)", color: "#0B0B0C" },
  ],
};

export const metadata: Metadata = {
  title: {
    default: "Yashvanth S · Full-Stack Developer & AI Engineer",
    template: "%s · Yashvanth S",
  },
  description:
    "Full-stack developer & AI engineer building fast, opinionated products for the modern web. React, Next.js, Node.js, Python, ML.",
  keywords: [
    "Yashvanth S",
    "full-stack developer",
    "AI engineer",
    "React developer",
    "Next.js developer",
    "Node.js developer",
    "machine learning",
    "web development",
    "portfolio",
    "JavaScript",
    "TypeScript",
    "Python",
    "open source",
    "IIITDM Kancheepuram",
  ],
  authors: [{ name: "Yashvanth S" }],
  creator: "Yashvanth S",
  publisher: "Yashvanth S",
  formatDetection: { email: false, address: false, telephone: false },
  metadataBase: new URL("https://yashvanth.com"),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://yashvanth.com",
    title: "Yashvanth S · Full-Stack Developer & AI Engineer",
    description:
      "Full-stack developer & AI engineer building fast, opinionated products for the modern web.",
    siteName: "Yashvanth S",
  },
  twitter: {
    card: "summary_large_image",
    title: "Yashvanth S · Full-Stack Developer & AI Engineer",
    description:
      "Full-stack developer & AI engineer building fast, opinionated products for the modern web.",
    creator: "@yashvanths19",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "ZR-1eKynBhaBA8AmLJvdzCX-OQybiFhgC6EjoXwbGoc",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: "Yashvanth S",
              jobTitle: "Full-Stack Developer & AI Engineer",
              description:
                "Full-stack developer and AI engineer specializing in React, Next.js, Node.js, and machine learning.",
              url: "https://yashvanth.com",
              sameAs: [
                "https://github.com/YashvanthSankar",
                "https://linkedin.com/in/yashvanths",
                "https://x.com/yashvanths19",
                "https://instagram.com/yashvanth.19",
              ],
              knowsAbout: [
                "JavaScript",
                "TypeScript",
                "React",
                "Next.js",
                "Node.js",
                "Python",
                "Machine Learning",
                "AI",
                "Web Development",
                "Full-Stack Development",
              ],
              alumniOf: {
                "@type": "EducationalOrganization",
                name: "IIITDM Kancheepuram",
              },
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-sans antialiased`}
      >
        <ThemeProvider
          attribute="class"
          storageKey="portfolio-theme"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[var(--ink)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--paper)]"
          >
            Skip to main content
          </a>
          {children}
        </ThemeProvider>
        <Analytics />
      </body>
    </html>
  );
}
