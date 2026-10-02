# TASK: Strip Cheap SaaS Elements & Deploy Editorial Studio Styling

Fix the design issues across `app/page.tsx`, `components/studio-tabs.tsx`, and `components/booking-concierge.tsx`:

1. Remove Hero Glow:
   - In `app/page.tsx`, delete the gold blurred radial glow block behind the masthead.

2. Clean Pull Quote:
   - In `app/page.tsx`, remove the frosted-glass rounded card, shadow, and `backdrop-blur` from the quote.
   - Restyle it as a clean editorial pull quote between a top and bottom hairline border (`border-y border-line py-8 max-w-2xl mx-auto`).

3. Fix Studio Tabs:
   - In `components/studio-tabs.tsx`, replace the rounded pill app toggle with clean uppercase text tabs. Use a simple underline for the active tab instead of a pill background.

4. Remove SaaS Corner Radius & Drop Shadows:
   - Strip `rounded-xl`, `shadow-ambient`, and `hover:-translate-y-0.5` from discipline cards, guarantee cards, and grids.
   - Use crisp borders (`border border-line`) with subtle hover color changes. No floating cards.

5. Editorial Buttons:
   - Change pill-shaped buttons to clean rectangular buttons with letter-spaced uppercase text.

6. Clean Reassurance Badges:
   - In `components/booking-concierge.tsx`, remove the green-tick pill badges.
   - Replace with a quiet single line separated by dots: `ABN REGISTERED · METRO ADELAIDE TRAVEL INCLUDED · HIGH-RES DIGITAL MASTERS`.

7. Verification:
   - Run `npm run build` to confirm zero compilation errors.
   - Update `STATUS.md`.