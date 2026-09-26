import Link from "next/link";
import { ArrowRight, Aperture, Film, Gauge, Heart, Home, Briefcase, Trophy } from "lucide-react";
import { InquiryForm } from "@/components/inquiry-form";
import { NICHES, formatAud } from "@/lib/pricing";

const VERTICALS = [
  {
    href: "/weddings",
    icon: Heart,
    title: "Weddings",
    body: "Barossa, McLaren Vale and Adelaide Hills celebrations, captured with an editorial eye.",
    price: `From ${formatAud(NICHES.weddings.base)}`,
  },
  {
    href: "/commercial",
    icon: Briefcase,
    title: "Commercial",
    body: "Headshots, events and brand content for Lot Fourteen startups and CBD businesses.",
    price: `From ${formatAud(NICHES.commercial.base)}`,
  },
  {
    href: "/real-estate",
    icon: Home,
    title: "Real Estate",
    body: "HDR stills, drone cutaways and an agent reel in a single listing package.",
    price: `${formatAud(NICHES["real-estate"].base)} package`,
  },
  {
    href: "/sports",
    icon: Trophy,
    title: "Sports",
    body: "SANFL, athletics and Gather Round action, plus team media days.",
    price: `From ${formatAud(NICHES.sports.base)}`,
  },
];

const GEAR = [
  { icon: Aperture, stat: "32.5MP", label: "Full-frame sensor" },
  { icon: Gauge, stat: "40fps", label: "Electronic burst" },
  { icon: Film, stat: "7K", label: "Video capture" },
];

export default function HomePage() {
  return (
    <>
      <section className="relative overflow-hidden border-b border-slate-800">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(192,138,91,0.15),transparent_60%)]" />
        <div className="relative mx-auto max-w-6xl px-6 py-28 md:py-40">
          <p className="text-xs font-medium uppercase tracking-[0.3em] text-copper">
            Adelaide · South Australia
          </p>
          <h1 className="mt-6 max-w-4xl font-serif text-5xl leading-[1.05] text-ivory md:text-7xl">
            Photography & video for the moments that matter.
          </h1>
          <p className="mt-6 max-w-2xl text-lg text-slate-300">
            SP Media Co. covers weddings, businesses, property and sport across Adelaide and
            regional South Australia with one studio and one standard.
          </p>
          <div className="mt-10 flex flex-wrap gap-4">
            <a
              href="#inquire"
              className="inline-flex items-center gap-2 rounded-md bg-copper px-6 py-3 text-sm font-medium text-obsidian-950 transition hover:bg-copper-light"
            >
              Get an instant quote <ArrowRight className="h-4 w-4" />
            </a>
            <a
              href="#work"
              className="rounded-md border border-slate-600 px-6 py-3 text-sm text-ivory transition hover:border-ivory"
            >
              What we shoot
            </a>
          </div>
        </div>
      </section>

      <section id="work" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
        <h2 className="font-serif text-3xl text-ivory md:text-4xl">Four specialties, one studio</h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {VERTICALS.map(({ href, icon: Icon, title, body, price }) => (
            <Link
              key={href}
              href={href}
              className="group rounded-xl border border-slate-800 bg-obsidian-900 p-8 transition hover:border-copper/60"
            >
              <Icon className="h-6 w-6 text-copper" />
              <h3 className="mt-5 font-serif text-2xl text-ivory">{title}</h3>
              <p className="mt-2 text-slate-300">{body}</p>
              <div className="mt-6 flex items-center justify-between text-sm">
                <span className="text-slate-400">{price}</span>
                <span className="inline-flex items-center gap-1 text-copper transition group-hover:gap-2">
                  Explore <ArrowRight className="h-4 w-4" />
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="border-y border-slate-800 bg-obsidian-900">
        <div className="mx-auto grid max-w-6xl gap-10 px-6 py-20 md:grid-cols-[1.2fr_2fr] md:items-center">
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.3em] text-copper">The kit</p>
            <h2 className="mt-4 font-serif text-3xl text-ivory">Shot on the Canon EOS R6 Mark III</h2>
            <p className="mt-4 text-slate-300">
              A full-frame body that handles a candlelit reception and a SANFL goal-square contest
              equally well. Every client gets the same flagship-level files.
            </p>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {GEAR.map(({ icon: Icon, stat, label }) => (
              <div key={label} className="rounded-xl border border-slate-800 bg-obsidian-950 p-6 text-center">
                <Icon className="mx-auto h-5 w-5 text-copper" />
                <p className="mt-3 font-serif text-3xl text-ivory">{stat}</p>
                <p className="mt-1 text-xs text-slate-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="inquire" className="mx-auto max-w-6xl scroll-mt-24 px-6 py-24">
        <h2 className="font-serif text-3xl text-ivory md:text-4xl">Build your quote</h2>
        <p className="mb-10 mt-3 text-slate-300">
          Pick your shoot, location and add-ons to see a price instantly, then send it through.
        </p>
        <InquiryForm />
      </section>
    </>
  );
}
