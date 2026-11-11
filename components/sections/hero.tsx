import { Hands } from "@/components/hands";
import { EMAIL, NAME, RESUME_URL, ROLE, SITE_URL } from "@/data/site";

const HOST = new URL(SITE_URL).host;

export function Hero() {
  return (
    <section className="pt-2 sm:pt-8">
      <Hands />
      <div className="col hero-copy">
        <h1 className="h-page">{ROLE}.</h1>
        <p className="mt-6 text-muted">
          I&apos;m {NAME}, a computer science student at IIITDM Kancheepuram in Chennai.
          Most recently an AI intern at Random Walk and a founding engineer at Promptli.
          Open to work.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a href={`mailto:${EMAIL}`} className="btn">
            Email me
          </a>
          <a href={RESUME_URL} download className="link small">
            Download résumé
          </a>
        </div>
        {/* Real: next.config.ts answers curl with a plain-text card. */}
        <p className="small no-print mt-8 text-muted">
          Or from a terminal: <span className="text-ink">curl {HOST}</span>
        </p>
      </div>
    </section>
  );
}
