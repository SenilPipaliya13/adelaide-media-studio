import "server-only";
import { Resend } from "resend";
import {
  HUB_SERVICES,
  LAUNCH_NICHE,
  LOCATIONS,
  NICHES,
  type HubService,
  type LocationKey,
  type Niche,
} from "@/lib/catalog";
import { SUBURB_REGIONS, type Suburb } from "@/lib/sa-suburbs";

const DEFAULT_NOTIFICATION_EMAIL = "spmediaco7@gmail.com";
// Resend's shared sender works without a verified domain. Set RESEND_FROM once spmediaco.com.au is verified.
const DEFAULT_FROM = "SP Media Co. Leads <onboarding@resend.dev>";

export type LeadNotification = {
  reference: string;
  // "studio-hub" is the homepage story form; "package-form" is the vertical page quote form.
  source: "studio-hub" | "package-form";
  // Null for hub story enquiries that aren't launch applications.
  niche: Niche | null;
  // Service card the client came from on the hub, if any.
  interest: HubService | null;
  // Suburb picked from the SA dataset (hub form only).
  suburb: Suburb | null;
  location: string | null;
  locationKey: LocationKey | null;
  addOns: { drone: boolean; rush: boolean; floorPlan: boolean; extraHours: number };
  name: string;
  email: string;
  phone: string;
  preferredDate: string | null;
  message: string | null;
  receivedAt: string;
  // Running count of launch applications on this server instance, set for launch leads only.
  launchApplicationNumber?: number;
};

export type SendResult = { sent: true; id: string } | { sent: false; reason: string };

const escapeHtml = (s: string) =>
  s.replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!);

function formatDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return Number.isNaN(d.getTime())
    ? iso
    : d.toLocaleDateString("en-AU", { weekday: "long", day: "numeric", month: "long", year: "numeric" });
}

function serviceLabel(lead: LeadNotification) {
  if (lead.niche) return NICHES[lead.niche].label;
  return lead.interest ? `${HUB_SERVICES[lead.interest].label} session` : "Studio session";
}

function suburbText(lead: LeadNotification) {
  return lead.suburb ? `${lead.suburb.name} ${lead.suburb.postcode}` : "Not selected";
}

function regionText(lead: LeadNotification) {
  if (!lead.suburb) return "Unknown (no suburb selected)";
  const region = SUBURB_REGIONS[lead.suburb.region];
  return `${region.label} · ${region.reassurance}`;
}

function locationText(lead: LeadNotification) {
  const parts: string[] = [];
  if (lead.locationKey) {
    const loc = LOCATIONS[lead.locationKey];
    parts.push(`${loc.label} (${loc.scope})`);
  }
  if (lead.location) parts.push(lead.location);
  return parts.join(" · ") || "Not specified";
}

function scopeItems(lead: LeadNotification) {
  if (!lead.niche) return [];
  const items: string[] = [...NICHES[lead.niche].deliverables];
  if (lead.niche === LAUNCH_NICHE) return items;
  if (lead.addOns.drone) items.push("Add-on: drone coverage");
  if (lead.addOns.rush) items.push("Add-on: 24-hour turnaround");
  if (lead.addOns.floorPlan) items.push("Add-on: schematic 2D floor plan");
  if (lead.addOns.extraHours > 0) {
    items.push(`Add-on: ${lead.addOns.extraHours} extra hour${lead.addOns.extraHours === 1 ? "" : "s"}`);
  }
  return items;
}

export function leadSubject(lead: LeadNotification) {
  if (lead.niche === LAUNCH_NICHE) {
    return `[LAUNCH OFFER APPLICANT] #${lead.launchApplicationNumber ?? "?"} · ${lead.name} · ${lead.reference}`;
  }
  return [`New ${serviceLabel(lead)} inquiry`, lead.name, lead.suburb?.name, lead.preferredDate, lead.reference]
    .filter(Boolean)
    .join(" · ");
}

export function leadHtml(lead: LeadNotification) {
  const e = escapeHtml;
  const service = serviceLabel(lead);
  const scope = scopeItems(lead);
  const telHref = lead.phone.replace(/[^\d+]/g, "");

  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:8px 12px 8px 0;color:#6b6b73;font-size:13px;vertical-align:top;white-space:nowrap;">${label}</td>
      <td style="padding:8px 0;color:#0b0b0c;font-size:15px;">${value}</td>
    </tr>`;

  const launchNote =
    lead.niche === LAUNCH_NICHE
      ? `<p style="margin:0 0 16px;padding:10px 12px;background:#f5f1ea;border-left:3px solid #c08a5b;font-size:14px;color:#0b0b0c;">
           Launch offer application #${lead.launchApplicationNumber ?? "?"} since the server last started. Only 5 places are available, so check the running total before accepting.
         </p>`
      : "";

  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#f4f4f5;font-family:-apple-system,Segoe UI,Helvetica,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;margin:0 auto;background:#ffffff;border-radius:8px;overflow:hidden;">
      <tr>
        <td style="background:#0b0b0c;padding:20px 24px;">
          <p style="margin:0;color:#c08a5b;font-size:12px;letter-spacing:2px;text-transform:uppercase;">New lead · ${e(lead.reference)}</p>
          <h1 style="margin:6px 0 0;color:#f5f1ea;font-size:20px;font-weight:600;">${e(service)}</h1>
        </td>
      </tr>
      <tr>
        <td style="padding:24px;">
          ${launchNote}
          <table role="presentation" cellpadding="0" cellspacing="0" style="width:100%;">
            ${row("Service", e(service))}
            ${row("Name", e(lead.name))}
            ${row("Email", `<a href="mailto:${e(lead.email)}" style="color:#9a6b43;">${e(lead.email)}</a>`)}
            ${row("Phone", `<a href="tel:${e(telHref)}" style="color:#9a6b43;">${e(lead.phone)}</a>`)}
            ${
              lead.source === "studio-hub"
                ? row("Suburb", e(suburbText(lead))) + row("Region status", e(regionText(lead)))
                : row("Location", e(locationText(lead)))
            }
            ${row("Preferred date", lead.preferredDate ? e(formatDate(lead.preferredDate)) : "Not given")}
          </table>
${
  scope.length
    ? `
          <h2 style="margin:24px 0 8px;font-size:14px;color:#0b0b0c;text-transform:uppercase;letter-spacing:1px;">Scope &amp; add-ons</h2>
          <ul style="margin:0;padding-left:20px;color:#0b0b0c;font-size:14px;line-height:1.6;">
            ${scope.map((i) => `<li>${e(i)}</li>`).join("")}
          </ul>`
    : ""
}
          <h2 style="margin:24px 0 8px;font-size:14px;color:#0b0b0c;text-transform:uppercase;letter-spacing:1px;">${
            lead.source === "studio-hub" ? "Client story" : "Client brief"
          }</h2>
          <p style="margin:0;padding:12px;background:#f4f4f5;border-radius:6px;color:#0b0b0c;font-size:14px;line-height:1.6;white-space:pre-wrap;">${
            lead.message ? e(lead.message) : "<em>No message provided.</em>"
          }</p>

          <p style="margin:24px 0 0;color:#6b6b73;font-size:12px;">Received ${e(lead.receivedAt)} · Reply to this email to respond to the client directly.</p>
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export function leadText(lead: LeadNotification) {
  const scope = scopeItems(lead);
  const isHub = lead.source === "studio-hub";
  return [
    leadSubject(lead),
    "",
    `Service: ${serviceLabel(lead)}`,
    `Name: ${lead.name}`,
    `Email: ${lead.email}`,
    `Phone: ${lead.phone}`,
    ...(isHub
      ? [`Suburb: ${suburbText(lead)}`, `Region status: ${regionText(lead)}`]
      : [`Location: ${locationText(lead)}`]),
    `Preferred date: ${lead.preferredDate ?? "Not given"}`,
    ...(scope.length ? ["", "Scope & add-ons:", ...scope.map((i) => `- ${i}`)] : []),
    "",
    isHub ? "Client story:" : "Client brief:",
    lead.message ?? "(none)",
  ].join("\n");
}

// Sends the studio a lead notification. Never throws: failures come back as { sent: false }.
export async function sendLeadNotification(lead: LeadNotification): Promise<SendResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { sent: false, reason: "RESEND_API_KEY is not set" };

  try {
    const resend = new Resend(apiKey);
    const { data, error } = await resend.emails.send({
      from: process.env.RESEND_FROM || DEFAULT_FROM,
      to: process.env.NOTIFICATION_EMAIL || DEFAULT_NOTIFICATION_EMAIL,
      replyTo: lead.email,
      subject: leadSubject(lead),
      html: leadHtml(lead),
      text: leadText(lead),
    });
    if (error || !data) return { sent: false, reason: error?.message ?? "No response from Resend" };
    return { sent: true, id: data.id };
  } catch (err) {
    return { sent: false, reason: err instanceof Error ? err.message : String(err) };
  }
}
