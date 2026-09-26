import type { Metadata } from "next";
import { Clapperboard, Home, Plane } from "lucide-react";
import { VerticalPage } from "@/components/vertical-page";

export const metadata: Metadata = {
  title: "Real Estate Photography Adelaide | $350 Listing Package",
  description:
    "HDR interior and exterior stills, drone video cutaways and an agent talking-head reel for Adelaide property listings, from $350 AUD.",
  alternates: { canonical: "/real-estate" },
};

export default function RealEstatePage() {
  return (
    <VerticalPage
      niche="real-estate"
      eyebrow="Real Estate"
      title="List it with stills, sky and a story, all in one visit for $350."
      intro="Our intro Listing Package gives Adelaide agents everything a campaign needs from a single booking: bright HDR photography, aerial cutaways and a short reel with you on camera."
      priceNote="Listing Package: $350 AUD"
      highlights={[
        {
          icon: Home,
          title: "Interior & exterior HDR stills",
          body: "Bracketed exposures blended for true-to-life window views and balanced interiors. Delivered web and print ready.",
        },
        {
          icon: Plane,
          title: "2–3 drone video cutaways",
          body: "Aerial establishing shots showing the block, the street and what's nearby, cut ready to drop into your campaign.",
        },
        {
          icon: Clapperboard,
          title: "Agent talking-head reel",
          body: "A short vertical reel with you walking buyers through the highlights, edited for Instagram, TikTok and portal video slots.",
        },
      ]}
      locations={["Adelaide CBD", "North Adelaide", "Glenelg", "Adelaide Hills", "Eastern Suburbs"]}
    />
  );
}
