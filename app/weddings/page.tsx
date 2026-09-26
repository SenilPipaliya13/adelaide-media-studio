import type { Metadata } from "next";
import { Camera, Grape, Heart } from "lucide-react";
import { VerticalPage } from "@/components/vertical-page";

export const metadata: Metadata = {
  title: "Wedding Photography Adelaide | Barossa, McLaren Vale & Adelaide Hills",
  description:
    "Editorial wedding photography and film for couples marrying in the Adelaide Hills, Barossa Valley and McLaren Vale.",
  alternates: { canonical: "/weddings" },
};

export default function WeddingsPage() {
  return (
    <VerticalPage
      niche="weddings"
      eyebrow="Weddings"
      title="Your day in the vines, the hills and the golden hour between."
      intro="Unposed, editorial coverage for couples marrying across South Australia's wine country. We blend in during the ceremony and take charge when the light is right."
      highlights={[
        {
          icon: Grape,
          title: "Wine-country specialists",
          body: "We know the cellar doors, chapels and estates of the Barossa and McLaren Vale, including where the sun sets at each one.",
        },
        {
          icon: Camera,
          title: "Low-light confidence",
          body: "Full-frame Canon R6 Mark III sensors hold clean detail through candlelit receptions and late-night dance floors.",
        },
        {
          icon: Heart,
          title: "Story-first galleries",
          body: "A full online gallery with private proofing links your family can download from without watermarks or waiting.",
        },
      ]}
      locations={["Adelaide Hills", "Barossa Valley", "McLaren Vale", "Adelaide CBD", "Glenelg"]}
    />
  );
}
