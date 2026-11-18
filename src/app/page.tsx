import Link from "next/link";
import { ArrowRight, Ban, CircleCheck } from "lucide-react";
import { Calculator } from "@/components/Calculator";
import { HomeHero } from "@/components/HomeHero";
import { LeadForm } from "@/components/LeadForm";
import { MinskMap } from "@/components/MinskMap";
import { Reveal } from "@/components/Reveal";
import { Faq, Head, JsonLd, LinkCard, Steps } from "@/components/ui";
import { districts, suburbs } from "@/lib/data/areas";
import { articles } from "@/lib/data/articles";
import { brands, otherBrands } from "@/lib/data/brands";
import { discountNote, discounts, generalFaq, reviews, steps } from "@/lib/data/common";
import { faults } from "@/lib/data/faults";
import { services } from "@/lib/data/services";
import { tech } from "@/lib/data/tech";
import { faqLd, pageMetadata } from "@/lib/seo";
import { routes, site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Ремонт холодильников в Минске на дому — мастер за 1–2 часа, от 30 BYN",
  description:
    "Ремонт холодильников в Минске с выездом на дом: Атлант, Samsung, LG, Bosch, Indesit. Диагностика 0 BYN при ремонте, цена до начала работ, гарантия до 24 месяцев. Ежедневно 8:00–22:00.",
  path: "/",
  keywords: ["ремонт холодильников минск", "ремонт холодильников на дому", "мастер по ремонту холодильников", "ремонт холодильников цена", "срочный ремонт холодильников"],
});

const urgencyDot = { 1: "bg-ok", 2: "bg-warn", 3: "bg-bad" } as const;

export default function Home() {
  return (
    <main id="main">
      <HomeHero />

      {/* Симптом → цена → страница */}
      <section className="wrap py-16 lg:py-24">
        <Head eyebrow="Неисправности" title={<>Найдите свою поломку — <span className="acc">цена сразу</span></>} lead="У каждой неисправности своя страница: что проверить самому, вероятные причины с долей случаев и стоимость ремонта." />
        <div className="card divide-y divide-white/6 overflow-hidden">
          {faults.map((f) => {
            const min = Math.min(...f.causes.map((c) => c.from));
            return (
              <Link key={f.slug} href={`${routes.faults}/${f.slug}`} className="group grid grid-cols-[1fr_auto] items-center gap-4 px-5 py-4 transition hover:bg-white/[0.04] sm:grid-cols-[1.2fr_2fr_auto_auto] sm:px-7">
                <span className="flex items-center gap-3 font-display text-sm font-semibold sm:text-base">
                  <span className={`h-2 w-2 shrink-0 rounded-full ${urgencyDot[f.urgency]}`} aria-hidden />
                  {f.name}
                </span>
                <span className="hidden truncate text-sm text-mute sm:block">{f.causes.slice(0, 3).map((c) => c.name.toLowerCase()).join(" · ")}</span>
                <span className="whitespace-nowrap text-right font-display text-sm font-semibold">от {min} <span className="text-xs text-mute">BYN</span></span>
                <ArrowRight size={18} className="acc hidden transition group-hover:translate-x-1 sm:block" />
              </Link>
            );
          })}
        </div>
        <p className="mt-4 flex flex-wrap gap-x-5 gap-y-1 text-xs text-mute">
          <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-ok" /> можно подождать</span>
          <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-warn" /> вызвать сегодня</span>
          <span className="flex items-center gap-2"><i className="h-2 w-2 rounded-full bg-bad" /> выключить из розетки</span>
        </p>
      </section>

      {/* Услуги — бенто */}
      <section className="wrap pb-16 lg:pb-24">
        <Head eyebrow="Услуги" title="Что мы делаем на вашей кухне" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.slice(0, 11).map((s, i) => (
            <Reveal key={s.slug} delay={(i % 4) * 60} className={i === 0 ? "sm:col-span-2 lg:row-span-2" : i === 5 ? "lg:col-span-2" : ""}>
              <Link href={`${routes.services}/${s.slug}`} className={`card group flex h-full flex-col justify-between gap-8 p-6 transition duration-300 hover:-translate-y-1 hover:border-white/25 ${i === 0 ? "bg-gradient-to-br from-ice/15 to-transparent sm:p-8" : ""}`}>
                <div>
                  <p className="text-[11px] uppercase tracking-widest text-mute">{s.time}</p>
                  <h3 className={`mt-2 font-display font-semibold leading-snug ${i === 0 ? "text-2xl sm:text-3xl" : "text-base"}`}>{s.name}</h3>
                  {(i === 0 || i === 5) && <p className="mt-3 max-w-md text-sm leading-relaxed text-mute">{s.lead}</p>}
                </div>
                <div className="flex items-end justify-between">
                  <p className="font-display text-lg font-semibold">от {s.from} <span className="text-xs text-mute">BYN</span></p>
                  <ArrowRight size={18} className="acc transition group-hover:translate-x-1" />
                </div>
              </Link>
            </Reveal>
          ))}
          <Link href={routes.services} className="card group flex flex-col justify-between gap-8 border-dashed p-6 transition hover:border-white/30">
            <h3 className="font-display text-base font-semibold">Все {services.length} услуг и {tech.length} типов техники</h3>
            <ArrowRight size={18} className="acc self-end transition group-hover:translate-x-1" />
          </Link>
        </div>
      </section>

      {/* Калькулятор */}
      <section className="wrap pb-16 lg:pb-24" id="kalkulyator">
        <Head eyebrow="Калькулятор" title={<>Вилка цены за <span className="acc">10 секунд</span></>} lead="Считается из тех же цифр, что стоят в прайсе, — сумма в калькуляторе не разойдётся с таблицей цен." />
        <Calculator />
      </section>

      {/* Бренды */}
      <section className="pb-16 lg:pb-24">
        <div className="wrap">
          <Head eyebrow="Бренды" title="Знаем слабые места каждой марки" lead="На странице бренда — типовые поломки именно этой техники, серии, коды ошибок и заметки мастера." />
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-8">
            {brands.map((b) => (
              <Link key={b.slug} href={`${routes.brands}/${b.slug}`} className="card group grid aspect-[4/3] place-items-center p-3 text-center transition hover:-translate-y-1 hover:border-white/25">
                <span>
                  <span className="mx-auto mb-2 block h-1 w-6 rounded-full transition-all group-hover:w-10" style={{ background: b.accent }} />
                  <span className="font-display text-sm font-semibold">{b.name}</span>
                </span>
              </Link>
            ))}
          </div>
        </div>
        <div className="mt-8 overflow-hidden border-y border-white/8 py-4" aria-hidden>
          <div className="flex w-max gap-10 whitespace-nowrap font-display text-sm text-mute" style={{ animation: "marquee 50s linear infinite" }}>
            {[...otherBrands, ...otherBrands].map((b, i) => (
              <span key={i}>{b}</span>
            ))}
          </div>
        </div>
      </section>

      {/* Как работаем */}
      <section className="wrap pb-16 lg:pb-24">
        <Head eyebrow="Процесс" title="От звонка до холода — пять шагов" />
        <Steps items={steps} />
      </section>

      {/* Честно */}
      <section className="wrap pb-16 lg:pb-24">
        <div className="grid gap-5 lg:grid-cols-2">
          <div className="card p-7 sm:p-9">
            <p className="eyebrow mb-4">Чего у нас нет</p>
            <h2 className="h2">Без рекламных фокусов</h2>
            <ul className="mt-6 space-y-4 text-sm">
              {[
                "«Приедем за 15 минут» — реальное время в Минске 1–2 часа",
                "Таймеров «скидка сгорает через 10 минут»",
                "«Ремонт от 10 рублей» без объяснения, что это за работа",
                "Диагноза «компрессор» по телефону, без замеров",
                "Доплат за вечер, выходные и срочность",
              ].map((t) => (
                <li key={t} className="flex gap-3 text-mute">
                  <Ban size={18} className="mt-0.5 shrink-0 text-bad" /> {t}
                </li>
              ))}
            </ul>
          </div>
          <div className="card bg-gradient-to-br from-ok/10 to-transparent p-7 sm:p-9">
            <p className="eyebrow mb-4">Что есть</p>
            <h2 className="h2">Понятные условия</h2>
            <ul className="mt-6 space-y-4 text-sm">
              {[
                `Диагностика ${site.diagnostics}; при отказе — ${site.diagnosticsRefusal} BYN за выезд`,
                "Точная сумма до начала работ, в акте — та же цифра",
                `Гарантия ${site.warrantyMin} ${site.warrantyMax} — срок по каждой работе в одной таблице`,
                "Оплата после того, как холодильник начал морозить",
                ...discounts.map((d) => `${d.t} ${d.who.toLowerCase()}`),
              ].map((t) => (
                <li key={t} className="flex gap-3">
                  <CircleCheck size={18} className="mt-0.5 shrink-0 text-ok" /> {t}
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-mute">{discountNote}</p>
          </div>
        </div>
      </section>

      {/* Типы техники */}
      <section className="wrap pb-16 lg:pb-24">
        <Head eyebrow="Техника" title="Не только обычные холодильники" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {tech.map((t) => (
            <LinkCard key={t.slug} href={`${routes.tech}/${t.slug}`} title={t.name} text={t.lead} meta={`от ${t.from} BYN`} />
          ))}
        </div>
      </section>

      {/* География */}
      <section className="wrap pb-16 lg:pb-24">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <MinskMap />
          <div>
            <p className="eyebrow mb-4">География</p>
            <h2 className="h2">Все 9 районов Минска и пригород</h2>
            <p className="lead mt-4">В черте города выезд без доплаты. За МКАД — от 15 BYN, сумму называем при заявке.</p>
            <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 text-sm sm:grid-cols-3">
              {[...districts, ...suburbs].map((a) => (
                <li key={a.slug}>
                  <Link href={`${routes.areas}/${a.slug}`} className="text-snow/80 underline-offset-4 hover:text-white hover:underline">
                    {a.name}
                  </Link>
                  <span className="ml-1.5 text-xs text-mute">{a.arrival.replace(" минут", " мин").replace(" часа", " ч")}</span>
                </li>
              ))}
            </ul>
            <Link href={routes.areas} className="btn-ghost mt-7">Вся зона выезда <ArrowRight size={16} /></Link>
          </div>
        </div>
      </section>

      {/* Отзывы */}
      <section className="wrap pb-16 lg:pb-24">
        <Head eyebrow="Отзывы" title="Что говорят после ремонта" />
        <div className="grid gap-4 md:grid-cols-3">
          {reviews.slice(0, 3).map((r) => (
            <figure key={r.name} className="card flex flex-col justify-between gap-6 p-6">
              <blockquote className="text-sm leading-relaxed text-snow/90">«{r.text}»</blockquote>
              <figcaption className="flex items-end justify-between text-xs text-mute">
                <span>
                  <span className="block text-sm font-semibold text-snow">{r.name}, {r.area}</span>
                  {r.model} · {new Date(r.date).toLocaleDateString("ru-RU", { month: "long", year: "numeric" })}
                </span>
                {site.demoContent && <span className="chip !py-0.5">демо</span>}
              </figcaption>
            </figure>
          ))}
        </div>
        <Link href={routes.reviews} className="btn-ghost mt-6">Все отзывы <ArrowRight size={16} /></Link>
      </section>

      {/* Блог */}
      <section className="wrap pb-8">
        <Head eyebrow="Блог мастера" title="Полезно знать до вызова" />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {articles.slice(0, 3).map((a) => (
            <LinkCard key={a.slug} href={`${routes.blog}/${a.slug}`} title={a.h1} text={a.lead} meta={`${a.tag} · ${a.minutes} мин`} />
          ))}
        </div>
      </section>

      <Faq items={generalFaq} title="Частые вопросы о ремонте" />

      <section className="wrap pb-20">
        <div className="grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <p className="eyebrow mb-4">Заявка</p>
            <h2 className="h2">Опишите проблему — перезвоним за <span className="acc">10 минут</span></h2>
            <p className="lead mt-4 max-w-lg">Диспетчер назовёт вилку цены по симптому и ближайшее окно мастера в вашем районе.</p>
          </div>
          <LeadForm />
        </div>
      </section>

      <JsonLd data={faqLd(generalFaq)} />
    </main>
  );
}
