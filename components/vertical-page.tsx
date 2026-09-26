import type { LucideIcon } from "lucide-react";
import { InquiryForm } from "@/components/inquiry-form";
import { JsonLd } from "@/components/json-ld";
import { NICHES, formatAud, type Niche } from "@/lib/pricing";
import { BUSINESS_NAME, SITE_URL } from "@/lib/seo";

export interface VerticalPageProps {
  niche: Niche;
  eyebrow: string;
  title: string;
  intro: string;
  highlights: { icon: LucideIcon; title: string; body: string }[];
  locations: string[];
  priceNote?: string;
}

export function VerticalPage({
  niche,
  eyebrow,
  title,
  intro,
  highlights,
  locations,
  priceNote,
}: VerticalPageProps) {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${NICHES[niche].label} photography & video`,
    provider: { "@id": `${SITE_URL}/#business`, name: BUSINESS_NAME },
    areaServed: locations.map((name) => ({ "@type": "Place", name })),
    url: `${SITE_URL}/${niche}`,
    offers: {
      "@type": "Offer",
      price: NICHES[niche].base,
      priceCurrency: "AUD",
    },
  };

  return (
    <>
      <JsonLd data={serviceSchema} />

      <section className="border-b border-slate-800 bg-gradient-to-b from-obsidian-900 to-obsidian-950">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-copper">{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight text-ivory md:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-300">{intro}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#inquire"
              className="rounded-md bg-copper px-5 py-3 text-sm font-medium text-obsidian-950 transition hover:bg-copper-light"
            >
              Get an instant estimate
            </a>
            <p className="text-sm text-slate-400">
              {priceNote ?? `From ${formatAud(NICHES[niche].base)} AUD`}
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-xl border border-slate-800 bg-obsidian-900 p-6">
              <Icon className="h-6 w-6 text-copper" />
              <h2 className="mt-4 font-serif text-xl text-ivory">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-slate-300">{body}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-2">
          {locations.map((loc) => (
            <span
              key={loc}
              className="rounded-full border border-slate-700 px-3 py-1 text-xs text-slate-300"
            >
              {loc}
            </span>
          ))}
        </div>
      </section>

      <section id="inquire" className="scroll-mt-24 border-t border-slate-800 bg-obsidian-900/50">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="mb-8 font-serif text-3xl text-ivory">Build your quote</h2>
          <InquiryForm defaultNiche={niche} />
        </div>
      </section>
    </>
  );
}
