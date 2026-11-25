import { site, whatsappTemplates } from "@/data/content";
import type { WhatsAppContext } from "@/data/types";
import type { Lang } from "@/i18n/config";
import { WHATSAPP_MS } from "@/i18n/data-ms";

type Vars = Partial<Record<"project" | "location" | "unit" | "config" | "price" | "shortlist", string>>;

export function whatsappMessage(context: WhatsAppContext, vars: Vars = {}, lang: Lang = "en") {
  const firstName = site.consultantName.split(" ")[0];
  const filled = (lang === "ms" ? WHATSAPP_MS : whatsappTemplates)[context].replace(/\{(\w+)\}/g, (_, key: string) => {
    if (key === "consultant") return firstName;
    return (vars as Record<string, string | undefined>)[key] ?? "";
  });
  return filled.replace(/\s+/g, " ").replace(/\s+([.,?])/g, "$1").trim();
}

export function whatsappHref(context: WhatsAppContext, vars: Vars = {}, lang: Lang = "en") {
  return `https://wa.me/${site.whatsappNumber}?text=${encodeURIComponent(whatsappMessage(context, vars, lang))}`;
}

export function wazeHref(query: string) {
  return `https://waze.com/ul?q=${encodeURIComponent(query)}&navigate=yes`;
}
