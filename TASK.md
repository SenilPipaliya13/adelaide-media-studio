# TASK: ABN Display, Adelaide Founders Launch Campaign & Lead Notification Setup

1. ABN & Legal Footer Update:
   - In `components/site-footer.tsx`:
     * Add the official Australian business identifier: "ABN: 46 478 326 745"
     * Format the legal line: "SP Media Co. · ABN 46 478 326 745 · Adelaide, South Australia"
     * Update `lib/seo.ts` to include the ABN in the LocalBusiness schema identifier.

2. "Adelaide Founders & Portfolios" Launch Campaign:
   - Add a high-converting announcement banner and dedicated card section on the homepage (`app/page.tsx`):
     * Title: "Adelaide Launch Initiative: 5 Complimentary Commercial Sessions"
     * Tagline: "To celebrate our Adelaide launch, SP Media Co. is partnering with 5 local founders, businesses, or real estate specialists for a complimentary 45-minute hero brand session."
     * What they get: 5 master high-res commercial stills shot on full-frame Canon EOS R6 Mark III glass + commercial release.
     * What we ask: Verified Google review + permission to feature imagery in our launch portfolio.
     * CTA: A button that scrolls directly to or pre-selects the inquiry form with "Launch Initiative Application".

3. Inquiry Form Enhancement (`components/inquiry-form.tsx`):
   - Add "Adelaide Launch Initiative (Complimentary Session)" to the service picker dropdown/selector.
   - When selected, mark total estimated price as "$0 (Selected by Application)" and update the submit button to "Apply for Complimentary Session".

4. Verification:
   - Run `npm run build` and ensure zero errors.
   - Append execution notes to `STATUS.md`.