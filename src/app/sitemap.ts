import type { MetadataRoute } from "next";
import { areas } from "@/lib/data/areas";
import { articles } from "@/lib/data/articles";
import { brands } from "@/lib/data/brands";
import { combos } from "@/lib/data/combos";
import { faults } from "@/lib/data/faults";
import { services } from "@/lib/data/services";
import { tech } from "@/lib/data/tech";
import { routes, site } from "@/lib/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const url = (p: string, priority: number, changeFrequency: "weekly" | "monthly" = "monthly") => ({
    url: `${site.url}${p === "/" ? "" : p}`, lastModified: now, changeFrequency, priority,
  });
  return [
    url("/", 1, "weekly"),
    url(routes.prices, 0.9, "weekly"),
    ...[routes.services, routes.faults, routes.brands, routes.areas, routes.tech].map((p) => url(p, 0.8, "weekly")),
    ...services.map((s) => url(`${routes.services}/${s.slug}`, 0.8)),
    ...faults.map((f) => url(`${routes.faults}/${f.slug}`, 0.8)),
    ...brands.map((b) => url(`${routes.brands}/${b.slug}`, 0.7)),
    ...combos.map((c) => url(`${routes.brands}/${c.brand}/${c.fault}`, 0.7)),
    ...tech.map((t) => url(`${routes.tech}/${t.slug}`, 0.7)),
    ...areas.map((a) => url(`${routes.areas}/${a.slug}`, 0.6)),
    ...[routes.reviews, routes.about, routes.warranty, routes.contacts, routes.blog].map((p) => url(p, 0.5)),
    ...articles.map((a) => url(`${routes.blog}/${a.slug}`, 0.5)),
  ];
}
