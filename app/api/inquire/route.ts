import { NextResponse } from "next/server";
import {
  FLOOR_PLAN_ADD_ON,
  HUB_SERVICE_KEYS,
  LAUNCH_NICHE,
  LOCATION_KEYS,
  MAX_EXTRA_HOURS,
  NICHE_KEYS,
  type HubService,
  type LocationKey,
  type Niche,
} from "@/lib/catalog";
import { sendLeadNotification } from "@/lib/email";
import { calculateEstimate } from "@/lib/pricing";
import { findSuburb } from "@/lib/sa-suburbs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Australian mobile or landline, allowing spaces, dashes and +61.
const AU_PHONE_RE = /^(?:\+?61|0)[2-478]\d{8}$/;

type Body = Record<string, unknown>;

// Launch offer applications received since this server instance started. In-memory only,
// so it resets on restart/redeploy and is not shared across serverless instances.
let launchApplicationCount = 0;

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

export async function POST(req: Request) {
  let body: Body;
  try {
    const parsed = await req.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error();
    body = parsed as Body;
  } catch {
    return NextResponse.json({ error: "Request body must be a JSON object." }, { status: 400 });
  }

  const fields: Record<string, string> = {};

  // The homepage studio hub sends a story-led enquiry: first/last name, a suburb from the SA
  // dataset and a free-form story, with no package, add-ons or date. Its only niche is the
  // launch application. Vertical pages send the full package form.
  const isHub = body.source === "studio-hub";

  const niche: Niche | null = isHub
    ? body.niche === LAUNCH_NICHE
      ? LAUNCH_NICHE
      : null
    : NICHE_KEYS.includes(body.niche as Niche)
      ? (body.niche as Niche)
      : null;
  if (!isHub && !niche) fields.niche = "Choose a shoot type.";

  const interest = HUB_SERVICE_KEYS.includes(body.interest as HubService)
    ? (body.interest as HubService)
    : null;

  const suburbBody = (body.suburb ?? {}) as Body;
  const suburb = findSuburb(str(suburbBody.name, 100), str(suburbBody.postcode, 4)) ?? null;
  if (isHub && !suburb) fields.suburb = "Choose your suburb from the list.";

  const locationKey = LOCATION_KEYS.includes(body.locationKey as LocationKey)
    ? (body.locationKey as LocationKey)
    : null;
  const location = str(body.location);

  // The complimentary launch session is a fixed 45-minute shoot and hub enquiries have no
  // package yet, so add-ons are ignored for both.
  const isLaunch = niche === LAUNCH_NICHE;
  const addOns = (isLaunch || isHub ? {} : body.addOns ?? {}) as Body;
  const drone = addOns.drone === true;
  const rush = addOns.rush === true;
  // Floor plans are only offered with the real estate package.
  const floorPlan = niche === FLOOR_PLAN_ADD_ON.niche && addOns.floorPlan === true;
  const extraHours = Number(addOns.extraHours ?? 0);
  if (!Number.isInteger(extraHours) || extraHours < 0 || extraHours > MAX_EXTRA_HOURS) {
    fields.extraHours = `Extra hours must be between 0 and ${MAX_EXTRA_HOURS}.`;
  }

  let name: string;
  if (isHub) {
    const firstName = str(body.firstName, 50);
    const lastName = str(body.lastName, 50);
    if (!firstName) fields.firstName = "Please enter your first name.";
    if (!lastName) fields.lastName = "Please enter your last name.";
    name = `${firstName} ${lastName}`.trim();
  } else {
    name = str(body.name, 100);
    if (name.length < 2) fields.name = "Please enter your name.";
  }

  const email = str(body.email, 200).toLowerCase();
  if (!EMAIL_RE.test(email)) fields.email = "Please enter a valid email.";

  const phone = str(body.phone, 30);
  if (!AU_PHONE_RE.test(phone.replace(/[\s()-]/g, ""))) {
    fields.phone = "Please enter a valid Australian phone number.";
  }

  // The hub form has no date picker; the package form requires one.
  const preferredDate = str(body.preferredDate, 10);
  if (!isHub || preferredDate) {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate) || Number.isNaN(Date.parse(preferredDate))) {
      fields.preferredDate = "Please choose a date.";
    } else {
      // Compare against today's date in Adelaide so late-evening bookings aren't rejected.
      const todayAdelaide = new Date().toLocaleDateString("en-CA", { timeZone: "Australia/Adelaide" });
      if (preferredDate < todayAdelaide) fields.preferredDate = "Date can't be in the past.";
    }
  }

  const message = str(body.message, 2000);
  if (isHub && message.length < 10) fields.message = "Tell us a little about your story.";

  if (Object.keys(fields).length > 0) {
    return NextResponse.json({ error: "Please fix the highlighted fields.", fields }, { status: 422 });
  }

  // Internal floor cost for the studio only. It is logged and stored, never returned to the client.
  // Story enquiries have no package yet, so they are quoted from scratch.
  const estimate = niche
    ? calculateEstimate({ niche, location: locationKey, drone, rush, floorPlan, extraHours })
    : null;
  const reference = `SPM-${Date.now().toString(36).toUpperCase()}`;

  const inquiry = {
    reference,
    source: isHub ? ("studio-hub" as const) : ("package-form" as const),
    niche,
    interest,
    suburb,
    location: location || null,
    locationKey,
    addOns: { drone, rush, floorPlan, extraHours },
    name,
    email,
    phone,
    preferredDate: preferredDate || null,
    message: message || null,
    estimate,
    receivedAt: new Date().toISOString(),
  };

  // TODO: persist to Supabase `inquiries` table once credentials are configured.
  console.info(
    "[inquire] new inquiry",
    inquiry.reference,
    inquiry.niche ?? inquiry.source,
    inquiry.estimate?.total ?? "story (quote from scratch)",
  );

  const launchApplicationNumber = isLaunch ? ++launchApplicationCount : undefined;
  if (isLaunch) {
    console.info(`[inquire] [LAUNCH OFFER APPLICANT] #${launchApplicationNumber}`, reference);
  }

  // Email failures must never fail the booking, so the lead is logged in full instead.
  const notification = await sendLeadNotification({ ...inquiry, launchApplicationNumber });
  if (notification.sent) {
    console.info("[inquire] notification sent", reference, notification.id);
  } else {
    console.warn("[inquire] notification not sent:", notification.reason);
    console.info("[inquire] lead details", JSON.stringify({ ...inquiry, launchApplicationNumber }));
  }

  return NextResponse.json(
    {
      ok: true,
      reference,
      message: isLaunch
        ? "Thank you for applying to the Adelaide Launch Initiative. We will review your application and reply within 24 hours."
        : isHub
          ? "Thank you for sharing your story. We will be in touch within 24 hours to plan your session."
          : "Thank you. We will review your brief and send a bespoke proposal within 24 hours.",
    },
    { status: 201 },
  );
}
