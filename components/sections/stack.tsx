import { technologyCategories } from "@/data/technologies";

export function Stack() {
  return (
    <section id="stack" className="col mt-28 scroll-mt-8">
      <h2 className="h-section">Stack</h2>
      <dl className="mt-8 space-y-4">
        {technologyCategories.map((c) => (
          <div key={c.title} className="grid gap-1 sm:grid-cols-[7rem_1fr] sm:gap-6">
            <dt className="small text-muted">{c.title}</dt>
            <dd>{c.items.join(", ")}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
