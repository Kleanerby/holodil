import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, CircleCheck, Eye, Phone, Siren, Sparkles } from "lucide-react";
import { LeadForm } from "@/components/LeadForm";
import { PartExplorer } from "@/components/stages";
import { Crumbs, CtaBand, Faq, Head, JsonLd, Queries } from "@/components/ui";
import { comboBy, combos, combosOfBrand, combosOfFault } from "@/lib/data/combos";
import { breadcrumbLd, faqLd, pageMetadata, serviceLd } from "@/lib/seo";
import { partNames, routes, site } from "@/lib/site";

type Props = { params: Promise<{ slug: string; fault: string }> };

export function generateStaticParams() {
  return combos.map((c) => ({ slug: c.brand, fault: c.fault }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props) {
  const p = await params;
  const c = comboBy(p.slug, p.fault);
  if (!c) return {};
  return pageMetadata({ title: c.title, description: c.description, path: `${routes.brands}/${c.brand}/${c.fault}`, keywords: c.queries });
}

const urgency = {
  1: { label: "Можно подождать день-два", cls: "border-ok/30 bg-ok/[0.07] text-ok" },
  2: { label: "Вызвать мастера сегодня", cls: "border-warn/30 bg-warn/[0.07] text-warn" },
  3: { label: "Выключите из розетки", cls: "border-bad/40 bg-bad/[0.1] text-bad" },
} as const;

export default async function ComboPage({ params }: Props) {
  const p = await params;
  const c = comboBy(p.slug, p.fault);
  if (!c) notFound();
  const { b, f } = c;
  const path = `${routes.brands}/${b.slug}/${f.slug}`;
  const crumbs = [
    { name: "Главная", path: "/" },
    { name: "Бренды", path: routes.brands },
    { name: b.name, path: `${routes.brands}/${b.slug}` },
    { name: f.name, path },
  ];
  const u = urgency[f.urgency];
  const max = Math.round((Math.max(...c.causes.map((x) => x.from)) * 1.6) / 10) * 10;
  const faq = [c.faq, ...f.faq.slice(0, 2)];
  const sameBrand = combosOfBrand(b.slug).filter((x) => x.fault !== f.slug);
  const sameFault = combosOfFault(f.slug).filter((x) => x.brand !== b.slug);

  return (
    <main id="main" style={{ "--accent": b.accent } as React.CSSProperties}>
      <section className="relative overflow-hidden">
        <p aria-hidden className="pointer-events-none absolute -top-2 right-0 select-none font-display text-[18vw] font-bold uppercase leading-none tracking-tighter text-white/[0.03]">
          {b.name}
        </p>
        <div className="wrap relative pb-12 pt-8 lg:pt-12">
          <Crumbs items={crumbs} />
          <p className={`mb-5 inline-flex items-center gap-2 rounded-full border px-3.5 py-1.5 text-xs font-semibold ${u.cls}`}>
            <Siren size={14} /> {u.label}
          </p>
          <h1 className="h1 max-w-4xl">{c.h1}</h1>

          <div className="mt-8 grid gap-5 lg:grid-cols-[1.5fr_1fr]">
            {/* главный вывод — то, ради чего страница существует */}
            <div className="relative overflow-hidden rounded-3xl border border-white/12 bg-panel-2 p-7 sm:p-9">
              <span className="absolute inset-y-0 left-0 w-1" style={{ background: "var(--accent)" }} aria-hidden />
              <p className="eyebrow mb-4"><Sparkles size={13} /> Особенность {b.name}</p>
              <p className="text-lg leading-relaxed sm:text-xl">{c.insight}</p>
              <p className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-1 border-t border-white/8 pt-5 text-sm">
                <span className="text-mute">Чаще всего виноват:</span>
                <span className="acc font-display font-semibold">{partNames[c.top]}</span>
              </p>
            </div>
            <div className="card flex flex-col justify-between gap-6 p-7">
              <dl className="grid grid-cols-2 gap-5">
                <div>
                  <dt className="text-[11px] uppercase tracking-widest text-mute">Ремонт</dt>
                  <dd className="mt-1 font-display text-2xl font-semibold">{c.from}–{max} <span className="text-sm text-mute">BYN</span></dd>
                </div>
                <div>
                  <dt className="text-[11px] uppercase tracking-widest text-mute">Мастер</dt>
                  <dd className="mt-1 font-display text-2xl font-semibold">{site.arrival}</dd>
                </div>
              </dl>
              <p className="text-sm leading-relaxed text-mute">{f.urgencyText}</p>
              <a href={site.phoneHref} className="btn-hot"><Phone size={16} /> {site.phone}</a>
            </div>
          </div>
        </div>
      </section>

      <section className="wrap grid gap-5 pb-16 lg:grid-cols-2 lg:pb-24">
        <div className="card p-7 sm:p-8">
          <h2 className="flex items-center gap-2.5 font-display text-xl font-semibold"><Eye size={20} className="acc" /> Как узнать этот случай</h2>
          <ul className="mt-6 space-y-4">
            {c.signs.map((s) => (
              <li key={s} className="flex gap-3 leading-relaxed"><span className="acc mt-0.5">—</span>{s}</li>
            ))}
          </ul>
          <p className="mt-6 border-t border-white/8 pt-5 text-sm">
            <span className="text-mute">Модели, где встречается чаще: </span>{c.models}
          </p>
        </div>
        <div className="card p-7 sm:p-8">
          <h2 className="flex items-center gap-2.5 font-display text-xl font-semibold"><CircleCheck size={20} className="acc" /> Проверьте до вызова</h2>
          <ul className="mt-6 space-y-5">
            {f.selfCheck.slice(0, 3).map((s) => (
              <li key={s.t}>
                <p className="font-semibold">{s.t}</p>
                <p className="mt-1 text-sm leading-relaxed text-mute">{s.d}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <section className="wrap pb-16 lg:pb-24">
        <Head eyebrow="Причины" title={<>Что проверит мастер у {b.ru} — <span className="acc">по порядку</span></>} lead={`Порядок учитывает слабые места ${b.name}: сначала то, что у этой марки отказывает чаще. Цена — за работу в простом случае.`} />
        <PartExplorer
          kind={b.kind}
          body={b.body}
          accent={b.accent}
          items={c.causes.map((x) => ({ part: x.part, title: x.name, text: x.why, fix: x.fix, from: x.from, href: x.service ? `${routes.services}/${x.service}` : undefined }))}
        />
      </section>

      <section className="wrap grid gap-8 pb-8 lg:grid-cols-2">
        <div>
          <h2 className="h2">Читать подробнее</h2>
          <ul className="mt-6 divide-y divide-white/8 border-y border-white/8">
            <li>
              <Link href={`${routes.brands}/${b.slug}`} className="group flex items-center justify-between gap-4 py-4">
                <span><span className="block font-semibold">Ремонт холодильников {b.name}</span><span className="text-sm text-mute">Все слабые места марки, серии, заметка мастера</span></span>
                <ArrowRight size={18} className="acc shrink-0 transition group-hover:translate-x-1" />
              </Link>
            </li>
            <li>
              <Link href={`${routes.faults}/${f.slug}`} className="group flex items-center justify-between gap-4 py-4">
                <span><span className="block font-semibold">{f.name}: общая картина</span><span className="text-sm text-mute">Причины для всех марок и что нельзя делать</span></span>
                <ArrowRight size={18} className="acc shrink-0 transition group-hover:translate-x-1" />
              </Link>
            </li>
            {sameBrand.slice(0, 4).map((x) => (
              <li key={x.fault}>
                <Link href={`${routes.brands}/${x.brand}/${x.fault}`} className="group flex items-center justify-between gap-4 py-4">
                  <span className="font-semibold">{x.h1}</span>
                  <ArrowRight size={18} className="acc shrink-0 transition group-hover:translate-x-1" />
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <LeadForm context={`${b.name}: ${f.name}`} title={`Мастер по ${b.name}`} />
      </section>

      <Faq items={faq} title={`${b.name}: ${f.name.toLowerCase()}`} />

      {sameFault.length > 0 && (
        <section className="wrap pb-12">
          <h2 className="mb-5 font-display text-lg font-semibold">Та же неисправность у других марок</h2>
          <ul className="flex flex-wrap gap-2">
            {sameFault.map((x) => (
              <li key={x.brand}><Link href={`${routes.brands}/${x.brand}/${x.fault}`} className="chip transition hover:border-white/40 hover:text-white">{x.b.name}</Link></li>
            ))}
          </ul>
        </section>
      )}

      <Queries items={c.queries} />
      <CtaBand />
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd data={faqLd(faq)} />
      <JsonLd data={serviceLd({ name: c.h1, description: c.description, path, from: c.from })} />
    </main>
  );
}
