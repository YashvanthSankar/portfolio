import { EMAIL, NAME, RESUME_URL, ROLE } from "@/data/site";

export function Hero() {
  return (
    <section className="col pb-4 pt-14 sm:pt-20">
      <h1 className="h-page">{ROLE}.</h1>
      <p className="mt-6 max-w-[34rem] text-muted">
        I&apos;m {NAME}, a computer science student at IIITDM Kancheepuram in Chennai. I
        co-founded Denoise Labs, build at Promptli, and I&apos;m open to work.
      </p>
      <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
        <a href={`mailto:${EMAIL}`} className="btn">
          Email me
        </a>
        <a href={RESUME_URL} download className="link small">
          Download résumé
        </a>
      </div>
    </section>
  );
}
