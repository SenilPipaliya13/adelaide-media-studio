# STATUS — SP Media Co.

## Homepage Replacement: Exact Wireframe Layout
**Status:** ✅ Complete · 2026-10-02 (ACST)

### Build
`npm run build` passes on Next.js 15.5.26 with no TypeScript errors, lint errors or warnings. `/` is 9.07 kB / 115 kB First Load JS (ISR, `revalidate = 3600`). Vertical pages are unchanged at 124 B / 110 kB. Shared JS is 103 kB.

### Changes
| File | Change |
|---|---|
| `app/page.tsx` | Fully rewritten. Matte `#0d0d11` background, "SP MEDIA CO." wordmark with "Adelaide, South Australia" beneath it, the "Welcome to SP Media Co." headline, then the daily quote in serif italic with the author cited, then the hub. The launch banner, large hero and marketing paragraph are gone. |
| `app/globals.css` | New `obsidian-925` token (`#0d0d11`) in `@theme`. |
| `components/wireframe-hub.tsx` | Rewritten. Tabs are now **Our Services · Contact Us · Book Us**, as three separate buttons: copper border and fill when active, subtle outline when not. **Our Services:** a numbered list of the four pillars, each with a scope line, three bullets covering craft, inclusions and delivery time, and a "See the work" link where a vertical page exists. **Contact Us:** a card with the studio email (`spmediaco7@gmail.com`), the base (Adelaide & Greater South Australia), and two buttons, "Email Us Directly" (`mailto:`) and "Send an Inquiry", which opens Book Us. **Book Us:** First Name, Last Name, Email, Phone Number, a Service dropdown ("Not sure yet" plus the four pillars), the SA suburb combobox with the Metro/Regional badge, the story textarea with the exact wireframe wording, and a "Send Inquiry" button that posts to `/api/inquire`. |
| `lib/catalog.ts` | `HUB_SERVICES` now holds the four wireframe pillars: `hospitality` (Brand & Hospitality), `real-estate` (Real Estate & Architecture), `celebrations` (Celebrations & Events) and `portraits` (Portraits & Milestones), each with `scope` and `points`. The API's `interest` validation and the email subject pick up the new keys automatically. |

### Verification (`next start`, `RESEND_API_KEY` blanked)
- Homepage HTML contains the welcome headline, the location line, all three tabs, "Brand & Hospitality", "Email Us Directly" and the studio email. It has no "Launch Initiative" text and no old SaaS headline.
- Hub inquiry with `interest: "hospitality"` and Glenelg → 201. The log shows `interest: "hospitality"` and `suburb.region: "metro"`.
- Invalid hub payload → 422 with field errors for suburb, firstName, lastName, email, phone and message.
- No pricing constants (`hourlyRate`) appear in `.next/static`.
- **Not tested:** tab switching, the dropdown and the combobox in a real browser.

### Notes
- **Delivery times in the service bullets need confirming.** TASK.md only gave "24h delivery" for real estate. The others (3–5 business days for brand work, 7 days for events, 5 business days for portraits) are placeholders I wrote in `lib/catalog.ts`.
- **The homepage no longer has a launch campaign entry point.** TASK.md asked for the launch banner to be removed, and the hub no longer has a launch-application mode. Old `#apply-launch-initiative` links now just open Book Us. The package form on the vertical pages still supports the launch niche.
- The Contact tab's phone and WhatsApp cards were removed, because the wireframe lists only email and base. `STUDIO_PHONE` (still a placeholder) is no longer used on the site.
- The shared site header (wordmark, vertical nav and "Book a session" → `/#book`) still shows above the page, so the wordmark appears twice on `/`. If the wireframe should be the only branding, hide the header on the homepage.
- "Brand & Hospitality" links to `/commercial`. "Portraits & Milestones" has no vertical page.

### Active backlog
- Confirm the delivery times in the service bullets.
- Decide whether the launch campaign should come back to the homepage, and whether the site header should be hidden there.
- Test the tabs, the dropdown and the combobox in a browser (desktop and mobile).
- All earlier backlog items below are still open.

## Wireframe Overhaul: Boutique Studio Hub + SA Suburb Autocomplete
**Status:** ✅ Complete · 2026-10-02 (ACST)

### Build
`npm run build` passes on Next.js 15.5.26 with no TypeScript errors, lint errors or warnings. `/` is now 7.92 kB / 116 kB First Load JS (was 183 B / 113 kB) because the hub and combobox are client components. `/` is ISR with `revalidate = 3600` so the daily quote rolls over. Vertical pages are 124 B / 110 kB. Shared JS is unchanged at 103 kB.

### Changes
| File | Change |
|---|---|
| `lib/sa-suburbs.ts` (new) | 107 SA suburbs and postcodes (64 metro, 43 regional, including the 10 in TASK.md), classified as `metro` ("Metro Adelaide (Standard Included)") or `regional` ("Regional SA (Custom Travel)"). Has `searchSuburbs()` (ranks name prefix, then word start, then postcode) and `findSuburb()` for server validation. Adelaide Hills towns are classed as regional, matching the existing "Regional travel" scope for the Hills. |
| `components/suburb-combobox.tsx` (new) | Client ARIA combobox. Search as you type, ArrowUp/Down/Enter/Escape, clear button. Each option shows name, postcode and a Metro/Regional badge. After a pick it shows a pill: "Metro Adelaide Service Zone - Travel Included", or a custom-travel note for regional. |
| `components/wireframe-hub.tsx` (new) | Client 3-tab hub (ARIA tabs, arrow-key navigation). **Our Services:** Commercial, Real Estate, Celebrations & Events, Portraits cards, each with "Book a session" (opens the Book tab with that service noted) and "See the work" where a vertical page exists. **Book a Session:** First/Last name, email, phone, suburb autocomplete and the "Tell us about your story — we will convert it into photography." textarea. **Contact:** phone (`tel:`), WhatsApp (`wa.me`) and email cards. The `#book`, `#services`, `#contact`, legacy `#inquire` and `#apply-launch-initiative` hashes open the right tab. The launch hash puts the form in launch-application mode. |
| `app/page.tsx` | Rebuilt: launch banner, centred SP Media Co. wordmark hero, the quote of the day, then the hub. The old hero, four-vertical grid, launch section, R6 kit strip and package `InquiryForm` were removed from the homepage. The package form is still on every vertical page. |
| `lib/quotes.ts` (new) | 7 quotes (Ansel Adams, Dorothea Lange, Henri Cartier-Bresson). `quoteOfTheDay()` picks one by calendar day in `Australia/Adelaide`. |
| `lib/contact.ts` (new) | `STUDIO_PHONE`, `STUDIO_EMAIL` (`spmediaco7@gmail.com`), and the derived `tel:` and WhatsApp links. |
| `lib/catalog.ts` | New `HUB_SERVICES` / `HUB_SERVICE_KEYS` for the service cards. |
| `app/api/inquire/route.ts` | Accepts hub submissions (`source: "studio-hub"`). They need a first and last name, email, AU phone, a suburb that exists in the dataset and a story of at least 10 characters. They have no date, package or add-ons. `niche` can only be `launch` and `interest` is optional. Hub leads with no niche have no estimate (`null`). Package-form validation is unchanged, and a date is still required there. The hub success message is "Thank you for sharing your story…". |
| `lib/email.ts` | Lead emails for hub leads show **Suburb** (e.g. "Glenelg 5045") and **Region status** (e.g. "Metro Adelaide (Standard Included) · Metro Adelaide Service Zone - Travel Included"). The brief heading becomes "Client story". The subject includes the suburb, e.g. "New Portraits session inquiry · Jo Smith · Glenelg · SPM-…". Scope and date are omitted or marked "Not given" when absent. |
| `components/site-header.tsx` | The CTA is now "Book a session" and links to `/#book`. |

### Verification (`next start`, `RESEND_API_KEY` blanked)
- Hub story (Glenelg, portraits) → 201. The lead log shows `suburb.region: "metro"` and `estimate: null`.
- Hub launch application (Tanunda) → 201 with the launch message, logged as `[LAUNCH OFFER APPLICANT] #1`, region `regional`.
- Invalid hub payload (bad postcode, empty names, short story, `niche: weddings`) → 422 with field errors for suburb, firstName, lastName, email, phone and message.
- Package-form wedding (Barossa, drone, rush, +2 hrs) → 201, floor total 3520 as before. Package form with no date → 422 `preferredDate`.
- The homepage HTML contains the three tabs, the story textarea label, the quote, the `wa.me` link and the launch links.
- `leadText` / `leadHtml` rendered for a hub lead: Suburb and Region status lines are present, and client input is HTML-escaped.
- No pricing constants (`hourlyRate`) appear in `.next/static`.
- **Not tested:** combobox keyboard and mouse use, tab switching and hash deep links in a real browser, and a real Resend send.

### Notes
- **`STUDIO_PHONE` in `lib/contact.ts` is a placeholder (`0400 000 000`).** The Contact tab's call and WhatsApp links are dead until a real number is set. No studio phone exists anywhere in the repo.
- The studio email on the Contact tab is `spmediaco7@gmail.com` (the lead inbox). Swap it for a domain address once `spmediaco.com.au` mail is set up.
- Sports no longer has a homepage card, because TASK.md lists four services without it. It is still in the header and footer nav.
- "Celebrations & Events" links to `/weddings`. "Portraits" has no vertical page, so its card only offers booking.
- The launch campaign now runs through the hub form (banner → Book tab in launch mode). The long launch section with the "What you get / What we ask" cards was cut. The same terms are shown in the form when launch mode is active.

### Active backlog
- Set the real studio phone in `lib/contact.ts`.
- Test the combobox, the tabs and the hash deep links in a browser (desktop and mobile).
- Consider a `/portraits` vertical page and suburb landing pages that reuse `lib/sa-suburbs.ts`.
- All earlier backlog items below are still open.

## Floor Plan Deliverables (Real Estate)
**Status:** ✅ Complete · 2026-09-26 (ACST)

### Build
`npm run build` passes on Next.js 15.5.26 with no TypeScript errors, lint errors or warnings. The vertical pages went from 109 kB to 110 kB First Load JS. Everything else is unchanged (`/` 183 B / 113 kB, shared JS 103 kB).

### Changes
| File | Change |
|---|---|
| `lib/catalog.ts` | Two new real estate deliverables: "Professional 2D Floor Plan with Room Dimensions & Total Area" and "Interactive Virtual Tour / 3D Walkthrough ready". New `FLOOR_PLAN_ADD_ON` export ("Schematic 2D Floor Plan", real estate only). |
| `components/inquiry-form.tsx` | Shows a "Schematic 2D Floor Plan" toggle in Add-ons when Real Estate is selected, and lists it in the Estimated Scope Summary. `addOns.floorPlan` is sent as false for other niches and for the launch session. |
| `app/api/inquire/route.ts` | Accepts `addOns.floorPlan`, but only for `real-estate`. It is ignored for other niches. Stored on the inquiry record and passed to the estimate. |
| `lib/pricing.ts` | New `floorPlan` add-on line. The rate is a **placeholder of 0**, because no floor plan price has been set. |
| `lib/email.ts` | Lead emails list "Add-on: schematic 2D floor plan" when it is selected. |
| `components/vertical-page.tsx` | New optional `callout` prop that renders a copper-bordered highlight bullet under the hero CTA. |
| `app/real-estate/page.tsx` | Uses the callout (Ruler icon) for "Accurate, Council-Ready 2D Floor Plans delivered in 24 hours alongside HDR stills." |

### Verification
- The prerendered `/real-estate` HTML contains the callout sentence and both new deliverables.
- No pricing constants (`hourlyRate`) appear in `.next/static` client chunks.
- The add-on toggle and the API path were not exercised in a browser or with a live POST during this run.

### Notes
- The package now includes a professional 2D floor plan, and a schematic 2D floor plan is also offered as a paid add-on, as TASK.md asked. Check that the difference between the two is clear to clients, or adjust the add-on wording.
- The "24 hours" in the callout is a delivery promise on the public page. Make sure the floor plan workflow can meet it.

### Active backlog
- Set a real price for the Schematic 2D Floor Plan add-on in `lib/pricing.ts` (currently 0).
- All items from the previous milestone's backlog below are still open.

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
