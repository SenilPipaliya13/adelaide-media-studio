"use client";

import { useEffect, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Building2,
  Check,
  Loader2,
  PartyPopper,
  UserRound,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { SuburbCombobox } from "@/components/suburb-combobox";
import {
  HUB_SERVICES,
  HUB_SERVICE_KEYS,
  TIMELINES,
  TIMELINE_KEYS,
  type HubService,
  type Timeline,
} from "@/lib/catalog";
import type { Suburb } from "@/lib/sa-suburbs";

export const DISCIPLINE_ICONS: Record<HubService, LucideIcon> = {
  hospitality: UtensilsCrossed,
  "real-estate": Building2,
  celebrations: PartyPopper,
  portraits: UserRound,
};

const STEPS = [
  { n: 1, label: "Discipline" },
  { n: 2, label: "Location & Timing" },
  { n: 3, label: "Your Story" },
] as const;

type Step = (typeof STEPS)[number]["n"];

// Server field errors that belong to an earlier step send the client back to it.
const FIELD_STEP: Record<string, Step> = { suburb: 2, preferredDate: 2 };

const TRUST_BADGES = ["Adelaide Based Studio", "Fast 2-Hour Response", "High-Resolution Masters"];

const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-carbon shadow-sm shadow-carbon/[0.02] transition placeholder:text-ink-muted/70 focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/30";

const labelClass = "mb-2 block text-[11px] font-medium uppercase tracking-[0.2em] text-ink-muted";

type Confirmation = { reference: string; message: string; discipline: string; suburb: string; timing: string };

// Today's date in Adelaide as YYYY-MM-DD, the same rule the API applies.
const todayAdelaide = () => new Date().toLocaleDateString("en-CA", { timeZone: "Australia/Adelaide" });

function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-AU", { weekday: "short", day: "numeric", month: "long", year: "numeric" });
}

// Three-step booking flow: discipline → suburb and timing → contact details and story.
// `preset` lets the disciplines showcase jump straight to step 2 with a discipline chosen.
export function BookingConcierge({ preset }: { preset?: { service: HubService; nonce: number } }) {
  const [step, setStep] = useState<Step>(1);
  const [discipline, setDiscipline] = useState<HubService | null>(null);
  const [suburb, setSuburb] = useState<Suburb | null>(null);
  const [timeline, setTimeline] = useState<Timeline | null>(null);
  const [date, setDate] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [story, setStory] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [formError, setFormError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [confirmation, setConfirmation] = useState<Confirmation | null>(null);

  const headingRef = useRef<HTMLHeadingElement>(null);
  const dialogRef = useRef<HTMLDialogElement>(null);
  const movedRef = useRef(false);

  useEffect(() => {
    if (!preset) return;
    setDiscipline(preset.service);
    setErrors({});
    setStep(2);
    movedRef.current = true;
  }, [preset]);

  // Move focus to the new step's heading so keyboard and screen reader users follow along.
  useEffect(() => {
    if (movedRef.current) headingRef.current?.focus({ preventScroll: true });
  }, [step]);

  useEffect(() => {
    if (confirmation && !dialogRef.current?.open) dialogRef.current?.showModal();
  }, [confirmation]);

  function clearError(field: string) {
    setErrors((prev) => {
      const next = { ...prev };
      delete next[field];
      return next;
    });
  }

  function goTo(next: Step) {
    movedRef.current = true;
    setStep(next);
  }

  function validateStep(s: Step) {
    const next: Record<string, string> = {};
    if (s === 1 && !discipline) next.discipline = "Choose the discipline that fits your session.";
    if (s === 2) {
      if (!suburb) next.suburb = "Choose your suburb from the list.";
      if (!timeline) next.timeline = "Let us know your timing.";
      else if (timeline === "date") {
        if (!date) next.preferredDate = "Choose a date.";
        else if (date < todayAdelaide()) next.preferredDate = "Date can't be in the past.";
      }
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setFormError(null);
    if (step < 3) {
      if (validateStep(step)) goTo((step + 1) as Step);
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/inquire", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          source: "studio-hub",
          interest: discipline ?? undefined,
          firstName,
          lastName,
          email,
          phone,
          suburb: suburb ? { name: suburb.name, postcode: suburb.postcode } : null,
          timeline,
          preferredDate: timeline === "date" ? date : undefined,
          message: story,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        const fields: Record<string, string> = data.fields ?? {};
        setErrors(fields);
        setFormError(data.error ?? "Something went wrong. Please try again.");
        const back = Math.min(3, ...Object.keys(fields).map((f) => FIELD_STEP[f] ?? 3)) as Step;
        if (back < 3) goTo(back);
        return;
      }
      setErrors({});
      setConfirmation({
        reference: data.reference,
        message: data.message,
        discipline: discipline ? HUB_SERVICES[discipline].label : "Studio session",
        suburb: suburb ? `${suburb.name} ${suburb.postcode}` : "",
        timing: timeline === "date" ? formatDate(date) : timeline ? TIMELINES[timeline] : "",
      });
    } catch {
      setFormError("Network error. Please check your connection and try again.");
    } finally {
      setSubmitting(false);
    }
  }

  // Closing the confirmation starts a fresh booking.
  function reset() {
    setConfirmation(null);
    setDiscipline(null);
    setSuburb(null);
    setTimeline(null);
    setDate("");
    setFirstName("");
    setLastName("");
    setPhone("");
    setEmail("");
    setStory("");
    setErrors({});
    setFormError(null);
    goTo(1);
  }

  const current = STEPS[step - 1];

  return (
    <div className="mx-auto max-w-3xl">
      <ol className="mb-10 grid grid-cols-3 gap-3" aria-label="Booking progress">
        {STEPS.map((s) => {
          const done = s.n < step;
          const active = s.n === step;
          return (
            <li key={s.n} aria-current={active ? "step" : undefined}>
              <span
                className={`block h-px w-full transition-colors duration-500 ${
                  done || active ? "bg-brass" : "bg-line"
                }`}
              />
              <span
                className={`mt-3 flex items-center gap-2 text-[11px] uppercase tracking-[0.2em] transition-colors ${
                  active ? "text-carbon" : done ? "text-brass-deep" : "text-ink-muted/70"
                }`}
              >
                <span className="inline-flex h-5 min-w-5 items-center font-serif text-base normal-case tracking-normal">
                  {done ? <Check aria-hidden className="h-3.5 w-3.5" /> : `0${s.n}`}
                </span>
                <span className="hidden sm:inline">{s.label}</span>
              </span>
            </li>
          );
        })}
      </ol>

      <form
        onSubmit={onSubmit}
        noValidate
        className="rounded-xl border border-line bg-white p-6 shadow-ambient md:p-10"
      >
        <div key={step} className="motion-safe:animate-rise-in">
          <p className="text-[11px] uppercase tracking-[0.25em] text-brass-deep">
            Step {step} of {STEPS.length} · {current.label}
          </p>
          <h3
            ref={headingRef}
            tabIndex={-1}
            className="mt-3 font-serif text-3xl leading-tight text-carbon focus:outline-none md:text-4xl"
          >
            {step === 1 && "What are we creating together?"}
            {step === 2 && "Where and when?"}
            {step === 3 && "Your story, in your words."}
          </h3>

          <div className="mt-8">
            {step === 1 && (
              <fieldset>
                <legend className="sr-only">Choose a discipline</legend>
                <div className="grid gap-4 sm:grid-cols-2">
                  {HUB_SERVICE_KEYS.map((key) => {
                    const Icon = DISCIPLINE_ICONS[key];
                    const { label, scope } = HUB_SERVICES[key];
                    return (
                      <label
                        key={key}
                        className="group relative flex cursor-pointer flex-col rounded-xl border border-line bg-canvas p-5 transition duration-300 hover:-translate-y-0.5 hover:border-brass/60 hover:shadow-ambient has-checked:border-brass has-checked:bg-brass/10 has-checked:shadow-ambient has-focus-visible:ring-2 has-focus-visible:ring-brass/40"
                      >
                        <input
                          type="radio"
                          name="discipline"
                          value={key}
                          checked={discipline === key}
                          onChange={() => {
                            setDiscipline(key);
                            setErrors({});
                          }}
                          className="sr-only"
                        />
                        <span className="flex items-start justify-between">
                          <span className="flex h-11 w-11 items-center justify-center rounded-full border border-line bg-white text-brass-deep transition group-hover:border-brass/60 group-has-checked:border-brass">
                            <Icon aria-hidden className="h-5 w-5" strokeWidth={1.5} />
                          </span>
                          <span
                            aria-hidden
                            className="flex h-5 w-5 items-center justify-center rounded-full border border-line text-white transition group-has-checked:border-brass group-has-checked:bg-brass"
                          >
                            <Check className="h-3 w-3" />
                          </span>
                        </span>
                        <span className="mt-5 font-serif text-2xl text-carbon">{label}</span>
                        <span className="mt-1 text-sm leading-relaxed text-ink-muted">{scope}</span>
                      </label>
                    );
                  })}
                </div>
                <FieldError message={errors.discipline} />
              </fieldset>
            )}

            {step === 2 && (
              <div className="space-y-8">
                <SuburbCombobox
                  value={suburb}
                  onChange={(s) => {
                    setSuburb(s);
                    if (s) clearError("suburb");
                  }}
                  error={errors.suburb}
                  label="Adelaide suburb or SA town"
                />

                <fieldset>
                  <legend className={labelClass}>Preferred date or timeline</legend>
                  <div className="grid gap-3 sm:grid-cols-2">
                    {TIMELINE_KEYS.map((key) => (
                      <label
                        key={key}
                        className="flex cursor-pointer items-center gap-3 rounded-xl border border-line bg-canvas px-4 py-3 text-sm text-carbon/85 transition hover:border-brass/60 has-checked:border-brass has-checked:bg-brass/10 has-checked:text-carbon has-focus-visible:ring-2 has-focus-visible:ring-brass/40"
                      >
                        <input
                          type="radio"
                          name="timeline"
                          value={key}
                          checked={timeline === key}
                          onChange={() => {
                            setTimeline(key);
                            clearError("timeline");
                          }}
                          className="peer sr-only"
                        />
                        <span
                          aria-hidden
                          className="h-3.5 w-3.5 shrink-0 rounded-full border border-ink-muted/50 transition peer-checked:border-[4px] peer-checked:border-brass"
                        />
                        {TIMELINES[key]}
                      </label>
                    ))}
                  </div>
                  <FieldError message={errors.timeline} />

                  {timeline === "date" && (
                    <label className="mt-4 block motion-safe:animate-fade-in">
                      <span className={labelClass}>Choose your date</span>
                      <input
                        type="date"
                        value={date}
                        min={todayAdelaide()}
                        onChange={(e) => {
                          setDate(e.target.value);
                          clearError("preferredDate");
                        }}
                        className={`${inputClass} [color-scheme:light] sm:max-w-xs`}
                      />
                      <FieldError message={errors.preferredDate} />
                    </label>
                  )}
                </fieldset>
              </div>
            )}

            {step === 3 && (
              <div className="space-y-6">
                <div className="grid gap-5 sm:grid-cols-2">
                  <TextField label="First Name" error={errors.firstName}>
                    <input
                      value={firstName}
                      onChange={(e) => {
                        setFirstName(e.target.value);
                        clearError("firstName");
                      }}
                      autoComplete="given-name"
                      required
                      className={inputClass}
                    />
                  </TextField>
                  <TextField label="Last Name" error={errors.lastName}>
                    <input
                      value={lastName}
                      onChange={(e) => {
                        setLastName(e.target.value);
                        clearError("lastName");
                      }}
                      autoComplete="family-name"
                      required
                      className={inputClass}
                    />
                  </TextField>
                  <TextField label="Direct Phone Number" error={errors.phone}>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        clearError("phone");
                      }}
                      autoComplete="tel"
                      placeholder="04xx xxx xxx"
                      required
                      className={inputClass}
                    />
                  </TextField>
                  <TextField label="Email" error={errors.email}>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        clearError("email");
                      }}
                      autoComplete="email"
                      required
                      className={inputClass}
                    />
                  </TextField>
                </div>

                <label className="block">
                  <span className="mb-3 block font-serif text-xl italic leading-snug text-carbon md:text-2xl">
                    Tell us about your story — we will convert it into photography.
                  </span>
                  <textarea
                    value={story}
                    onChange={(e) => {
                      setStory(e.target.value);
                      clearError("message");
                    }}
                    rows={6}
                    required
                    placeholder="Who's in it, where it happens, what you want to remember…"
                    className={`${inputClass} resize-y leading-relaxed`}
                  />
                  <FieldError message={errors.message} />
                </label>

                <ul className="flex flex-wrap items-center gap-2" aria-label="Studio assurances">
                  {TRUST_BADGES.map((badge) => (
                    <li
                      key={badge}
                      className="inline-flex items-center gap-1.5 rounded-full border border-brass/40 bg-brass/10 px-3 py-1 text-[11px] font-medium uppercase tracking-[0.15em] text-brass-deep"
                    >
                      <Check aria-hidden className="h-3 w-3" />
                      {badge}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {formError && (
          <p role="alert" className="mt-6 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-800">
            {formError}
          </p>
        )}

        <div className="mt-10 flex items-center justify-between gap-4 border-t border-line pt-6">
          {step > 1 ? (
            <button
              type="button"
              onClick={() => {
                setErrors({});
                setFormError(null);
                goTo((step - 1) as Step);
              }}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2.5 text-sm text-ink-muted transition hover:bg-stone/60 hover:text-carbon focus:outline-none focus-visible:ring-2 focus-visible:ring-brass/40"
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          ) : (
            <span className="text-xs text-ink-muted">Three short steps · about a minute</span>
          )}
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center gap-2 rounded-full bg-carbon px-6 py-3 text-sm font-medium tracking-wide text-canvas shadow-ambient transition hover:bg-carbon-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2 disabled:opacity-60"
          >
            {step < 3 ? (
              <>
                Continue <ArrowRight className="h-4 w-4" />
              </>
            ) : submitting ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" /> Sending
              </>
            ) : (
              <>
                Reserve Session <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
        </div>
      </form>

      <dialog
        ref={dialogRef}
        onClose={reset}
        aria-labelledby="concierge-confirmation-title"
        className="m-auto w-[min(92vw,32rem)] rounded-xl border border-line bg-canvas p-0 text-carbon shadow-lifted open:motion-safe:animate-rise-in"
      >
        {confirmation && (
          <div className="p-8 text-center md:p-10">
            <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full border border-brass/50 bg-brass/15 text-brass-deep">
              <Check aria-hidden className="h-6 w-6" />
            </span>
            <p className="mt-6 text-[11px] uppercase tracking-[0.25em] text-brass-deep">Session request received</p>
            <h2 id="concierge-confirmation-title" className="mt-2 font-serif text-3xl text-carbon">
              Thank you, {firstName}.
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-ink-muted">{confirmation.message}</p>
            <dl className="mt-6 divide-y divide-line rounded-xl border border-line bg-white text-left text-sm">
              {[
                ["Discipline", confirmation.discipline],
                ["Location", confirmation.suburb],
                ["Timing", confirmation.timing],
                ["Reference", confirmation.reference],
              ]
                .filter(([, v]) => v)
                .map(([k, v]) => (
                  <div key={k} className="flex justify-between gap-4 px-4 py-3">
                    <dt className="text-ink-muted">{k}</dt>
                    <dd className="text-right text-carbon">{v}</dd>
                  </div>
                ))}
            </dl>
            <form method="dialog" className="mt-8">
              <button
                autoFocus
                className="w-full rounded-full bg-carbon px-6 py-3 text-sm font-medium tracking-wide text-canvas transition hover:bg-carbon-soft focus:outline-none focus-visible:ring-2 focus-visible:ring-brass focus-visible:ring-offset-2"
              >
                Close
              </button>
            </form>
          </div>
        )}
      </dialog>
    </div>
  );
}

function TextField({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className={labelClass}>{label}</span>
      {children}
      <FieldError message={error} />
    </label>
  );
}

function FieldError({ message }: { message?: string }) {
  if (!message) return null;
  return <span className="mt-1.5 block text-xs text-red-700">{message}</span>;
}
