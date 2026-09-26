import type { Metadata } from "next";
import { Building2, Mic, UserSquare } from "lucide-react";
import { VerticalPage } from "@/components/vertical-page";

export const metadata: Metadata = {
  title: "Commercial Photography Adelaide | Headshots, Events & Brand Content",
  description:
    "Corporate headshots, event coverage and brand content for Adelaide businesses, from Lot Fourteen startups to the Adelaide Convention Centre.",
  alternates: { canonical: "/commercial" },
};

export default function CommercialPage() {
  return (
    <VerticalPage
      niche="commercial"
      eyebrow="Commercial"
      title="Imagery that makes your team and your work look as sharp as they are."
      intro="On-site headshots, conference and launch coverage, and brand libraries for Adelaide businesses. Fast turnaround, consistent lighting, no fuss for your people."
      highlights={[
        {
          icon: UserSquare,
          title: "Headshot days",
          body: "A portable studio set up in your office. We move whole teams through in minutes each with consistent, on-brand lighting.",
        },
        {
          icon: Mic,
          title: "Events & conferences",
          body: "Keynotes, panels and networking coverage at the Adelaide Convention Centre and venues across the CBD, with same-day selects for socials.",
        },
        {
          icon: Building2,
          title: "Startup & brand content",
          body: "Product, workspace and founder imagery for Lot Fourteen startups and growing B2B brands that need a library, not a single shot.",
        },
      ]}
      locations={["Lot Fourteen", "Adelaide Convention Centre", "Adelaide CBD", "North Adelaide"]}
    />
  );
}
