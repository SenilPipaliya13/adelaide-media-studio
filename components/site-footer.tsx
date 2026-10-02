import Link from "next/link";
import { ABN } from "@/lib/seo";

export function SiteFooter() {
  return (
    <footer className="border-t border-line-dark bg-carbon text-canvas/60">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-6 py-12 text-sm md:flex-row md:items-center md:justify-between">
        <p>
          <span className="font-serif text-lg tracking-[0.12em] text-canvas">SP MEDIA CO.</span>
          <span className="mt-1 block text-xs">{`ABN ${ABN} · Adelaide, South Australia`}</span>
        </p>
        <div className="flex gap-6 text-[11px] uppercase tracking-[0.2em]">
          <Link href="/weddings" className="transition hover:text-brass">Weddings</Link>
          <Link href="/commercial" className="transition hover:text-brass">Commercial</Link>
          <Link href="/real-estate" className="transition hover:text-brass">Real Estate</Link>
          <Link href="/sports" className="transition hover:text-brass">Sports</Link>
        </div>
        <p className="text-xs">© {new Date().getFullYear()} SP Media Co.</p>
      </div>
    </footer>
  );
}
