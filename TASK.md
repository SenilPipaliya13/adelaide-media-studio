# TASK: Complete Homepage Replacement - Exact Wireframe Layout

CRITICAL: Completely overwrite `app/page.tsx`. Delete all old hero sections, generic SaaS headings ("Photography & video for moments that matter"), launch banners, and generic buttons. Replace the entire page view with the authentic wireframe structure.

1. Layout & Styling Architecture (`app/page.tsx`):
   - Background: Deep matte obsidian/charcoal (`#0d0d11`).
   - Clean minimalist top branding:
     * Display "SP MEDIA CO." centered or top-left in refined tracking, with "Adelaide, South Australia" subtly beneath.
   - Welcome & Daily Master Quote:
     * Headline: "Welcome to SP Media Co."
     * Daily Photography Quote component (rendered directly beneath welcome, in an elegant serif italic with author citation).
   - 3-Segment Navigation Switcher:
     * Three distinct clickable tab buttons centered on screen:
       [ Our Services ]   [ Contact Us ]   [ Book Us ]
     * Active tab is highlighted with a warm copper accent border/fill; inactive tabs remain subtle minimal outline.

2. Content Under Each Tab:
   - TAB 1: [ Our Services ]
     * Clean, unpretentious list of the core craft pillars:
       1. Brand & Hospitality (Food, beverage, venues, and commercial spaces)
       2. Real Estate & Architecture (Interiors, exteriors, twilight, 24h delivery)
       3. Celebrations & Events (Birthdays, milestones, community gatherings)
       4. Portraits & Milestones (Graduations, headshots, natural portraiture)
     * Bullet points for each highlighting craft, delivery times, and inclusions.
   - TAB 2: [ Contact Us ]
     * Direct, transparent contact card:
       - Studio Email: spmediaco7@gmail.com
       - Base: Adelaide & Greater South Australia
       - Quick-action buttons: "Email Us Directly" and direct inquiry button.
   - TAB 3: [ Book Us ]
     * The authentic story-first booking form:
       - Inputs: First Name, Last Name, Email, Phone Number.
       - Service Dropdown / Genre Selector.
       - Suburb Autocomplete Input: Integrate `components/suburb-combobox.tsx` with live SA suburbs and Metro Adelaide badge.
       - Story Textarea (exact wireframe wording): "Tell us about your story — we will convert it into photography."
       - Submit button: "Send Inquiry" (connected to `/api/inquire`).

3. Verification:
   - Run `npm run build` to confirm zero TypeScript, lint, or JSX errors.
   - Ensure `app/page.tsx` directly renders this wireframe without any lingering legacy SaaS layout elements.
   - Update `STATUS.md`.