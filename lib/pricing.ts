// Internal pricing model. Server-only: it gives the studio the floor cost of a
// lead and must never be bundled into client code or returned by the API.
import "server-only";
import { LOCATIONS, MAX_EXTRA_HOURS, NICHES, type LocationKey, type Niche } from "@/lib/catalog";

const NICHE_RATES: Record<Niche, { base: number; hourlyRate: number }> = {
  weddings: { base: 2400, hourlyRate: 300 },
  commercial: { base: 650, hourlyRate: 200 },
  "real-estate": { base: 350, hourlyRate: 150 },
  sports: { base: 550, hourlyRate: 180 },
};

const TRAVEL: Record<LocationKey, number> = {
  cbd: 0,
  "north-adelaide": 0,
  glenelg: 0,
  hills: 60,
  "mclaren-vale": 100,
  barossa: 120,
};

const ADD_ONS = {
  drone: 250,
  rush: 150,
} as const;

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
  const rates = NICHE_RATES[input.niche];
  const lines: EstimateLine[] = [
    { label: `${niche.label} base (${niche.includedHours} hrs)`, amount: rates.base },
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
      label: `Extra hours (${hours} × $${rates.hourlyRate})`,
      amount: hours * rates.hourlyRate,
    });
  }

  let travelTbc = true;
  if (input.location) {
    travelTbc = false;
    const travel = TRAVEL[input.location];
    if (travel > 0) {
      lines.push({ label: `Travel: ${LOCATIONS[input.location].label}`, amount: travel });
    }
  }

  return {
    lines,
    total: lines.reduce((sum, l) => sum + l.amount, 0),
    travelTbc,
  };
}
