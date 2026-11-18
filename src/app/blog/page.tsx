import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { CtaBand, JsonLd } from "@/components/ui";
import { articles } from "@/lib/data/articles";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Блог мастера по холодильникам — советы по уходу, выбору и ремонту",
  description: "Статьи мастера по ремонту холодильников: чинить или покупать новый, как разморозить, какую температуру выставить, как перевозить и как выбрать мастера.",
  path: routes.blog,
});

const crumbs = [{ name: "Главная", path: "/" }, { name: "Блог", path: routes.blog }];

export default function BlogHub() {
  const [first, ...rest] = articles;
  return (
    <main id="main">
      <PageHero crumbs={crumbs} eyebrow="Блог мастера" title={<>Коротко и по делу — <span className="acc">без воды</span></>} lead="Отвечаем на вопросы, которые чаще всего задают диспетчеру. Каждая статья читается за 3–5 минут." />
      <section className="wrap grid gap-4 pb-16 md:grid-cols-2 lg:grid-cols-3 lg:pb-24">
        <Link href={`${routes.blog}/${first.slug}`} className="card group flex flex-col justify-between gap-10 bg-gradient-to-br from-ice/15 to-transparent p-7 transition hover:border-white/25 sm:p-10 md:col-span-2 lg:row-span-2">
          <div>
            <p className="chip">{first.tag} · {first.minutes} мин</p>
            <h2 className="mt-5 font-display text-2xl font-semibold leading-tight sm:text-4xl">{first.h1}</h2>
            <p className="lead mt-4 max-w-xl">{first.lead}</p>
          </div>
          <span className="acc inline-flex items-center gap-2 font-semibold">Читать <ArrowRight size={18} className="transition group-hover:translate-x-1" /></span>
        </Link>
        {rest.map((a) => (
          <Link key={a.slug} href={`${routes.blog}/${a.slug}`} className="card group flex flex-col justify-between gap-6 p-6 transition hover:-translate-y-1 hover:border-white/25">
            <div>
              <p className="text-[11px] uppercase tracking-widest text-mute">{a.tag} · {a.minutes} мин</p>
              <h2 className="mt-2 font-display text-lg font-semibold leading-snug">{a.h1}</h2>
              <p className="mt-2 line-clamp-3 text-sm text-mute">{a.lead}</p>
            </div>
            <ArrowRight size={18} className="acc transition group-hover:translate-x-1" />
          </Link>
        ))}
      </section>
      <CtaBand />
      <JsonLd data={breadcrumbLd(crumbs)} />
    </main>
  );
}
