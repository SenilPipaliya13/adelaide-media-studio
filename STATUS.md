# STATUS — SP Media Co.

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
