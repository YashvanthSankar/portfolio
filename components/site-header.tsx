import Link from "next/link";
import { ThemeToggle } from "@/components/theme-toggle";
import { Menu } from "@/components/menu";

/**
 * A plain header that scrolls away with the page: wordmark, theme
 * switch, and the Menu button that opens the section carousel.
 */
export function SiteHeader({ home = true }: { home?: boolean }) {
  return (
    <header className="col flex items-center justify-between gap-6 pt-7">
      <Link href="/" className="font-medium">
        Yashvanth
      </Link>
      <nav aria-label="Primary" className="small flex items-center gap-6">
        <ThemeToggle />
        <Menu home={home} />
      </nav>
    </header>
  );
}
