import Link from "next/link";
import { ArrowRight, ChevronDown, Phone } from "lucide-react";
import type { Crumb } from "@/lib/seo";
import { site } from "@/lib/site";

export function JsonLd({ data }: { data: unknown }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }} />;
}

export function Crumbs({ items }: { items: Crumb[] }) {
  return (
    <nav aria-label="Хлебные крошки" className="mb-6 flex flex-wrap items-center gap-x-2 gap-y-1 text-xs text-mute">
      {items.map((c, i) => (
        <span key={c.path} className="flex items-center gap-2">
          {i > 0 && <span aria-hidden>/</span>}
          {i < items.length - 1 ? (
            <Link href={c.path} className="hover:text-snow">
              {c.name}
            </Link>
          ) : (
            <span className="text-snow/70">{c.name}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

export function Head({ eyebrow, title, lead, center }: { eyebrow?: string; title: React.ReactNode; lead?: React.ReactNode; center?: boolean }) {
  return (
    <div className={`mb-10 max-w-3xl lg:mb-14 ${center ? "mx-auto text-center" : ""}`}>
      {eyebrow && <p className="eyebrow mb-4">{eyebrow}</p>}
      <h2 className="h2">{title}</h2>
      {lead && <p className="lead mt-4">{lead}</p>}
    </div>
  );
}

export function Faq({ items, title = "Вопросы и ответы" }: { items: { q: string; a: string }[]; title?: string }) {
  return (
    <section className="wrap py-16 lg:py-24">
      <div className="grid gap-10 lg:grid-cols-[1fr_2fr]">
        <div>
          <p className="eyebrow mb-4">FAQ</p>
          <h2 className="h2">{title}</h2>
          <p className="lead mt-4">Не нашли ответ — позвоните, диспетчер проконсультирует бесплатно.</p>
          <a href={site.phoneHref} className="btn-ghost mt-6">
            <Phone size={16} /> {site.phone}
          </a>
        </div>
        <div className="divide-y divide-white/8 border-y border-white/8">
          {items.map((f) => (
            <details key={f.q} className="group py-5">
              <summary className="flex cursor-pointer list-none items-start justify-between gap-6 text-base font-semibold sm:text-lg">
                {f.q}
                <ChevronDown size={20} className="mt-1 shrink-0 text-mute transition group-open:rotate-180" />
              </summary>
              <p className="mt-3 max-w-2xl leading-relaxed text-mute">{f.a}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}

export function PriceTable({ rows, caption }: { rows: { name: string; from: number; note?: string }[]; caption?: string }) {
  return (
    <div className="card overflow-hidden">
      <table className="w-full text-left text-sm">
        {caption && <caption className="sr-only">{caption}</caption>}
        <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-mute">
          <tr>
            <th className="px-5 py-4 font-medium sm:px-7">Работа</th>
            <th className="px-5 py-4 text-right font-medium sm:px-7">Цена</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-white/6">
          {rows.map((r) => (
            <tr key={r.name} className="transition hover:bg-white/[0.03]">
              <td className="px-5 py-4 sm:px-7">
                {r.name}
                {r.note && <span className="ml-2 text-xs text-mute">· {r.note}</span>}
              </td>
              <td className="whitespace-nowrap px-5 py-4 text-right font-display font-semibold sm:px-7">
                {r.from === 0 ? <span className="text-ok">0 BYN</span> : <>от {r.from} <span className="text-xs text-mute">BYN</span></>}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function CtaBand({ title, text }: { title?: React.ReactNode; text?: string }) {
  return (
    <section className="wrap pb-16 lg:pb-24">
      <div className="stage grid items-center gap-8 p-8 sm:p-12 lg:grid-cols-[1.4fr_1fr]">
        <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative">
          <h2 className="h2">{title ?? <>Мастер будет у вас через <span className="acc">{site.arrival}</span></>}</h2>
          <p className="lead mt-4 max-w-xl">
            {text ?? `Диагностика ${site.diagnostics}. Цена — до начала работ. Гарантия ${site.warrantyMax}.`}
          </p>
        </div>
        <div className="relative flex flex-col gap-3 sm:flex-row lg:flex-col">
          <a href={site.phoneHref} className="btn-hot">
            <Phone size={16} /> {site.phone}
          </a>
          <Link href="/kontakty#zayavka" className="btn-ghost">
            Оставить заявку <ArrowRight size={16} />
          </Link>
          <p className="text-xs text-mute lg:text-center">{site.hours}</p>
        </div>
      </div>
    </section>
  );
}

export function LinkCard({ href, title, text, meta }: { href: string; title: string; text?: string; meta?: React.ReactNode }) {
  return (
    <Link href={href} className="card group flex flex-col justify-between gap-6 p-6 transition duration-300 hover:-translate-y-1 hover:border-white/25">
      <div>
        <h3 className="font-display text-base font-semibold leading-snug">{title}</h3>
        {text && <p className="mt-2 text-sm leading-relaxed text-mute">{text}</p>}
      </div>
      <div className="flex items-center justify-between text-sm">
        <span className="text-mute">{meta}</span>
        <ArrowRight size={18} className="acc transition group-hover:translate-x-1" />
      </div>
    </Link>
  );
}

export function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div>
      <p className="font-display text-2xl font-semibold sm:text-3xl">{v}</p>
      <p className="mt-1 text-xs text-mute">{k}</p>
    </div>
  );
}

/** Кластер запросов страницы — видимый блок «Также ищут», работает на релевантность и перелинковку */
export function Queries({ items }: { items: string[] }) {
  return (
    <section className="wrap pb-12">
      <p className="mb-3 text-xs uppercase tracking-widest text-mute">С этой страницей ищут</p>
      <ul className="flex flex-wrap gap-2">
        {items.map((q) => (
          <li key={q} className="chip">
            {q}
          </li>
        ))}
      </ul>
    </section>
  );
}

export function Steps({ items }: { items: { t: string; d: string }[] }) {
  return (
    <ol className="relative grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {items.map((s, i) => (
        <li key={s.t} className="card relative p-6">
          <span className="font-display text-4xl font-semibold text-white/10">{String(i + 1).padStart(2, "0")}</span>
          <h3 className="mt-3 font-display text-base font-semibold">{s.t}</h3>
          <p className="mt-2 text-sm leading-relaxed text-mute">{s.d}</p>
        </li>
      ))}
    </ol>
  );
}
