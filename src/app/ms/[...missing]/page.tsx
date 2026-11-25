import { notFound } from "next/navigation";

/**
 * Unknown Bahasa Melayu addresses. Rendering the 404 inside /ms means the page knows its address on the
 * server, so the not-found page and navigation come out in Malay without a hydration mismatch.
 */
export default function Missing() {
  notFound();
}
