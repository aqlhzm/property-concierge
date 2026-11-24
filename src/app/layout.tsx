import "@fontsource-variable/inter";
import "@fontsource/playfair-display/400.css";
import "@fontsource/playfair-display/500.css";
import "@fontsource/playfair-display/600.css";
import "@fontsource/playfair-display/400-italic.css";
import "@fontsource/mr-dafoe/400.css";
import "./globals.css";

import { Analytics } from "@vercel/analytics/next";
import { Suspense } from "react";
import type { Metadata, Viewport } from "next";
import { IMAGES } from "@/data/projects";
import { SITE_URL, openGraph } from "@/lib/site";
import { SiteFooter } from "@/components/footer";
import { MobileTabBar, SiteHeader, PublicOnly } from "@/components/nav";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "PROPERTY CONCIERGE by aqilgotkeys",
    template: "%s · PROPERTY CONCIERGE",
  },
  description:
    "Premium property advisory by Aqil Hazim. Discover, compare and plan your next home, from first enquiry to receiving your keys.",
  openGraph: openGraph(IMAGES.ogDefault, "PROPERTY CONCIERGE by aqilgotkeys: Stargazer's Gazebo at Wellington Garden"),
  twitter: { card: "summary_large_image" },
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
        {/* Suspense: on routes with request-time params (staff lead pages) the pathname is only known per request. */}
        <Suspense fallback={null}>
          <SiteHeader />
        </Suspense>
        <main id="main" className="flex-1">
          {children}
        </main>
        <Suspense fallback={null}>
          <PublicOnly>
            <SiteFooter />
          </PublicOnly>
          <MobileTabBar />
        </Suspense>
        <Analytics />
      </body>
    </html>
  );
}
