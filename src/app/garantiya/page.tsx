import { FileCheck, RotateCcw, ShieldX } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { CtaBand, Head, JsonLd } from "@/components/ui";
import { warrantyTable } from "@/lib/data/common";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { routes, site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Гарантия на ремонт холодильников в Минске — сроки по каждому виду работ",
  description: "Гарантия на ремонт холодильников от 3 до 24 месяцев: таблица сроков по видам работ, что входит в гарантию, как обратиться и в каких случаях она не действует.",
  path: routes.warranty,
});

const crumbs = [{ name: "Главная", path: "/" }, { name: "Гарантия", path: routes.warranty }];

export default function WarrantyPage() {
  return (
    <main id="main">
      <PageHero crumbs={crumbs} eyebrow="Гарантия" title={<>Гарантия {site.warrantyMin} <span className="acc">{site.warrantyMax}</span></>} lead="Не «до 3 лет» мелким шрифтом, а конкретный срок на каждую работу. Он же будет стоять в вашем гарантийном талоне." />

      <section className="wrap pb-16 lg:pb-24">
        <div className="card overflow-hidden">
          {warrantyTable.map((w, i) => (
            <div key={w.work} className={`grid gap-1 px-5 py-5 sm:grid-cols-[1.3fr_1fr] sm:items-center sm:px-8 ${i ? "border-t border-white/6" : ""}`}>
              <p className="font-semibold">{w.work}</p>
              <p className="acc font-display font-semibold sm:text-right">{w.term}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap pb-16 lg:pb-24">
        <Head eyebrow="Как это работает" title="Три вещи о нашей гарантии" />
        <div className="grid gap-4 md:grid-cols-3">
          {[
            { i: <FileCheck />, t: "Документы", d: "После ремонта вы получаете акт выполненных работ, чек и гарантийный талон с датой, перечнем работ и сроком." },
            { i: <RotateCcw />, t: "Повторный выезд", d: "Если неисправность вернулась в гарантийный срок, мастер приезжает в течение суток и устраняет её бесплатно — включая запчасть." },
            { i: <ShieldX />, t: "Когда не действует", d: "Механические повреждения после ремонта, скачки напряжения без защиты, вмешательство посторонних мастеров, залив водой." },
          ].map((x) => (
            <div key={x.t} className="card p-7">
              <span className="acc">{x.i}</span>
              <h3 className="mt-4 font-display text-lg font-semibold">{x.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mute">{x.d}</p>
            </div>
          ))}
        </div>
      </section>
      <CtaBand />
      <JsonLd data={breadcrumbLd(crumbs)} />
    </main>
  );
}
