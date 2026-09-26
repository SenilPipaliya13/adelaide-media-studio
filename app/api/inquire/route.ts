import { NextResponse } from "next/server";
import {
  LAUNCH_NICHE,
  LOCATION_KEYS,
  MAX_EXTRA_HOURS,
  NICHE_KEYS,
  type LocationKey,
  type Niche,
} from "@/lib/catalog";
import { calculateEstimate } from "@/lib/pricing";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
// Australian mobile or landline, allowing spaces, dashes and +61.
const AU_PHONE_RE = /^(?:\+?61|0)[2-478]\d{8}$/;

type Body = Record<string, unknown>;

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

  const niche = body.niche as Niche;
  if (!NICHE_KEYS.includes(niche)) fields.niche = "Choose a shoot type.";

  const locationKey = LOCATION_KEYS.includes(body.locationKey as LocationKey)
    ? (body.locationKey as LocationKey)
    : null;
  const location = str(body.location);

  // The complimentary launch session is a fixed 45-minute shoot, so add-ons are ignored.
  const isLaunch = niche === LAUNCH_NICHE;
  const addOns = (isLaunch ? {} : body.addOns ?? {}) as Body;
  const drone = addOns.drone === true;
  const rush = addOns.rush === true;
  const extraHours = Number(addOns.extraHours ?? 0);
  if (!Number.isInteger(extraHours) || extraHours < 0 || extraHours > MAX_EXTRA_HOURS) {
    fields.extraHours = `Extra hours must be between 0 and ${MAX_EXTRA_HOURS}.`;
  }

  const name = str(body.name, 100);
  if (name.length < 2) fields.name = "Please enter your name.";

  const email = str(body.email, 200).toLowerCase();
  if (!EMAIL_RE.test(email)) fields.email = "Please enter a valid email.";

  const phone = str(body.phone, 30);
  if (!AU_PHONE_RE.test(phone.replace(/[\s()-]/g, ""))) {
    fields.phone = "Please enter a valid Australian phone number.";
  }

  const preferredDate = str(body.preferredDate, 10);
  if (!/^\d{4}-\d{2}-\d{2}$/.test(preferredDate) || Number.isNaN(Date.parse(preferredDate))) {
    fields.preferredDate = "Please choose a date.";
  } else {
    // Compare against today's date in Adelaide so late-evening bookings aren't rejected.
    const todayAdelaide = new Date().toLocaleDateString("en-CA", { timeZone: "Australia/Adelaide" });
    if (preferredDate < todayAdelaide) fields.preferredDate = "Date can't be in the past.";
  }

  const message = str(body.message, 2000);

  if (Object.keys(fields).length > 0) {
    return NextResponse.json({ error: "Please fix the highlighted fields.", fields }, { status: 422 });
  }

  // Internal floor cost for the studio only. It is logged and stored, never returned to the client.
  const estimate = calculateEstimate({ niche, location: locationKey, drone, rush, extraHours });
  const reference = `SPM-${Date.now().toString(36).toUpperCase()}`;

  const inquiry = {
    reference,
    niche,
    location: location || null,
    locationKey,
    addOns: { drone, rush, extraHours },
    name,
    email,
    phone,
    preferredDate,
    message: message || null,
    estimate,
    receivedAt: new Date().toISOString(),
  };

  // TODO: persist to Supabase `inquiries` table once credentials are configured.
  console.info("[inquire] new inquiry", inquiry.reference, inquiry.niche, inquiry.estimate.total);

  return NextResponse.json(
    {
      ok: true,
      reference,
      message: isLaunch
        ? "Thank you for applying to the Adelaide Launch Initiative. We will review your application and reply within 24 hours."
        : "Thank you. We will review your brief and send a bespoke proposal within 24 hours.",
    },
    { status: 201 },
  );
}
