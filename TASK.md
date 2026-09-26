# TASK: Phase 1 — Project Scaffolding, Multi-Genre Architecture & Booking Engine

1. App Scaffolding:
   - Scaffold a fresh Next.js 15 App Router project in the current directory with TypeScript, Tailwind CSS, and ESLint.
   - Configure Tailwind with a modern editorial palette (deep obsidian, slate gray, warm off-white, and subtle copper/gold accents).

2. Core Routes & Landing Shells:
   - `/` — Master portal highlighting SP Media Co., multi-vertical showcase, equipment credibility (R6 Mark III full-frame), and direct call-to-action.
   - `/weddings` — Tailored for Adelaide Hills, Barossa, and McLaren Vale couples.
   - `/commercial` — Geared for corporate headshots, events, and Lot Fourteen startups.
   - `/real-estate` — Highlighting the $350 AUD Listing Package (interior/exterior stills, 2-3 drone video cutaways, agent talking-head reel).
   - `/sports` — Fast action and team media days.

3. Interactive Quote & Booking Component:
   - Create `components/inquiry-form.tsx` featuring an interactive estimate calculator:
     * Niche selector
     * Location input (with quick Adelaide selector: CBD, North Adelaide, Glenelg, Hills, etc.)
     * Add-ons toggle: Aerial Drone Video, Fast 24-hr Turnaround, Extra Hours
     * Dynamic instant price preview in AUD
     * Client details (Name, Email, Phone, Preferred Date)
   - Create `app/api/inquire/route.ts` to receive and validate inquiries via JSON.

4. SEO & Schema Setup:
   - Create `lib/seo.ts` with injected LocalBusiness schema:
     * Name: "SP Media Co."
     * Area served: "Adelaide, South Australia"
     * Latitude / Longitude: -34.9285, 138.6007

5. Verification:
   - Run `npm run build` and ensure the production build finishes green.
   - Write a summary of created files and endpoints to `STATUS.md`.