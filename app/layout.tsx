import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Analytics } from "@vercel/analytics/next";
import { NAME, ROLE, SITE_URL } from "@/data/site";
import { profileUrls } from "@/data/socials";

const TITLE = `${NAME} · ${ROLE}`;
const DESCRIPTION = `${ROLE} in Chennai. React, Next.js, Node.js, Python and machine learning.`;

const geist = Geist({
  variable: "--font-geist",
  subsets: ["latin"],
  display: "swap",
});

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0b" },
  ],
};

export const metadata: Metadata = {
  title: { default: TITLE, template: `%s · ${NAME}` },
  description: DESCRIPTION,
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
    description: DESCRIPTION,
    siteName: NAME,
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
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

/* Replays a stored theme choice before first paint. Without a choice the
   stylesheet follows the system preference on its own. */
const THEME_SCRIPT = `try{var t=localStorage.getItem("theme");if(t==="light"||t==="dark")document.documentElement.setAttribute("data-theme",t)}catch(e){}`;

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: THEME_SCRIPT }} />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Person",
              name: NAME,
              alternateName: "Yashvanth S",
              jobTitle: ROLE,
              description: DESCRIPTION,
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
      <body className={`${geist.variable} font-sans`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:bg-ink focus:px-3 focus:py-2 focus:text-bg"
        >
          Skip to main content
        </a>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
