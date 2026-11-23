import { IMAGES } from "./projects";
import type { FAQ, NearbyPlace, UpfrontCostItem, WhatsAppContext } from "./types";

const WT = "wellington-garden-terrace";
const WG = "wellington-garden-homes";
const NG = "norton-garden";

export const faqs: FAQ[] = [
  // Wellington Garden: Terrace Homes
  { projectSlug: WT, sortOrder: 1, source: "Developer digital brochure", question: "What is the land tenure?", answer: "Leasehold, 99 years, expiring 16/06/2121." },
  { projectSlug: WT, sortOrder: 2, source: "Developer digital brochure", question: "When is the expected completion?", answer: "The brochure states an expected completion date of November 2026. Please confirm the latest construction and handover status with the consultant." },
  { projectSlug: WT, sortOrder: 3, source: "Developer digital brochure", question: "Who is the developer?", answer: "Paragon Pinnacle Sdn. Bhd. (1098122-T), an EcoWorld company. Developer licence 14505/09-2028/1134(R)." },
  { projectSlug: WT, sortOrder: 4, source: "Developer digital brochure", question: "How many units and what sizes are available?", answer: "305 units in total across phases P2F-2 (160 units) and P2F-4 (145 units), Types T1 to T5, with built up sizes from 1,469 to 1,694 sq ft. Current availability must be confirmed with the consultant." },
  { projectSlug: WT, sortOrder: 5, source: "Developer digital brochure", question: "Is there a Bumiputra discount?", answer: "The brochure states a 7% discount for Bumiputra purchasers." },
  { projectSlug: WT, sortOrder: 6, source: "Developer digital brochure", question: "Where is the sales gallery?", answer: "EcoWorld Gallery @ Eco Grandeur, Lot 6232, Persiaran Mokhtar Dahari, 42300 Bandar Puncak Alam, Selangor. Open Mon to Fri 9am to 6pm, weekends and public holidays 10am to 6pm. Waze: Eco Grandeur Sales Gallery." },

  // Wellington Garden: Garden Homes
  { projectSlug: WG, sortOrder: 1, source: "Developer brochure", question: "What is the land tenure?", answer: "The brochure states 99 years, expiring 16/06/2121." },
  { projectSlug: WG, sortOrder: 2, source: "Developer brochure", question: "When is the expected completion?", answer: "The brochure states an expected completion date of November 2026. Please confirm the latest construction and handover status with the consultant." },
  { projectSlug: WG, sortOrder: 3, source: "Developer brochure", question: "How many bedrooms do the Garden Homes have?", answer: "All four types (G1 to G4) have four bedrooms and three bathrooms, with built up sizes from 1,651 to 1,700 sq ft." },
  { projectSlug: WG, sortOrder: 4, source: "Developer brochure", question: "How many units are there?", answer: "300 units in total: P2F-1 (174 units) and P2F-3 (126 units). Current availability must be confirmed with the consultant." },
  { projectSlug: WG, sortOrder: 5, source: "Developer brochure", question: "Is there a Bumiputra discount?", answer: "The brochure states a 7% discount for Bumiputra purchasers." },
  { projectSlug: WG, sortOrder: 6, source: "Developer brochure", question: "What facilities are shown in the brochure?", answer: "The brochure features the Grand Entrance, Wellington Place, the Stargazer's Gazebo and a Pocket Garden. Ask the consultant for the full facility list." },

  // Norton Garden
  { projectSlug: NG, sortOrder: 1, source: "Developer brochure", question: "What is the land tenure?", answer: "Leasehold, 99 years, expiring 18/11/2119." },
  { projectSlug: NG, sortOrder: 2, source: "Developer brochure", question: "Is Norton Garden still available?", answer: "The brochure lists an expected completion date of July 2025, and its advertising permit validity period has ended. Please speak to the consultant to confirm current availability and pricing." },
  { projectSlug: NG, sortOrder: 3, source: "Developer brochure", question: "What makes the Norton Garden layout different?", answer: "The linked Garden Home offers a semi detached living experience on a 32' x 65' lot, with 20 ft back lane gardens and an exclusive residents' clubhouse. Types G2, G4 and G5 include a first floor family area." },
  { projectSlug: NG, sortOrder: 4, source: "Developer brochure", question: "How many units are there?", answer: "The brochure lists 192 Garden Home units in Phase 2A-2, with built up sizes from 2,090 to 2,258 sq ft." },
  { projectSlug: NG, sortOrder: 5, source: "Developer brochure", question: "Is the land encumbered?", answer: "The brochure lists Public Bank Berhad (6463-H) as the land encumbrance." },
];

const highways = (slug: string, source: string): NearbyPlace[] =>
  ["LATAR Highway", "Guthrie Corridor Expressway (GCE)", "DASH Highway"].map((name, i) => ({
    projectSlug: slug,
    name,
    category: "Highway",
    distanceKm: null,
    travelTimeMin: null,
    source,
    sortOrder: i + 1,
  }));

export const nearbyPlaces: NearbyPlace[] = [
  ...highways(WT, "Developer digital brochure (no distance stated)"),
  ...highways(WG, "Developer brochure (no distance stated)"),
  ...highways(NG, "Developer brochure (no distance stated)"),
];

export const site = {
  brandName: "PROPERTY CONCIERGE",
  brandSignature: "by aqilgotkeys",
  consultantName: "Aqil Hazim",
  consultantTitle: "Property Consultant",
  consultantPortrait: IMAGES.portrait,
  /** About page portrait: owner-supplied keys photo, lighting graded and upscaled to 4K */
  aboutPortrait: IMAGES.portraitKeys,
  /** Owner to supply a verified biography. Leave empty rather than inventing one. */
  consultantBio: "",
  serviceApproach:
    "Personal guidance from your first enquiry to key collection, helping you make the right property decision, navigate the buying process and receive your keys.",
  serviceAreas: ["Bandar Puncak Alam", "Selangor"],
  whatsappNumber: "601155523371",
  agencyName: null as string | null,
  renRegistration: null as string | null,
  contactEmail: null as string | null,
  social: { facebook: null, instagram: null, threads: null, tiktok: null } as Record<string, string | null>,
  consentText:
    "I agree that Aqil Hazim may contact me about this enquiry and process the details I have provided for that purpose.",
  consentVersion: "v0.1 draft",
  /** Owner to supply PDPA compliant wording. */
  privacyNotice: "",
  calculator: {
    defaultInterestRate: 4.0,
    defaultMarginOfFinance: 90,
    defaultTenureYears: 35,
    assumptionsLastReviewed: "2026-11-23",
    disclaimer:
      "All calculations are estimates for planning purposes only. They are not a bank quotation, financing approval or legal advice.",
  },
  upfrontCostItems: [
    { name: "Down payment", basis: "percent_of_price", value: 10, isVerified: false, note: "Depends on margin of finance chosen" },
    { name: "SPA legal fees", basis: "fixed", value: 0, isVerified: false, note: "Not configured. Confirm with your lawyer or the developer package" },
    { name: "Loan agreement legal fees", basis: "fixed", value: 0, isVerified: false, note: "Not configured. Confirm with your lawyer" },
    { name: "Stamp duty (MOT & loan)", basis: "fixed", value: 0, isVerified: false, note: "Not configured. Rules must be verified by a qualified professional" },
  ] satisfies UpfrontCostItem[],
};

/** Supports {project}, {location}, {unit}, {config}, {price}, {shortlist}, {consultant} */
export const whatsappTemplates: Record<WhatsAppContext, string> = {
  general: "Hi {consultant}, I'm looking for a home and would like some personal guidance.",
  project_overview: "Hi {consultant}, I'm interested in {project} ({location}). Could you share more details about this project?",
  unit_type: "Hi {consultant}, I'd like to know more about {unit} at {project} ({config}). {price}",
  price: "Hi {consultant}, could you share the latest price list and any current packages for {project}? I understand promotions are subject to the developer's terms.",
  availability: "Hi {consultant}, is {unit} at {project} still available? I understand availability needs your confirmation.",
  virtual_tour: "Hi {consultant}, I've been looking at the layout of {unit} at {project}. Could we arrange a viewing or a walkthrough?",
  financial_planner: "Hi {consultant}, I've used the financial planner on your site and would like to discuss an estimate for {project}.",
  comparison: "Hi {consultant}, I'm comparing these options: {shortlist}. Could you help me decide which suits me best?",
  viewing: "Hi {consultant}, I'd like to arrange a viewing for {project}{unit}.",
};
