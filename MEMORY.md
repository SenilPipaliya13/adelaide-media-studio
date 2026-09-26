# MEMORY — SP Media Co.

Project memory base. Read this before starting any task. The standards below are fixed; add new findings under **Lessons Learned**.

## Immutable Project Standards

### Next.js 15 App Router & React 19
- Next.js 15.5 (App Router only, no `pages/` directory) with React 19.1 and TypeScript (`strict: true`).
- Components in `app/` and `components/` are Server Components by default. Add `"use client"` only when a component needs state, effects, event handlers or browser APIs. `components/inquiry-form.tsx` is currently the only client component.
- API endpoints are Route Handlers (`app/<path>/route.ts`) that export named HTTP methods (`POST`, `GET`, …).
- Page metadata uses the `metadata` export or `generateMetadata`, not `<head>` tags.
- Use the `@/` path alias for imports (`@/lib/...`, `@/components/...`).
- Lint config is ESLint 9 flat config (`next/core-web-vitals` + `next/typescript`). `npm run build` must finish with zero TypeScript or lint errors.

### Styling: Tailwind CSS v4
- Theme tokens (the `obsidian`, `ivory` and `copper` palettes, plus fonts) live in the `@theme` block in `app/globals.css`, which begins with `@import "tailwindcss";`.
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

- _No entries yet._
