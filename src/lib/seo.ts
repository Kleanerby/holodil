import type { Metadata } from "next";
import { site } from "./site";

export function pageMetadata({
  title,
  description,
  path,
  keywords,
}: {
  title: string;
  description: string;
  path: string;
  keywords?: string[];
}): Metadata {
  return {
    title: { absolute: title },
    description,
    keywords,
    alternates: { canonical: path },
    openGraph: { type: "website", locale: site.locale, siteName: site.name, url: path, title, description },
    twitter: { card: "summary_large_image", title, description },
  };
}

export type Crumb = { name: string; path: string };

const abs = (p: string) => `${site.url}${p === "/" ? "" : p}`;

export function breadcrumbLd(crumbs: Crumb[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: crumbs.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: abs(c.path) })),
  };
}

export function faqLd(items: { q: string; a: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
  };
}

export function serviceLd({ name, description, path, from }: { name: string; description: string; path: string; from: number }) {
  return {
    "@context": "https://schema.org",
    "@type": "Service",
    name,
    description,
    url: abs(path),
    areaServed: { "@type": "City", name: "Минск" },
    provider: { "@id": `${site.url}/#business` },
    offers: { "@type": "Offer", priceCurrency: "BYN", price: from, priceSpecification: { "@type": "PriceSpecification", minPrice: from, priceCurrency: "BYN" } },
  };
}

/** TODO(content): добавить реальные адрес и geo; aggregateRating — только после появления настоящих отзывов. */
export function businessLd() {
  return {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "@id": `${site.url}/#business`,
    name: `${site.name} — ремонт холодильников`,
    url: site.url,
    telephone: site.phoneHref.replace("tel:", ""),
    email: site.email,
    priceRange: "30–500 BYN",
    currenciesAccepted: "BYN",
    openingHours: site.hoursSchema,
    address: { "@type": "PostalAddress", addressLocality: "Минск", addressCountry: "BY" },
    areaServed: [{ "@type": "City", name: "Минск" }, { "@type": "AdministrativeArea", name: "Минский район" }],
  };
}

export function articleLd({ title, description, path }: { title: string; description: string; path: string }) {
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    description,
    mainEntityOfPage: abs(path),
    author: { "@type": "Organization", name: site.name },
    publisher: { "@id": `${site.url}/#business` },
  };
}
