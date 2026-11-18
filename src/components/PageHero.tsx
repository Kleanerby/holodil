import type { Crumb } from "@/lib/seo";
import { Crumbs } from "./ui";

export function PageHero({ crumbs, eyebrow, title, lead, aside }: { crumbs: Crumb[]; eyebrow: string; title: React.ReactNode; lead?: React.ReactNode; aside?: React.ReactNode }) {
  return (
    <section className="relative overflow-hidden">
      <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden />
      <div className={`wrap relative grid items-end gap-8 pb-12 pt-8 lg:pb-16 lg:pt-12 ${aside ? "lg:grid-cols-[1.3fr_1fr]" : ""}`}>
        <div>
          <Crumbs items={crumbs} />
          <p className="eyebrow mb-4">{eyebrow}</p>
          <h1 className="h1 max-w-4xl">{title}</h1>
          {lead && <p className="lead mt-5 max-w-2xl">{lead}</p>}
        </div>
        {aside}
      </div>
    </section>
  );
}
