import { site, whatsappTemplates } from "@/data/content";
import type { WhatsAppContext } from "@/data/types";

type Vars = Partial<Record<"project" | "location" | "unit" | "config" | "price" | "shortlist", string>>;

export function whatsappMessage(context: WhatsAppContext, vars: Vars = {}) {
  const firstName = site.consultantName.split(" ")[0];
  const filled = whatsappTemplates[context].replace(/\{(\w+)\}/g, (_, key: string) => {
    if (key === "consultant") return firstName;
    return (vars as Record<string, string | undefined>)[key] ?? "";
  });
  return filled.replace(/\s+/g, " ").replace(/\s+([.,?])/g, "$1").trim();
}

export function whatsappHref(context: WhatsAppContext, vars: Vars = {}) {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(whatsappMessage(context, vars))}`;
}

export function wazeHref(query: string) {
  return `https://waze.com/ul?q=${encodeURIComponent(query)}&navigate=yes`;
}
