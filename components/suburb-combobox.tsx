"use client";

import { useId, useRef, useState } from "react";
import { Check, MapPin, X } from "lucide-react";
import { SUBURB_REGIONS, searchSuburbs, suburbKey, type Suburb } from "@/lib/sa-suburbs";

const inputClass =
  "w-full rounded-md border border-slate-600/60 bg-obsidian-900 px-3 py-2 text-sm text-ivory placeholder:text-slate-400 focus:border-copper focus:outline-none focus:ring-1 focus:ring-copper";

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
      <label htmlFor={id} className="mb-1 block text-sm text-slate-300">
        {label}
      </label>
      <div className="relative">
        <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
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
          className={`${inputClass} pl-9 pr-9`}
        />
        {query && (
          <button
            type="button"
            aria-label="Clear suburb"
            onClick={clear}
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-slate-400 transition hover:text-ivory"
          >
            <X className="h-4 w-4" />
          </button>
        )}

        <ul
          id={listId}
          ref={listRef}
          role="listbox"
          hidden={!showList}
          className="absolute z-20 mt-1 max-h-72 w-full overflow-auto rounded-md border border-slate-700/60 bg-obsidian-900 py-1 shadow-xl shadow-black/40"
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
              className={`flex cursor-pointer items-center justify-between gap-3 px-3 py-2 text-sm transition ${
                i === active ? "bg-copper/10 text-ivory" : "text-slate-300"
              }`}
            >
              <span>
                {s.name} <span className="tabular-nums text-slate-400">{s.postcode}</span>
              </span>
              <RegionBadge region={s.region} />
            </li>
          ))}
        </ul>
      </div>

      {noMatch && (
        <p className="mt-1 text-xs text-slate-400">
          No match yet. Mention your town in your story below and we&apos;ll confirm travel.
        </p>
      )}
      {region && (
        <p
          aria-live="polite"
          className={`mt-2 inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs ${
            value?.region === "metro"
              ? "border-copper/40 bg-copper/10 text-copper-light"
              : "border-slate-600/60 bg-obsidian-900 text-slate-300"
          }`}
        >
          <Check className="h-3.5 w-3.5" />
          {region.reassurance}
        </p>
      )}
      {error && <span className="mt-1 block text-xs text-red-400">{error}</span>}
    </div>
  );
}

function RegionBadge({ region }: { region: Suburb["region"] }) {
  return (
    <span
      title={SUBURB_REGIONS[region].label}
      className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] uppercase tracking-widest ${
        region === "metro" ? "border-copper/40 text-copper" : "border-slate-600/60 text-slate-400"
      }`}
    >
      {SUBURB_REGIONS[region].short}
    </span>
  );
}
