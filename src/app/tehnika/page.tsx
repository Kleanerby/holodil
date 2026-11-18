import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { CtaBand, JsonLd } from "@/components/ui";
import { tech } from "@/lib/data/tech";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Ремонт холодильной техники в Минске: морозильники, Side-by-Side, встраиваемые, винные шкафы",
  description: "Ремонт морозильных камер и ларей, холодильников Side-by-Side, встраиваемых и двухкомпрессорных моделей, винных шкафов и торгового холодильного оборудования в Минске.",
  path: routes.tech,
});

const crumbs = [{ name: "Главная", path: "/" }, { name: "Техника", path: routes.tech }];

export default function TechHub() {
  return (
    <main id="main">
      <PageHero crumbs={crumbs} eyebrow="Типы техники" title={<>От морозильного ларя до <span className="acc">торговой витрины</span></>} lead="Конструкция определяет ремонт. Для каждого типа — своя страница со своей 3D-моделью, типовыми поломками и ценами." />
      <section className="wrap grid gap-4 pb-16 md:grid-cols-2 lg:pb-24">
        {tech.map((t, i) => (
          <Link key={t.slug} href={`${routes.tech}/${t.slug}`} className={`card group flex flex-col justify-between gap-10 p-7 transition duration-300 hover:-translate-y-1 hover:border-white/25 sm:p-9 ${i === 0 ? "md:col-span-2" : ""}`}>
            <div>
              <p className="text-[11px] uppercase tracking-widest text-mute">{t.faults.length} типовых неисправностей</p>
              <h2 className="mt-2 font-display text-2xl font-semibold sm:text-3xl">{t.name}</h2>
              <p className="mt-3 max-w-2xl leading-relaxed text-mute">{t.lead}</p>
            </div>
            <div className="flex items-end justify-between">
              <p className="font-display text-xl font-semibold">от {t.from} <span className="text-sm text-mute">BYN</span></p>
              <ArrowRight className="acc transition group-hover:translate-x-1" />
            </div>
          </Link>
        ))}
      </section>
      <CtaBand />
      <JsonLd data={breadcrumbLd(crumbs)} />
    </main>
  );
}
