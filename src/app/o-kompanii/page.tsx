import { Gauge, Scale, Thermometer, Wind } from "lucide-react";
import { PageHero } from "@/components/PageHero";
import { Stage } from "@/components/stages";
import { CtaBand, Head, JsonLd, Steps } from "@/components/ui";
import { masters, steps } from "@/lib/data/common";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { routes, site } from "@/lib/site";

export const metadata = pageMetadata({
  title: `О сервисе «${site.name}» — мастера по ремонту холодильников в Минске`,
  description: "Кто приедет к вам домой: мастера по ремонту холодильников в Минске, их специализация и районы, оборудование и принципы работы сервиса.",
  path: routes.about,
});

const crumbs = [{ name: "Главная", path: "/" }, { name: "О компании", path: routes.about }];
const tools = [
  { i: <Gauge />, t: "Манометрическая станция", d: "Показывает давление в контуре — отличает утечку от засора за минуту." },
  { i: <Wind />, t: "Вакуумный насос", d: "Удаляет влагу и воздух перед заправкой. Без него ремонт живёт полгода." },
  { i: <Scale />, t: "Электронные весы", d: "Фреон дозируется с точностью до грамма — по шильдику холодильника." },
  { i: <Thermometer />, t: "Токовые клещи и термометр", d: "Ток компрессора и температура в камере до и после — вы видите результат." },
];

export default function AboutPage() {
  return (
    <main id="main">
      <PageHero crumbs={crumbs} eyebrow="О компании" title={<>Чиним холод в Минске <span className="acc">с {site.since} года</span></>} lead={`${site.masters} мастеров на выезде, у каждого — своя специализация и свои районы. Мы не колл-центр, передающий заявки: к вам приезжает наш штатный мастер.`} />

      <section className="wrap grid gap-8 pb-16 lg:grid-cols-2 lg:pb-24">
        <Stage startXray yaw={-2.3} className="h-[440px] lg:h-auto lg:min-h-[520px]" />
        <div className="self-center">
          <p className="eyebrow mb-4">Принципы</p>
          <h2 className="h2">Одни и те же цифры — везде</h2>
          <p className="lead mt-4">Мы изучили сайты крупных сервисов Минска и Москвы. Почти у всех гарантия, цены и часы работы противоречат друг другу на разных страницах. У нас они записаны в одном месте и подставляются автоматически.</p>
          <dl className="mt-8 grid grid-cols-2 gap-4">
            {[
              ["Выезд", site.arrival],
              ["Диагностика", site.diagnostics],
              ["Гарантия", `${site.warrantyMin} ${site.warrantyMax}`],
              ["График", site.hours],
            ].map(([k, v]) => (
              <div key={k} className="card p-5">
                <dt className="text-[11px] uppercase tracking-widest text-mute">{k}</dt>
                <dd className="mt-1.5 font-display text-sm font-semibold leading-snug sm:text-base">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      <section className="wrap pb-16 lg:pb-24">
        <Head eyebrow="Мастера" title="Кто к вам приедет" />
        {site.demoContent && <p className="mb-5 text-xs text-warn">Демо-данные: заменить на реальных мастеров с фотографиями.</p>}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {masters.map((m) => (
            <div key={m.name} className="card p-6">
              <div className="grid h-14 w-14 place-items-center rounded-2xl bg-ice/15 font-display text-xl font-semibold text-ice">{m.name[0]}</div>
              <h3 className="mt-4 font-display text-lg font-semibold">{m.name}</h3>
              <p className="text-sm text-mute">стаж {m.exp} лет</p>
              <p className="mt-4 text-sm leading-relaxed">{m.spec}</p>
              <p className="mt-4 border-t border-white/8 pt-4 text-xs text-mute">{m.zone}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap pb-16 lg:pb-24">
        <Head eyebrow="Оборудование" title="Что у мастера в чемодане" lead="По инструменту легко отличить холодильщика от «мастера на все руки»." />
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {tools.map((t) => (
            <div key={t.t} className="card p-6">
              <span className="acc">{t.i}</span>
              <h3 className="mt-4 font-display text-base font-semibold">{t.t}</h3>
              <p className="mt-2 text-sm leading-relaxed text-mute">{t.d}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="wrap pb-16 lg:pb-24">
        <Head eyebrow="Процесс" title="Как мы работаем" />
        <Steps items={steps} />
      </section>
      <CtaBand />
      <JsonLd data={breadcrumbLd(crumbs)} />
    </main>
  );
}
