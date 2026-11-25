import type { MetadataRoute } from "next";

/**
 * Installed app ("Add to Home screen"). Android builds the launch screen from background_color and the
 * "any" icon, so that icon is the emblem alone with generous room around it: a small glowing mark on the
 * dark brand background, not a stretched favicon on white. The home screen uses the maskable dark tile.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    id: "/",
    name: "PROPERTY CONCIERGE by aqilgotkeys",
    short_name: "Concierge",
    description: "Discover, compare and plan your next home with Aqil Hazim, from first enquiry to receiving your keys.",
    start_url: "/",
    scope: "/",
    display: "standalone",
    orientation: "portrait",
    background_color: "#070B09",
    theme_color: "#070B09",
    lang: "en-MY",
    categories: ["lifestyle", "business"],
    icons: [
      { src: "/icons/icon-192.png", sizes: "192x192", type: "image/png", purpose: "any" },
      { src: "/icons/icon-512.png", sizes: "512x512", type: "image/png", purpose: "any" },
      { src: "/icons/icon-maskable-192.png", sizes: "192x192", type: "image/png", purpose: "maskable" },
      { src: "/icons/icon-maskable-512.png", sizes: "512x512", type: "image/png", purpose: "maskable" },
    ],
    shortcuts: [
      { name: "Developments", short_name: "Projects", url: "/projects", icons: [{ src: "/icons/icon-maskable-192.png", sizes: "192x192" }] },
      { name: "Financial planner", short_name: "Planner", url: "/calculator", icons: [{ src: "/icons/icon-maskable-192.png", sizes: "192x192" }] },
      { name: "Projek (Bahasa Melayu)", short_name: "Projek", url: "/ms/projects", icons: [{ src: "/icons/icon-maskable-192.png", sizes: "192x192" }] },
    ],
  };
}
