import Link from "next/link";
import { areas } from "@/lib/data/areas";

/** Схема Минска: кольцо МКАД, районы и пригороды. Не карта, а навигация по географии. */
export function MinskMap({ active, className = "" }: { active?: string; className?: string }) {
  return (
    <div className={`stage aspect-square w-full ${className}`}>
      <div className="grid-lines pointer-events-none absolute inset-0" aria-hidden />
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden>
        <ellipse cx="50" cy="50" rx="36" ry="33" fill="color-mix(in oklab, var(--accent) 6%, transparent)" stroke="var(--accent)" strokeOpacity=".35" strokeWidth=".35" strokeDasharray="1.2 1.2" />
        <path d="M22 30 C 38 40, 44 44, 50 50 S 66 62, 82 74" fill="none" stroke="#6fdcff" strokeOpacity=".25" strokeWidth=".8" />
        <path d="M8 50 L92 50 M50 10 L50 90 M20 20 L80 80 M80 20 L20 80" stroke="#fff" strokeOpacity=".05" strokeWidth=".3" />
        <text x="50" y="14.5" textAnchor="middle" fontSize="2.2" fill="#8b9ab0" letterSpacing=".4">МКАД</text>
      </svg>
      {areas.map((a) => {
        const on = a.slug === active;
        return (
          <Link
            key={a.slug}
            href={`/rajony/${a.slug}`}
            className="group absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: `${a.x}%`, top: `${a.y}%` }}
          >
            <span className="flex flex-col items-center gap-1">
              <span className="relative grid place-items-center">
                {on && <span className="absolute h-4 w-4 rounded-full" style={{ background: "var(--accent)", animation: "pulse-ring 1.8s ease-out infinite" }} />}
                <span
                  className={`relative rounded-full transition group-hover:scale-150 ${a.kind === "district" ? "h-2.5 w-2.5" : "h-1.5 w-1.5"}`}
                  style={{ background: on ? "var(--accent)" : a.kind === "district" ? "#eaf1f8" : "#8b9ab0" }}
                />
              </span>
              <span className={`whitespace-nowrap rounded-full px-2 py-0.5 text-[10px] transition sm:text-[11px] ${on ? "font-semibold text-ink" : "text-snow/75 group-hover:text-white"}`} style={on ? { background: "var(--accent)" } : undefined}>
                {a.name}
              </span>
            </span>
          </Link>
        );
      })}
    </div>
  );
}
