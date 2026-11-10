import { technologyCategories } from "@/data/technologies";

export function Stack() {
  return (
    <section id="stack" className="col section scroll-mt-8">
      <h2 className="h-section">Stack</h2>
      <dl className="space-y-4">
        {technologyCategories.map((c) => (
          <div key={c.title} className="grid gap-1 sm:grid-cols-[6.5rem_minmax(0,1fr)] sm:gap-4">
            <dt className="small text-muted sm:pt-0.5">{c.title}</dt>
            <dd className="measure">{c.items.join(", ")}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
