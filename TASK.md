# TASK: Full Visual Identity Overhaul - Luxury Editorial Boutique Studio

CRITICAL: Eliminate all "developer dark mode", AI-template aesthetics, and static form styling. Rebuild the frontend to reflect a luxury, authentic Australian boutique media studio (refined typography, organic warm palette, and an interactive editorial booking concierge).

1. Design System & Palette:
   - Theme: Deep warm carbon (#121110) or warm museum canvas (#F9F8F6) editorial aesthetic.
   - Accents: Champagne brass (#C5A880) and soft warm stone (#E7E3DC).
   - Typography: Serif headings (Cormorant Garamond / Playfair Display styling) paired with clean, tracked grotesque sans-serif for labels and body copy.
   - Micro-details: Subtle border radiuses (rounded-xl), soft ambient shadows, delicate 1px border lines (#262422 or #E2DDD5), and organic transitions.

2. Interactive Multi-Step Studio Concierge (`components/booking-concierge.tsx`):
   - Replace the static text form with an engaging, smooth multi-step booking experience:
     * STEP 1: Discipline Selection (Visual selectable cards with icons & descriptions):
       - Brand & Hospitality (Food, beverage, venues, commercial products)
       - Spaces & Real Estate (Interiors, architecture, 24h delivery)
       - Celebrations & Events (Birthdays, corporate events, parties)
       - Portraits & Milestones (Graduations, creative portraits, headshots)
     * STEP 2: Location & Timing:
       - Adelaide Suburb selector (using the existing `suburb-combobox.tsx` with instant badge feedback: "Metro Adelaide - Travel Included").
       - Preferred Date / Timeline selector.
     * STEP 3: The Story & Contact:
       - First & Last Name, Direct Phone Number, Email.
       - Signature textarea: "Tell us about your story — we will convert it into photography."
       - Live reassuring badges: "Adelaide Based Studio · Fast 2-Hour Response · High-Resolution Masters".
   - Seamless submission via existing `/api/inquire` route with an elegant confirmation modal upon success.

3. Page Structure (`app/page.tsx`):
   - Refined Studio Header:
     * "SP MEDIA CO." with subtitle "Adelaide, South Australia · Commercial, Spaces & Event Studio".
     * Daily Rotating Photography Quote in an elegant serif italic quote card.
   - Clean Segment Navigation / Tabs:
     * [ Our Disciplines ]  [ About The Craft ]  [ Reserve Session ]
   - Disciplines Showcase:
     * Editorial service breakdown showing exactly what clients receive:
       - Canon full-frame glass & natural studio light.
       - Hand-graded high-resolution digital master files.
       - Private password-protected client download gallery.
       - Transparent turnaround times (24-48 hours for real estate, 3-5 days for events/hospitality).
   - Transparent Adelaide Studio Guarantee:
     * ABN registered (ABN 46 478 326 745), direct phone / WhatsApp quick link, and spmediaco7@gmail.com.

4. Verification:
   - Run `npm run build` to verify zero compile, JSX, or TypeScript errors.
   - Confirm all interactive states (card selections, step transitions, suburb combobox) work without bugs.
   - Update `STATUS.md`.