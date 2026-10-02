"use client";

import { useEffect, useId, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, Loader2, Mail, MapPin, Send } from "lucide-react";
import { SuburbCombobox } from "@/components/suburb-combobox";
import { HUB_SERVICES, HUB_SERVICE_KEYS, LAUNCH_APPLY_HASH, type HubService } from "@/lib/catalog";
import { STUDIO_EMAIL } from "@/lib/contact";
import type { Suburb } from "@/lib/sa-suburbs";

const TABS = [
  { key: "services", label: "Our Services" },
  { key: "contact", label: "Contact Us" },
  { key: "book", label: "Book Us" },
] as const;

type TabKey = (typeof TABS)[number]["key"];

// Older links (#inquire, the retired launch banner hash) still land on the booking tab.
const HASH_TO_TAB: Record<string, TabKey> = {
  "#services": "services",
  "#contact": "contact",
  "#book": "book",
  "#inquire": "book",
  [LAUNCH_APPLY_HASH]: "book",
};

const inputClass =
  "w-full rounded-md border border-slate-600/60 bg-obsidian-900 px-3 py-2 text-sm text-ivory placeholder:text-slate-400 focus:border-copper focus:outline-none focus:ring-1 focus:ring-copper";

export function WireframeHub() {
  const id = useId();
  const [tab, setTab] = useState<TabKey>("services");
  const hubRef = useRef<HTMLElement>(null);
  const tabRefs = useRef<Record<TabKey, HTMLButtonElement | null>>({ services: null, contact: null, book: null });

  // Deep links (#services, #contact, #book) open the matching tab.
  useEffect(() => {
    function applyHash() {
      const target = HASH_TO_TAB[window.location.hash];
      if (!target) return;
      setTab(target);
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

  return (
    <section id="studio" ref={hubRef} className="mx-auto max-w-4xl scroll-mt-24 px-6 pb-24">
      <div role="tablist" aria-label="Studio" className="flex flex-wrap justify-center gap-3">
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
            className={`min-w-36 rounded-md border px-5 py-2.5 text-sm tracking-wide transition focus:outline-none focus-visible:ring-2 focus-visible:ring-copper focus-visible:ring-offset-2 focus-visible:ring-offset-obsidian-925 ${
              tab === t.key
                ? "border-copper bg-copper/15 text-copper-light"
                : "border-slate-700/70 text-slate-300 hover:border-slate-500 hover:text-ivory"
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
          {t.key === "services" && <ServicesPanel />}
          {t.key === "contact" && <ContactPanel onInquire={() => openTab("book")} />}
          {t.key === "book" && <BookPanel />}
        </div>
      ))}
    </section>
  );
}

function ServicesPanel() {
  return (
    <ol className="mx-auto max-w-3xl divide-y divide-slate-800 border-y border-slate-800">
      {HUB_SERVICE_KEYS.map((key, i) => {
        const { label, scope, points, href } = HUB_SERVICES[key];
        return (
          <li key={key} className="grid gap-4 py-8 sm:grid-cols-[3rem_1fr]">
            <span className="font-serif text-2xl text-copper">{String(i + 1).padStart(2, "0")}</span>
            <div>
              <h3 className="font-serif text-2xl text-ivory">{label}</h3>
              <p className="mt-1 text-sm text-slate-400">{scope}</p>
              <ul className="mt-4 space-y-2 text-slate-300">
                {points.map((point) => (
                  <li key={point} className="flex gap-3">
                    <span aria-hidden className="mt-2.5 h-1 w-1 shrink-0 rounded-full bg-copper" />
                    {point}
                  </li>
                ))}
              </ul>
              {href && (
                <Link
                  href={href}
                  className="mt-4 inline-flex items-center gap-1 text-sm text-copper transition hover:gap-2"
                >
                  See the work <ArrowRight className="h-4 w-4" />
                </Link>
              )}
            </div>
          </li>
        );
      })}
    </ol>
  );
}

function ContactPanel({ onInquire }: { onInquire: () => void }) {
  return (
    <div className="mx-auto max-w-xl rounded-2xl border border-slate-800 bg-obsidian-900 p-8 md:p-10">
      <dl className="space-y-6">
        <div className="flex gap-4">
          <Mail aria-hidden className="mt-1 h-5 w-5 shrink-0 text-copper" />
          <div>
            <dt className="text-xs uppercase tracking-widest text-slate-400">Studio Email</dt>
            <dd className="mt-1 break-words font-serif text-xl text-ivory">{STUDIO_EMAIL}</dd>
          </div>
        </div>
        <div className="flex gap-4">
          <MapPin aria-hidden className="mt-1 h-5 w-5 shrink-0 text-copper" />
          <div>
            <dt className="text-xs uppercase tracking-widest text-slate-400">Base</dt>
            <dd className="mt-1 font-serif text-xl text-ivory">Adelaide &amp; Greater South Australia</dd>
          </div>
        </div>
      </dl>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row">
        <a
          href={`mailto:${STUDIO_EMAIL}`}
          className="flex flex-1 items-center justify-center gap-2 rounded-md bg-copper px-4 py-3 text-sm font-medium text-obsidian-950 transition hover:bg-copper-light"
        >
          <Mail className="h-4 w-4" /> Email Us Directly
        </a>
        <button
          type="button"
          onClick={onInquire}
          className="flex flex-1 items-center justify-center gap-2 rounded-md border border-copper px-4 py-3 text-sm text-copper transition hover:bg-copper/10"
        >
          Send an Inquiry <ArrowRight className="h-4 w-4" />
        </button>
      </div>
      <p className="mt-6 text-center text-xs text-slate-400">We reply within one business day (ACST).</p>
    </div>
  );
}

type Status =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success"; reference: string; message: string }
  | { state: "error"; message: string; fields?: Record<string, string> };

function BookPanel() {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState<HubService | "">("");
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
          interest: service || undefined,
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
        <h3 className="font-serif text-2xl text-ivory">Inquiry received</h3>
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
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First Name" error={fieldErrors.firstName}>
          <input value={firstName} onChange={(e) => setFirstName(e.target.value)} autoComplete="given-name" required className={inputClass} />
        </Field>
        <Field label="Last Name" error={fieldErrors.lastName}>
          <input value={lastName} onChange={(e) => setLastName(e.target.value)} autoComplete="family-name" required className={inputClass} />
        </Field>
        <Field label="Email" error={fieldErrors.email}>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" required className={inputClass} />
        </Field>
        <Field label="Phone Number" error={fieldErrors.phone}>
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

      <Field label="Service">
        <select
          value={service}
          onChange={(e) => setService(e.target.value as HubService | "")}
          className={inputClass}
        >
          <option value="">Not sure yet</option>
          {HUB_SERVICE_KEYS.map((key) => (
            <option key={key} value={key}>
              {HUB_SERVICES[key].label}
            </option>
          ))}
        </select>
      </Field>

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
        Send Inquiry
      </button>
      {status.state === "error" && (
        <p role="alert" className="text-sm text-red-400">
          {status.message}
        </p>
      )}
    </form>
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
