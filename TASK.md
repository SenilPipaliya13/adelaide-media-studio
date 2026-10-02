# TASK: Wireframe Overhaul - Authentic Boutique Studio + SA Suburb Autocomplete

1. Adelaide Suburbs Engine:
   - Create `lib/sa-suburbs.ts` containing a dataset of Greater Adelaide & Regional SA suburbs and postcodes (e.g., Adelaide CBD 5000, North Adelaide 5006, Norwood 5067, Glenelg 5045, Unley 5061, Prospect 5082, Bowden 5007, Henley Beach 5022, Barossa 5352, McLaren Vale 5171).
   - Classify them into "Metro Adelaide (Standard Included)" vs "Regional SA (Custom Travel)".

2. Dynamic Suburb Autocomplete Component:
   - Create `components/suburb-combobox.tsx`:
     * Search-as-you-type input with smooth keyboard navigation.
     * Displays Suburb Name, Postcode, and Region badge.
     * On selection, displays a subtle reassurance pill: "Metro Adelaide Service Zone - Travel Included".

3. Homepage Redesign (`app/page.tsx` & `components/wireframe-hub.tsx`):
   - Header: Elegant branding for SP Media Co.
   - Daily Photography Quote: Serendipitous rotating master quote (Ansel Adams, Dorothea Lange, Cartier-Bresson) that changes with the calendar day.
   - Clean 3-Tab Studio Hub:
     * Tab 1: [ Our Services ] -> Visual cards for Commercial, Real Estate, Celebrations & Events, and Portraits.
     * Tab 2: [ Book a Session ] -> Human story form with First/Last Name, Email, Phone, the Suburb Autocomplete, and the custom textarea: "Tell us about your story — we will convert it into photography."
     * Tab 3: [ Contact ] -> Direct Adelaide phone, WhatsApp quick-link, and studio email.

4. Resend Lead Pipeline:
   - Update `app/api/inquire/route.ts` to include the selected Suburb and Region status in the email sent to `spmediaco7@gmail.com`.

5. Verification:
   - Run `npm run build` to verify zero compile or type errors.
   - Update `STATUS.md`.