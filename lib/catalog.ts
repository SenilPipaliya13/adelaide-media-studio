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
      "Professional 2D Floor Plan with Room Dimensions & Total Area",
      "Interactive Virtual Tour / 3D Walkthrough ready",
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
  launch: {
    label: "Adelaide Launch Initiative (Complimentary Session)",
    includedHours: 0.75,
    summary:
      "Complimentary 45-minute hero brand session for 5 Adelaide founders, businesses or real estate specialists. In return we ask for a verified Google review and permission to feature the imagery in our launch portfolio.",
    deliverables: [
      "45-minute hero brand session",
      "5 master high-res commercial stills, shot full-frame on the Canon EOS R6 Mark III",
      "Commercial usage release",
    ],
  },
} as const;

export type Niche = keyof typeof NICHES;
export const NICHE_KEYS = Object.keys(NICHES) as Niche[];

// Complimentary launch campaign. Selected by application, so it has no add-ons or price.
export const LAUNCH_NICHE = "launch" satisfies Niche;
// Hash the launch CTA links to. The inquiry form pre-selects the launch session when it sees it.
export const LAUNCH_APPLY_HASH = "#apply-launch-initiative";

// Real estate only add-on, offered on top of drone / rush / extra hours.
export const FLOOR_PLAN_ADD_ON = {
  niche: "real-estate" satisfies Niche,
  label: "Schematic 2D Floor Plan",
  hint: "Simplified layout drawing for brochures and portals",
} as const;

// Service cards on the homepage studio hub. `href` points at the matching vertical page, when there is one.
export const HUB_SERVICES = {
  commercial: {
    label: "Commercial",
    body: "Headshots, brand stories and event coverage for Lot Fourteen startups and CBD businesses.",
    href: "/commercial",
  },
  "real-estate": {
    label: "Real Estate",
    body: "HDR interiors, drone cutaways, agent reels and council-ready floor plans for every listing.",
    href: "/real-estate",
  },
  celebrations: {
    label: "Celebrations & Events",
    body: "Weddings in the Barossa, McLaren Vale and Adelaide Hills, plus milestones worth keeping.",
    href: "/weddings",
  },
  portraits: {
    label: "Portraits",
    body: "Unhurried individual, couple and family portraits, shot somewhere around Adelaide that means something to you.",
    href: null,
  },
} as const;

export type HubService = keyof typeof HUB_SERVICES;
export const HUB_SERVICE_KEYS = Object.keys(HUB_SERVICES) as HubService[];

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
