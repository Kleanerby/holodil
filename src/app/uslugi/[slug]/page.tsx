import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Clock, Info, Phone, ShieldCheck, TriangleAlert } from "lucide-react";
import { LeadForm } from "@/components/LeadForm";
import { Stage } from "@/components/stages";
import { Crumbs, CtaBand, Faq, Head, JsonLd, PriceTable, Queries } from "@/components/ui";
import { faultBySlug } from "@/lib/data/faults";
import { serviceBySlug, services, type Service } from "@/lib/data/services";
import { breadcrumbLd, faqLd, pageMetadata, serviceLd } from "@/lib/seo";
import { partAccent, partNames, routes, site } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return services.map((s) => ({ slug: s.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props) {
  const s = serviceBySlug((await params).slug);
  if (!s) return {};
  return pageMetadata({ title: s.title, description: s.description, path: `${routes.services}/${s.slug}`, keywords: s.queries });
}

function Facts({ s }: { s: Service }) {
  return (
    <dl className="mt-7 grid max-w-lg grid-cols-3 gap-3">
      {[
        { k: "цена", v: `от ${s.from} BYN` },
        { k: "время", v: s.time },
        { k: "гарантия", v: s.warranty },
      ].map((x) => (
        <div key={x.k} className="glass !rounded-2xl p-4">
          <dt className="text-[11px] uppercase tracking-widest text-mute">{x.k}</dt>
          <dd className="mt-1 font-display text-sm font-semibold leading-tight sm:text-base">{x.v}</dd>
        </div>
      ))}
    </dl>
  );
}

function Buttons() {
  return (
    <div className="mt-7 flex flex-col gap-3 sm:flex-row">
      <a href={site.phoneHref} className="btn-hot"><Phone size={16} /> {site.phone}</a>
      <a href="#zayavka" className="btn-ghost">Вызвать мастера <ArrowRight size={16} /></a>
    </div>
  );
}

function Signs({ s }: { s: Service }) {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {s.signs.map((t, i) => (
        <li key={t} className="card flex gap-4 p-5">
          <span className="acc font-display text-sm font-semibold">{String(i + 1).padStart(2, "0")}</span>
          <span className="text-sm leading-relaxed">{t}</span>
        </li>
      ))}
    </ul>
  );
}

function Timeline({ s }: { s: Service }) {
  return (
    <ol className="relative ml-3 border-l border-white/10">
      {s.steps.map((st, i) => (
        <li key={st.t} className="relative pb-8 pl-8 last:pb-0">
          <span className="absolute -left-[13px] top-0 grid h-[26px] w-[26px] place-items-center rounded-full border border-white/15 bg-ink text-[11px] font-semibold" style={{ color: "var(--accent)" }}>{i + 1}</span>
          <h3 className="font-display text-base font-semibold">{st.t}</h3>
          <p className="mt-1.5 max-w-xl text-sm leading-relaxed text-mute">{st.d}</p>
        </li>
      ))}
    </ol>
  );
}

function Notes({ s }: { s: Service }) {
  return (
    <div className="grid gap-3">
      {s.notes.map((n) => (
        <div key={n.t} className="card flex gap-4 p-5">
          <Info size={18} className="acc mt-0.5 shrink-0" />
          <div>
            <h3 className="font-display text-sm font-semibold">{n.t}</h3>
            <p className="mt-1.5 text-sm leading-relaxed text-mute">{n.d}</p>
          </div>
        </div>
      ))}
    </div>
  );
}

function Honest({ s }: { s: Service }) {
  return (
    <aside className="rounded-3xl border border-warn/25 bg-warn/[0.06] p-6 sm:p-8">
      <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-widest text-warn"><TriangleAlert size={15} /> Честно о ремонте</p>
      <p className="mt-3 max-w-3xl text-base leading-relaxed sm:text-lg">{s.honest}</p>
    </aside>
  );
}

function Related({ s }: { s: Service }) {
  const items = s.relatedFaults.map(faultBySlug).filter((f) => !!f);
  return (
    <section className="wrap pb-16 lg:pb-24">
      <Head eyebrow="Симптомы" title="При каких неисправностях это нужно" />
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((f) => (
          <Link key={f.slug} href={`${routes.faults}/${f.slug}`} className="card group p-6 transition hover:-translate-y-1 hover:border-white/25">
            <h3 className="font-display text-base font-semibold">{f.name}</h3>
            <p className="mt-2 line-clamp-2 text-sm text-mute">{f.lead}</p>
            <span className="acc mt-4 inline-flex items-center gap-1.5 text-sm font-semibold">Причины и цены <ArrowRight size={14} className="transition group-hover:translate-x-1" /></span>
          </Link>
        ))}
      </div>
    </section>
  );
}

export default async function ServicePage({ params }: Props) {
  const s = serviceBySlug((await params).slug);
  if (!s) notFound();
  const path = `${routes.services}/${s.slug}`;
  const accent = partAccent[s.part];
  const crumbs = [{ name: "Главная", path: "/" }, { name: "Услуги", path: routes.services }, { name: s.name, path }];
  const stage = <Stage highlight={s.part} accent={accent} startXray yaw={-2.5} className="h-[440px] sm:h-[520px] lg:h-full lg:min-h-[560px]" />;

  return (
    <main id="main" style={{ "--accent": accent } as React.CSSProperties}>
      {/* ── Вариант 1: текст + модель, ниже вертикальный таймлайн ── */}
      {s.layout === "timeline" && (
        <>
          <section className="wrap grid gap-8 pb-14 pt-8 lg:grid-cols-2 lg:pt-12">
            <div className="self-center">
              <Crumbs items={crumbs} />
              <p className="eyebrow mb-4">{partNames[s.part]}</p>
              <h1 className="h1">{s.h1}</h1>
              <p className="lead mt-5 max-w-xl">{s.lead}</p>
              <Facts s={s} />
              <Buttons />
            </div>
            {stage}
          </section>
          <section className="wrap pb-16 lg:pb-24">
            <Head eyebrow="Признаки" title="Когда нужна эта услуга" />
            <Signs s={s} />
          </section>
          <section className="wrap grid gap-10 pb-16 lg:grid-cols-[1.1fr_1fr] lg:pb-24">
            <div>
              <Head eyebrow="Как проходит" title="Этапы работы" />
              <Timeline s={s} />
            </div>
            <div className="lg:sticky lg:top-24 lg:self-start">
              <h2 className="mb-5 font-display text-xl font-semibold">Цены</h2>
              <PriceTable rows={s.prices} caption={`Цены: ${s.name}`} />
              <div className="mt-5"><LeadForm compact context={s.name} /></div>
            </div>
          </section>
          <section className="wrap grid gap-5 pb-16 lg:grid-cols-2 lg:pb-24">
            <Notes s={s} />
            <Honest s={s} />
          </section>
        </>
      )}

      {/* ── Вариант 2: заголовок по центру, широкая сцена с признаками поверх ── */}
      {s.layout === "split" && (
        <>
          <section className="wrap pb-10 pt-8 lg:pt-12">
            <Crumbs items={crumbs} />
            <div className="grid items-end gap-6 lg:grid-cols-[1.4fr_1fr]">
              <div>
                <p className="eyebrow mb-4">{partNames[s.part]} · от {s.from} BYN</p>
                <h1 className="h1">{s.h1}</h1>
              </div>
              <p className="lead">{s.lead}</p>
            </div>
          </section>
          <section className="wrap pb-16">
            <div className="relative">
              <Stage highlight={s.part} accent={accent} startXray yaw={-2.6} className="h-[460px] sm:h-[560px]" />
              <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:absolute lg:inset-y-6 lg:right-6 lg:mt-0 lg:w-[340px] lg:grid-cols-1 lg:content-center">
                {s.signs.map((t) => (
                  <div key={t} className="glass !rounded-2xl p-4 text-sm leading-snug">{t}</div>
                ))}
              </div>
            </div>
            <div className="mt-6 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm">
              <span className="flex items-center gap-2"><Clock size={16} className="acc" /> {s.time}</span>
              <span className="flex items-center gap-2"><ShieldCheck size={16} className="acc" /> гарантия {s.warranty}</span>
              <a href={site.phoneHref} className="btn-hot ml-auto"><Phone size={16} /> {site.phone}</a>
            </div>
          </section>
          <section className="wrap grid gap-8 pb-16 lg:grid-cols-2 lg:pb-24">
            <div>
              <h2 className="h2 mb-6">Сколько стоит</h2>
              <PriceTable rows={s.prices} caption={`Цены: ${s.name}`} />
            </div>
            <div>
              <h2 className="h2 mb-6">Что важно знать</h2>
              <Notes s={s} />
            </div>
          </section>
          <section className="wrap pb-16 lg:pb-24">
            <Head eyebrow="Порядок работ" title="Как это происходит" />
            <ol className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {s.steps.map((st, i) => (
                <li key={st.t} className="card p-6">
                  <span className="acc font-display text-3xl font-semibold">{i + 1}</span>
                  <h3 className="mt-3 font-display text-base font-semibold">{st.t}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-mute">{st.d}</p>
                </li>
              ))}
            </ol>
          </section>
          <section className="wrap grid gap-5 pb-16 lg:grid-cols-[1.4fr_1fr] lg:pb-24">
            <Honest s={s} />
            <LeadForm compact context={s.name} />
          </section>
        </>
      )}

      {/* ── Вариант 3: «смета» — прайс в первом экране ── */}
      {s.layout === "ledger" && (
        <>
          <section className="wrap grid gap-8 pb-14 pt-8 lg:grid-cols-[1.15fr_1fr] lg:pt-12">
            <div>
              <Crumbs items={crumbs} />
              <p className="eyebrow mb-4">{partNames[s.part]}</p>
              <h1 className="h1">{s.h1}</h1>
              <p className="lead mt-5 max-w-xl">{s.lead}</p>
              <div className="mt-8 rounded-3xl border border-dashed border-white/20 bg-panel/70 p-6 font-mono text-sm sm:p-7">
                <p className="mb-4 flex justify-between text-[11px] uppercase tracking-widest text-mute"><span>Смета</span><span>BYN</span></p>
                {s.prices.map((p) => (
                  <p key={p.name} className="flex items-baseline gap-2 py-1.5">
                    <span className="font-sans">{p.name}</span>
                    <span className="mb-1 flex-1 border-b border-dotted border-white/20" />
                    <span className="font-semibold">{p.from === 0 ? "0" : `от ${p.from}`}</span>
                  </p>
                ))}
                <p className="mt-4 flex justify-between border-t border-white/15 pt-4 font-sans text-xs text-mute">
                  <span>Время: {s.time}</span><span>Гарантия: {s.warranty}</span>
                </p>
              </div>
              <Buttons />
            </div>
            <Stage highlight={s.part} accent={accent} startXray yaw={-2.4} className="h-[440px] lg:h-auto lg:min-h-[620px]" />
          </section>
          <section className="wrap grid gap-10 pb-16 lg:grid-cols-2 lg:pb-24">
            <div>
              <Head eyebrow="Признаки" title="Когда это нужно" />
              <ul className="space-y-3">
                {s.signs.map((t) => (
                  <li key={t} className="flex gap-3 border-b border-white/8 pb-3 text-base"><span className="acc">—</span>{t}</li>
                ))}
              </ul>
              <div className="mt-8"><Honest s={s} /></div>
            </div>
            <div>
              <Head eyebrow="Процесс" title="Что делает мастер" />
              <Timeline s={s} />
            </div>
          </section>
          <section className="wrap grid gap-5 pb-16 lg:grid-cols-[1fr_1fr] lg:pb-24">
            <Notes s={s} />
            <LeadForm compact context={s.name} />
          </section>
        </>
      )}

      <Related s={s} />
      <Faq items={s.faq} title={`Вопросы: ${s.name.toLowerCase()}`} />
      <Queries items={s.queries} />
      <CtaBand />
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd data={faqLd(s.faq)} />
      <JsonLd data={serviceLd({ name: s.h1, description: s.description, path, from: s.from })} />
    </main>
  );
}
