import type { Metadata } from "next";
import { NAME, SITE_URL } from "@/data/site";

const DESCRIPTION =
  "Every public repository — tools, experiments, and things built to scratch an itch.";

export const metadata: Metadata = {
  title: "All projects",
  description: DESCRIPTION,
  alternates: { canonical: "/work" },
  openGraph: {
    title: `All projects · ${NAME}`,
    description: DESCRIPTION,
    url: `${SITE_URL}/work`,
  },
  twitter: {
    card: "summary_large_image",
    title: `All projects · ${NAME}`,
    description: DESCRIPTION,
  },
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            name: `All projects · ${NAME}`,
            description: DESCRIPTION,
            url: `${SITE_URL}/work`,
            author: { "@type": "Person", name: NAME, url: SITE_URL },
          }),
        }}
      />
      {children}
    </>
  );
}
