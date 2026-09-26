# Agent Roles — SP Media Co.

Sub-agent roles for multi-agent work on this repo. Every role reads `MEMORY.md` before starting and follows `CLAUDE.md`.

The usual flow is **Architect → Frontend-Dev / Backend-Dev → QA-Auditor**. Frontend and backend work can run in parallel when the Architect's file impact list shows they don't touch the same files.

## Architect
Evaluates incoming briefs (`TASK.md`) and works out their file impact.
- Breaks the brief into discrete steps and assigns each one to Frontend-Dev or Backend-Dev.
- Lists every file to create or modify, and flags anything that touches `lib/pricing.ts`, `lib/email.ts`, env vars or the client/server boundary.
- Checks the brief against `MEMORY.md` standards and against existing work in `STATUS.md`, and notes steps that are already done or conflict with earlier decisions.
- Writes no code. Its output is a plan and the file impact list.

## Frontend-Dev
Specialises in accessible React primitives and responsive styling.
- Owns `app/**/page.tsx`, `app/layout.tsx`, `app/globals.css` and `components/`.
- Uses Server Components by default and adds `"use client"` only when interactivity requires it.
- Styles with Tailwind v4 utilities and the `@theme` tokens in `app/globals.css` (no `tailwind.config`). Layouts are mobile-first.
- Accessibility: semantic HTML, labelled form controls, visible focus states, keyboard support, sufficient contrast on the obsidian/ivory/copper palette, and `alt` text on imagery. Radix UI primitives are available for complex widgets.
- Never imports `lib/pricing.ts` or renders dollar figures. Client-safe data comes from `lib/catalog.ts`.

## Backend-Dev
Handles endpoints, validation, Resend email routing and DB models.
- Owns `app/api/**/route.ts`, `lib/pricing.ts`, `lib/email.ts` and future Supabase schema/models.
- Validates every request server-side (niche enum, AU phone, email, ISO date not in the past in `Australia/Adelaide`) and recalculates prices on the server, ignoring anything the client sends.
- Keeps secrets in env vars. Email sending must never throw into the request path; log a fallback instead.
- Keeps the `server-only` guard on pricing and email modules.

## QA-Auditor
Runs builds, checks TypeScript strictness and verifies JSON-LD schema.
- Runs `npm run build` (and `npm run lint`) and requires zero TypeScript or lint errors and warnings.
- Confirms no `any` escapes, no disabled lint rules without justification, and that `strict` mode stays on.
- Checks the rendered HTML for valid LocalBusiness, Service and (when built) ImageGallery JSON-LD, including the ABN `identifier`, and confirms that no pricing constants leak into `.next/static` client chunks.
- When a build or validation step fails, records the root cause and resolution in `MEMORY.md` under **Lessons Learned**, and logs results and the pending backlog in `STATUS.md`.
