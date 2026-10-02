"use client";

import { useEffect, useRef, useState } from "react";
import { Check, Loader2, MapPin, MessageCircle, Minus, Phone, Plus, Send, Sparkles } from "lucide-react";
import {
  FLOOR_PLAN_ADD_ON,
  LAUNCH_APPLY_HASH,
  LAUNCH_NICHE,
  LOCATIONS,
  LOCATION_KEYS,
  MAX_EXTRA_HOURS,
  NICHES,
  NICHE_KEYS,
  type LocationKey,
  type Niche,
} from "@/lib/catalog";

type Status =
  | { state: "idle" }
  | { state: "submitting" }
  | { state: "success"; reference: string; message: string }
  | { state: "error"; message: string; fields?: Record<string, string> };

const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-2.5 text-sm text-carbon transition placeholder:text-ink-muted/70 focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/30";

export function InquiryForm({ defaultNiche = "weddings" }: { defaultNiche?: Niche }) {
  const [niche, setNiche] = useState<Niche>(defaultNiche);
  const [locationText, setLocationText] = useState("");
  const [locationKey, setLocationKey] = useState<LocationKey | null>(null);
  const [drone, setDrone] = useState(defaultNiche === "real-estate");
  const [rush, setRush] = useState(false);
  const [extraHours, setExtraHours] = useState(0);
  const [floorPlan, setFloorPlan] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [date, setDate] = useState("");
  const [message, setMessage] = useState("");
  const [status, setStatus] = useState<Status>({ state: "idle" });
  const formRef = useRef<HTMLFormElement>(null);

  // The launch campaign CTA links to LAUNCH_APPLY_HASH: pre-select the complimentary
  // session and scroll to the form.
  useEffect(() => {
    function applyFromHash() {
      if (window.location.hash !== LAUNCH_APPLY_HASH) return;
      setNiche(LAUNCH_NICHE);
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      // Swap the hash back so a second click on the CTA fires hashchange again.
      history.replaceState(null, "", `${window.location.pathname}${window.location.search}#inquire`);
    }
    applyFromHash();
    window.addEventListener("hashchange", applyFromHash);
    return () => window.removeEventListener("hashchange", applyFromHash);
  }, []);

  const pkg = NICHES[niche];
  const isLaunch = niche === LAUNCH_NICHE;
  const offersFloorPlan = niche === FLOOR_PLAN_ADD_ON.niche;
  const trimmedLocation = locationText.trim();
  const locationScope = locationKey
    ? `${LOCATIONS[locationKey].label} · ${LOCATIONS[locationKey].scope}`
    : trimmedLocation
      ? `${trimmedLocation} · Travel scope confirmed in proposal`
      : null;
  const activeAddOns = isLaunch
    ? []
    : [
        drone && (niche === "real-estate" ? "Aerial drone video (in package)" : "Aerial drone video"),
        rush && "Fast 24-hr turnaround",
        offersFloorPlan && floorPlan && FLOOR_PLAN_ADD_ON.label,
        extraHours > 0 && `${extraHours} extra hour${extraHours === 1 ? "" : "s"} of coverage`,
      ].filter((a): a is string => Boolean(a));

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
          addOns: isLaunch
            ? { drone: false, rush: false, extraHours: 0, floorPlan: false }
            : { drone, rush, extraHours, floorPlan: offersFloorPlan && floorPlan },
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
      setStatus({ state: "success", reference: data.reference, message: data.message });
    } catch {
      setStatus({ state: "error", message: "Network error. Please try again." });
    }
  }

  if (status.state === "success") {
    return (
      <div className="rounded-xl border border-brass/50 bg-white p-8 shadow-ambient text-center">
        <Check className="mx-auto mb-4 h-10 w-10 text-brass-deep" />
        <h3 className="font-serif text-2xl text-carbon">
          {isLaunch ? "Application received" : "Brief received"}
        </h3>
        <p className="mt-2 text-carbon/75">{status.message}</p>
        <p className="mt-4 text-xs uppercase tracking-widest text-ink-muted">
          Reference {status.reference}
        </p>
      </div>
    );
  }

  return (
    <>
      <form
        ref={formRef}
        onSubmit={onSubmit}
        className="grid scroll-mt-28 gap-8 rounded-xl border border-line bg-white p-6 shadow-ambient md:grid-cols-[1fr_320px] md:p-8"
        noValidate
      >
        <div className="space-y-6">
          {/* Niche */}
          <fieldset>
            <legend className="mb-2 text-xs font-medium uppercase tracking-widest text-ink-muted">
              What are we shooting?
            </legend>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {NICHE_KEYS.map((key) => (
                <button
                  key={key}
                  type="button"
                  onClick={() => setNiche(key)}
                  aria-pressed={niche === key}
                  className={`rounded-xl border px-3 py-2 text-sm transition ${
                    key === LAUNCH_NICHE ? "col-span-full inline-flex items-center justify-center gap-2" : ""
                  } ${
                    niche === key
                      ? "border-brass bg-brass/10 text-carbon"
                      : "border-line text-carbon/75 hover:border-brass/60"
                  }`}
                >
                  {key === LAUNCH_NICHE && <Sparkles className="h-4 w-4 text-brass-deep" />}
                  {NICHES[key].label}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-ink-muted">{pkg.summary}</p>
          </fieldset>

          {/* Location */}
          <div>
            <label
              htmlFor="location"
              className="mb-2 block text-xs font-medium uppercase tracking-widest text-ink-muted"
            >
              Location
            </label>
            <div className="relative">
              <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-muted" />
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
                      ? "border-brass bg-brass/10 text-carbon"
                      : "border-line text-carbon/75 hover:border-brass/60"
                  }`}
                >
                  {LOCATIONS[key].label}
                </button>
              ))}
            </div>
          </div>

          {/* Add-ons (the complimentary launch session is fixed scope) */}
          <fieldset className="space-y-3" hidden={isLaunch}>
            <legend className="mb-2 text-xs font-medium uppercase tracking-widest text-ink-muted">
              Add-ons
            </legend>
            <Toggle
              label="Aerial drone video"
              hint={niche === "real-estate" ? "Included in listing package" : "Aerial establishing shots"}
              checked={drone}
              onChange={setDrone}
            />
            <Toggle
              label="Fast 24-hr turnaround"
              hint="Priority edit and delivery"
              checked={rush}
              onChange={setRush}
            />
            {offersFloorPlan && (
              <Toggle
                label={FLOOR_PLAN_ADD_ON.label}
                hint={FLOOR_PLAN_ADD_ON.hint}
                checked={floorPlan}
                onChange={setFloorPlan}
              />
            )}
            <div className="flex items-center justify-between rounded-xl border border-line px-4 py-3">
              <div>
                <p className="text-sm text-carbon">Extra hours</p>
                <p className="text-xs text-ink-muted">
                  Beyond the {pkg.includedHours} included hours
                </p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Remove an hour"
                  onClick={() => setExtraHours((h) => Math.max(0, h - 1))}
                  disabled={extraHours === 0}
                  className="rounded-xl border border-line p-1 text-carbon/75 disabled:opacity-40"
                >
                  <Minus className="h-4 w-4" />
                </button>
                <span className="w-6 text-center text-sm tabular-nums text-carbon">{extraHours}</span>
                <button
                  type="button"
                  aria-label="Add an hour"
                  onClick={() => setExtraHours((h) => Math.min(MAX_EXTRA_HOURS, h + 1))}
                  disabled={extraHours === MAX_EXTRA_HOURS}
                  className="rounded-xl border border-line p-1 text-carbon/75 disabled:opacity-40"
                >
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>
          </fieldset>

          {/* Client details */}
          <fieldset className="grid gap-4 sm:grid-cols-2">
            <legend className="mb-2 text-xs font-medium uppercase tracking-widest text-ink-muted">
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
                className={`${inputClass} [color-scheme:light]`}
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

        {/* Scope summary */}
        <aside className="h-fit rounded-xl border border-line bg-canvas p-5 md:sticky md:top-24">
          <p className="text-xs font-medium uppercase tracking-widest text-brass-deep">
            Estimated Scope Summary
          </p>
          <p className="mt-2 font-serif text-2xl text-carbon">{pkg.label}</p>
          <dl className="mt-4 space-y-4 border-t border-line pt-4 text-sm">
            <div>
              <dt className="text-xs uppercase tracking-widest text-ink-muted">Package deliverables</dt>
              <dd>
                <ul className="mt-2 space-y-1.5 text-carbon/75">
                  {pkg.deliverables.map((item) => (
                    <li key={item} className="flex gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-brass-deep" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest text-ink-muted">Location scope</dt>
              <dd className="mt-1 text-carbon/75">{locationScope ?? "Not selected yet"}</dd>
            </div>
            <div>
              <dt className="text-xs uppercase tracking-widest text-ink-muted">Add-ons</dt>
              <dd>
                {activeAddOns.length > 0 ? (
                  <ul className="mt-1 space-y-1 text-carbon/75">
                    {activeAddOns.map((a) => (
                      <li key={a}>{a}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-1 text-ink-muted">
                    {isLaunch ? "Not available for this session" : "None selected"}
                  </p>
                )}
              </dd>
            </div>
            {isLaunch && (
              <div>
                <dt className="text-xs uppercase tracking-widest text-ink-muted">Total estimated price</dt>
                <dd className="mt-1 font-serif text-xl text-carbon">$0 (Selected by Application)</dd>
              </div>
            )}
          </dl>
          <p className="mt-4 text-xs text-ink-muted">
            {isLaunch
              ? "In return we ask for a verified Google review and permission to feature the imagery in our launch portfolio."
              : "Every shoot is quoted individually. We'll reply with a bespoke proposal."}
          </p>
          <button
            type="submit"
            disabled={status.state === "submitting"}
            className="mt-6 flex w-full items-center justify-center gap-2 rounded-full bg-carbon px-4 py-3 text-sm font-medium tracking-wide text-canvas transition hover:bg-carbon-soft disabled:opacity-60"
          >
            {status.state === "submitting" ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            {isLaunch ? "Apply for Complimentary Session" : "Request Tailored Quote"}
          </button>
          {status.state === "error" && (
            <p role="alert" className="mt-3 text-sm text-red-700">
              {status.message}
            </p>
          )}
        </aside>
      </form>
      <p className="mt-4 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-center text-sm text-ink-muted">
        <MessageCircle className="h-4 w-4 text-brass-deep" />
        <Phone className="h-4 w-4 text-brass-deep" />
        Prefer a faster response? DM us on Instagram @spmediaco or call us directly.
      </p>
    </>
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
    <label className="flex cursor-pointer items-center justify-between rounded-xl border border-line px-4 py-3">
      <div>
        <p className="text-sm text-carbon">{label}</p>
        <p className="text-xs text-ink-muted">{hint}</p>
      </div>
      <input
        type="checkbox"
        role="switch"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span className="relative h-6 w-11 rounded-full bg-stone transition peer-checked:bg-brass peer-focus-visible:ring-2 peer-focus-visible:ring-brass/50 after:absolute after:left-0.5 after:top-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition peer-checked:after:translate-x-5" />
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
      <span className="mb-1 block text-sm text-carbon/75">{label}</span>
      {children}
      {error && <span className="mt-1 block text-xs text-red-700">{error}</span>}
    </label>
  );
}
