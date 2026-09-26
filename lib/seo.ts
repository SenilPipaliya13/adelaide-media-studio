export const SITE_URL = "https://spmediaco.com.au";
export const BUSINESS_NAME = "SP Media Co.";
export const ABN = "46 478 326 745";

export const localBusinessSchema = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "@id": `${SITE_URL}/#business`,
  name: BUSINESS_NAME,
  url: SITE_URL,
  identifier: {
    "@type": "PropertyValue",
    propertyID: "ABN",
    name: "Australian Business Number",
    value: ABN.replace(/\s/g, ""),
  },
  description:
    "Adelaide photography and video studio covering weddings, commercial, real estate and sports.",
  areaServed: {
    "@type": "Place",
    name: "Adelaide, South Australia",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Adelaide",
    addressRegion: "SA",
    addressCountry: "AU",
  },
  geo: {
    "@type": "GeoCoordinates",
    latitude: -34.9285,
    longitude: 138.6007,
  },
  priceRange: "$$",
} as const;

// Returns a serialised JSON-LD string safe to drop into a <script> tag.
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
