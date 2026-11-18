import { LeadForm } from "@/components/LeadForm";
import { PageHero } from "@/components/PageHero";
import { CtaBand, JsonLd } from "@/components/ui";
import { reviews } from "@/lib/data/common";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { routes, site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Отзывы о ремонте холодильников в Минске — с датой, моделью и суммой",
  description: "Отзывы клиентов о ремонте холодильников в Минске: какая модель, что сломалось, сколько стоил ремонт и в каком районе. Только с датой и деталями.",
  path: routes.reviews,
});

const crumbs = [{ name: "Главная", path: "/" }, { name: "Отзывы", path: routes.reviews }];

export default function ReviewsPage() {
  return (
    <main id="main">
      <PageHero crumbs={crumbs} eyebrow="Отзывы" title={<>Отзывы с <span className="acc">датой, моделью и суммой</span></>} lead="Безымянным «спасибо, всё супер» трудно верить. Поэтому в каждом отзыве — модель холодильника, район, что именно сделали и сколько это стоило." />
      <section className="wrap pb-16 lg:pb-24">
        {site.demoContent && (
          <p className="mb-6 rounded-2xl border border-warn/30 bg-warn/[0.06] p-4 text-sm text-warn">
            Демо-наполнение: отзывы ниже — образец оформления. Перед запуском их нужно заменить настоящими.
          </p>
        )}
        <div className="columns-1 gap-4 md:columns-2 lg:columns-3">
          {reviews.map((r) => (
            <figure key={r.name + r.date} className="card mb-4 break-inside-avoid p-6">
              <div className="mb-4 flex flex-wrap gap-2">
                <span className="chip">{r.model}</span>
                <span className="chip">{r.area}</span>
              </div>
              <blockquote className="leading-relaxed text-snow/90">«{r.text}»</blockquote>
              <figcaption className="mt-5 flex items-end justify-between border-t border-white/8 pt-4 text-sm">
                <span>
                  <span className="block font-semibold">{r.name}</span>
                  <time dateTime={r.date} className="text-xs text-mute">{new Date(r.date).toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })}</time>
                </span>
                <span className="font-display font-semibold">{r.sum} <span className="text-xs text-mute">BYN</span></span>
              </figcaption>
            </figure>
          ))}
        </div>
      </section>
      <section className="wrap grid gap-8 pb-16 lg:grid-cols-2 lg:pb-24">
        <div>
          <h2 className="h2">Мы у вас уже были?</h2>
          <p className="lead mt-4">Расскажите, как всё прошло. Критика тоже публикуется — вместе с нашим ответом.</p>
        </div>
        <LeadForm title="Оставить отзыв" context="Отзыв" />
      </section>
      <CtaBand />
      <JsonLd data={breadcrumbLd(crumbs)} />
    </main>
  );
}
