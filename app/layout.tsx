import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { BUSINESS_NAME, SITE_URL, localBusinessSchema } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${BUSINESS_NAME} | Adelaide Photography & Video`,
    template: `%s | ${BUSINESS_NAME}`,
  },
  description:
    "Adelaide photography and video for weddings, commercial, real estate and sports. Shot on the full-frame Canon EOS R6 Mark III.",
  openGraph: {
    siteName: BUSINESS_NAME,
    locale: "en_AU",
    type: "website",
  },
};

// "only light" opts out of browser force-dark modes, which otherwise invert the ivory palette to black.
export const viewport: Viewport = {
  colorScheme: "only light",
  themeColor: "#FBF9F5",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    // The next/font variables must sit on <html>: Tailwind declares --font-sans/--font-serif on :root,
    // and a var() there can only see custom properties defined on the same element.
    <html lang="en-AU" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="bg-canvas font-sans text-carbon antialiased">
        <JsonLd data={localBusinessSchema} />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
