import Link from "next/link";
import { areas } from "@/lib/data/areas";
import { brands } from "@/lib/data/brands";
import { faults } from "@/lib/data/faults";
import { services } from "@/lib/data/services";
import { tech } from "@/lib/data/tech";
import { routes, site } from "@/lib/site";
import { Logo } from "./Header";

function Col({ title, href, items }: { title: string; href: string; items: { name: string; href: string }[] }) {
  return (
    <div>
      <Link href={href} className="font-display text-sm font-semibold">
        {title}
      </Link>
      <ul className="mt-4 space-y-2 text-[13px] text-mute">
        {items.map((i) => (
          <li key={i.href}>
            <Link href={i.href} className="transition hover:text-snow">
              {i.name}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Footer() {
  return (
    <footer className="border-t border-white/8 bg-panel/60">
      <div className="wrap grid gap-10 py-14 sm:grid-cols-2 lg:grid-cols-[1.3fr_1fr_1fr_1fr_1fr]">
        <div>
          <Logo />
          <p className="mt-5 max-w-xs text-sm leading-relaxed text-mute">
            Ремонт холодильников и морозильных камер на дому в Минске и Минском районе. {site.hours}.
          </p>
          <a href={site.phoneHref} className="mt-5 block font-display text-xl font-semibold">
            {site.phone}
          </a>
          <a href={`mailto:${site.email}`} className="mt-1 block text-sm text-mute hover:text-snow">
            {site.email}
          </a>
          <ul className="mt-6 flex flex-wrap gap-x-4 gap-y-2 text-[13px] text-mute">
            {[
              ["Цены", routes.prices],
              ["Гарантия", routes.warranty],
              ["Отзывы", routes.reviews],
              ["О компании", routes.about],
              ["Блог", routes.blog],
              ["Контакты", routes.contacts],
            ].map(([n, h]) => (
              <li key={h}>
                <Link href={h} className="hover:text-snow">{n}</Link>
              </li>
            ))}
          </ul>
        </div>
        <Col title="Услуги" href={routes.services} items={[
          ...services.slice(0, 10).map((s) => ({ name: s.name, href: `${routes.services}/${s.slug}` })),
          ...tech.slice(0, 3).map((t) => ({ name: t.name, href: `${routes.tech}/${t.slug}` })),
        ]} />
        <Col title="Неисправности" href={routes.faults} items={faults.slice(0, 13).map((f) => ({ name: f.name, href: `${routes.faults}/${f.slug}` }))} />
        <Col title="Бренды" href={routes.brands} items={brands.slice(0, 13).map((b) => ({ name: `Ремонт ${b.name}`, href: `${routes.brands}/${b.slug}` }))} />
        <Col title="География" href={routes.areas} items={areas.slice(0, 13).map((a) => ({ name: a.kind === "district" ? `${a.name} район` : a.name, href: `${routes.areas}/${a.slug}` }))} />
      </div>
      <div className="border-t border-white/8">
        <div className="wrap flex flex-col gap-2 py-6 text-xs text-mute sm:flex-row sm:justify-between">
          <p>© {new Date().getFullYear()} {site.name}. {site.legalName}, УНП {site.unp}</p>
          <p>Цены на сайте не являются публичной офертой. Точную стоимость называет мастер после диагностики.</p>
        </div>
      </div>
    </footer>
  );
}
