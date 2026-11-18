import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { CtaBand, JsonLd } from "@/components/ui";
import { faults } from "@/lib/data/faults";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Неисправности холодильников: причины, что делать и цены ремонта в Минске",
  description: "Каталог неисправностей холодильников: не морозит, не включается, течёт, шумит, намерзает лёд, щёлкает. Самодиагностика, вероятные причины и стоимость ремонта в Минске.",
  path: routes.faults,
});

const crumbs = [{ name: "Главная", path: "/" }, { name: "Неисправности", path: routes.faults }];
const groups = [
  { u: 3 as const, title: "Выключить немедленно", text: "Опасно для техники или людей", cls: "border-bad/30", dot: "bg-bad" },
  { u: 2 as const, title: "Вызвать мастера сегодня", text: "Продукты и мотор под угрозой", cls: "border-warn/30", dot: "bg-warn" },
  { u: 1 as const, title: "Можно подождать день-два", text: "Но откладывать надолго не стоит", cls: "border-ok/30", dot: "bg-ok" },
];

export default function FaultsHub() {
  return (
    <main id="main">
      <PageHero crumbs={crumbs} eyebrow="Неисправности" title={<>Что случилось с холодильником? <span className="acc">Разберёмся по симптому</span></>} lead="Неисправности разложены по срочности. На каждой странице — что проверить самому, причины с долей случаев и 3D-модель с подсветкой виновного узла." />
      <section className="wrap grid gap-5 pb-16 lg:grid-cols-3 lg:pb-24">
        {groups.map((g) => (
          <div key={g.u} className={`card ${g.cls} p-6 sm:p-7`}>
            <p className="flex items-center gap-2.5 font-display text-lg font-semibold"><i className={`h-2.5 w-2.5 rounded-full ${g.dot}`} />{g.title}</p>
            <p className="mt-1 text-sm text-mute">{g.text}</p>
            <ul className="mt-5 divide-y divide-white/8 border-t border-white/8">
              {faults.filter((f) => f.urgency === g.u).map((f) => (
                <li key={f.slug}>
                  <Link href={`${routes.faults}/${f.slug}`} className="group flex items-center justify-between gap-3 py-3.5">
                    <span>
                      <span className="block font-semibold transition group-hover:text-ice">{f.name}</span>
                      <span className="text-xs text-mute">от {Math.min(...f.causes.map((c) => c.from))} BYN · {f.causes.length} причин</span>
                    </span>
                    <ArrowRight size={16} className="shrink-0 text-mute transition group-hover:translate-x-1 group-hover:text-ice" />
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      <CtaBand title={<>Не нашли свой случай? Опишите по телефону — <span className="acc">подскажем бесплатно</span></>} />
      <JsonLd data={breadcrumbLd(crumbs)} />
    </main>
  );
}
