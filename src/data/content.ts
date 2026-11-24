import { IMAGES } from "./projects";
import type { FAQ, NearbyPlace, UpfrontCostItem, WhatsAppContext } from "./types";

const WT = "wellington-garden-terrace";
const WG = "wellington-garden-homes";
const NG = "norton-garden";
const AP = "airria-plus";
const AP_SRC = "Airria Plus brochure";
const AP_PRICE = "Phase 3 price list, 07/09/2026";

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
  // Airria Plus, Kundang
  { projectSlug: AP, sortOrder: 1, source: AP_SRC, question: "Where is Airria Plus and who is the developer?", answer: "Airria Plus is a 59 acre residential development in Kundang, Selangor, by Adenland (Kundang) Sdn Bhd (970958-D). It is reached via the LATAR Expressway, the Guthrie Corridor Expressway and the North South Expressway." },
  { projectSlug: AP, sortOrder: 2, source: AP_PRICE, question: "How much are the Phase 3 homes?", answer: "Net selling prices in the Phase 3 price list run from RM672,100 (Type A intermediate) to RM1,074,200 (Type D corner), across 156 lots in Blocks 24, 25, 31 to 35 and 37 to 43. Prices and availability change, so confirm the unit with the consultant." },
  { projectSlug: AP, sortOrder: 3, source: AP_PRICE, question: "How does the Bumiputera discount work?", answer: "71 of the 156 Phase 3 lots are Bumiputera lots. They are listed with a gross SPA price and a 7% Bumiputera discount; the net price is what is shown on this page. For example, a Type A intermediate Bumiputera lot is RM722,688 gross, less RM50,588, which is RM672,100 net. The other lots carry no discount." },
  { projectSlug: AP, sortOrder: 4, source: AP_SRC, question: "Which home types are there?", answer: "All are double storey terrace homes with four bedrooms and three bathrooms. Type A is 20' x 65' (2,046 to 2,094 sq ft), Type B is 20' x 68' (2,165 to 2,213 sq ft), Type C is a 22' x 65' corner (2,308 sq ft) and Type D is 22' x 68' corner or end lot (2,443 sq ft). Every layout has a ground floor bedroom and a first floor study area." },
  { projectSlug: AP, sortOrder: 5, source: AP_SRC, question: "What facilities are planned?", answer: "A clubhouse with a badminton court, gymnasium, café, kindergarten, surau and management office, beside a 7 acre central lake park with a 25m lap pool, wading pool, BBQ pit, two kids playgrounds, two outdoor gyms, a viewing deck, amphitheatre, tree house, jungle trail, a 1km jogging and cycling track, a community spice garden, sunken lounge, multi purpose sport court, garden park and a guard house." },
  { projectSlug: AP, sortOrder: 6, source: "Brochure and price list", question: "What is the land tenure and expected completion?", answer: "Neither is stated in the brochure or the price list. Ask Aqil for the tenure, the developer licence, the advertising permit and the expected completion date before you book." },
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
  ...([
    ["North South Expressway", "Highway"],
    ["Guthrie Corridor Expressway", "Highway"],
    ["LATAR Expressway", "Highway"],
    ["AEON Rawang", "Shopping"],
    ["Mydin Rawang", "Shopping"],
    ["Tesco Rawang", "Shopping"],
    ["Sungai Buloh Hospital", "Healthcare"],
    ["KPJ Rawang Specialist Hospital", "Healthcare"],
    ["Selgate Rawang Hospital", "Healthcare"],
    ["SJK (C) Kundang", "School"],
    ["SK Seri Kundang", "School"],
    ["SJK (C) Kuang", "School"],
    ["SMK Taman Desa", "School"],
    ["SMK Taman Desa 2", "School"],
  ] as const).map(([name, category], i): NearbyPlace => ({
    projectSlug: AP,
    name,
    category,
    distanceKm: null,
    travelTimeMin: null,
    source: "Airria Plus brochure, location map (no distance stated)",
    sortOrder: i + 1,
  })),
];

export const site = {
  brandName: "PROPERTY CONCIERGE",
  brandSignature: "by aqilgotkeys",
  consultantName: "Aqil Hazim",
  consultantTitle: "Property Consultant",
  consultantPortrait: IMAGES.portrait,
  /** About page portrait: owner-supplied keys photo, lighting graded and upscaled to 4K */
  aboutPortrait: IMAGES.portraitKeys,
  /** Home page "Your consultant" panel: seated portrait cropped below the chest, upscaled */
  consultantFeature: IMAGES.portraitSofaWatch,
  /** Round avatar (About page consultant card): face crop of the seated portrait */
  consultantAvatar: IMAGES.portraitSeatedFace,
  /** Subtle motion loop of the same portrait: 1080 for desktop, 720 for phones */
  aboutPortraitVideo: { large: IMAGES.portraitKeysLoop, small: IMAGES.portraitKeysLoopSmall },
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
