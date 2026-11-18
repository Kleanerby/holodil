"use client";

import { useState } from "react";
import { ArrowRight, Check } from "lucide-react";
import { site } from "@/lib/site";

export function LeadForm({ context, title = "Вызвать мастера", compact = false }: { context?: string; title?: string; compact?: boolean }) {
  const [state, setState] = useState<"idle" | "sending" | "ok" | "error">("idle");

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const fd = new FormData(e.currentTarget);
    if (fd.get("company")) return; // honeypot
    setState("sending");
    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fd.get("name"),
          phone: fd.get("phone"),
          problem: fd.get("problem"),
          context: context ?? document.title,
          page: location.pathname,
        }),
      });
      setState(res.ok ? "ok" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "ok")
    return (
      <div className="glass p-7 text-center" role="status">
        <span className="mx-auto grid h-12 w-12 place-items-center rounded-full bg-ok/15 text-ok">
          <Check />
        </span>
        <p className="mt-4 font-display text-lg font-semibold">Заявка принята</p>
        <p className="mt-2 text-sm text-mute">Диспетчер перезвонит в течение 10 минут в рабочее время ({site.hours.toLowerCase()}).</p>
      </div>
    );

  return (
    <form onSubmit={submit} className="glass p-6 sm:p-7" id="zayavka">
      <p className="font-display text-lg font-semibold">{title}</p>
      <p className="mt-1 text-sm text-mute">Перезвоним за 10 минут и назовём вилку цены.</p>
      <div className="mt-5 grid gap-3">
        <input name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden />
        <label className="sr-only" htmlFor="lf-name">Имя</label>
        <input id="lf-name" name="name" className="field" placeholder="Ваше имя" autoComplete="given-name" />
        <label className="sr-only" htmlFor="lf-phone">Телефон</label>
        <input id="lf-phone" name="phone" type="tel" required pattern="[\d\s()+\-]{9,}" className="field" placeholder="+375 (__) ___-__-__" autoComplete="tel" />
        {!compact && (
          <>
            <label className="sr-only" htmlFor="lf-problem">Что случилось</label>
            <textarea id="lf-problem" name="problem" rows={2} className="field resize-none" placeholder="Марка и что случилось: «Атлант, не морозит верх»" />
          </>
        )}
        <button className="btn-hot mt-1" disabled={state === "sending"}>
          {state === "sending" ? "Отправляем…" : "Жду звонка"} <ArrowRight size={16} />
        </button>
        {state === "error" && (
          <p className="text-sm text-bad" role="alert">
            Не удалось отправить. Позвоните: <a className="underline" href={site.phoneHref}>{site.phone}</a>
          </p>
        )}
        <p className="text-[11px] leading-snug text-mute">Нажимая кнопку, вы соглашаетесь на обработку персональных данных для связи по заявке.</p>
      </div>
    </form>
  );
}
