import Link from "next/link";
import { Calculator } from "@/components/Calculator";
import { PageHero } from "@/components/PageHero";
import { CtaBand, Faq, Head, JsonLd, PriceTable } from "@/components/ui";
import { discountNote, discounts, generalFaq } from "@/lib/data/common";
import { services } from "@/lib/data/services";
import { breadcrumbLd, faqLd, pageMetadata } from "@/lib/seo";
import { routes, site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Цены на ремонт холодильников в Минске — прайс 2026 в BYN и калькулятор",
  description: "Прайс на ремонт холодильников в Минске: диагностика 0 BYN при ремонте, замена реле от 60, термостата от 70, заправка фреоном от 80, компрессор от 180 BYN. Онлайн-калькулятор.",
  path: routes.prices,
  keywords: ["ремонт холодильников цена минск", "сколько стоит ремонт холодильника", "прайс на ремонт холодильников", "стоимость ремонта холодильника"],
});

const crumbs = [{ name: "Главная", path: "/" }, { name: "Цены", path: routes.prices }];
const faq = [generalFaq[0], generalFaq[1], generalFaq[5], generalFaq[3]];

export default function PricesPage() {
  return (
    <main id="main">
      <PageHero
        crumbs={crumbs}
        eyebrow="Цены"
        title={<>Прайс без звёздочек и <span className="acc">мелкого шрифта</span></>}
        lead="«От» — это цена работы в простом случае. Запчасть считается отдельно там, где это указано. Итоговую сумму мастер называет до начала ремонта и вписывает в акт."
        aside={
          <div className="card grid grid-cols-2 gap-px overflow-hidden bg-white/8 text-center">
            {[
              ["0 BYN", "диагностика при ремонте"],
              [`${site.diagnosticsRefusal} BYN`, "выезд при отказе от ремонта"],
              [`от ${site.minPrice} BYN`, "минимальный ремонт"],
              ["+0%", "за срочность и выходные"],
            ].map(([v, k]) => (
              <div key={k} className="bg-panel p-5">
                <p className="font-display text-xl font-semibold">{v}</p>
                <p className="mt-1 text-xs text-mute">{k}</p>
              </div>
            ))}
          </div>
        }
      />

      <section className="wrap pb-16 lg:pb-24" id="kalkulyator">
        <Head eyebrow="Калькулятор" title="Рассчитайте вилку по симптому" />
        <Calculator />
      </section>

      <section className="wrap pb-16 lg:pb-24">
        <Head eyebrow="Прайс-лист" title="Все работы по разделам" />
        <div className="grid gap-8 lg:grid-cols-2">
          {services.map((s) => (
            <div key={s.slug}>
              <div className="mb-3 flex items-baseline justify-between gap-4">
                <h3 className="font-display text-lg font-semibold">{s.name}</h3>
                <Link href={`${routes.services}/${s.slug}`} className="acc whitespace-nowrap text-xs font-semibold">Подробнее →</Link>
              </div>
              <PriceTable rows={s.prices} caption={s.name} />
            </div>
          ))}
        </div>
      </section>

      <section className="wrap pb-16 lg:pb-24">
        <div className="card grid gap-8 p-7 sm:p-10 lg:grid-cols-[1fr_1.4fr]">
          <div>
            <p className="eyebrow mb-4">Скидки</p>
            <h2 className="h2">Постоянные, без таймеров</h2>
            <p className="mt-4 text-sm text-mute">{discountNote}</p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-3">
            {discounts.map((d) => (
              <li key={d.who} className="rounded-2xl border border-white/10 bg-ink/50 p-5">
                <p className="acc font-display text-3xl font-semibold">{d.t}</p>
                <p className="mt-2 text-sm leading-snug">{d.who}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      <Faq items={faq} title="О ценах и оплате" />
      <CtaBand />
      <JsonLd data={breadcrumbLd(crumbs)} />
      <JsonLd data={faqLd(faq)} />
    </main>
  );
}
