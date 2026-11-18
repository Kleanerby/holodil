import Link from "next/link";
import { notFound } from "next/navigation";
import { Car, Lightbulb, Phone, TrainFront } from "lucide-react";
import { LeadForm } from "@/components/LeadForm";
import { MinskMap } from "@/components/MinskMap";
import { Crumbs, CtaBand, Faq, Head, JsonLd, Queries } from "@/components/ui";
import { areaBySlug, areas } from "@/lib/data/areas";
import { faults } from "@/lib/data/faults";
import { breadcrumbLd, faqLd, pageMetadata, serviceLd } from "@/lib/seo";
import { routes, site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return areas.map((a) => ({ slug: a.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props) {
  const a = areaBySlug((await params).slug);
  if (!a) return {};
  return pageMetadata({ title: a.title, description: a.description, path: `${routes.areas}/${a.slug}`, keywords: a.queries });
}

export default async function AreaPage({ params }: Props) {
  const a = areaBySlug((await params).slug);
  if (!a) notFound();
  const path = `${routes.areas}/${a.slug}`;
  const hub = a.kind === "district" ? `${a.name} район` : a.name;
  const crumbs = [{ name: "Главная", path: "/" }, { name: "Районы", path: routes.areas }, { name: hub, path }];
  const faq = [
    { q: `Сколько стоит выезд мастера ${a.where}?`, a: a.fee === 0 ? `Выезд ${a.where} бесплатный при ремонте. Если вы откажетесь от ремонта после диагностики — ${site.diagnosticsRefusal} BYN.` : `Доплата за выезд ${a.where} — ${a.fee} BYN к стоимости ремонта. Диагностика при ремонте бесплатна.` },
    { q: `Как быстро приедет мастер ${a.where}?`, a: `Обычно за ${a.arrival}. Точное время мастер называет по телефону, когда принимает заявку.` },
    { q: "Работаете ли вы в выходные?", a: `${site.hours}, без доплат за срочность и выходные.` },
  ];
  // у каждого района свой набор «популярных» неисправностей — по индексу, чтобы блоки не совпадали
  const idx = areas.indexOf(a);
  const popular = [0, 1, 2, 3].map((k) => faults[(idx * 3 + k * 4) % faults.length]);

  return (
    <main id="main">
      <section className="wrap grid items-center gap-8 pb-14 pt-8 lg:grid-cols-[1.1fr_1fr] lg:pt-12">
        <div>
          <Crumbs items={crumbs} />
          <p className="eyebrow mb-4">{a.kind === "district" ? "Район Минска" : "Минский район · пригород"}</p>
          <h1 className="h1">
            Ремонт холодильников <span className="acc">{a.where}</span>
          </h1>
          <p className="lead mt-5 max-w-xl">{a.profile}</p>
          <dl className="mt-7 grid max-w-lg grid-cols-3 gap-3">
            {[
              { k: "приезд", v: a.arrival },
              { k: "выезд", v: a.fee === 0 ? "0 BYN" : `+${a.fee} BYN` },
              { k: "ремонт", v: `от ${site.minPrice} BYN` },
            ].map((x) => (
              <div key={x.k} className="glass !rounded-2xl p-4">
                <dt className="text-[11px] uppercase tracking-widest text-mute">{x.k}</dt>
                <dd className="mt-1 font-display text-sm font-semibold leading-tight sm:text-base">{x.v}</dd>
              </div>
            ))}
          </dl>
          <a href={site.phoneHref} className="btn-hot mt-7"><Phone size={16} /> {site.phone}</a>
        </div>
        <MinskMap active={a.slug} className="mx-auto max-w-[560px]" />
      </section>

      <section className="wrap grid gap-5 pb-16 lg:grid-cols-3 lg:pb-24">
        <div className="card p-6 sm:p-7">
          <h2 className="font-display text-lg font-semibold">Микрорайоны и посёлки</h2>
          <ul className="mt-4 flex flex-wrap gap-2">
            {a.places.map((p) => <li key={p} className="chip">{p}</li>)}
          </ul>
        </div>
        {a.streets.length > 0 && (
          <div className="card p-6 sm:p-7">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold"><Car size={18} className="acc" /> Улицы</h2>
            <p className="mt-4 text-sm leading-relaxed text-mute">{a.streets.join(", ")} и все остальные улицы района.</p>
          </div>
        )}
        {a.metro && (
          <div className="card p-6 sm:p-7">
            <h2 className="flex items-center gap-2 font-display text-lg font-semibold"><TrainFront size={18} className="acc" /> Метро рядом</h2>
            <ul className="mt-4 flex flex-wrap gap-2">
              {a.metro.map((m) => <li key={m} className="chip">{m}</li>)}
            </ul>
          </div>
        )}
        {a.kind === "suburb" && (
          <div className="card p-6 sm:p-7 lg:col-span-2">
            <h2 className="font-display text-lg font-semibold">Как считается выезд за МКАД</h2>
            <p className="mt-4 text-sm leading-relaxed text-mute">
              Доплата {a.fee} BYN фиксированная и называется при заявке. Она не зависит от времени суток и дня недели. Диагностика при ремонте — бесплатно, как и в городе.
            </p>
          </div>
        )}
      </section>

      <section className="wrap pb-16 lg:pb-24">
        <Head eyebrow="Специфика" title={`С чем обращаются ${a.where}`} />
        <div className="grid gap-4 md:grid-cols-3">
          {a.typical.map((t, i) => (
            <div key={t.t} className="card p-6">
              <span className="acc font-display text-3xl font-semibold">{i + 1}</span>
              <h3 className="mt-3 font-display text-base font-semibold">{t.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mute">{t.d}</p>
            </div>
          ))}
        </div>
        <aside className="mt-5 flex gap-4 rounded-3xl border border-ice/20 bg-ice/[0.05] p-6">
          <Lightbulb className="acc shrink-0" />
          <p className="leading-relaxed"><span className="font-semibold">Совет диспетчера. </span>{a.tip}</p>
        </aside>
      </section>

      <section className="wrap grid gap-8 pb-8 lg:grid-cols-2">
        <div>
          <h2 className="h2">Частые заявки</h2>
          <ul className="mt-6 divide-y divide-white/8 border-y border-white/8">
            {popular.map((f) => (
              <li key={f.slug}>
                <Link href={`${routes.faults}/${f.slug}`} className="flex items-center justify-between gap-4 py-4 transition hover:text-ice">
                  <span className="font-semibold">{f.name}</span>
                  <span className="whitespace-nowrap text-sm text-mute">от {Math.min(...f.causes.map((c) => c.from))} BYN →</span>
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <LeadForm context={`Район: ${hub}`} title={`Мастер ${a.where}`} />
      </section>

      <Faq items={faq} title={`Выезд ${a.where}`} />

      <section className="wrap pb-12">
        <h2 className="mb-5 font-display text-lg font-semibold">Соседние районы</h2>
        <ul className="flex flex-wrap gap-2">
          {areas.filter((x) => x.slug !== a.slug).map((n) => (
            <li key={n.slug}><Link href={`${routes.areas}/${n.slug}`} className="chip transition hover:border-white/40 hover:text-white">{n.name}</Link></li>
          ))}
        </ul>
      </section>

      <Queries items={a.queries} />
      <CtaBand title={<>Мастер {a.where} — через <span className="acc">{a.arrival}</span></>} />
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd data={faqLd(faq)} />
      <JsonLd data={serviceLd({ name: a.h1, description: a.description, path, from: site.minPrice })} />
    </main>
  );
}
