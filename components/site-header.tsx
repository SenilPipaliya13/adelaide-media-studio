import Link from "next/link";

const NAV = [
  { href: "/weddings", label: "Weddings" },
  { href: "/commercial", label: "Commercial" },
  { href: "/real-estate", label: "Real Estate" },
  { href: "/sports", label: "Sports" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-slate-800 bg-obsidian-950/85 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-xl tracking-wide text-ivory">
          SP Media <span className="text-copper">Co.</span>
        </Link>
        <nav className="hidden gap-6 text-sm text-slate-300 md:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-ivory">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/#inquire"
          className="rounded-md border border-copper px-4 py-2 text-sm text-copper transition hover:bg-copper hover:text-obsidian-950"
        >
          Get a quote
        </Link>
      </div>
      <nav className="flex justify-center gap-5 border-t border-slate-800 py-2 text-xs text-slate-300 md:hidden">
        {NAV.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
