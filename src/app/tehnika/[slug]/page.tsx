import Link from "next/link";
import { notFound } from "next/navigation";
import { Phone } from "lucide-react";
import { LeadForm } from "@/components/LeadForm";
import { Stage } from "@/components/stages";
import { Crumbs, CtaBand, Faq, Head, JsonLd, Queries } from "@/components/ui";
import { tech, techBySlug } from "@/lib/data/tech";
import { breadcrumbLd, faqLd, pageMetadata, serviceLd } from "@/lib/seo";
import { partAccent, routes, site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return tech.map((t) => ({ slug: t.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props) {
  const t = techBySlug((await params).slug);
  if (!t) return {};
  return pageMetadata({ title: t.title, description: t.description, path: `${routes.tech}/${t.slug}`, keywords: t.queries });
}

export default async function TechPage({ params }: Props) {
  const t = techBySlug((await params).slug);
  if (!t) notFound();
  const path = `${routes.tech}/${t.slug}`;
  const accent = partAccent[t.part];
  const crumbs = [{ name: "Главная", path: "/" }, { name: "Техника", path: routes.tech }, { name: t.name, path }];

  return (
    <main id="main" style={{ "--accent": accent } as React.CSSProperties}>
      <section className="wrap pb-10 pt-8 lg:pt-12">
        <Crumbs items={crumbs} />
        <div className="grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <Stage kind={t.kind} body={t.body} accent={accent} highlight={t.part} startOpen yaw={-0.7} className="order-2 h-[440px] sm:h-[540px] lg:order-1 lg:h-[620px]" />
          <div className="order-1 self-center lg:order-2">
            <p className="eyebrow mb-4">Тип техники</p>
            <h1 className="h1">{t.h1}</h1>
            <p className="lead mt-5">{t.lead}</p>
            <dl className="mt-7 divide-y divide-white/8 border-y border-white/8">
              {[{ k: "Ремонт", v: `от ${t.from} BYN` }, ...t.specs].map((s) => (
                <div key={s.k} className="flex justify-between gap-6 py-3.5 text-sm">
                  <dt className="text-mute">{s.k}</dt>
                  <dd className="text-right font-semibold">{s.v}</dd>
                </div>
              ))}
            </dl>
            <a href={site.phoneHref} className="btn-hot mt-7"><Phone size={16} /> {site.phone}</a>
          </div>
        </div>
      </section>

      <section className="wrap py-16 lg:py-24">
        <Head eyebrow="Устройство" title="Чем отличается конструкция" lead="От этого зависит и диагностика, и цена ремонта." />
        <div className="grid gap-4 md:grid-cols-3">
          {t.anatomy.map((a, i) => (
            <div key={a.t} className="card relative overflow-hidden p-7">
              <span className="absolute -right-2 -top-6 font-display text-[7rem] font-bold leading-none text-white/[0.04]" aria-hidden>{i + 1}</span>
              <h3 className="font-display text-lg font-semibold">{a.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-mute">{a.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap grid gap-8 pb-16 lg:grid-cols-[1.4fr_1fr] lg:pb-24">
        <div>
          <h2 className="h2 mb-6">Неисправности и цены</h2>
          <div className="card divide-y divide-white/6 overflow-hidden">
            {t.faults.map((f) => (
              <div key={f.t} className="grid gap-1 px-5 py-4 sm:grid-cols-[1.1fr_1.3fr_auto] sm:items-center sm:gap-5 sm:px-7">
                <p className="font-semibold">{f.t}</p>
                <p className="text-sm text-mute">{f.cause}</p>
                <p className="whitespace-nowrap font-display font-semibold sm:text-right">{f.from === 0 ? <span className="text-ok">диагностика 0</span> : `от ${f.from}`} <span className="text-xs text-mute">BYN</span></p>
              </div>
            ))}
          </div>
        </div>
        <LeadForm compact context={`Техника: ${t.name}`} />
      </section>

      <Faq items={t.faq} title={t.name} />

      <section className="wrap pb-12">
        <h2 className="mb-5 font-display text-lg font-semibold">Другая техника</h2>
        <ul className="flex flex-wrap gap-2">
          {tech.filter((x) => x.slug !== t.slug).map((n) => (
            <li key={n.slug}><Link href={`${routes.tech}/${n.slug}`} className="chip transition hover:border-white/40 hover:text-white">{n.name}</Link></li>
          ))}
        </ul>
      </section>

      <Queries items={t.queries} />
      <CtaBand />
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd data={faqLd(t.faq)} />
      <JsonLd data={serviceLd({ name: t.h1, description: t.description, path, from: t.from })} />
    </main>
  );
}
