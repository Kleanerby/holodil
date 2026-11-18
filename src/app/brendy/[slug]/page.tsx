import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, MapPin, Package, Phone, Quote } from "lucide-react";
import { LeadForm } from "@/components/LeadForm";
import { PartExplorer, Stage } from "@/components/stages";
import { Crumbs, CtaBand, Faq, Head, JsonLd, Queries } from "@/components/ui";
import { brandBySlug, brands } from "@/lib/data/brands";
import { combosOfBrand } from "@/lib/data/combos";
import { breadcrumbLd, faqLd, pageMetadata, serviceLd } from "@/lib/seo";
import { routes, site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return brands.map((b) => ({ slug: b.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props) {
  const b = brandBySlug((await params).slug);
  if (!b) return {};
  return pageMetadata({ title: b.title, description: b.description, path: `${routes.brands}/${b.slug}`, keywords: b.queries });
}

export default async function BrandPage({ params }: Props) {
  const b = brandBySlug((await params).slug);
  if (!b) notFound();
  const path = `${routes.brands}/${b.slug}`;
  const crumbs = [{ name: "Главная", path: "/" }, { name: "Бренды", path: routes.brands }, { name: b.name, path }];
  const min = Math.min(...b.weak.map((w) => w.from));
  const neighbours = brands.filter((x) => x.slug !== b.slug);
  const own = combosOfBrand(b.slug);

  return (
    <main id="main" style={{ "--accent": b.accent } as React.CSSProperties}>
      <section className="relative overflow-hidden">
        <p aria-hidden className="pointer-events-none absolute -top-4 left-1/2 w-max -translate-x-1/2 select-none font-display text-[22vw] font-bold uppercase leading-none tracking-tighter text-white/[0.035]">
          {b.name}
        </p>
        <div className="wrap relative grid gap-8 pb-14 pt-8 lg:grid-cols-[1fr_0.9fr] lg:pt-12">
          <div className="self-center">
            <Crumbs items={crumbs} />
            <p className="chip mb-5"><MapPin size={13} /> {b.origin}</p>
            <h1 className="h1">
              Ремонт холодильников <span className="acc">{b.ru}</span> в Минске
            </h1>
            <p className="lead mt-5 max-w-xl">{b.lead}</p>
            <dl className="mt-7 flex flex-wrap gap-x-10 gap-y-4">
              <div>
                <dt className="text-[11px] uppercase tracking-widest text-mute">Ремонт {b.name}</dt>
                <dd className="mt-1 font-display text-2xl font-semibold">от {Math.min(min, site.minPrice)} BYN</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-widest text-mute">Выезд</dt>
                <dd className="mt-1 font-display text-2xl font-semibold">{site.arrival}</dd>
              </div>
              <div>
                <dt className="text-[11px] uppercase tracking-widest text-mute">Гарантия</dt>
                <dd className="mt-1 font-display text-2xl font-semibold">{site.warrantyMax}</dd>
              </div>
            </dl>
            <div className="mt-7 flex flex-col gap-3 sm:flex-row">
              <a href={site.phoneHref} className="btn-hot"><Phone size={16} /> {site.phone}</a>
              <a href="#slabye-mesta" className="btn-ghost">Слабые места {b.name} <ArrowRight size={16} /></a>
            </div>
          </div>
          <Stage kind={b.kind} body={b.body} accent={b.accent} startOpen yaw={-0.6} className="h-[460px] sm:h-[560px] lg:h-[640px]" />
        </div>
      </section>

      <section className="wrap pb-16 lg:pb-24" id="slabye-mesta">
        <Head eyebrow="Типовые поломки" title={<>Где {b.ru} ломается <span className="acc">чаще всего</span></>} lead="Не общий список «всё чиним», а то, с чем к нам реально обращаются владельцы этой марки." />
        <PartExplorer
          flip
          kind={b.kind}
          body={b.body}
          accent={b.accent}
          items={b.weak.map((w) => ({ part: w.part, title: w.t, text: w.d, from: w.from, href: w.service ? `${routes.services}/${w.service}` : undefined }))}
        />
      </section>

      {b.codes && (
        <section className="wrap pb-16 lg:pb-24">
          <Head eyebrow="Коды ошибок" title={`Что показывает дисплей ${b.name}`} lead="Коды могут отличаться в зависимости от серии и года выпуска — точную расшифровку мастер сверит по сервисной документации модели." />
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {b.codes.map((c) => (
              <div key={c.code} className="card flex items-center gap-5 p-5">
                <span className="grid h-14 min-w-[5.5rem] place-items-center rounded-xl bg-ink px-3 font-mono text-lg font-bold tracking-wider" style={{ color: "var(--accent)", textShadow: "0 0 18px var(--accent)" }}>{c.code}</span>
                <span className="text-sm leading-snug">{c.mean}</span>
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="wrap grid gap-5 pb-16 lg:grid-cols-[1.2fr_1fr] lg:pb-24">
        <figure className="card relative overflow-hidden p-7 sm:p-10">
          <Quote size={90} className="absolute -right-2 -top-2 text-white/[0.04]" aria-hidden />
          <p className="eyebrow mb-4">Заметка мастера</p>
          <blockquote className="font-display text-lg font-medium leading-snug sm:text-2xl">{b.note}</blockquote>
          <figcaption className="mt-6 flex items-start gap-3 border-t border-white/8 pt-5 text-sm text-mute">
            <Package size={18} className="acc mt-0.5 shrink-0" /> {b.parts}
          </figcaption>
        </figure>
        <div className="card p-7 sm:p-8">
          <h2 className="font-display text-lg font-semibold">Серии и модели {b.name}</h2>
          <ul className="mt-5 space-y-2.5">
            {b.series.map((s) => (
              <li key={s} className="flex items-center gap-3 border-b border-white/6 pb-2.5 text-sm">
                <span className="h-1.5 w-1.5 rounded-full" style={{ background: "var(--accent)" }} /> {s}
              </li>
            ))}
          </ul>
          <p className="mt-4 text-xs text-mute">Нет вашей модели в списке? Ремонтируем всю линейку — назовите модель диспетчеру.</p>
        </div>
      </section>

      {own.length > 0 && (
        <section className="wrap pb-16 lg:pb-24">
          <Head eyebrow="Разборы" title={`Частые случаи с ${b.name}`} lead="Отдельные страницы для самых типичных поломок этой марки." />
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {own.map((c) => (
              <Link key={c.fault} href={`${routes.brands}/${c.brand}/${c.fault}`} className="card group flex flex-col justify-between gap-6 p-6 transition duration-300 hover:-translate-y-1 hover:border-white/25">
                <h3 className="font-display text-base font-semibold leading-snug">{c.h1}</h3>
                <span className="flex items-center justify-between text-sm"><span className="text-mute">от {c.from} BYN</span><ArrowRight size={18} className="acc transition group-hover:translate-x-1" /></span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="wrap grid gap-8 pb-8 lg:grid-cols-[1fr_1fr]">
        <div>
          <p className="eyebrow mb-4">Заявка</p>
          <h2 className="h2">Сломался {b.name}? Привезём запчасти сразу</h2>
          <p className="lead mt-4">Назовите модель с шильдика внутри камеры — мастер возьмёт детали именно под неё.</p>
        </div>
        <LeadForm context={`Бренд: ${b.name}`} />
      </section>

      <Faq items={b.faq} title={`Вопросы о ремонте ${b.name}`} />

      <section className="wrap pb-12">
        <h2 className="mb-5 font-display text-lg font-semibold">Другие марки</h2>
        <ul className="flex flex-wrap gap-2">
          {neighbours.map((n) => (
            <li key={n.slug}><Link href={`${routes.brands}/${n.slug}`} className="chip transition hover:border-white/40 hover:text-white">{n.name}</Link></li>
          ))}
        </ul>
      </section>

      <Queries items={b.queries} />
      <CtaBand />
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd data={faqLd(b.faq)} />
      <JsonLd data={serviceLd({ name: b.h1, description: b.description, path, from: min })} />
    </main>
  );
}
