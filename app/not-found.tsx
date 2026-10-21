import Link from "next/link";
import { SiteHeader } from "@/components/site-header";

export default function NotFound() {
  return (
    <>
      <SiteHeader home={false} />
      <main id="main-content" className="col pt-14 sm:pt-20">
        <h1 className="h-page">Page not found.</h1>
        <p className="mt-4 text-muted">The link is broken, or the page moved.</p>
        <p className="mt-8">
          <Link href="/" className="btn">
            Back home
          </Link>
        </p>
      </main>
    </>
  );
}
