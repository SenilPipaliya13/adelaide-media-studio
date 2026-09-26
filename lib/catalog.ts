// Client-safe service catalog: labels, deliverables and location scope only.
// Dollar figures live in `lib/pricing.ts`, which is server-only.

export const NICHES = {
  weddings: {
    label: "Weddings",
    includedHours: 8,
    summary: "Full-day coverage, 8 hours",
    deliverables: [
      "8 hours of coverage, prep to first dance",
      "Edited online gallery with private proofing",
      "Full-resolution downloads, no watermarks",
    ],
  },
  commercial: {
    label: "Commercial",
    includedHours: 3,
    summary: "Headshots, events & brand content, 3 hours",
    deliverables: [
      "3 hours on site",
      "Retouched headshots or event coverage",
      "Web and print ready brand files",
    ],
  },
  "real-estate": {
    label: "Real Estate",
    includedHours: 2,
    summary: "Listing package: HDR stills, drone cutaways, agent reel",
    deliverables: [
      "Interior & exterior HDR stills",
      "2–3 aerial drone video cutaways",
      "Agent talking-head reel",
    ],
  },
  sports: {
    label: "Sports",
    includedHours: 3,
    summary: "Match-day action or team media day, 3 hours",
    deliverables: [
      "3 hours of match-day or media-day coverage",
      "High-speed action sequences",
      "Edited gallery ready for club socials",
    ],
  },
} as const;

export type Niche = keyof typeof NICHES;
export const NICHE_KEYS = Object.keys(NICHES) as Niche[];

export const LOCATIONS = {
  cbd: { label: "Adelaide CBD", scope: "Metro" },
  "north-adelaide": { label: "North Adelaide", scope: "Metro" },
  glenelg: { label: "Glenelg", scope: "Metro" },
  hills: { label: "Adelaide Hills", scope: "Regional travel" },
  "mclaren-vale": { label: "McLaren Vale", scope: "Regional travel" },
  barossa: { label: "Barossa Valley", scope: "Regional travel" },
} as const;

export type LocationKey = keyof typeof LOCATIONS;
export const LOCATION_KEYS = Object.keys(LOCATIONS) as LocationKey[];

export const MAX_EXTRA_HOURS = 8;
