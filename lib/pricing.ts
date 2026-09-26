// Shared pricing model. Used by the client-side estimate calculator and
// re-run on the server so a submitted estimate can never be tampered with.

export const NICHES = {
  weddings: {
    label: "Weddings",
    base: 2400,
    includedHours: 8,
    hourlyRate: 300,
    summary: "Full-day coverage, 8 hours",
  },
  commercial: {
    label: "Commercial",
    base: 650,
    includedHours: 3,
    hourlyRate: 200,
    summary: "Headshots, events & brand content, 3 hours",
  },
  "real-estate": {
    label: "Real Estate",
    base: 350,
    includedHours: 2,
    hourlyRate: 150,
    summary: "Listing package: HDR stills, drone cutaways, agent reel",
  },
  sports: {
    label: "Sports",
    base: 550,
    includedHours: 3,
    hourlyRate: 180,
    summary: "Match-day action or team media day, 3 hours",
  },
} as const;

export type Niche = keyof typeof NICHES;
export const NICHE_KEYS = Object.keys(NICHES) as Niche[];

export const LOCATIONS = {
  cbd: { label: "Adelaide CBD", travel: 0 },
  "north-adelaide": { label: "North Adelaide", travel: 0 },
  glenelg: { label: "Glenelg", travel: 0 },
  hills: { label: "Adelaide Hills", travel: 60 },
  "mclaren-vale": { label: "McLaren Vale", travel: 100 },
  barossa: { label: "Barossa Valley", travel: 120 },
} as const;

export type LocationKey = keyof typeof LOCATIONS;
export const LOCATION_KEYS = Object.keys(LOCATIONS) as LocationKey[];

export const ADD_ONS = {
  drone: 250,
  rush: 150,
} as const;

export const MAX_EXTRA_HOURS = 8;

export interface EstimateInput {
  niche: Niche;
  location?: LocationKey | null;
  drone: boolean;
  rush: boolean;
  extraHours: number;
}

export interface EstimateLine {
  label: string;
  amount: number;
}

export interface Estimate {
  lines: EstimateLine[];
  total: number;
  // True when the location is free text and travel still needs quoting.
  travelTbc: boolean;
}

export function calculateEstimate(input: EstimateInput): Estimate {
  const niche = NICHES[input.niche];
  const lines: EstimateLine[] = [
    { label: `${niche.label} base (${niche.includedHours} hrs)`, amount: niche.base },
  ];

  if (input.drone) {
    // Drone cutaways are already bundled into the real estate package.
    lines.push({
      label: input.niche === "real-estate" ? "Aerial drone video (included)" : "Aerial drone video",
      amount: input.niche === "real-estate" ? 0 : ADD_ONS.drone,
    });
  }

  if (input.rush) {
    lines.push({ label: "Fast 24-hr turnaround", amount: ADD_ONS.rush });
  }

  const hours = Math.max(0, Math.min(MAX_EXTRA_HOURS, Math.floor(input.extraHours)));
  if (hours > 0) {
    lines.push({
      label: `Extra hours (${hours} × $${niche.hourlyRate})`,
      amount: hours * niche.hourlyRate,
    });
  }

  let travelTbc = true;
  if (input.location) {
    const loc = LOCATIONS[input.location];
    travelTbc = false;
    if (loc.travel > 0) {
      lines.push({ label: `Travel: ${loc.label}`, amount: loc.travel });
    }
  }

  return {
    lines,
    total: lines.reduce((sum, l) => sum + l.amount, 0),
    travelTbc,
  };
}

export const formatAud = (n: number) =>
  new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    maximumFractionDigits: 0,
  }).format(n);
