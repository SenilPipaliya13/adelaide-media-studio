# TASK: Initialize Agentic Multi-Agent Protocol & Self-Improving Memory

1. Create Project Memory Base (`MEMORY.md`):
   - Document immutable project standards:
     * Next.js 15 App Router conventions & React 19 rules.
     * Styling: Tailwind v4 theme variables in `app/globals.css` (no tailwind.config).
     * Server security: `lib/pricing.ts` is strictly `server-only` to protect quotation logic.
     * Business Identity: SP Media Co. (ABN: 46 478 326 745), Adelaide, South Australia.

2. Create Agent Role Definitions (`agents/README.md`):
   - Define sub-agent roles:
     * `Architect`: Evaluates incoming briefs and determines file impact.
     * `Frontend-Dev`: Specializes in accessible React primitives and responsive styling.
     * `Backend-Dev`: Handles endpoints, validation, Resend email routing, and DB models.
     * `QA-Auditor`: Runs builds, checks TypeScript strictness, and verifies schema JSON-LD.

3. Update `CLAUDE.md` Orchestration Directive:
   - Add rule: Before processing any task, read `MEMORY.md` to load accumulated learnings.
   - Add rule: If an execution error occurs during build/validation, document the root cause and resolution in `MEMORY.md` under `## Lessons Learned`.
   - Add rule: Maintain active status and pending backlogs in `STATUS.md`.

4. Verification:
   - Run `npm run build` to confirm workspace integrity.
   - Log initialization summary in `STATUS.md`.