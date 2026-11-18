import Link from "next/link";
import { PageHero } from "@/components/PageHero";
import { CtaBand, JsonLd } from "@/components/ui";
import { brands, otherBrands } from "@/lib/data/brands";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { partNames, routes } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Ремонт холодильников по маркам в Минске — Атлант, Samsung, LG, Bosch, Indesit",
  description: "Ремонт холодильников всех марок в Минске: Атлант, Indesit, Samsung, LG, Bosch, Beko, Liebherr, Stinol, Ariston, Electrolux, Haier. Слабые места, коды ошибок и цены по каждому бренду.",
  path: routes.brands,
});

const crumbs = [{ name: "Главная", path: "/" }, { name: "Бренды", path: routes.brands }];

export default function BrandsHub() {
  return (
    <main id="main">
      <PageHero crumbs={crumbs} eyebrow="Бренды" title={<>У каждой марки — <span className="acc">свои болезни</span></>} lead="Indesit теряет фреон через контур обогрева, LG — через линейный компрессор, Samsung зарастает льдом за задней стенкой. Выберите марку — покажем её слабые места." />
      <section className="wrap grid gap-4 pb-16 sm:grid-cols-2 lg:grid-cols-4 lg:pb-24">
        {brands.map((b) => (
          <Link key={b.slug} href={`${routes.brands}/${b.slug}`} className="card group relative overflow-hidden p-6 transition duration-300 hover:-translate-y-1 hover:border-white/25">
            <span className="absolute -right-8 -top-8 h-28 w-28 rounded-full opacity-20 blur-2xl transition group-hover:opacity-50" style={{ background: b.accent }} aria-hidden />
            <p className="text-[11px] uppercase tracking-widest text-mute">{b.origin.split("/")[0]}</p>
            <h2 className="mt-2 font-display text-2xl font-semibold">{b.name}</h2>
            <p className="mt-1 text-sm text-mute">{b.ru}</p>
            <ul className="mt-5 space-y-1.5 text-[13px] text-snow/80">
              {b.weak.slice(0, 3).map((w) => (
                <li key={w.t} className="flex items-center gap-2"><i className="h-1 w-3 rounded-full" style={{ background: b.accent }} />{partNames[w.part]}</li>
              ))}
            </ul>
          </Link>
        ))}
      </section>
      <section className="wrap pb-16 lg:pb-24">
        <div className="card p-7 sm:p-9">
          <h2 className="font-display text-xl font-semibold">Ремонтируем и другие марки</h2>
          <p className="mt-2 text-sm text-mute">Отдельной страницы пока нет, но запчасти и опыт — есть.</p>
          <ul className="mt-6 flex flex-wrap gap-2">
            {otherBrands.map((b) => <li key={b} className="chip">Ремонт холодильников {b}</li>)}
          </ul>
        </div>
      </section>
      <CtaBand />
      <JsonLd data={breadcrumbLd(crumbs)} />
    </main>
  );
}
