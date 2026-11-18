import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { CtaBand, Head, JsonLd, LinkCard } from "@/components/ui";
import { services } from "@/lib/data/services";
import { tech } from "@/lib/data/tech";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { partAccent, partNames, routes } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Услуги по ремонту холодильников в Минске — все виды работ и цены",
  description: "Все услуги по ремонту холодильников в Минске: замена компрессора, заправка фреоном, ремонт No Frost, платы, термостата, уплотнителя. Цены в BYN, сроки и гарантия по каждой работе.",
  path: routes.services,
});

const crumbs = [{ name: "Главная", path: "/" }, { name: "Услуги", path: routes.services }];

export default function ServicesHub() {
  return (
    <main id="main">
      <PageHero crumbs={crumbs} eyebrow="Услуги" title={<>Все виды ремонта — <span className="acc">с ценой, сроком и гарантией</span></>} lead="У каждой работы своя страница: признаки, этапы, из чего складывается цена и когда услуга вам не нужна." />
      <section className="wrap pb-16 lg:pb-24">
        <div className="card divide-y divide-white/6 overflow-hidden">
          <div className="hidden grid-cols-[2fr_1fr_1fr_1fr_auto] gap-4 bg-white/[0.03] px-7 py-4 text-xs uppercase tracking-wider text-mute md:grid">
            <span>Услуга</span><span>Узел</span><span>Время</span><span>Гарантия</span><span className="w-28 text-right">Цена</span>
          </div>
          {services.map((s) => (
            <Link key={s.slug} href={`${routes.services}/${s.slug}`} className="group grid gap-2 px-5 py-5 transition hover:bg-white/[0.04] md:grid-cols-[2fr_1fr_1fr_1fr_auto] md:items-center md:gap-4 md:px-7">
              <span className="font-display font-semibold">{s.name}</span>
              <span className="flex items-center gap-2 text-sm text-mute"><i className="h-2 w-2 rounded-full" style={{ background: partAccent[s.part] }} />{partNames[s.part]}</span>
              <span className="text-sm text-mute">{s.time}</span>
              <span className="text-sm text-mute">{s.warranty}</span>
              <span className="flex items-center justify-between gap-3 font-display font-semibold md:w-28 md:justify-end">
                от {s.from} BYN <ArrowRight size={16} className="acc transition group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>
      <section className="wrap pb-16 lg:pb-24">
        <Head eyebrow="По типу техники" title="Особые холодильники — особый подход" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tech.map((t) => <LinkCard key={t.slug} href={`${routes.tech}/${t.slug}`} title={t.name} text={t.lead} meta={`от ${t.from} BYN`} />)}
        </div>
      </section>
      <CtaBand />
      <JsonLd data={breadcrumbLd(crumbs)} />
    </main>
  );
}
