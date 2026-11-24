export type ImageLabel = "Actual photograph" | "Show unit" | "CGI" | "Artist's impression";

export type GalleryImage = { url: string; caption: string; label: ImageLabel };
export type Spec = { group: string; item: string; value: string };

/** Each development keeps a subtle identity accent inside the emerald/sage family. */
export type ProjectTheme = {
  accent: string;
};

export type Project = {
  slug: string;
  /** Development name as printed in the brochure */
  name: string;
  /** Distinguishes products that share a development name */
  productName: string;
  productLabel: string;
  propertyType: string;
  category: "Landed" | "High-Rise" | "Mixed";
  township: string;
  location: string;
  state: string;
  tagline: string;
  description: string;
  highlights: string[];
  facilities: string[];
  heroImage: GalleryImage;
  gallery: GalleryImage[];
  lotSize: string;
  builtUpMin: number;
  builtUpMax: number;
  totalUnits: number;
  /** Optional wording for the units figure when it covers only part of the development */
  totalUnitsLabel?: string;
  bedrooms: number;
  bathrooms: number;
  priceMin: number;
  priceMax: number;
  /** What the price range is based on, shown next to it (e.g. "Permit price range", "Phase 3 price list") */
  priceRangeLabel: string;
  /** Only show prices when verified and permitted */
  showPrice: boolean;
  priceNote: string;
  priceSource: string;
  priceLastVerified: string | null;
  bumiputraDiscount: string;
  salesStatus: string;
  expectedCompletion: string;
  landTenure: string;
  landEncumbrances: string | null;
  restrictionOfInterest: string;
  developerBrand: string;
  developerEntity: string;
  developerLicense: string;
  advertisingPermit: string;
  advertisingPermitValidity: string;
  approvingAuthority: string;
  buildingPlanRef: string;
  locationAccessNote: string;
  salesGallery: { name: string; address: string; hours: string; phone: string; wazeQuery: string; heading?: string };
  specifications: Spec[];
  disclaimer: string;
  whatsappProjectLine: string;
  dataSource: string;
  contentLastUpdated: string;
  featuredOrder: number;
  theme: ProjectTheme;
};

export type UnitType = {
  id: string;
  projectSlug: string;
  code: string;
  name: string;
  storeys: string;
  bedrooms: number;
  bathrooms: number;
  builtUpMin: number;
  builtUpMax: number;
  lotSize: string;
  variants: { position: string; builtUpSqft: number }[];
  keySpaces: string[];
  floorPlanGround: string;
  floorPlanFirst: string;
  floorPlanNote: string;
  image: GalleryImage | null;
  priceLabel: string;
  availabilityStatus: "Available" | "Limited" | "Sold out" | "To be confirmed";
  availabilityNote: string;
  sortOrder: number;
};

export type FAQ = { projectSlug: string; question: string; answer: string; source: string; sortOrder: number };

export type NearbyPlace = {
  projectSlug: string;
  name: string;
  category: "Highway" | "School" | "Healthcare" | "Shopping" | "Transit" | "Leisure" | "Other";
  distanceKm: number | null;
  travelTimeMin: number | null;
  source: string;
  sortOrder: number;
};

export type UpfrontCostItem = {
  name: string;
  basis: "fixed" | "percent_of_price" | "percent_of_loan";
  value: number;
  isVerified: boolean;
  note: string;
};

export type WhatsAppContext =
  | "project_overview"
  | "unit_type"
  | "price"
  | "availability"
  | "virtual_tour"
  | "financial_planner"
  | "comparison"
  | "viewing"
  | "general";
