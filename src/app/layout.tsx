import type { Metadata, Viewport } from "next";
import { Archivo } from "next/font/google";
import { JsonLd } from "@/components/ui/JsonLd";
import { organisationSchema } from "@/lib/schema";
import { site } from "@/lib/site";
import "./globals.css";

const archivo = Archivo({
  variable: "--font-archivo",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Labour Hire Sydney | Construction Labourers & Trades | Uphold Group",
    template: `%s | ${site.name}`,
  },
  description: site.description,
  applicationName: site.name,
  /* What iOS prints under the home screen icon. Without it the <title> is
     used, and ours is 71 characters long. */
  appleWebApp: { title: "Uphold" },
  authors: [{ name: site.legalName }],
  openGraph: {
    type: "website",
    url: site.url,
    siteName: site.name,
    locale: "en_AU",
    title: "Labour Hire Sydney | Construction Labourers & Trades",
    description: site.description,
  },
  twitter: {
    card: "summary_large_image",
    title: "Labour Hire Sydney | Construction Labourers & Trades",
    description: site.description,
  },
  alternates: { canonical: "/" },
  formatDetection: { telephone: true },
};

export const viewport: Viewport = {
  themeColor: "#ffffff",
  colorScheme: "light",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-AU" className={archivo.variable}>
      <body className="font-sans">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:absolute focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-ink focus:px-5 focus:py-3 focus:text-[15px] focus:text-white"
        >
          Skip to content
        </a>

        {children}

        <JsonLd data={organisationSchema()} />
      </body>
    </html>
  );
}
