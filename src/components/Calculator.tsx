"use client";

import { useMemo, useState } from "react";
import { brands } from "@/lib/data/brands";
import { faults } from "@/lib/data/faults";
import { LeadForm } from "./LeadForm";

const types = [
  { id: "drip", name: "Обычный (капельный)", k: 1 },
  { id: "nofrost", name: "No Frost", k: 1.1 },
  { id: "sbs", name: "Side-by-Side", k: 1.35 },
  { id: "builtin", name: "Встраиваемый", k: 1.25 },
  { id: "freezer", name: "Морозильник / ларь", k: 1 },
];
const premium = new Set(["liebherr", "bosch", "siemens", "samsung", "lg", "haier"]);

/**
 * Калькулятор считает вилку из тех же цифр, что стоят в прайсе (causes[].from),
 * поэтому результат не может разойтись с таблицей цен — частая ошибка конкурентов.
 */
export function Calculator() {
  const [brand, setBrand] = useState("atlant");
  const [type, setType] = useState("drip");
  const [fault, setFault] = useState(faults[0].slug);
  const [old, setOld] = useState(false);

  const res = useMemo(() => {
    const f = faults.find((x) => x.slug === fault)!;
    const k = types.find((t) => t.id === type)!.k * (premium.has(brand) ? 1.1 : 1);
    const sorted = [...f.causes].sort((a, b) => b.share - a.share);
    const likely = sorted[0];
    const froms = f.causes.map((c) => c.from);
    const round = (n: number) => Math.round((n * k) / 5) * 5;
    return {
      min: round(Math.min(...froms)),
      max: round(Math.max(...froms) * 1.6 + (old ? 40 : 0)),
      likely,
      likelyPrice: round(likely.from),
      name: f.name,
    };
  }, [brand, type, fault, old]);

  const brandName = brands.find((b) => b.slug === brand)?.name ?? "Другая марка";

  return (
    <div className="grid gap-5 lg:grid-cols-[1.25fr_1fr]">
      <div className="card p-6 sm:p-8">
        <div className="grid gap-6 sm:grid-cols-2">
          <label className="block text-sm">
            <span className="mb-2 block text-mute">Марка</span>
            <select className="field" value={brand} onChange={(e) => setBrand(e.target.value)}>
              {brands.map((b) => (
                <option key={b.slug} value={b.slug} className="bg-panel">
                  {b.name}
                </option>
              ))}
              <option value="other" className="bg-panel">Другая марка</option>
            </select>
          </label>
          <label className="block text-sm">
            <span className="mb-2 block text-mute">Тип холодильника</span>
            <select className="field" value={type} onChange={(e) => setType(e.target.value)}>
              {types.map((t) => (
                <option key={t.id} value={t.id} className="bg-panel">
                  {t.name}
                </option>
              ))}
            </select>
          </label>
        </div>
        <fieldset className="mt-6">
          <legend className="mb-3 text-sm text-mute">Что случилось</legend>
          <div className="flex flex-wrap gap-2">
            {faults.map((f) => (
              <button
                key={f.slug}
                type="button"
                onClick={() => setFault(f.slug)}
                aria-pressed={fault === f.slug}
                className={`rounded-full border px-3.5 py-2 text-[13px] transition ${fault === f.slug ? "border-transparent bg-ice font-semibold text-ink" : "border-white/12 text-snow/80 hover:border-white/40"}`}
              >
                {f.name}
              </button>
            ))}
          </div>
        </fieldset>
        <label className="mt-6 flex cursor-pointer items-center gap-3 text-sm">
          <input type="checkbox" checked={old} onChange={(e) => setOld(e.target.checked)} className="h-5 w-5 accent-[#6fdcff]" />
          Холодильнику больше 12 лет
        </label>

        <div className="mt-8 rounded-2xl border border-white/10 bg-ink/60 p-6" aria-live="polite">
          <p className="text-xs uppercase tracking-widest text-mute">
            {brandName} · {res.name.toLowerCase()}
          </p>
          <p className="mt-2 font-display text-3xl font-semibold sm:text-4xl">
            {res.min}–{res.max} <span className="text-base text-mute">BYN</span>
          </p>
          <p className="mt-3 text-sm leading-relaxed text-mute">
            Наиболее вероятно: <span className="text-snow">{res.likely.name.toLowerCase()}</span> ({res.likely.share}% случаев) — работа от {res.likelyPrice} BYN.
            Запчасти в вилку включены, кроме компрессора и платы. Точную сумму мастер назовёт после замеров.
          </p>
        </div>
      </div>
      <LeadForm title="Зафиксировать расчёт" context={`Калькулятор: ${brandName}, ${res.name}, ${res.min}–${res.max} BYN`} />
    </div>
  );
}
