import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono, Instrument_Serif } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { SmoothScroll } from "@/components/providers/smooth-scroll";
import { PageTransition } from "@/components/providers/page-transition";
import { Cursor } from "@/components/cursor";
import { NAME, SITE_URL } from "@/data/site";
import { profileUrls } from "@/data/socials";

const TITLE = `${NAME} · Full-Stack Developer & AI Engineer`;

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

/* Editorial counterweight — used on 2–4 emphasized words per section. */
const instrumentSerif = Instrument_Serif({
  variable: "--font-serif",
  subsets: ["latin"],
  weight: ["400"],
  style: ["italic"],
  display: "swap",
});

export const viewport: Viewport = {
  viewportFit: "cover",
  themeColor: "#0A0A0B",
};

export const metadata: Metadata = {
  title: {
    default: TITLE,
    template: `%s · ${NAME}`,
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
  /* Inherited by /lilmoney's metadata, which must not change — so these
     stay the short form while the portfolio's own title carries NAME. */
  authors: [{ name: "Yashvanth S" }],
  creator: "Yashvanth S",
  publisher: "Yashvanth S",
  formatDetection: { email: false, address: false, telephone: false },
  metadataBase: new URL(SITE_URL),
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: SITE_URL,
    title: TITLE,
    description:
      "Full-stack developer & AI engineer building fast, opinionated products for the modern web.",
    siteName: NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
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
              name: NAME,
              alternateName: "Yashvanth S",
              jobTitle: "Full-Stack Developer & AI Engineer",
              description:
                "Full-stack developer and AI engineer specializing in React, Next.js, Node.js, and machine learning.",
              url: SITE_URL,
              sameAs: profileUrls,
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
        className={`${geistSans.variable} ${geistMono.variable} ${instrumentSerif.variable} font-sans antialiased`}
      >
        {/* Reveal targets ship with `opacity: 0` inline and are shown by
            JS. Without JS there is nothing to show them, so the stylesheet
            wins by force and the page reads in full. */}
        <noscript>
          <style>{`[style*="opacity:0"],[style*="opacity: 0"]{opacity:1!important}`}</style>
        </noscript>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[100] focus:px-4 focus:py-2 focus:bg-[var(--bg-1)] focus:text-[var(--text-1)] focus:border focus:border-[var(--accent)] focus:rounded-[2px] focus:text-sm focus:font-medium"
        >
          Skip to main content
        </a>
        <SmoothScroll>
          <PageTransition>{children}</PageTransition>
        </SmoothScroll>
        <Cursor />
        <Analytics />
      </body>
    </html>
  );
}
