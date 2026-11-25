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
import { HtmlLang, SkipLink } from "@/components/html-lang";

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
  // Home screen app on iPhone: edge to edge, the page runs under a transparent status bar (offsets use --safe-top)
  appleWebApp: { capable: true, title: "Got Keys", statusBarStyle: "black-translucent" },
  // Search Console / Bing Webmaster ownership tags. Set the token (the content="" value only) in Vercel env and redeploy.
  verification: {
    google: process.env.GOOGLE_SITE_VERIFICATION || undefined,
    other: process.env.BING_SITE_VERIFICATION ? { "msvalidate.01": process.env.BING_SITE_VERIFICATION } : undefined,
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
      <head>
        {/* Bahasa Melayu pages live under /ms: set the document language before first paint */}
        <script
          dangerouslySetInnerHTML={{
            __html: `if(/^\\/ms(\\/|$)/.test(location.pathname))document.documentElement.lang="ms-MY"`,
          }}
        />
      </head>
      <body className="flex min-h-full flex-col">
        <Suspense fallback={null}>
          <SkipLink />
          <HtmlLang />
        </Suspense>
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
