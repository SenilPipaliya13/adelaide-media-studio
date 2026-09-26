import Link from "next/link";
import { ABN } from "@/lib/seo";

export function SiteFooter() {
  return (
    <footer className="border-t border-slate-800 bg-obsidian-950">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-6 py-10 text-sm text-slate-400 md:flex-row md:items-center md:justify-between">
        <p>
          <span className="font-serif text-ivory">SP Media Co.</span>
          {` · ABN ${ABN} · Adelaide, South Australia`}
        </p>
        <div className="flex gap-5">
          <Link href="/weddings" className="hover:text-ivory">Weddings</Link>
          <Link href="/commercial" className="hover:text-ivory">Commercial</Link>
          <Link href="/real-estate" className="hover:text-ivory">Real Estate</Link>
          <Link href="/sports" className="hover:text-ivory">Sports</Link>
        </div>
        <p>© {new Date().getFullYear()} SP Media Co.</p>
      </div>
    </footer>
  );
}
