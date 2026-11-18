import { Clock, Mail, MapPin, MessageCircle, Phone, Send } from "lucide-react";
import { LeadForm } from "@/components/LeadForm";
import { MinskMap } from "@/components/MinskMap";
import { PageHero } from "@/components/PageHero";
import { JsonLd } from "@/components/ui";
import { breadcrumbLd, pageMetadata } from "@/lib/seo";
import { routes, site } from "@/lib/site";

export const metadata = pageMetadata({
  title: "Контакты — вызвать мастера по ремонту холодильников в Минске",
  description: `Вызов мастера по ремонту холодильников в Минске: телефон ${site.phone}, Telegram, Viber, онлайн-заявка. ${site.hours}.`,
  path: routes.contacts,
});

const crumbs = [{ name: "Главная", path: "/" }, { name: "Контакты", path: routes.contacts }];

export default function ContactsPage() {
  return (
    <main id="main">
      <PageHero crumbs={crumbs} eyebrow="Контакты" title={<>Позвоните — мастер выедет <span className="acc">в ближайшее окно</span></>} lead="Что сообщить диспетчеру: марку и примерный возраст холодильника, что случилось и ваш адрес. Этого достаточно, чтобы назвать вилку цены." />
      <section className="wrap grid gap-8 pb-20 lg:grid-cols-[1fr_1fr]">
        <div className="space-y-4">
          <a href={site.phoneHref} className="card flex items-center gap-5 p-6 transition hover:border-white/25">
            <span className="grid h-12 w-12 place-items-center rounded-2xl bg-hot text-ink"><Phone /></span>
            <span>
              <span className="block text-xs text-mute">Телефон</span>
              <span className="font-display text-xl font-semibold sm:text-2xl">{site.phone}</span>
            </span>
          </a>
          <div className="grid gap-4 sm:grid-cols-2">
            <a href={site.telegram} className="card flex items-center gap-4 p-5 transition hover:border-white/25"><Send className="acc" /> Telegram</a>
            <a href={site.viber} className="card flex items-center gap-4 p-5 transition hover:border-white/25"><MessageCircle className="acc" /> Viber</a>
          </div>
          <ul className="card divide-y divide-white/6 text-sm">
            <li className="flex items-center gap-4 p-5"><Clock size={18} className="acc shrink-0" /> {site.hours} — без выходных</li>
            <li className="flex items-center gap-4 p-5"><MapPin size={18} className="acc shrink-0" /> {site.address}</li>
            <li className="flex items-center gap-4 p-5"><Mail size={18} className="acc shrink-0" /> <a href={`mailto:${site.email}`}>{site.email}</a></li>
          </ul>
          <p className="text-xs text-mute">{site.legalName}, УНП {site.unp}</p>
          <MinskMap />
        </div>
        <div className="lg:sticky lg:top-24 lg:self-start">
          <LeadForm title="Онлайн-заявка" />
        </div>
      </section>
      <JsonLd data={breadcrumbLd(crumbs)} />
    </main>
  );
}
