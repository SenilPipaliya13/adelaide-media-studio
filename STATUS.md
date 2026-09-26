# STATUS — SP Media Co.

## Agentic Multi-Agent Protocol & Project Memory
**Status:** ✅ Complete · 2026-09-26 (ACST)

### Build
`npm run build` passes on Next.js 15.5.26 with no TypeScript errors, lint errors or warnings. No application code changed, so the route table is the same as in the previous milestone (`/` 183 B / 113 kB, shared JS 103 kB).

### Changes
| File | Change |
|---|---|
| `MEMORY.md` (new) | Project memory base. It records the fixed standards: Next.js 15 App Router and React 19 conventions, Tailwind v4 tokens in the `@theme` block of `app/globals.css` (no `tailwind.config`), `lib/pricing.ts` and `lib/email.ts` staying `server-only` with no dollar figures on the client, and the business identity (SP Media Co., ABN 46 478 326 745, Adelaide SA). It also has an empty `## Lessons Learned` log for build and validation errors. |
| `agents/README.md` (new) | Defines the sub-agent roles, what each one owns and how work passes between them: **Architect** (brief evaluation, file impact), **Frontend-Dev** (accessible React, responsive Tailwind), **Backend-Dev** (endpoints, validation, Resend, DB models) and **QA-Auditor** (build, TS strictness, JSON-LD checks). |
| `CLAUDE.md` | New `## Orchestration Directive` section with four rules: read `MEMORY.md` before any task, record the root cause and resolution of build or validation errors under `## Lessons Learned`, keep status and backlog in `STATUS.md`, and use the roles in `agents/README.md`. |

### Active backlog
- Supabase `inquiries` table persistence. This is also needed for a hard cap on the launch campaign's 5 places.
- Confirmation email to the client. Verify the `spmediaco.com.au` sender in Resend.
- A real Resend send has not been tested yet.
- Spam protection and rate limiting on `/api/inquire`.
- Confirm placeholder pricing.
- Portfolio imagery on Cloudflare R2, ImageGallery JSON-LD and suburb landing pages.
- Triage the 2 `npm audit` advisories.
- Test the launch-CTA hash pre-select in a real browser.

## Email Lead Notifications (Resend)
**Status:** ✅ Complete · 2026-09-26 (ACST)

### Build
`npm run build` passes on Next.js 15.5.26 with no TypeScript errors, lint errors or warnings. `npm run lint` is also clean. The route table is unchanged from the previous milestone (`/api/inquire` 123 B, shared JS 103 kB).

### Changes
| File | Change |
|---|---|
| `package.json` | Added `resend` (^6.30.0). |
| `lib/email.ts` (new) | Server-only. `sendLeadNotification()` sends via Resend using `RESEND_API_KEY` to `NOTIFICATION_EMAIL` (default `spmediaco7@gmail.com`), with `replyTo` set to the client. The HTML template shows the service, name, clickable `mailto:` and `tel:` links, location (with Metro/Regional scope), preferred date, the scope/add-ons list and the client's brief. A plain-text version is sent too. All client input is HTML-escaped. The function never throws and returns `{ sent: false, reason }` if the key is missing or Resend errors. |
| `app/api/inquire/route.ts` | After validation, dispatches the notification. If it isn't sent, it logs the reason and the full lead JSON to the console. The response is still 201 either way. Adds an in-memory `launchApplicationCount`. Launch applications get the subject `[LAUNCH OFFER APPLICANT] #n · Name · SPM-…`, and the email body carries a note that only 5 places exist. |

### Environment
- `RESEND_API_KEY` (required to send) and `NOTIFICATION_EMAIL` are set in `.env.local`, which is gitignored.
- `RESEND_FROM` (optional) defaults to `SP Media Co. Leads <onboarding@resend.dev>`. Resend's shared sender only delivers to the email address that owns the Resend account. Verify `spmediaco.com.au` in Resend and set `RESEND_FROM` (for example `leads@spmediaco.com.au`), or check that `NOTIFICATION_EMAIL` is the Resend account's own email.
- These variables must also be added in the hosting provider's environment settings.

### Verification (`next start`, with `RESEND_API_KEY` blanked)
- Two launch applications and one commercial inquiry all returned 201.
- The server logged `[LAUNCH OFFER APPLICANT] #1` and then `#2`, then "notification not sent: RESEND_API_KEY is not set", then the full lead JSON for each. The fallback path works.
- **A real send through Resend was not tested**, so no email reached the inbox during this run. Submit one test inquiry with the key set and confirm it arrives, not in spam.

### Notes
- The launch counter is a tag, not a hard cap. Applications past #5 are still accepted and emailed. The counter resets on restart or redeploy and isn't shared between serverless instances. A reliable cap needs the Supabase `inquiries` table.
- The email is sent before the response returns (awaited), so a slow Resend call adds latency to form submission but can't cause an error.

## ABN Display & Adelaide Launch Initiative
**Status:** ✅ Complete · 2026-09-26 (ACST)

### Build
`npm run build` passes on Next.js 15.5.26 with no TypeScript errors, lint errors or warnings. `npm run lint` is also clean.

```
Route (app)                                 Size  First Load JS
┌ ○ /                                      183 B         113 kB
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
| `lib/seo.ts` | New `ABN` constant (`"46 478 326 745"`). LocalBusiness schema now has `identifier: { "@type": "PropertyValue", propertyID: "ABN", value: "46478326745" }`. |
| `components/site-footer.tsx` | Legal line now reads "SP Media Co. · ABN 46 478 326 745 · Adelaide, South Australia", using the shared `ABN` constant. |
| `lib/catalog.ts` | New `launch` niche, labelled "Adelaide Launch Initiative (Complimentary Session)", with deliverables: 45-minute hero brand session, 5 master high-res stills on the R6 Mark III, and a commercial release. Also exports `LAUNCH_NICHE` and `LAUNCH_APPLY_HASH` (`#apply-launch-initiative`). |
| `lib/pricing.ts` | `launch` rate is base $0 / hourly $0. Travel still counts toward the internal floor cost. |
| `app/page.tsx` | Adds a full-width announcement banner above the hero and a `#launch-initiative` card section after it. The section has the title, tagline, "What you get" and "What we ask" cards, and an "Apply for the Launch Initiative" CTA. Both the banner and the CTA link to `LAUNCH_APPLY_HASH`. |
| `components/inquiry-form.tsx` | The launch session appears as a full-width option in the service picker. When it is selected, add-ons are hidden and sent as off, the summary shows **Total estimated price: $0 (Selected by Application)** and the "What we ask" terms, the submit button reads **"Apply for Complimentary Session"**, and the success screen reads "Application received". On mount and on `hashchange`, the form checks for `#apply-launch-initiative`. If it finds it, it pre-selects the launch session, scrolls to the form and resets the hash to `#inquire`, so the CTA still works if clicked again. |
| `app/api/inquire/route.ts` | Accepts `niche: "launch"`. Add-ons are ignored for launch applications even when the client sends them, and launch applications get their own confirmation message. |

### Verification (`next start`)
- The homepage HTML contains the campaign title, the `#apply-launch-initiative` links, the new picker option, the footer legal line and the ABN `identifier` in the JSON-LD.
- A launch application sent with drone, rush and 3 extra hours returned 201 with the launch message. The server logged a floor total of 0, so the add-ons were ignored.
- A commercial inquiry still returned 201 with the standard message. The server logged 650.
- The hash pre-select and scroll are client-side and were **not** exercised in a real browser. Check this manually before launch.

### Notes
- TASK.md is titled "…& Lead Notification Setup", but its steps contain no notification instructions, so **no lead notification was built**. The inquiries API still only logs to the console. Email/Supabase notification is still an open gap (see Phase 1 "Known gaps").
- The `$0 (Selected by Application)` label is an intentional exception to the no-public-prices rule from the previous milestone.
- Nothing limits the campaign to 5 places. Applications are reviewed manually, so the banner and section should be removed once the places are filled.

### Re-run · 2026-09-26 (ACST)
The same TASK.md was dispatched again by `run-engine.ps1`. Every item was already implemented and committed in `44d1bba`, so no code changed. `npm run build` was run again and passed with no errors, and the route table matches the one above. The lead-notification gap noted above is still open.

---

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
- ~~No email notification to the studio or client yet.~~ Studio notification added via Resend (see the top section). There is still no confirmation email to the client.
- No spam protection or rate limiting on `/api/inquire` yet.
- Pricing figures are placeholders and need confirmation before launch.
- No real imagery yet. Pages are text/icon shells until portfolio images are hosted on Cloudflare R2.
- ImageGallery JSON-LD and suburb-level landing pages are not built yet.
- `npm audit` reports 2 advisories (1 moderate, 1 high) from the create-next-app dependency tree. They have not been triaged.
