"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Clock, Phone, ScanLine, ShieldCheck, Wrench } from "lucide-react";
import { faults } from "@/lib/data/faults";
import { site } from "@/lib/site";
import { Fridge3D } from "./three/Fridge3D";

const picks = ["ne-morozit", "ne-vklyuchaetsya", "techet", "shumit", "namerzaet-led", "oshibka-na-displee"];

export function HomeHero() {
  const [slug, setSlug] = useState<string | null>(null);
  const [open, setOpen] = useState(0);
  const fault = faults.find((f) => f.slug === slug);
  const cause = fault ? [...fault.causes].sort((a, b) => b.share - a.share)[0] : null;

  // двери приоткрываются при загрузке и распахиваются по мере прокрутки
  useEffect(() => {
    const t = setTimeout(() => setOpen(0.45), 900);
    const on = () => setOpen(Math.min(1, 0.45 + window.scrollY / 500));
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", on);
    };
  }, []);

  return (
    <section className="relative overflow-hidden">
      <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden />
      <div className="wrap relative grid items-center gap-8 pb-14 pt-8 lg:grid-cols-[1.05fr_1fr] lg:pb-20 lg:pt-12">
        <div>
          <p className="eyebrow mb-5">Минск и Минский район · {site.hours.toLowerCase()}</p>
          <h1 className="h1">
            Ремонт холодильников <span className="acc">в Минске</span> на дому
          </h1>
          <p className="lead mt-5 max-w-xl">
            Мастер приедет за {site.arrival} с запчастями под вашу модель. Назовём цену до начала работ — и она не изменится.
          </p>

          <ul className="mt-7 grid max-w-xl grid-cols-3 gap-3 text-sm">
            {[
              { i: <Clock size={18} />, v: site.arrival, k: "выезд мастера" },
              { i: <Wrench size={18} />, v: "0 BYN", k: "диагностика при ремонте" },
              { i: <ShieldCheck size={18} />, v: "до 24 мес.", k: "гарантия по талону" },
            ].map((x) => (
              <li key={x.k} className="glass !rounded-2xl p-3.5 sm:p-4">
                <span className="acc">{x.i}</span>
                <p className="mt-2 font-display text-sm font-semibold sm:text-lg">{x.v}</p>
                <p className="mt-0.5 text-[11px] leading-tight text-mute sm:text-xs">{x.k}</p>
              </li>
            ))}
          </ul>

          <div className="mt-7 flex flex-col gap-3 sm:flex-row">
            <a href={site.phoneHref} className="btn-hot">
              <Phone size={16} /> {site.phone}
            </a>
            <Link href="/kontakty#zayavka" className="btn-ghost">
              Оставить заявку <ArrowRight size={16} />
            </Link>
          </div>
          <p className="mt-4 text-xs text-mute">Ремонт от {site.minPrice} BYN · оплата после проверки · наличные, карта, ЕРИП, счёт для юрлиц</p>
        </div>

        <div className="stage h-[520px] sm:h-[600px] lg:h-[680px]">
          <div className="absolute inset-0">
            <Fridge3D highlight={cause?.part ?? null} xray={!!fault} open={fault ? 0.15 : open} yaw={fault ? -2.4 : -0.55} />
          </div>

          <div className="absolute inset-x-4 top-4">
            <p className="mb-2 flex items-center gap-1.5 text-[11px] uppercase tracking-widest text-mute">
              <ScanLine size={13} /> Что случилось? Покажем причину на модели
            </p>
            <div className="flex flex-wrap gap-1.5">
              {picks.map((s) => {
                const f = faults.find((x) => x.slug === s)!;
                const on = slug === s;
                return (
                  <button
                    key={s}
                    type="button"
                    aria-pressed={on}
                    onClick={() => setSlug(on ? null : s)}
                    className={`rounded-full border px-3 py-1.5 text-xs backdrop-blur transition ${on ? "border-transparent bg-ice font-semibold text-ink" : "border-white/15 bg-ink/50 text-snow hover:border-white/40"}`}
                  >
                    {f.name}
                  </button>
                );
              })}
            </div>
          </div>

          <div className="absolute inset-x-4 bottom-4">
            {fault && cause ? (
              <Link href={`/neispravnosti/${fault.slug}`} className="glass group flex items-center justify-between gap-4 !rounded-2xl p-4">
                <span>
                  <span className="block text-[11px] uppercase tracking-widest text-mute">Вероятнее всего · {cause.share}% случаев</span>
                  <span className="mt-1 block font-display text-sm font-semibold sm:text-base">{cause.name}</span>
                  <span className="mt-0.5 block text-xs text-mute">{cause.fix} — от {cause.from} BYN</span>
                </span>
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ice text-ink transition group-hover:translate-x-1">
                  <ArrowRight size={18} />
                </span>
              </Link>
            ) : (
              <p className="text-center text-[11px] text-mute">Потяните модель, чтобы повернуть · прокрутите — двери откроются</p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
