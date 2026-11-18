"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, DoorOpen, ScanLine } from "lucide-react";
import { partNames, type FridgeKind, type PartId } from "@/lib/site";
import { Fridge3D } from "./three/Fridge3D";

function Toggle({ on, set, icon, children }: { on: boolean; set: (v: boolean) => void; icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <button
      type="button"
      onClick={() => set(!on)}
      aria-pressed={on}
      className={`inline-flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-semibold backdrop-blur transition ${on ? "border-transparent text-ink" : "border-white/15 bg-ink/50 text-snow hover:border-white/40"}`}
      style={on ? { background: "var(--accent)" } : undefined}
    >
      {icon}
      {children}
    </button>
  );
}

type StageProps = {
  kind?: FridgeKind;
  body?: string;
  accent?: string;
  highlight?: PartId | null;
  startXray?: boolean;
  startOpen?: boolean;
  yaw?: number;
  className?: string;
  hint?: boolean;
};

/** 3D-сцена с кнопками «Открыть» и «Рентген» */
export function Stage({ kind, body, accent, highlight = null, startXray = false, startOpen = false, yaw, className = "", hint = true }: StageProps) {
  const [xray, setXray] = useState(startXray);
  const [open, setOpen] = useState(startOpen);
  return (
    <div className={`stage ${className}`}>
      <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden />
      <div className="absolute inset-0">
        <Fridge3D kind={kind} body={body} accent={accent} highlight={highlight} xray={xray} open={open ? 1 : 0} yaw={yaw} />
      </div>
      <div className="absolute left-4 top-4 flex gap-2">
        <Toggle on={open} set={setOpen} icon={<DoorOpen size={14} />}>
          {open ? "Закрыть" : "Открыть"}
        </Toggle>
        <Toggle on={xray} set={setXray} icon={<ScanLine size={14} />}>
          Рентген
        </Toggle>
      </div>
      {hint && <p className="pointer-events-none absolute bottom-4 right-5 text-[11px] text-mute">Потяните, чтобы повернуть</p>}
    </div>
  );
}

export type ExplorerItem = {
  part: PartId;
  title: string;
  text: string;
  fix?: string;
  from: number;
  share?: number;
  href?: string;
};

/** Список причин / слабых мест слева, 3D-модель с подсветкой узла справа */
export function PartExplorer({
  items,
  kind,
  body,
  accent,
  flip = false,
}: {
  items: ExplorerItem[];
  kind?: FridgeKind;
  body?: string;
  accent?: string;
  flip?: boolean;
}) {
  const [i, setI] = useState(0);
  const cur = items[i];
  return (
    <div className="grid gap-5 lg:grid-cols-2">
      <ol className={`flex flex-col gap-3 ${flip ? "lg:order-2" : ""}`}>
        {items.map((c, k) => {
          const on = k === i;
          return (
            <li key={c.title}>
              <div
                role="button"
                tabIndex={0}
                aria-pressed={on}
                onClick={() => setI(k)}
                onMouseEnter={() => setI(k)}
                onFocus={() => setI(k)}
                onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && setI(k)}
                className={`card cursor-pointer p-5 transition duration-300 sm:p-6 ${on ? "!border-white/30 bg-panel-2" : "opacity-75 hover:opacity-100"}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-widest text-mute">{partNames[c.part]}</p>
                    <h3 className="mt-1 font-display text-base font-semibold sm:text-lg">{c.title}</h3>
                  </div>
                  <p className="whitespace-nowrap font-display text-sm font-semibold">
                    от {c.from} <span className="text-xs text-mute">BYN</span>
                  </p>
                </div>
                {c.share != null && (
                  <div className="mt-4 flex items-center gap-3">
                    <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-white/8">
                      <div className="h-full rounded-full transition-all duration-700" style={{ width: `${c.share * 1.6}%`, background: "var(--accent)" }} />
                    </div>
                    <span className="w-24 text-right text-xs text-mute">{c.share}% случаев</span>
                  </div>
                )}
                <div className={`grid transition-all duration-500 ${on ? "mt-4 grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                  <div className="overflow-hidden">
                    <p className="text-sm leading-relaxed text-mute">{c.text}</p>
                    {c.fix && (
                      <p className="mt-2 text-sm">
                        <span className="text-mute">Решение: </span>
                        {c.fix}
                      </p>
                    )}
                    {c.href && (
                      <Link href={c.href} className="acc mt-3 inline-flex items-center gap-1.5 text-sm font-semibold">
                        Подробнее об услуге <ArrowRight size={14} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
      <div className="stage min-h-[420px] lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] lg:max-h-[720px]">
        <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden />
        <div className="absolute inset-0">
          <Fridge3D kind={kind} body={body} accent={accent} highlight={cur.part} xray yaw={-2.5} spin />
        </div>
        <p className="pointer-events-none absolute bottom-4 left-5 right-5 text-center text-[11px] text-mute">
          Корпус показан прозрачным · наведите на причину слева, чтобы увидеть узел
        </p>
      </div>
    </div>
  );
}
