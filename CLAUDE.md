# SP Media Co. — System & Engineering Context

## Business Context
- Brand: SP Media Co.
- Domain: spmediaco.com.au
- Market: Adelaide, South Australia (ACST)
- Primary Gear: Canon EOS R6 Mark III (32.5MP, 40fps burst, 7K video)
- Core Verticals:
  1. /weddings — Barossa, McLaren Vale, Adelaide Hills
  2. /commercial — Lot Fourteen, Adelaide Convention Centre, CBD B2B
  3. /real-estate — Interior/exterior HDR bracket stills, drone video, agent reels ($350 AUD intro package)
  4. /sports — High-speed athletics, SANFL, Gather Round action

## Technical Stack
- Framework: Next.js 15 (App Router), TypeScript, Tailwind CSS
- UI System: Lucide React, Radix UI primitives / Tailwind styling
- Backend / Lead Storage: Supabase / PostgreSQL schema
- Media Delivery: Cloudflare R2 (zero egress fees for client proofing)
- SEO: Dynamic LocalBusiness & ImageGallery JSON-LD for Adelaide suburbs

## Development Protocol
- Every task must compile cleanly with `npm run build` with zero TypeScript or lint errors.
- Status, build output, and completed milestones must be logged to `STATUS.md`.

## Orchestration Directive
- Before processing any task, read `MEMORY.md` to load accumulated learnings and the immutable project standards.
- If an execution error occurs during build/validation, document the root cause and resolution in `MEMORY.md` under `## Lessons Learned`.
- Maintain active status and pending backlogs in `STATUS.md`.
- Sub-agent roles (Architect, Frontend-Dev, Backend-Dev, QA-Auditor) are defined in `agents/README.md`.