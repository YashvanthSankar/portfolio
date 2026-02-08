export const metadata = {
  title: "My Work | GitHub Repositories & Projects",
  description: "Explore my comprehensive collection of GitHub repositories showcasing full-stack development, AI projects, and open-source contributions across various technologies.",
  keywords: [
    "GitHub repositories",
    "open source projects",
    "full-stack development",
    "React projects",
    "Next.js projects",
    "AI projects",
    "machine learning",
    "web development portfolio",
    "code portfolio"
  ],
  alternates: {
    canonical: '/work',
  },
  openGraph: {
    title: "My Work | Yashvanth S - GitHub Repositories",
    description: "Explore my comprehensive collection of GitHub repositories showcasing full-stack development, AI projects, and open-source contributions.",
    url: 'https://yashvanth.com/work',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'My Work | Yashvanth S - GitHub Repositories',
    description: 'Explore my comprehensive collection of GitHub repositories showcasing full-stack development projects.',
  },
};

export default function WorkLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "CollectionPage",
            "name": "Portfolio Projects - Yashvanth S",
            "description": "Explore my portfolio of full-stack development projects, AI applications, and web development work.",
            "url": "https://yashvanth.com/work",
            "mainEntity": {
              "@type": "ItemList",
              "name": "Portfolio Projects",
              "description": "A collection of my development projects and work"
            },
            "author": {
              "@type": "Person",
              "name": "Yashvanth S",
              "url": "https://yashvanth.com"
            }
          })
        }}
      />
      {children}
    </>
  );
}