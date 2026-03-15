import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Analytics } from "@vercel/analytics/next"

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Yashvanth S | Developer Portfolio",
    template: "%s | Yashvanth S"
  },
  description: "Full-stack developer and AI engineer specializing in React, Next.js, Node.js, and machine learning. Explore my portfolio of innovative web applications and open-source projects.",
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
    "open source"
  ],
  authors: [{ name: "Yashvanth S" }],
  creator: "Yashvanth S",
  publisher: "Yashvanth S",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL('https://yashvanth.com'),
  alternates: {
    canonical: '/',
  },
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://yashvanth.com',
    title: 'Yashvanth S | Full-Stack Developer & AI Engineer',
    description: 'Full-stack developer and AI engineer specializing in React, Next.js, Node.js, and machine learning. Explore my portfolio of innovative web applications.',
    siteName: 'Yashvanth S Portfolio',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yashvanth S | Full-Stack Developer & AI Engineer',
    description: 'Full-stack developer and AI engineer specializing in React, Next.js, Node.js, and machine learning.',
    creator: '@yashvanths',
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'ZR-1eKynBhaBA8AmLJvdzCX-OQybiFhgC6EjoXwbGoc',
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
        <link rel="icon" href="/ys.png" type="image/png" />
        <link rel="manifest" href="/manifest.json" />
        <meta name="theme-color" content="#09090b" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              "name": "Yashvanth S",
              "jobTitle": "Full-Stack Developer & AI Engineer",
              "description": "Full-stack developer and AI engineer specializing in React, Next.js, Node.js, and machine learning.",
              "url": "https://yashvanth.com",
              "sameAs": [
                "https://github.com/YashvanthSankar",
                "https://linkedin.com/in/yashvanths",
                "https://instagram.com/yashvanth191206"
              ],
              "knowsAbout": [
                "JavaScript",
                "TypeScript",
                "React",
                "Next.js",
                "Node.js",
                "Python",
                "Machine Learning",
                "AI",
                "Web Development",
                "Full-Stack Development"
              ],
              "alumniOf": {
                "@type": "EducationalOrganization",
                "name": "IIITDM Kancheepuram"
              }
            }),
          }}
        />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} font-mono antialiased`}
      >
        <ThemeProvider
          attribute="class"
          storageKey="portfolio-theme"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <a
            href="#main-content"
            className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-white focus:text-black focus:rounded-lg focus:text-sm focus:font-medium"
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
