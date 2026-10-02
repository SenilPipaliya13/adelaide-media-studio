# MEMORY — SP Media Co.

Project memory base. Read this before starting any task. The standards below are fixed; add new findings under **Lessons Learned**.

## Immutable Project Standards

### Next.js 15 App Router & React 19
- Next.js 15.5 (App Router only, no `pages/` directory) with React 19.1 and TypeScript (`strict: true`).
- Components in `app/` and `components/` are Server Components by default. Add `"use client"` only when a component needs state, effects, event handlers or browser APIs. Current client components: `components/inquiry-form.tsx` (vertical pages), and `components/studio-tabs.tsx`, `components/booking-concierge.tsx` and `components/suburb-combobox.tsx` (homepage).
- API endpoints are Route Handlers (`app/<path>/route.ts`) that export named HTTP methods (`POST`, `GET`, …).
- Page metadata uses the `metadata` export or `generateMetadata`, not `<head>` tags.
- Use the `@/` path alias for imports (`@/lib/...`, `@/components/...`).
- Lint config is ESLint 9 flat config (`next/core-web-vitals` + `next/typescript`). `npm run build` must finish with zero TypeScript or lint errors.

### Styling: Tailwind CSS v4
- Theme tokens live in the `@theme` block in `app/globals.css`, which begins with `@import "tailwindcss";`. Never use the v3 `@tailwind base/components/utilities` directives, even if a brief pastes them. The palette is a light editorial one. The source hexes are the `:root` variables (`--bg-main`, `--text-main`, `--text-muted`, `--border-line`, `--card-bg`, `--accent-gold`), and the tokens read from them: `canvas` (page), `card`, `carbon` (text, dark bands, primary buttons), `stone`, `line`/`line-dark` hairlines, `gold` (decorative rules and icons only), `brass` accents and `ink-muted`. Use `brass-deep` rather than `brass` or `gold` for small text or icons on light grounds, because those fail contrast. Use `brass`, not `gold`, for text on carbon. Fonts are Cormorant Garamond (serif) and Inter (sans). Don't add unlayered `font-family` rules on `body` or `.font-serif`: unlayered CSS beats Tailwind's layered utilities and would replace the webfonts. The old `obsidian`/`ivory`/`copper` tokens no longer exist.
- The site is light-only. `color-scheme: only light` (on `:root`, plus `viewport.colorScheme` in `app/layout.tsx`) stops browser force-dark modes from inverting it. Keep both.
- next/font `.variable` classes must stay on `<html>`, not `<body>` (see Lessons Learned, 2026-10-02).
- There is **no** `tailwind.config.*` file. Do not create one. Add or change tokens in `@theme`.
- PostCSS runs through `@tailwindcss/postcss` (`postcss.config.mjs`).
- Icons come from `lucide-react`. Lucide v1 ships no brand logos (such as Instagram), so use generic icons.

### Server Security: pricing is server-only
- `lib/pricing.ts` starts with `import "server-only"`. It holds base/hourly rates, travel fees, add-on prices and `calculateEstimate()`. Importing it from a client component must fail the build. Never remove that guard.
- No dollar figures go into client code, rendered HTML or API responses. Client-safe data (labels, deliverables, scope, `MAX_EXTRA_HOURS`) lives in `lib/catalog.ts`.
- `lib/email.ts` (Resend) is also `server-only`. Secrets (`RESEND_API_KEY`, `NOTIFICATION_EMAIL`, `RESEND_FROM`) stay in `.env.local` (gitignored) and hosting env settings, never in code.
- The one intentional exception is the launch session's "$0 (Selected by Application)" label.

### Business Identity
- Trading name: **SP Media Co.**, ABN **46 478 326 745**, Adelaide, South Australia (ACST / `Australia/Adelaide`).
- Domain: spmediaco.com.au. The ABN constant lives in `lib/seo.ts` (`ABN`) and is reused by the footer and the LocalBusiness JSON-LD `identifier`. Import it rather than hard-coding it.

## Lessons Learned
_Record the root cause and resolution of every build or validation error here, newest first. Format: date · symptom · root cause · resolution._

- **2026-10-02 · Webfonts never rendered.** Every heading and label fell back to a system font, although the build passed and the CSS looked right (`.font-serif{font-family:var(--font-serif)}`). It was only caught by reading `getComputedStyle` in a real browser and looking at screenshots. **Root cause:** Tailwind v4 declares `--font-serif: var(--font-cormorant)…` on `:root`, but the next/font `.variable` classes were on `<body>`. A `var()` inside a custom property resolves on the element where that property is declared, so at `:root` `--font-cormorant` was undefined. That made the whole token invalid, and every descendant inherited the invalid value. **Resolution:** put the next/font variable classes on `<html>` (`app/layout.tsx`). Check rendered fonts in a browser after any font change, because the build won't catch this.
