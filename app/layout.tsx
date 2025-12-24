import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

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
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
        alt: 'Yashvanth S - Full-Stack Developer & AI Engineer',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Yashvanth S | Full-Stack Developer & AI Engineer',
    description: 'Full-stack developer and AI engineer specializing in React, Next.js, Node.js, and machine learning.',
    images: ['/og-image.png'],
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
    google: 'your-google-site-verification-code', 
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
                "https://instagram.com/yashavnth191206"
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
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
