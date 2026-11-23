import "@fontsource-variable/inter";
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/400-italic.css";
import "@fontsource/mr-dafoe/400.css";
import "./globals.css";

import { Analytics } from "@vercel/analytics/next";
import type { Metadata, Viewport } from "next";
import { SiteFooter } from "@/components/footer";
import { MobileTabBar, SiteHeader } from "@/components/nav";

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL ?? "https://property-concierge.vercel.app"),
  title: {
    default: "PROPERTY CONCIERGE by aqilgotkeys",
    template: "%s · PROPERTY CONCIERGE",
  },
  description:
    "Premium property advisory by Aqil Hazim. Discover, compare and plan your next home, from first enquiry to receiving your keys.",
  openGraph: {
    siteName: "PROPERTY CONCIERGE by aqilgotkeys",
    type: "website",
    locale: "en_MY",
  },
};

export const viewport: Viewport = {
  themeColor: "#070B09",
  colorScheme: "dark",
  viewportFit: "cover",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en-MY" className="h-full">
      <body className="flex min-h-full flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-3 focus:left-3 focus:z-50 focus:rounded-full focus:bg-emerald focus:px-4 focus:py-2 focus:text-on-emerald"
        >
          Skip to content
        </a>
        <SiteHeader />
        <main id="main" className="flex-1">
          {children}
        </main>
        <SiteFooter />
        <MobileTabBar />
        <Analytics />
      </body>
    </html>
  );
}
