# STATUS — SP Media Co.

## Bespoke Proposal & Custom Quote Model (no public prices)
**Status:** ✅ Complete · 2026-09-26 (ACST)

### Build
`npm run build` passes on Next.js 15.5.26 with no TypeScript errors, lint errors or warnings. `npm run lint` is also clean.

```
Route (app)                                 Size  First Load JS
┌ ○ /                                      183 B         112 kB
├ ○ /_not-found                            996 B         104 kB
├ ƒ /api/inquire                           123 B         103 kB
├ ○ /commercial                            179 B         109 kB
├ ○ /real-estate                           179 B         109 kB
├ ○ /sports                                179 B         109 kB
└ ○ /weddings                              179 B         109 kB
+ First Load JS shared by all             103 kB
```

### Changes
| File | Change |
|---|---|
| `lib/catalog.ts` (new) | Client-safe catalog with niche labels, summaries, included hours, **deliverables**, location labels and scope (Metro / Regional travel), and `MAX_EXTRA_HOURS`. Contains no dollar figures. |
| `lib/pricing.ts` | Now **server-only** (`import "server-only"`, which fails the build if a client component imports it). Holds base/hourly rates, travel fees, add-on prices and `calculateEstimate()`. `formatAud` was removed. |
| `components/inquiry-form.tsx` | Removed every dollar figure, including the add-on hints and the per-hour rate. The "Instant estimate" total was replaced with an **Estimated Scope Summary** that lists package deliverables, location scope and active add-ons. The submit button now reads **"Request Tailored Quote"**. The booking notice "Prefer a faster response? DM us on Instagram @spmediaco or call us directly." sits below the form. The success screen shows the API's `message`. |
| `components/vertical-page.tsx` | Removed the "From $X AUD" note and the `offers.price` in the Service JSON-LD. The CTA now reads "Request a tailored quote". |
| `app/page.tsx` | Removed the "From $X" labels from the vertical cards and replaced them with scope notes. The hero CTA and quote-section copy were updated. |
| `app/real-estate/page.tsx` | Removed $350 from the title tag, meta description, H1 and price note. |
| `app/api/inquire/route.ts` | The 201 response is now `{ ok, reference, message }`. The server still computes the full estimate for the studio, logs the total, and keeps it on the `inquiry` record for future Supabase storage. |
| `package.json` | Added the `server-only` dependency. |

### Endpoint: `POST /api/inquire` (updated)
- `201 { ok: true, reference: "SPM-…", message: "Thank you. We will review your brief and send a bespoke proposal within 24 hours." }`
- `422 { error, fields }` and `400` are unchanged.

### Verification (`next start`)
- All 5 pages returned 200. The rendered HTML contains "Estimated Scope Summary", "Request Tailored Quote" and the Instagram/phone notice.
- No `$NNN` amounts or "AUD" appear in the prerendered HTML. No pricing constants appear in `.next/static` client chunks.
- A valid wedding inquiry (Barossa, drone, rush, +2 hrs) returned 201 with no price fields. The server log recorded an internal floor of 3520 (2400 + 250 + 150 + 600 + 120 ✓).
- An empty payload returned 422 with field errors.

### Notes
- `lib/seo.ts` still sets `priceRange: "$$"` on the LocalBusiness schema. This is a schema.org relative tier rather than a dollar figure, so it was left in place.
- Lucide v1 has no brand icons, so the booking notice uses `MessageCircle` + `Phone` in place of an Instagram logo.
- The Phase 1 "Pricing model" table below still reflects the internal rates in `lib/pricing.ts`. Those rates are now internal only.

---

## Phase 1: Scaffolding, Multi-Genre Architecture & Booking Engine
**Status:** ✅ Complete · 2026-09-26 (ACST)

### Build
`npm run build` passes on Next.js 15.5.26 with no TypeScript errors, lint errors or warnings.

```
Route (app)                                 Size  First Load JS
┌ ○ /                                      179 B         111 kB
├ ○ /_not-found                            996 B         104 kB
├ ƒ /api/inquire                           123 B         103 kB
├ ○ /commercial                            174 B         108 kB
├ ○ /real-estate                           174 B         108 kB
├ ○ /sports                                174 B         108 kB
└ ○ /weddings                              174 B         108 kB
+ First Load JS shared by all             103 kB
```

### Stack
- Next.js 15.5 (App Router), React 19.1, TypeScript, ESLint 9 (`next/core-web-vitals`)
- Tailwind CSS v4. The palette is defined in `@theme` inside `app/globals.css`. v4 does not use a `tailwind.config` file.
- lucide-react icons. Fonts are Inter (sans) and Fraunces (serif) via `next/font/google`.

### Palette (`app/globals.css`)
| Token | Hex | Use |
|---|---|---|
| `obsidian-950/900/800/700` | `#0b0b0c` → `#2a2a2e` | Backgrounds and cards |
| `slate-*` (built-in) | — | Secondary text and borders |
| `ivory` / `ivory-muted` | `#f5f1ea` / `#e8e2d6` | Primary text |
| `copper` / `-light` / `-dark` | `#c08a5b` / `#d6a877` / `#9a6b43` | Accents and CTAs |

### Files created
| File | Purpose |
|---|---|
| `app/layout.tsx` | Root layout: fonts, site metadata, header/footer, and LocalBusiness JSON-LD injected on every page |
| `app/globals.css` | Tailwind import and editorial theme tokens |
| `app/page.tsx` | `/` master portal: hero, four-vertical showcase, R6 Mark III specs (32.5MP / 40fps / 7K), quote form |
| `app/weddings/page.tsx` | `/weddings`: Adelaide Hills, Barossa, McLaren Vale |
| `app/commercial/page.tsx` | `/commercial`: headshots, events, Lot Fourteen startups |
| `app/real-estate/page.tsx` | `/real-estate`: $350 Listing Package (HDR stills, 2–3 drone cutaways, agent reel) |
| `app/sports/page.tsx` | `/sports`: action, SANFL, Gather Round, team media days |
| `app/api/inquire/route.ts` | `POST /api/inquire`: JSON inquiry intake and validation |
| `components/inquiry-form.tsx` | Client-side estimate calculator and booking form |
| `components/vertical-page.tsx` | Shared vertical landing template, including per-page `Service` JSON-LD |
| `components/site-header.tsx` / `site-footer.tsx` | Navigation and footer |
| `components/json-ld.tsx` | `<script type="application/ld+json">` helper |
| `lib/seo.ts` | `localBusinessSchema` ("SP Media Co.", areaServed "Adelaide, South Australia", geo -34.9285, 138.6007) and `jsonLd()` serialiser (escapes `<`) |
| `lib/pricing.ts` | Single pricing model used by both the form and the API |

### Endpoint: `POST /api/inquire`
Request body (JSON):
```json
{
  "niche": "weddings | commercial | real-estate | sports",
  "location": "free text",
  "locationKey": "cbd | north-adelaide | glenelg | hills | mclaren-vale | barossa | null",
  "addOns": { "drone": true, "rush": false, "extraHours": 0 },
  "name": "…", "email": "…", "phone": "04xx xxx xxx",
  "preferredDate": "YYYY-MM-DD", "message": "optional"
}
```
Responses:
- `201 { ok, reference, estimate: { total, travelTbc } }`
- `422 { error, fields }` for field-level validation errors
- `400` when the body is not a JSON object

Validation covers the niche enum, 0–8 extra hours, a name, an email, an Australian phone number (`04…`, `0[2378]…`, `+61…`), and an ISO date that is not in the past (compared against today in `Australia/Adelaide`). The server recalculates the price and ignores any price the client sends.

### Pricing model (placeholders, change in `lib/pricing.ts`)
| Niche | Base | Included hrs | Extra hr |
|---|---|---|---|
| Weddings | $2,400 | 8 | $300 |
| Commercial | $650 | 3 | $200 |
| Real Estate | $350 | 2 | $150 |
| Sports | $550 | 3 | $180 |

Add-ons: drone +$250 (included at no extra cost for Real Estate) and 24-hr turnaround +$150. Travel: CBD, North Adelaide and Glenelg $0; Hills $60; McLaren Vale $100; Barossa $120. A free-text location shows "travel quoted" instead of a fee.

### Smoke test (`next start`)
- All 5 pages returned 200. LocalBusiness JSON-LD is present in the page HTML.
- A valid wedding inquiry (Barossa, drone, rush, +2 hrs) returned 201 with a total of $3,520 (2400 + 250 + 150 + 600 + 120 ✓).
- An invalid payload returned 422 with all six field errors. A non-JSON body returned 400.

### Known gaps / next steps
- **Persistence:** inquiries are validated and logged to the server console but **not stored yet**. Connect the Supabase `inquiries` table (the TODO is in `route.ts`).
- No email notification to the studio or client yet.
- No spam protection or rate limiting on `/api/inquire` yet.
- Pricing figures are placeholders and need confirmation before launch.
- No real imagery yet. Pages are text/icon shells until portfolio images are hosted on Cloudflare R2.
- ImageGallery JSON-LD and suburb-level landing pages are not built yet.
- `npm audit` reports 2 advisories (1 moderate, 1 high) from the create-next-app dependency tree. They have not been triaged.
