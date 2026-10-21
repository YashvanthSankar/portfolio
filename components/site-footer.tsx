import Link from "next/link";
import { sections } from "@/data/sections";
import { socials } from "@/data/socials";
import { NAME } from "@/data/site";
import { Clock } from "@/components/clock";

export function SiteFooter() {
  return (
    <footer className="col mt-28 pb-12">
      <div className="grid gap-10 sm:grid-cols-3">
        <div className="small">
          <p className="font-medium">{NAME}</p>
          <p className="text-muted">
            Chennai, India · <Clock />
          </p>
        </div>
        <ul className="small space-y-1">
          {sections.map((s) => (
            <li key={s.id}>
              <Link href={`/#${s.id}`} className="link text-muted hover:text-ink">
                {s.label}
              </Link>
            </li>
          ))}
          <li>
            <Link href="/work" className="link text-muted hover:text-ink">
              All repositories
            </Link>
          </li>
        </ul>
        <ul className="small space-y-1">
          {socials.map((s) => (
            <li key={s.name}>
              <a
                href={s.href}
                {...(!s.noBlank && { target: "_blank", rel: "noopener noreferrer" })}
                className="link text-muted hover:text-ink"
              >
                {s.name}
              </a>
            </li>
          ))}
        </ul>
      </div>
      <p className="small mt-12 text-muted">© {new Date().getFullYear()} {NAME}</p>
    </footer>
  );
}
