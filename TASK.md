# TASK: Transition to Bespoke Proposal & Custom Quote Model (No Fixed Prices)

1. Remove Hardcoded Prices from UI:
   - In `components/inquiry-form.tsx` and all page routes (`/`, `/weddings`, `/commercial`, `/real-estate`, `/sports`):
     * Remove all visible dollar figures (no "$350", "$2,800", etc.).
     * Replace the running cash total box with a dynamic "Estimated Scope Summary" that clearly lists the selected package deliverables, location scope, and active add-ons.
     * Update the submit button text to: "Request Tailored Quote".
     * Add a direct booking notice below the form: "Prefer a faster response? DM us on Instagram @spmediaco or call us directly."

2. Keep Internal Pricing Engine (`lib/pricing.ts`):
   - Retain the pricing math internally for server-side evaluation only so the studio knows the floor cost of the lead, but do NOT send dollar figures back in the client-facing API response.

3. Update API Response (`app/api/inquire/route.ts`):
   - Modify the 201 JSON return object to omit public price numbers:
     `{ ok: true, reference: string, message: "Thank you. We will review your brief and send a bespoke proposal within 24 hours." }`

4. Verification:
   - Ensure `npm run build` passes with zero errors.
   - Update `STATUS.md` with the changes.