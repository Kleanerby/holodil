import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CircleCheck, Phone, Power, Siren, X } from "lucide-react";
import { LeadForm } from "@/components/LeadForm";
import { PartExplorer } from "@/components/stages";
import { Crumbs, CtaBand, Faq, Head, JsonLd, Queries } from "@/components/ui";
import { combosOfFault } from "@/lib/data/combos";
import { faultBySlug, faults } from "@/lib/data/faults";
import { breadcrumbLd, faqLd, pageMetadata, serviceLd } from "@/lib/seo";
import { routes, site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return faults.map((f) => ({ slug: f.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props) {
  const f = faultBySlug((await params).slug);
  if (!f) return {};
  return pageMetadata({ title: f.title, description: f.description, path: `${routes.faults}/${f.slug}`, keywords: f.queries });
}

const tones = {
  ice: { accent: "#6fdcff", label: "Можно подождать", cls: "border-ok/30 bg-ok/[0.07] text-ok" },
  amber: { accent: "#ffc24a", label: "Вызвать мастера сегодня", cls: "border-warn/30 bg-warn/[0.07] text-warn" },
  red: { accent: "#ff6b7a", label: "Выключите из розетки", cls: "border-bad/40 bg-bad/[0.1] text-bad" },
} as const;

export default async function FaultPage({ params }: Props) {
  const f = faultBySlug((await params).slug);
  if (!f) notFound();
  const path = `${routes.faults}/${f.slug}`;
  const tone = tones[f.tone];
  const crumbs = [{ name: "Главная", path: "/" }, { name: "Неисправности", path: routes.faults }, { name: f.name, path }];
  const min = Math.min(...f.causes.map((c) => c.from));
  const max = Math.max(...f.causes.map((c) => c.from));
  const others = faults.filter((x) => x.slug !== f.slug).slice(0, 14);

  return (
    <main id="main" style={{ "--accent": tone.accent } as React.CSSProperties}>
      {f.tone === "red" && (
        <div className="border-b border-bad/30 bg-bad/15">
          <p className="wrap flex items-center gap-3 py-3 text-sm font-semibold text-bad">
            <Power size={16} /> Сначала выньте вилку из розетки — потом читайте дальше.
          </p>
        </div>
      )}

      <section className="wrap grid gap-8 pb-14 pt-8 lg:grid-cols-[1.2fr_1fr] lg:pt-12">
        <div>
          <Crumbs items={crumbs} />
          <p className={`mb-5 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold ${tone.cls}`}>
            <Siren size={14} /> Срочность {f.urgency}/3 · {tone.label}
          </p>
          <h1 className="h1">{f.h1}</h1>
          <p className="lead mt-5 max-w-xl">{f.lead}</p>
          <p className="mt-4 max-w-xl text-sm text-snow/80">{f.urgencyText}</p>

          <div className="mt-8 flex flex-wrap items-end gap-x-10 gap-y-4">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-mute">Стоимость ремонта</p>
              <p className="mt-1 font-display text-3xl font-semibold sm:text-4xl">{min}–{Math.round((max * 1.6) / 10) * 10} <span className="text-base text-mute">BYN</span></p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-mute">Мастер приедет</p>
              <p className="mt-1 font-display text-3xl font-semibold sm:text-4xl">{site.arrival}</p>
            </div>
          </div>
          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a href={site.phoneHref} className="btn-hot"><Phone size={16} /> {site.phone}</a>
            <a href="#prichiny" className="btn-ghost">Смотреть причины <ArrowRight size={16} /></a>
          </div>
        </div>

        {/* чек-лист самопроверки */}
        <div className="card self-start p-6 sm:p-8">
          <p className="eyebrow mb-3">До вызова мастера</p>
          <h2 className="font-display text-xl font-semibold">Проверьте сами — это бесплатно</h2>
          <ul className="mt-6 space-y-5">
            {f.selfCheck.map((c) => (
              <li key={c.t} className="flex gap-3.5">
                <CircleCheck size={20} className="acc mt-0.5 shrink-0" />
                <div>
                  <p className="font-semibold">{c.t}</p>
                  <p className="mt-1 text-sm leading-relaxed text-mute">{c.d}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="mt-6 border-t border-white/8 pt-5 text-sm text-mute">Не помогло? Значит, причина в одном из узлов ниже.</p>
        </div>
      </section>

      <section className="wrap pb-16 lg:pb-24" id="prichiny">
        <Head eyebrow="Причины" title={<>{f.causes.length} причин — <span className="acc">покажем на модели</span></>} lead="Доля случаев — по нашей статистике заявок. Наведите на причину: нужный узел подсветится внутри холодильника." />
        <PartExplorer
          accent={tone.accent}
          items={f.causes.map((c) => ({
            part: c.part, title: c.name, text: c.why, fix: c.fix, from: c.from, share: c.share,
            href: c.service ? `${routes.services}/${c.service}` : undefined,
          }))}
        />
      </section>

      <section className="wrap grid gap-5 pb-16 lg:grid-cols-[1.3fr_1fr] lg:pb-24">
        <div className="rounded-3xl border border-bad/25 bg-bad/[0.06] p-6 sm:p-8">
          <h2 className="font-display text-xl font-semibold sm:text-2xl">Чего делать не нужно</h2>
          <ul className="mt-5 space-y-4">
            {f.dont.map((d) => (
              <li key={d} className="flex gap-3 leading-relaxed">
                <X size={18} className="mt-1 shrink-0 text-bad" /> {d}
              </li>
            ))}
          </ul>
        </div>
        <LeadForm compact context={`Неисправность: ${f.name}`} title="Вызвать мастера" />
      </section>

      {combosOfFault(f.slug).length > 0 && (
        <section className="wrap pb-8">
          <Head eyebrow="По маркам" title="У вашей марки своя причина" lead="У некоторых брендов эта неисправность выглядит иначе — разобрали отдельно." />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {combosOfFault(f.slug).map((c) => (
              <Link key={c.brand} href={`${routes.brands}/${c.brand}/${c.fault}`} className="card group flex items-center justify-between gap-4 p-5 transition hover:border-white/25">
                <span><span className="block font-display font-semibold">{c.b.name}</span><span className="text-xs text-mute">{c.h1}</span></span>
                <ArrowRight size={16} className="acc shrink-0 transition group-hover:translate-x-1" />
              </Link>
            ))}
          </div>
        </section>
      )}

      <Faq items={f.faq} title={`Коротко: ${f.name.toLowerCase()}`} />

      <section className="wrap pb-12">
        <h2 className="mb-5 font-display text-lg font-semibold">Другие неисправности</h2>
        <ul className="flex flex-wrap gap-2">
          {others.map((o) => (
            <li key={o.slug}>
              <Link href={`${routes.faults}/${o.slug}`} className="chip transition hover:border-white/40 hover:text-white">{o.name}</Link>
            </li>
          ))}
        </ul>
      </section>

      <Queries items={f.queries} />
      <CtaBand title={<>Не гадайте — мастер определит причину за <span className="acc">15 минут</span></>} />
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd data={faqLd(f.faq)} />
      <JsonLd data={serviceLd({ name: f.h1, description: f.description, path, from: min })} />
    </main>
  );
}
