"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  Briefcase,
  Check,
  Home,
  Loader2,
  Mail,
  MessageCircle,
  PartyPopper,
  Phone,
  Send,
  Sparkles,
  User,
  X,
} from "lucide-react";
import { SuburbCombobox } from "@/components/suburb-combobox";
import {
  HUB_SERVICES,
  HUB_SERVICE_KEYS,
  LAUNCH_APPLY_HASH,
  LAUNCH_NICHE,
  NICHES,
  type HubService,
} from "@/lib/catalog";
import { STUDIO_EMAIL, STUDIO_PHONE, STUDIO_TEL_HREF, STUDIO_WHATSAPP_HREF } from "@/lib/contact";
import type { Suburb } from "@/lib/sa-suburbs";

const TABS = [
  { key: "services", label: "Our Services" },
  { key: "book", label: "Book a Session" },
  { key: "contact", label: "Contact" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

// The old "#inquire" anchor (existing links and bookmarks) opens the booking tab.
const HASH_TO_TAB: Record<string, TabKey> = {
  "#services": "services",
  "#book": "book",
  "#inquire": "book",
  "#contact": "contact",
  [LAUNCH_APPLY_HASH]: "book",
};

const SERVICE_ICONS: Record<HubService, typeof Briefcase> = {
  commercial: Briefcase,
  "real-estate": Home,
  celebrations: PartyPopper,
  portraits: User,
};

const inputClass =
  "w-full rounded-md border border-slate-600/60 bg-obsidian-900 px-3 py-2 text-sm text-ivory placeholder:text-slate-400 focus:border-copper focus:outline-none focus:ring-1 focus:ring-copper";

export function WireframeHub() {
  const id = useId();
  const [tab, setTab] = useState<TabKey>("services");
  const [interest, setInterest] = useState<HubService | null>(null);
  const [launch, setLaunch] = useState(false);
  const hubRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<Record<TabKey, HTMLButtonElement | null>>({ services: null, book: null, contact: null });

  // Deep links (#book, #contact, the launch CTA hash) open the matching tab.
  useEffect(() => {
    function applyHash() {
      const hash = window.location.hash;
      const target = HASH_TO_TAB[hash];
      if (!target) return;
      setTab(target);
      if (hash === LAUNCH_APPLY_HASH) {
        setLaunch(true);
        // Swap the hash so a second click on the launch CTA fires hashchange again.
        history.replaceState(null, "", `${window.location.pathname}${window.location.search}#book`);
      }
      hubRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }
    applyHash();
    window.addEventListener("hashchange", applyHash);
    return () => window.removeEventListener("hashchange", applyHash);
  }, []);

  function openTab(key: TabKey, focus = false) {
    setTab(key);
    if (focus) tabRefs.current[key]?.focus();
  }

  // Arrow keys move between tabs (WAI-ARIA tabs pattern, automatic activation).
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

  function bookService(key: HubService) {
    setInterest(key);
    setLaunch(false);
    openTab("book");
    hubRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  return (
    <section id="studio" ref={hubRef} className="mx-auto max-w-6xl scroll-mt-24 px-6 py-20">
      <div
        role="tablist"
        aria-label="Studio hub"
        className="mx-auto flex w-full max-w-xl rounded-full border border-slate-700/60 bg-obsidian-900 p-1"
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
            className={`flex-1 rounded-full px-3 py-2.5 text-sm transition focus:outline-none focus-visible:ring-2 focus-visible:ring-copper ${
              tab === t.key ? "bg-copper text-obsidian-950" : "text-slate-300 hover:text-ivory"
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      {TABS.map((t) => (
        <div
          key={t.key}
          id={`${id}-panel-${t.key}`}
          role="tabpanel"
          aria-labelledby={`${id}-tab-${t.key}`}
          hidden={tab !== t.key}
          tabIndex={0}
          className="mt-12 focus:outline-none"
        >
          {t.key === "services" && <ServicesPanel onBook={bookService} />}
          {t.key === "book" && (
            <BookPanel
              interest={interest}
              onClearInterest={() => setInterest(null)}
              launch={launch}
              onClearLaunch={() => setLaunch(false)}
            />
          )}
          {t.key === "contact" && <ContactPanel />}
        </div>
      ))}
    </section>
  );
}

function ServicesPanel({ onBook }: { onBook: (key: HubService) => void }) {
  return (
    <div className="grid gap-6 sm:grid-cols-2">
      {HUB_SERVICE_KEYS.map((key) => {
        const { label, body, href } = HUB_SERVICES[key];
        const Icon = SERVICE_ICONS[key];
        return (
          <article
            key={key}
            className="group flex flex-col rounded-2xl border border-slate-800 bg-obsidian-900 p-8 transition hover:border-copper/60"
          >
            <Icon className="h-6 w-6 text-copper" />
            <h3 className="mt-5 font-serif text-2xl text-ivory">{label}</h3>
            <p className="mt-2 flex-1 text-slate-300">{body}</p>
            <div className="mt-6 flex items-center justify-between gap-4 text-sm">
              <button
                type="button"
                onClick={() => onBook(key)}
                className="inline-flex items-center gap-1 text-copper transition hover:gap-2"
              >
                Book a session <ArrowRight className="h-4 w-4" />
              </button>
              {href && (
                <Link href={href} className="text-slate-400 underline-offset-4 transition hover:text-ivory hover:underline">
                  See the work
                </Link>
              )}
            </div>
          </article>
        );
      })}
    </div>
  );
}

type Status =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success"; reference: string; message: string }
  | { state: "error"; message: string; fields?: Record<string, string> };

function BookPanel({
  interest,
  onClearInterest,
  launch,
  onClearLaunch,
}: {
  interest: HubService | null;
  onClearInterest: () => void;
  launch: boolean;
  onClearLaunch: () => void;
}) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [suburb, setSuburb] = useState<Suburb | null>(null);
  const [story, setStory] = useState("");
  const [status, setStatus] = useState<Status>({ state: "idle" });

  const fieldErrors = status.state === "error" ? status.fields ?? {} : {};

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ state: "submitting" });
    try {
      const res = await fetch("/api/inquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "studio-hub",
          niche: launch ? LAUNCH_NICHE : undefined,
          interest: launch ? undefined : interest ?? undefined,
          firstName,
          lastName,
          email,
          phone,
          suburb: suburb ? { name: suburb.name, postcode: suburb.postcode } : null,
          message: story,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({ state: "error", message: data.error ?? "Something went wrong.", fields: data.fields });
        return;
      }
      setStatus({ state: "success", reference: data.reference, message: data.message });
    } catch {
      setStatus({ state: "error", message: "Network error. Please try again." });
    }
  }

  if (status.state === "success") {
    return (
      <div className="mx-auto max-w-2xl rounded-2xl border border-copper/40 bg-obsidian-900 p-10 text-center">
        <Check className="mx-auto mb-4 h-10 w-10 text-copper" />
        <h3 className="font-serif text-2xl text-ivory">{launch ? "Application received" : "Story received"}</h3>
        <p className="mt-2 text-slate-300">{status.message}</p>
        <p className="mt-4 text-xs uppercase tracking-widest text-slate-400">Reference {status.reference}</p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      noValidate
      className="mx-auto max-w-2xl space-y-6 rounded-2xl border border-slate-700/60 bg-obsidian-900 p-6 md:p-10"
    >
      <div>
        <h3 className="font-serif text-3xl text-ivory">Book a session</h3>
        <p className="mt-2 text-slate-300">
          No packages to decode. Tell us who you are and what you&apos;re hoping to capture, and we&apos;ll
          shape the session around it.
        </p>
      </div>

      {launch ? (
        <div className="rounded-xl border border-copper/40 bg-copper/5 p-4 text-sm">
          <div className="flex items-start justify-between gap-3">
            <p className="inline-flex items-center gap-2 font-medium text-ivory">
              <Sparkles className="h-4 w-4 text-copper" /> Applying for: {NICHES[LAUNCH_NICHE].label}
            </p>
            <button type="button" aria-label="Cancel launch application" onClick={onClearLaunch} className="text-slate-400 hover:text-ivory">
              <X className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-slate-300">
            {NICHES[LAUNCH_NICHE].deliverables.join(" · ")}. In return we ask for a verified Google review and
            permission to feature the imagery in our launch portfolio.
          </p>
        </div>
      ) : (
        interest && (
          <p className="inline-flex items-center gap-2 rounded-full border border-copper/40 bg-copper/10 px-3 py-1 text-xs text-copper-light">
            Interested in: {HUB_SERVICES[interest].label}
            <button type="button" aria-label="Clear service" onClick={onClearInterest} className="hover:text-ivory">
              <X className="h-3.5 w-3.5" />
            </button>
          </p>
        )
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First name" error={fieldErrors.firstName}>
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" required className={inputClass} />
        </Field>
        <Field label="Last name" error={fieldErrors.lastName}>
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" required className={inputClass} />
        </Field>
        <Field label="Email" error={fieldErrors.email}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required className={inputClass} />
        </Field>
        <Field label="Phone" error={fieldErrors.phone}>
          <input
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            autoComplete="tel"
            placeholder="04xx xxx xxx"
            required
            className={inputClass}
          />
        </Field>
      </div>

      <SuburbCombobox value={suburb} onChange={setSuburb} error={fieldErrors.suburb} />

      <Field label="Tell us about your story — we will convert it into photography." error={fieldErrors.message}>
        <textarea
          value={story}
          onChange={(e) => setStory(e.target.value)}
          rows={5}
          required
          placeholder="Who's in it, where it happens, what you want to remember…"
          className={inputClass}
        />
      </Field>

      <button
        type="submit"
        disabled={status.state === "submitting"}
        className="flex w-full items-center justify-center gap-2 rounded-md bg-copper px-4 py-3 text-sm font-medium text-obsidian-950 transition hover:bg-copper-light disabled:opacity-60"
      >
        {status.state === "submitting" ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
        {launch ? "Apply for Complimentary Session" : "Share my story"}
      </button>
      {status.state === "error" && (
        <p role="alert" className="text-sm text-red-400">
          {status.message}
        </p>
      )}
    </form>
  );
}

function ContactPanel() {
  const items = [
    { icon: Phone, label: "Call the studio", value: STUDIO_PHONE, href: STUDIO_TEL_HREF, external: false },
    { icon: MessageCircle, label: "WhatsApp", value: "Message us now", href: STUDIO_WHATSAPP_HREF, external: true },
    { icon: Mail, label: "Email", value: STUDIO_EMAIL, href: `mailto:${STUDIO_EMAIL}`, external: false },
  ];
  return (
    <div className="mx-auto max-w-4xl">
      <div className="grid gap-6 md:grid-cols-3">
        {items.map(({ icon: Icon, label, value, href, external }) => (
          <a
            key={label}
            href={href}
            {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
            className="rounded-2xl border border-slate-800 bg-obsidian-900 p-8 text-center transition hover:border-copper/60"
          >
            <Icon className="mx-auto h-6 w-6 text-copper" />
            <p className="mt-4 text-xs uppercase tracking-widest text-slate-400">{label}</p>
            <p className="mt-2 break-words font-serif text-xl text-ivory">{value}</p>
          </a>
        ))}
      </div>
      <p className="mt-8 text-center text-sm text-slate-400">
        Based in Adelaide, South Australia. We reply within one business day (ACST).
      </p>
    </div>
  );
}

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-slate-300">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}
