import { WireframeHub } from "@/components/wireframe-hub";
import { quoteOfTheDay } from "@/lib/quotes";

// Re-render hourly so the daily quote rolls over at Adelaide midnight without a client-side flash.
export const revalidate = 3600;

export default function HomePage() {
  const quote = quoteOfTheDay();

  return (
    <div className="min-h-screen bg-obsidian-925">
      <header className="px-6 pt-16 text-center">
        <p className="text-sm font-medium uppercase tracking-[0.45em] text-ivory">SP Media Co.</p>
        <p className="mt-2 text-xs uppercase tracking-[0.3em] text-slate-400">Adelaide, South Australia</p>
      </header>

      <section className="mx-auto max-w-3xl px-6 py-16 text-center md:py-20">
        <h1 className="font-serif text-4xl tracking-tight text-ivory md:text-6xl">Welcome to SP Media Co.</h1>
        <figure className="mx-auto mt-10 max-w-2xl">
          <blockquote className="font-serif text-xl italic leading-snug text-ivory-muted md:text-2xl">
            &ldquo;{quote.text}&rdquo;
          </blockquote>
          <figcaption className="mt-4 text-xs uppercase tracking-[0.3em] text-copper">— {quote.author}</figcaption>
        </figure>
      </section>

      <WireframeHub />
    </div>
  );
}
