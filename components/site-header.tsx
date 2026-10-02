import Link from "next/link";

const NAV = [
  { href: "/weddings", label: "Weddings" },
  { href: "/commercial", label: "Commercial" },
  { href: "/real-estate", label: "Real Estate" },
  { href: "/sports", label: "Sports" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-line bg-canvas/85 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="font-serif text-xl font-medium tracking-[0.12em] text-carbon">
          SP MEDIA <span className="text-brass-deep">CO.</span>
        </Link>
        <nav className="hidden gap-8 text-[11px] uppercase tracking-[0.2em] text-ink-muted md:flex">
          {NAV.map((item) => (
            <Link key={item.href} href={item.href} className="transition hover:text-carbon">
              {item.label}
            </Link>
          ))}
        </nav>
        <Link
          href="/#reserve"
          className="rounded-full border border-carbon px-5 py-2 text-[11px] font-medium uppercase tracking-[0.2em] text-carbon transition hover:bg-carbon hover:text-canvas"
        >
          Reserve
        </Link>
      </div>
      <nav className="flex justify-center gap-5 border-t border-line py-2 text-[11px] uppercase tracking-[0.15em] text-ink-muted md:hidden">
        {NAV.map((item) => (
          <Link key={item.href} href={item.href}>
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}
