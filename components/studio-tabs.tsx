"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { Aperture, ArrowRight, Clock, Images, LockKeyhole, SunMedium, type LucideIcon } from "lucide-react";
import { BookingConcierge, DISCIPLINE_ICONS } from "@/components/booking-concierge";
import { HUB_SERVICES, HUB_SERVICE_KEYS, LAUNCH_APPLY_HASH, type HubService } from "@/lib/catalog";

const TABS = [
  { key: "disciplines", label: "Our Disciplines" },
  { key: "craft", label: "About The Craft" },
  { key: "reserve", label: "Reserve Session" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

// Older links (#services, #book, #inquire, the retired launch hash) still land on the right tab.
const HASH_TO_TAB: Record<string, TabKey> = {
  "#disciplines": "disciplines",
  "#services": "disciplines",
  "#craft": "craft",
  "#about": "craft",
  "#reserve": "reserve",
  "#book": "reserve",
  "#inquire": "reserve",
  [LAUNCH_APPLY_HASH]: "reserve",
};

// What every client receives, whatever the discipline.
const INCLUDED: { icon: LucideIcon; title: string; body: string }[] = [
  {
    icon: Aperture,
    title: "Canon full-frame glass & natural studio light",
    body: "Shot full-frame on the Canon EOS R6 Mark III, shaped by natural and soft studio light.",
  },
  {
    icon: SunMedium,
    title: "Hand-graded high-resolution digital masters",
    body: "Every frame you receive is individually selected and colour-graded by hand, with no watermarks.",
  },
  {
    icon: LockKeyhole,
    title: "Private, password-protected download gallery",
    body: "Your images arrive in a private online gallery you can share with the people who matter.",
  },
  {
    icon: Clock,
    title: "Transparent turnaround times",
    body: "24–48 hours for real estate and spaces. 3–5 days for events and hospitality. Agreed before the shoot.",
  },
];

const PROCESS = [
  {
    title: "Your story",
    body: "It starts with a conversation. We learn who you are, what the images are for and where they'll live, then plan the session around it.",
  },
  {
    title: "The session",
    body: "Full-frame Canon glass and as much natural light as the space allows. We work quietly so the moments stay real.",
  },
  {
    title: "The grade",
    body: "Back at the studio each selected frame is hand-graded for true colour and skin tone, then exported as a high-resolution master.",
  },
  {
    title: "Delivery",
    body: "Your masters arrive in a private, password-protected gallery, inside the turnaround we agreed at the start.",
  },
];

export function StudioTabs() {
  const id = useId();
  const [tab, setTab] = useState<TabKey>("disciplines");
  const [preset, setPreset] = useState<{ service: HubService; nonce: number }>();
  const sectionRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<Record<TabKey, HTMLButtonElement | null>>({ disciplines: null, craft: null, reserve: null });

  useEffect(() => {
    function applyHash() {
      const target = HASH_TO_TAB[window.location.hash];
      if (!target) return;
      setTab(target);
      sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  function openTab(key: TabKey, focus = false) {
    setTab(key);
    if (focus) tabRefs.current[key]?.focus();
  }

  function reserve(service?: HubService) {
    if (service) setPreset({ service, nonce: Date.now() });
    setTab("reserve");
    sectionRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  // WAI-ARIA tabs pattern with automatic activation.
  function onTabKeyDown(e: React.KeyboardEvent<HTMLButtonElement>) {
    const i = TABS.findIndex((t) => t.key === tab);
    let next: number | null = null;
    if (e.key === "ArrowRight") next = (i + 1) % TABS.length;
    if (e.key === "ArrowLeft") next = (i - 1 + TABS.length) % TABS.length;
    if (e.key === "Home") next = 0;
    if (e.key === "End") next = TABS.length - 1;
    if (next === null) return;
    e.preventDefault();
    openTab(TABS[next].key, true);
  }

  return (
    <section id="studio" ref={sectionRef} className="mx-auto max-w-6xl scroll-mt-32 px-6 pb-24 md:scroll-mt-24">
      <div className="flex justify-center">
        <div
          role="tablist"
          aria-label="Studio"
          className="grid w-full max-w-md grid-cols-3 gap-1 rounded-2xl border border-line bg-white/70 p-1.5 shadow-ambient backdrop-blur sm:inline-flex sm:w-auto sm:max-w-none sm:rounded-full"
        >
          {TABS.map((t) => (
            <button
              key={t.key}
              ref={(el) => {
                tabRefs.current[t.key] = el;
              }}
              id={`${id}-tab-${t.key}`}
              role="tab"
              type="button"
              aria-selected={tab === t.key}
              aria-controls={`${id}-panel-${t.key}`}
              tabIndex={tab === t.key ? 0 : -1}
              onClick={() => openTab(t.key)}
              onKeyDown={onTabKeyDown}
              className={`rounded-xl px-2 py-2.5 text-[10px] font-medium uppercase leading-tight tracking-[0.12em] transition duration-300 focus:outline-none focus-visible:ring-2 focus-visible:ring-brass/50 sm:rounded-full sm:px-6 sm:text-[11px] sm:tracking-[0.2em] ${
                tab === t.key ? "bg-carbon text-canvas shadow-sm" : "text-ink-muted hover:bg-stone/60 hover:text-carbon"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {TABS.map((t) => (
        <div
          key={t.key}
          id={`${id}-panel-${t.key}`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${t.key}`}
          hidden={tab !== t.key}
          tabIndex={0}
          className="mt-14 focus:outline-none motion-safe:animate-fade-in"
        >
          {t.key === "disciplines" && <DisciplinesPanel onReserve={reserve} />}
          {t.key === "craft" && <CraftPanel onReserve={() => reserve()} />}
          {t.key === "reserve" && <BookingConcierge preset={preset} />}
        </div>
      ))}
    </section>
  );
}

function SectionIntro({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="mx-auto max-w-2xl text-center">
      <p className="text-[11px] uppercase tracking-[0.3em] text-brass-deep">{eyebrow}</p>
      <h2 className="mt-4 font-serif text-4xl leading-tight text-carbon md:text-5xl">{title}</h2>
      <p className="mt-4 leading-relaxed text-ink-muted">{body}</p>
    </div>
  );
}

function DisciplinesPanel({ onReserve }: { onReserve: (service: HubService) => void }) {
  return (
    <div>
      <SectionIntro
        eyebrow="Our Disciplines"
        title="Four disciplines, one standard of craft."
        body="Every commission is shot, graded and delivered by the same small Adelaide studio. Here is exactly what you receive."
      />

      <div className="mt-14 grid gap-6 md:grid-cols-2">
        {HUB_SERVICE_KEYS.map((key, i) => {
          const Icon = DISCIPLINE_ICONS[key];
          const { label, scope, points, turnaround, href } = HUB_SERVICES[key];
          return (
            <article
              key={key}
              className="group flex flex-col rounded-xl border border-line bg-white p-7 shadow-ambient transition duration-500 hover:-translate-y-0.5 hover:shadow-lifted md:p-9"
            >
              <div className="flex items-start justify-between gap-4">
                <span className="font-serif text-lg text-brass-deep">{String(i + 1).padStart(2, "0")}</span>
                <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line text-brass-deep transition group-hover:border-brass/60">
                  <Icon aria-hidden className="h-5 w-5" strokeWidth={1.5} />
                </span>
              </div>
              <h3 className="mt-6 font-serif text-3xl text-carbon">{label}</h3>
              <p className="mt-1 text-sm text-ink-muted">{scope}</p>
              <ul className="mt-6 space-y-3 border-t border-line pt-6 text-sm leading-relaxed text-carbon/80">
                {points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span aria-hidden className="mt-2 h-px w-3 shrink-0 bg-brass" />
                    {point}
                  </li>
                ))}
              </ul>
              <p className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-stone/60 px-3 py-1 text-[11px] uppercase tracking-[0.15em] text-carbon/80">
                <Clock aria-hidden className="h-3.5 w-3.5 text-brass-deep" />
                Delivered in {turnaround}
              </p>
              <div className="mt-auto flex flex-wrap items-center gap-x-6 gap-y-3 pt-8">
                <button
                  type="button"
                  onClick={() => onReserve(key)}
                  className="inline-flex items-center gap-2 rounded-full bg-carbon px-5 py-2.5 text-sm text-canvas transition hover:bg-carbon-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2"
                >
                  Reserve this session <ArrowRight className="h-4 w-4" />
                </button>
                {href && (
                  <Link
                    href={href}
                    className="inline-flex items-center gap-1 text-sm text-brass-deep underline-offset-4 transition hover:underline"
                  >
                    See the work
                  </Link>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <div className="mt-20 rounded-xl border border-line-dark bg-carbon px-7 py-12 text-canvas md:px-12">
        <p className="text-center text-[11px] uppercase tracking-[0.3em] text-brass">What every session includes</p>
        <ul className="mt-10 grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {INCLUDED.map(({ icon: Icon, title, body }) => (
            <li key={title}>
              <Icon aria-hidden className="h-6 w-6 text-brass" strokeWidth={1.25} />
              <h3 className="mt-4 font-serif text-xl leading-snug">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-canvas/65">{body}</p>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function CraftPanel({ onReserve }: { onReserve: () => void }) {
  return (
    <div>
      <SectionIntro
        eyebrow="About The Craft"
        title="Slow, considered, made in Adelaide."
        body="SP Media Co. is a boutique studio, not a production line. The same small team looks after your session from the first conversation to the final file."
      />

      <ol className="mx-auto mt-14 grid max-w-5xl gap-px overflow-hidden rounded-xl border border-line bg-line md:grid-cols-2">
        {PROCESS.map((step, i) => (
          <li key={step.title} className="bg-white p-8 md:p-10">
            <span className="font-serif text-5xl text-brass">{String(i + 1).padStart(2, "0")}</span>
            <h3 className="mt-4 font-serif text-2xl text-carbon">{step.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-muted">{step.body}</p>
          </li>
        ))}
      </ol>

      <div className="mx-auto mt-14 flex max-w-5xl flex-col items-center justify-between gap-6 rounded-xl border border-line bg-stone/40 px-8 py-8 text-center md:flex-row md:text-left">
        <div className="flex items-center gap-4">
          <Images aria-hidden className="hidden h-8 w-8 shrink-0 text-brass-deep md:block" strokeWidth={1.25} />
          <p className="font-serif text-2xl text-carbon">Have a story worth photographing?</p>
        </div>
        <button
          type="button"
          onClick={onReserve}
          className="inline-flex items-center gap-2 rounded-full bg-carbon px-6 py-3 text-sm text-canvas transition hover:bg-carbon-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2"
        >
          Reserve Session <ArrowRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}
