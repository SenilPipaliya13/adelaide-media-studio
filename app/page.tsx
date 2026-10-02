import { Quote, Sparkles } from "lucide-react";
import { WireframeHub } from "@/components/wireframe-hub";
import { LAUNCH_APPLY_HASH } from "@/lib/catalog";
import { quoteOfTheDay } from "@/lib/quotes";

// Re-render hourly so the daily quote rolls over at Adelaide midnight without a client-side flash.
export const revalidate = 3600;

export default function HomePage() {
  const quote = quoteOfTheDay();

  return (
    <>
      <a
        href={LAUNCH_APPLY_HASH}
        className="block border-b border-copper/30 bg-copper/10 px-6 py-3 text-center text-sm text-ivory transition hover:bg-copper/20"
      >
        <Sparkles className="mr-2 inline h-4 w-4 align-[-2px] text-copper" />
        <span className="font-medium">Adelaide Launch Initiative:</span> 5 complimentary commercial
        sessions for local founders.{" "}
        <span className="whitespace-nowrap text-copper-light underline underline-offset-4">
          Apply now
        </span>
      </a>

      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(192,138,91,0.14),transparent_65%)]" />
        <div className="relative mx-auto max-w-4xl px-6 py-24 text-center md:py-32">
          <p className="text-xs font-medium uppercase tracking-[0.35em] text-copper">
            Boutique photography studio · Adelaide, South Australia
          </p>
          <h1 className="mt-6 font-serif text-6xl leading-none tracking-tight text-ivory md:text-8xl">
            SP Media <span className="text-copper">Co.</span>
          </h1>
          <p className="mx-auto mt-6 max-w-2xl text-lg text-slate-300">
            A small studio for people, places and businesses with a story worth telling. Shot on
            the full-frame Canon EOS R6 Mark III and edited by hand.
          </p>

          <figure className="mx-auto mt-14 max-w-2xl border-t border-slate-800 pt-10">
            <Quote aria-hidden className="mx-auto h-5 w-5 text-copper" />
            <blockquote className="mt-4 font-serif text-2xl italic leading-snug text-ivory-muted md:text-3xl">
              &ldquo;{quote.text}&rdquo;
            </blockquote>
            <figcaption className="mt-4 text-xs uppercase tracking-[0.3em] text-slate-400">
              {quote.author} · Today&apos;s quote
            </figcaption>
          </figure>
        </div>
      </section>

      <WireframeHub />
    </>
  );
}
