"use client";

import { useMemo, useState } from "react";
import { Check, Loader2, MapPin, Minus, Plus, Send } from "lucide-react";
import {
  ADD_ONS,
  LOCATIONS,
  LOCATION_KEYS,
  MAX_EXTRA_HOURS,
  NICHES,
  NICHE_KEYS,
  calculateEstimate,
  formatAud,
  type LocationKey,
  type Niche,
} from "@/lib/pricing";

type Status =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success"; reference: string }
  | { state: "error"; message: string; fields?: Record<string, string> };

const inputClass =
  "w-full rounded-md border border-slate-600/60 bg-obsidian-900 px-3 py-2 text-sm text-ivory placeholder:text-slate-400 focus:border-copper focus:outline-none focus:ring-1 focus:ring-copper";

export function InquiryForm({ defaultNiche = "weddings" }: { defaultNiche?: Niche }) {
  const [niche, setNiche] = useState<Niche>(defaultNiche);
  const [locationText, setLocationText] = useState("");
  const [locationKey, setLocationKey] = useState<LocationKey | null>(null);
  const [drone, setDrone] = useState(defaultNiche === "real-estate");
  const [rush, setRush] = useState(false);
  const [extraHours, setExtraHours] = useState(0);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>({ state: "idle" });

  const estimate = useMemo(
    () => calculateEstimate({ niche, location: locationKey, drone, rush, extraHours }),
    [niche, locationKey, drone, rush, extraHours],
  );

  const fieldErrors = status.state === "error" ? status.fields ?? {} : {};

  function pickLocation(key: LocationKey) {
    setLocationKey(key);
    setLocationText(LOCATIONS[key].label);
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus({ state: "submitting" });
    try {
      const res = await fetch("/api/inquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          niche,
          location: locationText,
          locationKey,
          addOns: { drone, rush, extraHours },
          name,
          email,
          phone,
          preferredDate: date,
          message,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setStatus({
          state: "error",
          message: data.error ?? "Something went wrong.",
          fields: data.fields,
        });
        return;
      }
      setStatus({ state: "success", reference: data.reference });
    } catch {
      setStatus({ state: "error", message: "Network error. Please try again." });
    }
  }

  if (status.state === "success") {
    return (
      <div className="rounded-xl border border-copper/40 bg-obsidian-800 p-8 text-center">
        <Check className="mx-auto mb-4 h-10 w-10 text-copper" />
        <h3 className="font-serif text-2xl text-ivory">Inquiry received</h3>
        <p className="mt-2 text-slate-300">
          Thanks {name.split(" ")[0]}. We&apos;ll be in touch within one business day.
        </p>
        <p className="mt-4 text-xs uppercase tracking-widest text-slate-400">
          Reference {status.reference}
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={onSubmit}
      className="grid gap-8 rounded-xl border border-slate-700/60 bg-obsidian-800 p-6 md:grid-cols-[1fr_320px] md:p-8"
      noValidate
    >
      <div className="space-y-6">
        {/* Niche */}
        <fieldset>
          <legend className="mb-2 text-xs font-medium uppercase tracking-widest text-slate-400">
            What are we shooting?
          </legend>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
            {NICHE_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => setNiche(key)}
                aria-pressed={niche === key}
                className={`rounded-md border px-3 py-2 text-sm transition ${
                  niche === key
                    ? "border-copper bg-copper/10 text-ivory"
                    : "border-slate-600/60 text-slate-300 hover:border-slate-400"
                }`}
              >
                {NICHES[key].label}
              </button>
            ))}
          </div>
          <p className="mt-2 text-xs text-slate-400">{NICHES[niche].summary}</p>
        </fieldset>

        {/* Location */}
        <div>
          <label
            htmlFor="location"
            className="mb-2 block text-xs font-medium uppercase tracking-widest text-slate-400"
          >
            Location
          </label>
          <div className="relative">
            <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              id="location"
              value={locationText}
              onChange={(e) => {
                setLocationText(e.target.value);
                setLocationKey(null);
              }}
              placeholder="Suburb or venue"
              className={`${inputClass} pl-9`}
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {LOCATION_KEYS.map((key) => (
              <button
                key={key}
                type="button"
                onClick={() => pickLocation(key)}
                className={`rounded-full border px-3 py-1 text-xs transition ${
                  locationKey === key
                    ? "border-copper bg-copper/10 text-ivory"
                    : "border-slate-600/60 text-slate-300 hover:border-slate-400"
                }`}
              >
                {LOCATIONS[key].label}
              </button>
            ))}
          </div>
        </div>

        {/* Add-ons */}
        <fieldset className="space-y-3">
          <legend className="mb-2 text-xs font-medium uppercase tracking-widest text-slate-400">
            Add-ons
          </legend>
          <Toggle
            label="Aerial drone video"
            hint={niche === "real-estate" ? "Included in listing package" : `+${formatAud(ADD_ONS.drone)}`}
            checked={drone}
            onChange={setDrone}
          />
          <Toggle
            label="Fast 24-hr turnaround"
            hint={`+${formatAud(ADD_ONS.rush)}`}
            checked={rush}
            onChange={setRush}
          />
          <div className="flex items-center justify-between rounded-md border border-slate-600/60 px-4 py-3">
            <div>
              <p className="text-sm text-ivory">Extra hours</p>
              <p className="text-xs text-slate-400">
                {formatAud(NICHES[niche].hourlyRate)} per hour
              </p>
            </div>
            <div className="flex items-center gap-3">
              <button
                type="button"
                aria-label="Remove an hour"
                onClick={() => setExtraHours((h) => Math.max(0, h - 1))}
                disabled={extraHours === 0}
                className="rounded-md border border-slate-600/60 p-1 text-slate-300 disabled:opacity-40"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="w-6 text-center text-sm tabular-nums text-ivory">{extraHours}</span>
              <button
                type="button"
                aria-label="Add an hour"
                onClick={() => setExtraHours((h) => Math.min(MAX_EXTRA_HOURS, h + 1))}
                disabled={extraHours === MAX_EXTRA_HOURS}
                className="rounded-md border border-slate-600/60 p-1 text-slate-300 disabled:opacity-40"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
        </fieldset>

        {/* Client details */}
        <fieldset className="grid gap-4 sm:grid-cols-2">
          <legend className="mb-2 text-xs font-medium uppercase tracking-widest text-slate-400">
            Your details
          </legend>
          <Field label="Name" error={fieldErrors.name}>
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="name"
              required
              className={inputClass}
            />
          </Field>
          <Field label="Email" error={fieldErrors.email}>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
              required
              className={inputClass}
            />
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
          <Field label="Preferred date" error={fieldErrors.preferredDate}>
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
              className={`${inputClass} [color-scheme:dark]`}
            />
          </Field>
          <div className="sm:col-span-2">
            <Field label="Anything else? (optional)" error={fieldErrors.message}>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                rows={3}
                className={inputClass}
              />
            </Field>
          </div>
        </fieldset>
      </div>

      {/* Estimate */}
      <aside className="h-fit rounded-lg border border-slate-700/60 bg-obsidian-900 p-5 md:sticky md:top-24">
        <p className="text-xs font-medium uppercase tracking-widest text-copper">Instant estimate</p>
        <p className="mt-2 font-serif text-4xl text-ivory tabular-nums">{formatAud(estimate.total)}</p>
        <p className="text-xs text-slate-400">AUD, GST inclusive</p>
        <ul className="mt-5 space-y-2 border-t border-slate-700/60 pt-4 text-sm">
          {estimate.lines.map((line) => (
            <li key={line.label} className="flex justify-between gap-4 text-slate-300">
              <span>{line.label}</span>
              <span className="tabular-nums">{formatAud(line.amount)}</span>
            </li>
          ))}
          {estimate.travelTbc && (
            <li className="text-xs text-slate-400">
              Travel quoted once we confirm your location.
            </li>
          )}
        </ul>
        <button
          type="submit"
          disabled={status.state === "submitting"}
          className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-copper px-4 py-3 text-sm font-medium text-obsidian-950 transition hover:bg-copper-light disabled:opacity-60"
        >
          {status.state === "submitting" ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Send className="h-4 w-4" />
          )}
          Send inquiry
        </button>
        {status.state === "error" && (
          <p role="alert" className="mt-3 text-sm text-red-400">
            {status.message}
          </p>
        )}
      </aside>
    </form>
  );
}

function Toggle({
  label,
  hint,
  checked,
  onChange,
}: {
  label: string;
  hint: string;
  checked: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <label className="flex cursor-pointer items-center justify-between rounded-md border border-slate-600/60 px-4 py-3">
      <div>
        <p className="text-sm text-ivory">{label}</p>
        <p className="text-xs text-slate-400">{hint}</p>
      </div>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span className="relative h-6 w-11 rounded-full bg-slate-600 transition peer-checked:bg-copper peer-focus-visible:ring-2 peer-focus-visible:ring-copper after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-ivory after:transition peer-checked:after:translate-x-5" />
    </label>
  );
}

function Field({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block">
      <span className="mb-1 block text-sm text-slate-300">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </label>
  );
}
