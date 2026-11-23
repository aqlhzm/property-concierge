import { z } from "zod";

export const INTENTS = [
  "General enquiry",
  "Viewing request",
  "Consultation",
  "Price & availability",
  "Financing discussion",
  "Recommendation request",
] as const;

export const INTENT_FROM_PARAM: Record<string, (typeof INTENTS)[number]> = {
  viewing: "Viewing request",
  consultation: "Consultation",
  price: "Price & availability",
  financing: "Financing discussion",
  recommendation: "Recommendation request",
};

export const READINESS = ["Within 3 months", "3 to 6 months", "6 to 12 months", "More than a year", "Just exploring"] as const;
export const DESIRE = ["Own stay", "Upgrade from current home", "Investment", "For parents / family", "Not sure yet"] as const;
export const ELIGIBILITY = ["Not checked yet", "Preapproved or in progress", "Cash buyer", "Would like guidance"] as const;

const optional = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v ? v : undefined));

export const enquirySchema = z.object({
  fullName: z.string().trim().min(2, "Please enter your name").max(100),
  phone: z
    .string()
    .trim()
    .transform((v) => v.replace(/[\s\-()]/g, ""))
    .pipe(z.string().regex(/^\+?\d{9,15}$/, "Enter a valid phone number, e.g. 012 345 6789")),
  email: z
    .string()
    .trim()
    .max(200)
    .optional()
    .transform((v) => (v ? v : undefined))
    .pipe(z.email("Enter a valid email or leave it blank").optional()),
  preferredContact: z.enum(["WhatsApp", "Call", "Email"]).default("WhatsApp"),
  intent: z.enum(INTENTS),
  projectSlug: optional(80),
  unitId: optional(40),
  preferredViewingDate: z
    .string()
    .optional()
    .transform((v) => (v ? v : undefined))
    .pipe(z.iso.date("Choose a valid date").optional()),
  preferredViewingTime: optional(40),
  message: optional(1000),
  dreamDesire: optional(80),
  dreamReadiness: optional(80),
  dreamEligibility: optional(80),
  dreamAffordability: optional(120),
  dreamMatch: optional(200),
  consent: z.literal("on", { error: "Please agree so Aqil can contact you" }),
  ctaSource: optional(120),
  utmSource: optional(100),
  utmMedium: optional(100),
  utmCampaign: optional(100),
  // Honeypot: real users never see or fill this
  company: z.string().max(0).optional(),
});

export type EnquiryState =
  | { status: "idle" }
  | { status: "error"; message: string; fieldErrors?: Record<string, string>; whatsappUrl?: string }
  | { status: "success"; leadCode: string; whatsappUrl: string };
