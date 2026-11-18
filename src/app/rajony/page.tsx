import Link from "next/link";
import { MinskMap } from "@/components/MinskMap";
import { PageHero } from "@/components/PageHero";
import { CtaBand, JsonLd } from "@/components/ui";
import { districts, moreTowns, suburbs } from "@/lib/data/areas";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { routes } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Ремонт холодильников по районам Минска и в Минском районе — зона выезда",
  description: "Выезд мастера по ремонту холодильников во все районы Минска и пригород: Боровляны, Ждановичи, Колодищи, Заславль, Мачулищи, Сеница. Время приезда и стоимость выезда.",
  path: routes.areas,
});

const crumbs = [{ name: "Главная", path: "/" }, { name: "Районы", path: routes.areas }];

function Rows({ items }: { items: typeof districts }) {
  return (
    <div className="card divide-y divide-white/6 overflow-hidden">
      {items.map((a) => (
        <Link key={a.slug} href={`${routes.areas}/${a.slug}`} className="grid grid-cols-[1fr_auto_auto] items-center gap-4 px-5 py-4 transition hover:bg-white/[0.04] sm:px-7">
          <span className="min-w-0">
            <span className="font-display font-semibold">{a.name}</span>
            <span className="mt-0.5 block truncate text-xs text-mute">{a.places.slice(0, 4).join(" · ")}</span>
          </span>
          <span className="whitespace-nowrap text-sm text-mute">{a.arrival}</span>
          <span className="w-20 whitespace-nowrap text-right font-display text-sm font-semibold">{a.fee === 0 ? <span className="text-ok">0 BYN</span> : `+${a.fee} BYN`}</span>
        </Link>
      ))}
    </div>
  );
}

export default function AreasHub() {
  return (
    <main id="main">
      <PageHero crumbs={crumbs} eyebrow="География" title={<>Минск и <span className="acc">30 км вокруг</span></>} lead="В черте МКАД выезд без доплаты. За городом — фиксированная сумма, которую называем при заявке." />
      <section className="wrap grid gap-8 pb-16 lg:grid-cols-[1fr_1.1fr] lg:pb-24">
        <MinskMap className="min-w-0 lg:sticky lg:top-24 lg:self-start" />
        <div className="min-w-0 space-y-8">
          <div>
            <h2 className="mb-4 font-display text-xl font-semibold">Районы Минска</h2>
            <Rows items={districts} />
          </div>
          <div>
            <h2 className="mb-4 font-display text-xl font-semibold">Пригород</h2>
            <Rows items={suburbs} />
          </div>
          <div className="card p-6">
            <h2 className="font-display text-lg font-semibold">Также выезжаем</h2>
            <p className="mt-3 text-sm leading-relaxed text-mute">{moreTowns.join(", ")}. Стоимость выезда — от 25 BYN, уточняйте у диспетчера.</p>
          </div>
        </div>
      </section>
      <CtaBand />
      <JsonLd data={breadcrumbLd(crumbs)} />
    </main>
  );
}
