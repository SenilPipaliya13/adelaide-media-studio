# TASK: Wire Email Lead Notifications with Resend

1. Dependencies:
   - Install `resend`

2. Email Dispatch Engine (`lib/email.ts`):
   - Initialize Resend with `process.env.RESEND_API_KEY`.
   - Create a clean HTML notification template containing:
     * Lead Type / Service requested
     * Full Name, Email, and Phone Number (clickable `tel:` and `mailto:` links)
     * Location & Preferred Date
     * Selected Scope / Add-ons summary
     * Client's custom brief / message

3. Wire into Inquiry API (`app/api/inquire/route.ts`):
   - When an inquiry or launch session application is validated:
     * If `process.env.RESEND_API_KEY` is present, dispatch the email immediately to `process.env.NOTIFICATION_EMAIL` (default: spmediaco7@gmail.com).
     * If Resend API key is missing or fails, log the lead to the server console and continue returning 201 so the user's booking never errors out.

4. Add Safety Cap for Free Launch Offer:
   - In `app/api/inquire/route.ts`, keep a simple in-memory / counter tracking launch initiative applications, tagging them clearly as `[LAUNCH OFFER APPLICANT]` in the email subject line.

5. Verification:
   - Run `npm run build` with zero errors.
   - Update `STATUS.md`.