"use client";

import { useId, useRef, useState } from "react";
import { Check, MapPin, X } from "lucide-react";
import { SUBURB_REGIONS, searchSuburbs, suburbKey, type Suburb } from "@/lib/sa-suburbs";

const inputClass =
  "w-full border border-line bg-white px-4 py-3 text-sm text-carbon transition placeholder:text-ink-muted/70 focus:border-brass focus:outline-none focus:ring-2 focus:ring-brass/30";

// Search-as-you-type suburb picker following the WAI-ARIA combobox pattern
// (ArrowUp/ArrowDown to move, Enter to select, Escape to close).
export function SuburbCombobox({
  value,
  onChange,
  error,
  label = "Suburb",
}: {
  value: Suburb | null;
  onChange: (suburb: Suburb | null) => void;
  error?: string;
  label?: string;
}) {
  const id = useId();
  const listId = `${id}-list`;
  const [query, setQuery] = useState(value ? value.name : "");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);
  const listRef = useRef<HTMLUListElement>(null);

  const results = searchSuburbs(query);
  const showList = open && results.length > 0;
  const noMatch = open && query.trim().length > 1 && results.length === 0;

  function select(suburb: Suburb) {
    onChange(suburb);
    setQuery(suburb.name);
    setOpen(false);
  }

  function clear() {
    onChange(null);
    setQuery("");
    setOpen(false);
  }

  function move(delta: number) {
    if (!results.length) return;
    const next = (active + delta + results.length) % results.length;
    setActive(next);
    listRef.current?.children[next]?.scrollIntoView({ block: "nearest" });
  }

  function onKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!open) setOpen(true);
        else move(1);
        break;
      case "ArrowUp":
        e.preventDefault();
        move(-1);
        break;
      case "Enter":
        if (showList) {
          e.preventDefault();
          select(results[active]);
        }
        break;
      case "Escape":
        setOpen(false);
        break;
    }
  }

  const region = value ? SUBURB_REGIONS[value.region] : null;

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-[11px] font-medium uppercase tracking-[0.2em] text-ink-muted">
        {label}
      </label>
      <div className="relative">
        <MapPin className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-brass-deep" />
        <input
          id={id}
          role="combobox"
          aria-expanded={showList}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={showList ? `${id}-opt-${active}` : undefined}
          aria-invalid={Boolean(error)}
          autoComplete="off"
          value={query}
          placeholder="Start typing a suburb or postcode"
          onChange={(e) => {
            setQuery(e.target.value);
            setActive(0);
            setOpen(true);
            if (value) onChange(null);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setOpen(false)}
          onKeyDown={onKeyDown}
          className={`${inputClass} pl-10 pr-10`}
        />
        {query && (
          <button
            type="button"
            aria-label="Clear suburb"
            onClick={clear}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full p-1 text-ink-muted transition hover:bg-stone hover:text-carbon"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <ul
          id={listId}
          ref={listRef}
          role="listbox"
          hidden={!showList}
          className="absolute z-20 mt-2 max-h-72 w-full overflow-auto border border-line bg-white py-1.5 shadow-lifted"
        >
          {results.map((s, i) => (
            <li
              key={suburbKey(s)}
              id={`${id}-opt-${i}`}
              role="option"
              aria-selected={i === active}
              // mousedown fires before the input's blur, so the click isn't lost.
              onMouseDown={(e) => {
                e.preventDefault();
                select(s);
              }}
              onMouseEnter={() => setActive(i)}
              className={`flex cursor-pointer items-center justify-between gap-3 px-4 py-2.5 text-sm transition ${
                i === active ? "bg-stone/60 text-carbon" : "text-carbon/80"
              }`}
            >
              <span>
                {s.name} <span className="tabular-nums text-ink-muted">{s.postcode}</span>
              </span>
              <RegionBadge region={s.region} />
            </li>
          ))}
        </ul>
      </div>

      {noMatch && (
        <p className="mt-2 text-xs text-ink-muted">
          No match yet. Mention your town in your story below and we&apos;ll confirm travel.
        </p>
      )}
      {region && (
        <p
          aria-live="polite"
          className={`mt-3 inline-flex animate-fade-in items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-medium tracking-wide ${
            value?.region === "metro"
              ? "border-brass/50 bg-brass/15 text-brass-deep"
              : "border-line bg-stone/50 text-carbon/80"
          }`}
        >
          <Check className="h-3.5 w-3.5" />
          {region.reassurance}
        </p>
      )}
      {error && <span className="mt-1.5 block text-xs text-red-700">{error}</span>}
    </div>
  );
}

function RegionBadge({ region }: { region: Suburb["region"] }) {
  return (
    <span
      title={SUBURB_REGIONS[region].label}
      className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-widest ${
        region === "metro" ? "border-brass/50 text-brass-deep" : "border-line text-ink-muted"
      }`}
    >
      {SUBURB_REGIONS[region].short}
    </span>
  );
}
