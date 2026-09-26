import type { Metadata } from "next";
import { Gauge, Trophy, Users } from "lucide-react";
import { VerticalPage } from "@/components/vertical-page";

export const metadata: Metadata = {
  title: "Sports Photography Adelaide | SANFL, Athletics & Team Media Days",
  description:
    "High-speed action photography for SANFL, athletics and Gather Round, plus team media days for Adelaide clubs.",
  alternates: { canonical: "/sports" },
};

export default function SportsPage() {
  return (
    <VerticalPage
      niche="sports"
      eyebrow="Sports"
      title="The contest, the contact and the moment it all turned."
      intro="Match-day action and club media days for Adelaide teams, athletes and events. Built for speed on the field and fast delivery off it."
      highlights={[
        {
          icon: Gauge,
          title: "40fps burst",
          body: "The Canon R6 Mark III shoots 40 frames per second, fast enough to capture the exact frame of the mark, the tackle or the finish line.",
        },
        {
          icon: Trophy,
          title: "SANFL & Gather Round",
          body: "Sideline coverage for footy, athletics and major events, with selects ready for club socials before the siren goes quiet.",
        },
        {
          icon: Users,
          title: "Team media days",
          body: "Player portraits, team photos and promo content shot in one efficient session at your ground.",
        },
      ]}
      locations={["Adelaide Oval", "Norwood Oval", "SA Athletics Stadium", "Adelaide CBD"]}
    />
  );
}
