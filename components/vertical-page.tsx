import type { LucideIcon } from "lucide-react";
import { InquiryForm } from "@/components/inquiry-form";
import { JsonLd } from "@/components/json-ld";
import { NICHES, type Niche } from "@/lib/catalog";
import { BUSINESS_NAME, SITE_URL } from "@/lib/seo";

export interface VerticalPageProps {
  niche: Niche;
  eyebrow: string;
  title: string;
  intro: string;
  highlights: { icon: LucideIcon; title: string; body: string }[];
  locations: string[];
  priceNote?: string;
  // Featured selling point shown as a bullet under the hero CTA.
  callout?: { icon: LucideIcon; text: string };
}

export function VerticalPage({
  niche,
  eyebrow,
  title,
  intro,
  highlights,
  locations,
  priceNote,
  callout,
}: VerticalPageProps) {
  const serviceSchema = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${NICHES[niche].label} photography & video`,
    provider: { "@id": `${SITE_URL}/#business`, name: BUSINESS_NAME },
    areaServed: locations.map((name) => ({ "@type": "Place", name })),
    url: `${SITE_URL}/${niche}`,
  };

  return (
    <>
      <JsonLd data={serviceSchema} />

      <section className="border-b border-line bg-gradient-to-b from-stone/70 to-canvas">
        <div className="mx-auto max-w-6xl px-6 py-24 md:py-32">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-brass-deep">{eyebrow}</p>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-tight text-carbon md:text-6xl">
            {title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-carbon/75">{intro}</p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#inquire"
              className="rounded-full bg-carbon px-6 py-3 text-sm font-medium tracking-wide text-canvas shadow-ambient transition hover:bg-carbon-soft"
            >
              Request a tailored quote
            </a>
            <p className="text-sm text-ink-muted">
              {priceNote ?? "Bespoke proposals, quoted to your brief"}
            </p>
          </div>
          {callout && (
            <p className="mt-8 flex max-w-2xl items-start gap-3 rounded-xl border border-brass/50 bg-brass/10 px-4 py-3 text-sm text-carbon">
              <callout.icon className="mt-0.5 h-5 w-5 shrink-0 text-brass-deep" />
              {callout.text}
            </p>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <div className="grid gap-6 md:grid-cols-3">
          {highlights.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-xl border border-line bg-white p-6 shadow-ambient">
              <Icon className="h-6 w-6 text-brass-deep" />
              <h2 className="mt-4 font-serif text-xl text-carbon">{title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-carbon/75">{body}</p>
            </div>
          ))}
        </div>
        <div className="mt-12 flex flex-wrap gap-2">
          {locations.map((loc) => (
            <span
              key={loc}
              className="rounded-full border border-line bg-white px-3 py-1 text-xs text-carbon/80"
            >
              {loc}
            </span>
          ))}
        </div>
      </section>

      <section id="inquire" className="scroll-mt-24 border-t border-line bg-stone/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <h2 className="mb-8 font-serif text-3xl text-carbon">Tell us about your shoot</h2>
          <InquiryForm defaultNiche={niche} />
        </div>
      </section>
    </>
  );
}
