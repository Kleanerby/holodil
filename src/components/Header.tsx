"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { ChevronDown, Menu, Phone, Snowflake, X } from "lucide-react";
import { districts } from "@/lib/data/areas";
import { brands } from "@/lib/data/brands";
import { faults } from "@/lib/data/faults";
import { services } from "@/lib/data/services";
import { tech } from "@/lib/data/tech";
import { routes, site } from "@/lib/site";

type Item = { name: string; href: string };
const menu: { name: string; href: string; cols?: number; items?: Item[]; all?: string }[] = [
  {
    name: "Услуги",
    href: routes.services,
    cols: 3,
    all: "Все услуги",
    items: [
      ...services.map((s) => ({ name: s.name, href: `${routes.services}/${s.slug}` })),
      ...tech.map((t) => ({ name: t.name, href: `${routes.tech}/${t.slug}` })),
    ],
  },
  { name: "Неисправности", href: routes.faults, cols: 3, all: "Все неисправности", items: faults.map((f) => ({ name: f.name, href: `${routes.faults}/${f.slug}` })) },
  { name: "Бренды", href: routes.brands, cols: 4, all: "Все марки", items: brands.map((b) => ({ name: b.name, href: `${routes.brands}/${b.slug}` })) },
  { name: "Районы", href: routes.areas, cols: 3, all: "Минск и район", items: districts.map((a) => ({ name: a.name, href: `${routes.areas}/${a.slug}` })) },
  { name: "Цены", href: routes.prices },
  { name: "Блог", href: routes.blog },
];

export function Logo() {
  return (
    <Link href="/" className="flex items-center gap-2.5" aria-label={`${site.name} — на главную`}>
      <span className="grid h-9 w-9 place-items-center rounded-xl bg-ice text-ink">
        <Snowflake size={20} strokeWidth={2.4} />
      </span>
      <span className="leading-none">
        <span className="block font-display text-base font-semibold tracking-tight">{site.name}</span>
        <span className="mt-0.5 block text-[10px] uppercase tracking-[0.18em] text-mute">ремонт холодильников</span>
      </span>
    </Link>
  );
}

export function Header() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const path = usePathname();

  useEffect(() => setOpen(false), [path]);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 12);
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <header className={`sticky top-0 z-50 transition duration-300 ${scrolled || open ? "border-b border-white/8 bg-ink/85 backdrop-blur-xl" : "border-b border-transparent"}`}>
      <div className="wrap flex h-[72px] items-center justify-between gap-6">
        <Logo />
        <nav className="hidden items-center gap-1 xl:flex" aria-label="Основная навигация">
          {menu.map((m) => {
            const active = path.startsWith(m.href);
            return (
              <div key={m.name} className="group relative">
                <Link href={m.href} className={`flex items-center gap-1 rounded-full px-3.5 py-2 text-sm transition hover:bg-white/[0.06] ${active ? "text-ice" : "text-snow/85"}`}>
                  {m.name}
                  {m.items && <ChevronDown size={14} className="text-mute transition group-hover:rotate-180" />}
                </Link>
                {m.items && (
                  <div className="invisible absolute left-1/2 top-full z-50 -translate-x-1/2 pt-3 opacity-0 transition duration-200 group-focus-within:visible group-focus-within:opacity-100 group-hover:visible group-hover:opacity-100">
                    <div className="rounded-3xl border border-white/10 bg-panel/95 p-5 shadow-2xl backdrop-blur-xl" style={{ width: (m.cols ?? 2) * 208 }}>
                      <ul className="grid gap-x-2 gap-y-0.5" style={{ gridTemplateColumns: `repeat(${m.cols}, minmax(0, 1fr))` }}>
                        {m.items.map((i) => (
                          <li key={i.href}>
                            <Link href={i.href} className="block rounded-xl px-3 py-2 text-[13px] text-snow/80 transition hover:bg-white/[0.06] hover:text-white">
                              {i.name}
                            </Link>
                          </li>
                        ))}
                      </ul>
                      <Link href={m.href} className="mt-3 block border-t border-white/8 px-3 pt-3 text-xs font-semibold text-ice">
                        {m.all} →
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div className="flex items-center gap-3">
          <a href={site.phoneHref} className="hidden shrink-0 text-right leading-tight sm:block">
            <span className="block whitespace-nowrap font-display text-sm font-semibold">{site.phone}</span>
            <span className="flex items-center justify-end gap-1.5 text-[11px] text-mute">
              <span className="relative flex h-1.5 w-1.5">
                <span className="absolute inset-0 rounded-full bg-ok" style={{ animation: "pulse-ring 1.8s ease-out infinite" }} />
                <span className="relative h-1.5 w-1.5 rounded-full bg-ok" />
              </span>
              {site.hours}
            </span>
          </a>
          <Link href="/kontakty#zayavka" className="btn-hot hidden shrink-0 whitespace-nowrap !px-5 !py-2.5 md:inline-flex">
            Вызвать мастера
          </Link>
          <a href={site.phoneHref} className="grid h-11 w-11 place-items-center rounded-full bg-hot text-ink sm:hidden" aria-label="Позвонить">
            <Phone size={18} />
          </a>
          <button onClick={() => setOpen((v) => !v)} className="grid h-11 w-11 place-items-center rounded-full border border-white/15 xl:hidden" aria-label="Меню" aria-expanded={open}>
            {open ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-x-0 bottom-0 top-[72px] overflow-y-auto bg-ink px-5 pb-10 pt-2 xl:hidden">
          {menu.map((m) =>
            m.items ? (
              <details key={m.name} className="group border-b border-white/8">
                <summary className="flex cursor-pointer list-none items-center justify-between py-4 font-display text-lg font-semibold">
                  {m.name} <ChevronDown size={18} className="text-mute transition group-open:rotate-180" />
                </summary>
                <ul className="grid grid-cols-2 gap-1 pb-4">
                  {m.items.map((i) => (
                    <li key={i.href}>
                      <Link href={i.href} className="block rounded-lg px-2 py-2 text-sm text-snow/80">
                        {i.name}
                      </Link>
                    </li>
                  ))}
                  <li className="col-span-2">
                    <Link href={m.href} className="block px-2 py-2 text-sm font-semibold text-ice">
                      {m.all} →
                    </Link>
                  </li>
                </ul>
              </details>
            ) : (
              <Link key={m.name} href={m.href} className="block border-b border-white/8 py-4 font-display text-lg font-semibold">
                {m.name}
              </Link>
            ),
          )}
          <div className="mt-6 grid gap-3">
            <a href={site.phoneHref} className="btn-hot">
              <Phone size={16} /> {site.phone}
            </a>
            <Link href="/kontakty" className="btn-ghost">Контакты</Link>
          </div>
        </div>
      )}
    </header>
  );
}
