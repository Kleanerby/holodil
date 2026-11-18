import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight, Lightbulb } from "lucide-react";
import { Crumbs, CtaBand, JsonLd, Queries } from "@/components/ui";
import { articleBySlug, articles, type Block } from "@/lib/data/articles";
import { articleLd, breadcrumbLd, pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}
export const dynamicParams = false;

export async function generateMetadata({ params }: Props) {
  const a = articleBySlug((await params).slug);
  if (!a) return {};
  return pageMetadata({ title: a.title, description: a.description, path: `${routes.blog}/${a.slug}`, keywords: a.queries });
}

function Render({ b }: { b: Block }) {
  switch (b.type) {
    case "h2":
      return <h2 className="mt-12 font-display text-2xl font-semibold sm:text-3xl">{b.text}</h2>;
    case "p":
      return <p className="mt-5 text-lg leading-relaxed text-snow/85">{b.text}</p>;
    case "list":
      return (
        <ul className="mt-5 space-y-3">
          {b.items.map((i) => (
            <li key={i} className="flex gap-3 text-lg leading-relaxed text-snow/85"><span className="acc mt-0.5">—</span>{i}</li>
          ))}
        </ul>
      );
    case "steps":
      return (
        <ol className="mt-6 space-y-3">
          {b.items.map((i, k) => (
            <li key={i} className="card flex gap-4 p-5">
              <span className="acc font-display text-lg font-semibold">{k + 1}</span>
              <span className="leading-relaxed">{i}</span>
            </li>
          ))}
        </ol>
      );
    case "note":
      return (
        <aside className="mt-8 flex gap-4 rounded-3xl border border-ice/25 bg-ice/[0.06] p-6">
          <Lightbulb className="acc shrink-0" />
          <p className="leading-relaxed">{b.text}</p>
        </aside>
      );
    case "table":
      return (
        <div className="card mt-6 overflow-x-auto">
          <table className="w-full min-w-[480px] text-left text-sm">
            <thead className="bg-white/[0.03] text-xs uppercase tracking-wider text-mute">
              <tr>{b.head.map((h) => <th key={h} className="px-5 py-4 font-medium">{h}</th>)}</tr>
            </thead>
            <tbody className="divide-y divide-white/6">
              {b.rows.map((r) => (
                <tr key={r[0]}>{r.map((c, i) => <td key={i} className={`px-5 py-4 ${i === 0 ? "font-semibold" : "text-snow/80"}`}>{c}</td>)}</tr>
              ))}
            </tbody>
          </table>
        </div>
      );
  }
}

export default async function ArticlePage({ params }: Props) {
  const a = articleBySlug((await params).slug);
  if (!a) notFound();
  const path = `${routes.blog}/${a.slug}`;
  const crumbs = [{ name: "Главная", path: "/" }, { name: "Блог", path: routes.blog }, { name: a.h1, path }];
  const toc = a.body.filter((b) => b.type === "h2");

  return (
    <main id="main">
      <article className="wrap grid gap-10 pb-16 pt-8 lg:grid-cols-[1fr_300px] lg:pt-12">
        <div className="min-w-0 max-w-3xl">
          <Crumbs items={crumbs} />
          <p className="chip">{a.tag} · {a.minutes} мин чтения</p>
          <h1 className="h1 mt-5">{a.h1}</h1>
          <p className="mt-6 border-l-2 pl-5 font-display text-lg font-medium leading-snug sm:text-xl" style={{ borderColor: "var(--accent)" }}>{a.lead}</p>
          {a.body.map((b, i) => <Render key={i} b={b} />)}
          <Link href={a.cta.href} className="btn-ice mt-12">{a.cta.text} <ArrowRight size={16} /></Link>
        </div>
        <aside className="lg:sticky lg:top-24 lg:self-start">
          {toc.length > 0 && (
            <div className="card p-6">
              <p className="text-xs uppercase tracking-widest text-mute">В статье</p>
              <ul className="mt-4 space-y-2.5 text-sm">
                {toc.map((t) => t.type === "h2" && <li key={t.text} className="text-snow/80">{t.text}</li>)}
              </ul>
            </div>
          )}
          <div className="card mt-4 p-6">
            <p className="text-xs uppercase tracking-widest text-mute">Ещё почитать</p>
            <ul className="mt-4 space-y-3 text-sm">
              {articles.filter((x) => x.slug !== a.slug).slice(0, 4).map((x) => (
                <li key={x.slug}><Link href={`${routes.blog}/${x.slug}`} className="font-semibold leading-snug hover:text-ice">{x.h1}</Link></li>
              ))}
            </ul>
          </div>
        </aside>
      </article>
      <Queries items={a.queries} />
      <CtaBand />
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd data={articleLd({ title: a.h1, description: a.description, path })} />
    </main>
  );
}
