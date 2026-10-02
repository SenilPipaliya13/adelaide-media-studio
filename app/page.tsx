import { BadgeCheck, Mail, MessageCircle, Phone, Quote, type LucideIcon } from "lucide-react";
import { StudioTabs } from "@/components/studio-tabs";
import { STUDIO_EMAIL, STUDIO_PHONE, STUDIO_TEL_HREF, STUDIO_WHATSAPP_HREF } from "@/lib/contact";
import { quoteOfTheDay } from "@/lib/quotes";
import { ABN } from "@/lib/seo";

// Re-render hourly so the daily quote rolls over at Adelaide midnight without a client-side flash.
export const revalidate = 3600;

export default function HomePage() {
  const quote = quoteOfTheDay();

  return (
    <div className="bg-canvas">
      <header className="relative overflow-hidden px-6 pb-16 pt-20 text-center md:pb-20 md:pt-28">
        {/* Soft brass glow behind the masthead */}
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-0 h-[28rem] w-[56rem] -translate-x-1/2 -translate-y-1/2 rounded-full bg-brass/15 blur-3xl"
        />
        <div className="relative">
          <h1 className="font-serif text-5xl font-medium tracking-[0.18em] text-carbon md:text-7xl">SP MEDIA CO.</h1>
          <div aria-hidden className="mx-auto mt-6 h-px w-16 bg-brass" />
          <p className="mt-6 text-[11px] uppercase tracking-[0.3em] text-ink-muted md:text-xs">
            Adelaide, South Australia · Commercial, Spaces &amp; Event Studio
          </p>

          <figure className="mx-auto mt-14 max-w-2xl rounded-xl border border-line bg-white/80 px-8 py-10 shadow-ambient backdrop-blur md:px-14">
            <Quote aria-hidden className="mx-auto h-5 w-5 text-brass" strokeWidth={1.5} />
            <blockquote className="mt-5 font-serif text-2xl italic leading-snug text-carbon md:text-3xl">
              &ldquo;{quote.text}&rdquo;
            </blockquote>
            <figcaption className="mt-6 text-[11px] uppercase tracking-[0.3em] text-brass-deep">
              {quote.author} · Quote of the day
            </figcaption>
          </figure>
        </div>
      </header>

      <StudioTabs />

      <section id="contact" className="scroll-mt-24 border-t border-line bg-stone/40">
        <div className="mx-auto max-w-6xl px-6 py-20">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-[11px] uppercase tracking-[0.3em] text-brass-deep">The Adelaide Studio Guarantee</p>
            <h2 className="mt-4 font-serif text-4xl leading-tight text-carbon md:text-5xl">
              A real studio, with real people behind it.
            </h2>
            <p className="mt-4 leading-relaxed text-ink-muted">
              Registered, local and easy to reach. Talk to us directly before you book anything.
            </p>
          </div>

          <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <GuaranteeItem icon={BadgeCheck} label="ABN registered" value={`ABN ${ABN}`} />
            <GuaranteeItem icon={Phone} label="Direct phone" value={STUDIO_PHONE} href={STUDIO_TEL_HREF} />
            <GuaranteeItem
              icon={MessageCircle}
              label="WhatsApp"
              value="Message the studio"
              href={STUDIO_WHATSAPP_HREF}
              external
            />
            <GuaranteeItem icon={Mail} label="Email" value={STUDIO_EMAIL} href={`mailto:${STUDIO_EMAIL}`} />
          </ul>
        </div>
      </section>
    </div>
  );
}

function GuaranteeItem({
  icon: Icon,
  label,
  value,
  href,
  external,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  href?: string;
  external?: boolean;
}) {
  const body = (
    <>
      <Icon aria-hidden className="h-5 w-5 text-brass-deep" strokeWidth={1.5} />
      <span className="mt-5 block text-[11px] uppercase tracking-[0.2em] text-ink-muted">{label}</span>
      <span className="mt-1 block break-words font-serif text-xl text-carbon">{value}</span>
    </>
  );
  const className = "block h-full rounded-xl border border-line bg-white p-6 shadow-ambient";

  return (
    <li>
      {href ? (
        <a
          href={href}
          {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
          className={`${className} transition duration-300 hover:-translate-y-0.5 hover:border-brass/60 hover:shadow-lifted focus:outline-none focus-visible:ring-2 focus-visible:ring-brass/50`}
        >
          {body}
        </a>
      ) : (
        <div className={className}>{body}</div>
      )}
    </li>
  );
}
