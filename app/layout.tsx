import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import { JsonLd } from "@/components/json-ld";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { BUSINESS_NAME, SITE_URL, localBusinessSchema } from "@/lib/seo";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const fraunces = Fraunces({
  variable: "--font-fraunces",
  subsets: ["latin"],
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en-AU">
      <body className={`${inter.variable} ${fraunces.variable} font-sans antialiased`}>
        <JsonLd data={localBusinessSchema} />
        <SiteHeader />
        <main>{children}</main>
        <SiteFooter />
      </body>
    </html>
  );
}
