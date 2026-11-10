import Image from "next/image";
import { EMAIL, NAME } from "@/data/site";

const facts = [
  { label: "Email", value: EMAIL, href: `mailto:${EMAIL}` },
  { label: "Based in", value: "Chennai, India" },
  { label: "Studying", value: "BTech + MTech CS, IIITDM Kancheepuram, 2024–2029" },
  { label: "CGPA", value: "9.32" },
  { label: "Status", value: "Open to work" },
];

export function About() {
  return (
    <section id="about" className="col section scroll-mt-8">
      <h2 className="h-section">About</h2>
      <div className="grid gap-8 sm:grid-cols-[minmax(0,1fr)_11rem] sm:gap-10">
        <div>
          <p>
            I build full-stack apps and AI tools that solve real problems, and I care
            about the details nobody asks for: the empty state, the error message, the
            form that doesn&apos;t lose your text. Right now I&apos;m making AI feel
            quiet and useful.
          </p>
          <dl className="mt-8 space-y-2">
            {facts.map((f) => (
              <div key={f.label} className="grid grid-cols-[6.5rem_minmax(0,1fr)] gap-4">
                <dt className="small text-muted">{f.label}</dt>
                <dd className="small">
                  {f.href ? (
                    <a href={f.href} className="link break-all">
                      {f.value}
                    </a>
                  ) : (
                    f.value
                  )}
                </dd>
              </div>
            ))}
          </dl>
        </div>
        <Image
          src="/yashvanth.jpg"
          alt={NAME}
          width={460}
          height={460}
          sizes="(max-width: 640px) 100vw, 176px"
          className="block h-auto w-full max-w-[16rem] grayscale sm:max-w-none"
        />
      </div>
    </section>
  );
}
