import type { GalleryImage, Project, Spec } from "./types";

/**
 * Project content migrated from the Base44 app (6b03e14baf639027c969822b) on 23 Nov 2026.
 * Every value comes from the developer brochures. Do not add figures that are not in a verified source.
 * Images are still hosted on Base44 media storage.
 */

const MEDIA = "https://media.base44.com/images/public/6b03e14baf639027c969822b";

export const IMAGES = {
  gazebo: `${MEDIA}/f1effdeb386ed1f094bf7da2d6a77a7a_home-hero-stargazers-gazebo.webp`,
  wellingtonSemiD: `${MEDIA}/ca3f439e43575772f442d3ac462838d0_wellington-garden-home-semid.webp`,
  wellingtonTerrace: `${MEDIA}/5f2ceb5eb_wellington-terrace-hero.webp`,
  norton: `${MEDIA}/550b3405f_norton-garden-hero.webp`,
  portrait: `${MEDIA}/c6fc0c93a5a0d4ea972535f73e67eb5c_aqil-hazim-portrait-v2.webp`,
} as const;

export const MEDIA_BASE = MEDIA;

const gazebo: GalleryImage = {
  url: IMAGES.gazebo,
  caption: "Stargazer's Gazebo, Wellington Garden",
  label: "Artist's impression",
};

const SALES_GALLERY = {
  name: "EcoWorld Gallery @ Eco Grandeur",
  address:
    "Lot 6232, Persiaran Mokhtar Dahari, Eco Grandeur, 42300 Bandar Puncak Alam, Selangor Darul Ehsan",
  hours: "Mon–Fri 9am – 6pm · Weekends & Public Holidays 10am – 6pm",
  phone: "+603 3270 2525",
  wazeQuery: "Eco Grandeur Sales Gallery",
};

const ACCESS =
  "Accessible via the LATAR Highway, Guthrie Corridor Expressway (GCE) and DASH Highway.";

const DISCLAIMER_BASE =
  "All illustrations, art renderings and photographs are artist's impressions only. Plans, layouts, specifications and information are subject to change and do not constitute an offer or contract. Please refer to the sale and purchase agreement of the actual unit purchased.";

const WELLINGTON_FACILITIES = ["Grand Entrance", "Wellington Place", "Stargazer's Gazebo", "Pocket Garden"];

const wellingtonSpecs = (firstFloor: string): Spec[] => [
  { group: "Structure", item: "Structure", value: "Reinforced Concrete" },
  { group: "Structure", item: "Wall", value: "Brickworks / Reinforced Concrete" },
  { group: "Structure", item: "Roof cover", value: "Roof Tiles / Concrete Slab / Metal Deck" },
  { group: "Structure", item: "Ceiling", value: "Concrete Slab / Plaster Ceiling" },
  { group: "Openings", item: "Windows", value: "Aluminium Framed Glass Casement / Top Hung / Fixed Glass" },
  { group: "Openings", item: "Main entrance", value: "Solid Core Door" },
  { group: "Finishes", item: "Ground floor (living/dining/kitchen/bedroom)", value: "Porcelain Tiles" },
  { group: "Finishes", item: "First floor bedrooms", value: firstFloor },
  { group: "Finishes", item: "Kitchen wall", value: "1500mm High Ceramic Wall Tiles / Plaster & Paint" },
  { group: "Finishes", item: "Bath wall", value: "2700mm High Ceramic Tiles / Plaster & Paint" },
  { group: "Sanitary", item: "WC / Wash basins / Showers", value: "3 / 3 / 3" },
  { group: "Sanitary", item: "Kitchen sink", value: "1" },
  { group: "Electrical", item: "Air-cond points", value: "2" },
  { group: "Electrical", item: "Water heater points", value: "3" },
  { group: "Electrical", item: "Fiber wall socket", value: "1" },
  { group: "External", item: "Fencing", value: "Brick Wall and Metal Grille" },
  { group: "External", item: "Turfing", value: "Provided" },
];

export const projects: Project[] = [
  {
    slug: "wellington-garden-terrace",
    name: "Wellington Garden",
    productName: "Terrace Homes",
    productLabel: "Double Storey Terrace Home · 18' x 65'",
    propertyType: "Double Storey Terrace Home",
    category: "Landed",
    township: "Eco Grandeur",
    location: "Bandar Puncak Alam",
    state: "Selangor",
    tagline: "Come home to where verdant landscapes await you.",
    description:
      "With eye-catching and elegant facades, the spacious and well-planned terrace homes in Wellington Garden are designed for discerning individuals who value the important things in life. Located in the up-and-coming district north-west of the Klang Valley, Eco Grandeur is accessible via the LATAR Highway, Guthrie Corridor Expressway and DASH Highway.",
    highlights: [
      "4 bedrooms · 3 bathrooms",
      "Built-up 1,469 – 1,694 sq ft (per permit details)",
      "Leasehold 99 years (expiry 16/06/2121)",
      "Expected completion November 2026",
    ],
    facilities: WELLINGTON_FACILITIES,
    heroImage: { url: IMAGES.wellingtonTerrace, caption: "Terrace Homes, Types T2 & T5", label: "Artist's impression" },
    gallery: [
      { url: IMAGES.wellingtonTerrace, caption: "Terrace Homes, Types T2 & T5", label: "Artist's impression" },
      gazebo,
    ],
    lotSize: "18' x 65'",
    builtUpMin: 1469,
    builtUpMax: 1694,
    totalUnits: 305,
    bedrooms: 4,
    bathrooms: 3,
    priceMin: 781200,
    priceMax: 1144800,
    showPrice: true,
    priceNote:
      "Minimum and maximum prices as stated in the advertising permit details for phases P2F-2 and P2F-4 (Types T1–T5). 7% discount for Bumiputra. Unit-level pricing and current packages must be confirmed with the consultant.",
    priceSource: "Developer e-brochure (Advertising & Sales Permit 14505-7/10-2027/0781(R)-(S))",
    priceLastVerified: "2026-11-23",
    bumiputraDiscount: "7% discount for Bumiputra",
    salesStatus: "Selling — availability to be confirmed with consultant",
    expectedCompletion: "November 2026",
    landTenure: "Leasehold — 99 years (expiry 16/06/2121)",
    landEncumbrances: null,
    restrictionOfInterest:
      "The land can be transferred, leased or charged with prior approval by the State Authority",
    developerBrand: "EcoWorld",
    developerEntity: "Paragon Pinnacle Sdn. Bhd. (1098122-T)",
    developerLicense: "14505/09-2028/1134(R) · valid 21/09/2023 – 20/09/2028",
    advertisingPermit: "14505-7/10-2027/0781(R)-(S)",
    advertisingPermitValidity: "05/10/2026 – 04/10/2027",
    approvingAuthority: "Majlis Perbandaran Kuala Selangor (MPKS)",
    buildingPlanRef:
      "Bil. (20) dlm. MDKS 200.11/280/4/12/2022-01 / 03, Bil. (21) dlm. MDKS 200.11/280/4/12/2022-02 & Bil. (19) dlm. MDKS 200.11/280/4/12/2022-04",
    locationAccessNote: ACCESS,
    salesGallery: SALES_GALLERY,
    specifications: wellingtonSpecs("Ceramic Tiles"),
    disclaimer: `${DISCLAIMER_BASE} Iklan ini telah diluluskan oleh Jabatan Perumahan Negara.`,
    whatsappProjectLine: "Wellington Garden Terrace Homes (18' x 65') at Eco Grandeur, Bandar Puncak Alam",
    dataSource: "EG Wellington Garden Terrace Home e-brochure",
    contentLastUpdated: "2026-11-23",
    featuredOrder: 1,
    theme: {
      background: "#0B110C",
      surface: "#152017",
      primary: "#E2B33C",
      secondary: "#6E9A5B",
      accent: "#F0CF6E",
      text: "#F5F1E4",
      muted: "#A9B49F",
    },
  },
  {
    slug: "wellington-garden-homes",
    name: "Wellington Garden",
    productName: "Garden Homes",
    productLabel: "Double Storey Garden Home · 24' x 55'",
    propertyType: "Double Storey Garden Home",
    category: "Landed",
    township: "Eco Grandeur",
    location: "Bandar Puncak Alam",
    state: "Selangor",
    tagline: "Enjoy a life of serenity in a safe and verdant environment.",
    description:
      "Wellington Garden brings a new iteration of beautiful, well-planned garden homes. With four bedrooms, these homes offer the space to suit your unique requirements. Located in the up-and-coming district north-west of the Klang Valley, Eco Grandeur is accessible via the LATAR Highway, Guthrie Corridor Expressway and DASH Highway.",
    highlights: [
      "4 bedrooms · 3 bathrooms",
      "Built-up 1,651 – 1,700 sq ft",
      "Types G1 – G4, corner/end and intermediate",
      "Expected completion November 2026",
    ],
    facilities: WELLINGTON_FACILITIES,
    heroImage: { url: IMAGES.wellingtonSemiD, caption: "Garden Home 24' x 55' (Semi-D)", label: "Artist's impression" },
    gallery: [
      { url: IMAGES.wellingtonSemiD, caption: "Garden Home 24' x 55' (Semi-D)", label: "Artist's impression" },
      gazebo,
    ],
    lotSize: "24' x 55'",
    builtUpMin: 1651,
    builtUpMax: 1700,
    totalUnits: 300,
    bedrooms: 4,
    bathrooms: 3,
    priceMin: 976800,
    priceMax: 1252800,
    showPrice: true,
    priceNote:
      "Range combines permit details for P2F-1 (RM990,000 – RM1,230,000; 174 units) and P2F-3 (RM976,800 – RM1,252,800; 126 units). 7% discount for Bumiputra. Unit-level pricing and current packages must be confirmed with the consultant.",
    priceSource: "Developer brochure (Advertising & Sales Permit 14505-7/10-2027/0781(R)-(S))",
    priceLastVerified: "2026-11-23",
    bumiputraDiscount: "7% discount for Bumiputra",
    salesStatus: "Selling — availability to be confirmed with consultant",
    expectedCompletion: "November 2026",
    landTenure: "99 years (expiry 16/06/2121)",
    landEncumbrances: null,
    restrictionOfInterest:
      "The land can be transferred, leased or charged with prior approval by the State Authority",
    developerBrand: "EcoWorld",
    developerEntity: "Paragon Pinnacle Sdn. Bhd. (1098122-T)",
    developerLicense: "14505/09-2028/1134(A) · valid 21/09/2023 – 20/09/2028",
    advertisingPermit: "14505-7/10-2027/0781(R)-(S)",
    advertisingPermitValidity: "05/10/2026 – 04/10/2027",
    approvingAuthority: "Majlis Perbandaran Kuala Selangor (MPKS)",
    buildingPlanRef:
      "Bil. (20) dlm. MDKS 200.11/280/4/12/2022-01 / 03, Bil. (21) dlm. MDKS 200.11/280/4/12/2022-02 & Bil. (19) dlm. MDKS 200.11/280/4/12/2022-04",
    locationAccessNote: ACCESS,
    salesGallery: SALES_GALLERY,
    specifications: wellingtonSpecs("Laminated Timber"),
    disclaimer: `${DISCLAIMER_BASE} Iklan ini telah diluluskan oleh Jabatan Perumahan Negara.`,
    whatsappProjectLine: "Wellington Garden Garden Homes (24' x 55') at Eco Grandeur, Bandar Puncak Alam",
    dataSource: "EG Wellington Garden Home brochure",
    contentLastUpdated: "2026-11-23",
    featuredOrder: 2,
    theme: {
      background: "#0A1210",
      surface: "#13201B",
      primary: "#B9C97A",
      secondary: "#5E8C6A",
      accent: "#E2C66B",
      text: "#F3F2E8",
      muted: "#A3B3A6",
    },
  },
  {
    slug: "norton-garden",
    name: "Norton Garden",
    productName: "Linked Garden Homes",
    productLabel: "Linked Garden Home · 32' x 65'",
    propertyType: "Double Storey Linked Garden Home (semi-detached living)",
    category: "Landed",
    township: "Eco Grandeur",
    location: "Bandar Puncak Alam",
    state: "Selangor",
    tagline: "A home in a garden. A Modern Victorian haven.",
    description:
      "Come home to Norton Garden and be surrounded by lush gardens — a Modern Victorian haven with an exclusive clubhouse designed only for residents. The linked Garden Home offers a semi-detached living experience inspired by the Victorian aesthetic, streamlined to reflect modern tastes, with generous and practical spaces for family life. 20-foot back-lane gardens extend the garden living experience.",
    highlights: [
      "4 bedrooms · 3 bathrooms",
      "Built-up 2,090 – 2,258 sq ft",
      "Exclusive residents' clubhouse",
      "20-foot back-lane gardens",
    ],
    facilities: ["Exclusive residents' clubhouse", "20-foot back-lane gardens"],
    heroImage: { url: IMAGES.norton, caption: "Linked Garden Homes, Types G1 & G2", label: "Artist's impression" },
    gallery: [{ url: IMAGES.norton, caption: "Linked Garden Homes, Types G1 & G2", label: "Artist's impression" }],
    lotSize: "32' x 65'",
    builtUpMin: 2090,
    builtUpMax: 2258,
    totalUnits: 192,
    bedrooms: 4,
    bathrooms: 3,
    priceMin: 1254000,
    priceMax: 1593600,
    // Permit validity ended 10/08/2025; keep hidden until reconfirmed with the developer.
    showPrice: false,
    priceNote:
      "The brochure's advertising permit validity period (11/08/2022 – 10/08/2025) has ended and its expected completion date was July 2025. Pricing, availability and current permit status must be reconfirmed with the developer before display.",
    priceSource: "Developer brochure (Advertising & Sales Permit 14505-6/08-2025/0109(A)-(S))",
    priceLastVerified: null,
    bumiputraDiscount: "7% discount for Bumiputra (per brochure)",
    salesStatus: "Availability & pricing to be reconfirmed",
    expectedCompletion: "July 2025 (per brochure — reconfirm current status)",
    landTenure: "Leasehold — 99 years (expiry 18/11/2119)",
    landEncumbrances: "Public Bank Berhad (6463-H)",
    restrictionOfInterest:
      "The land can be transferred, leased or charged with prior approval by the State Authority",
    developerBrand: "EcoWorld",
    developerEntity: "Paragon Pinnacle Sdn. Bhd. (1098122-T)",
    developerLicense: "14505/09-2028/1134(A) · valid 21/09/2023 – 20/09/2028",
    advertisingPermit: "14505-6/08-2025/0109(A)-(S)",
    advertisingPermitValidity: "11/08/2022 – 10/08/2025 (ended)",
    approvingAuthority: "Majlis Perbandaran Kuala Selangor (MPKS)",
    buildingPlanRef: "Bil.(23)DLM.MDKS 280/4/12/2017-03 & Bil.(45)DLM.MDKS 280/4/12/2017-04(A)",
    locationAccessNote: ACCESS,
    salesGallery: SALES_GALLERY,
    specifications: [
      { group: "Structure", item: "Structure", value: "Reinforced Concrete" },
      { group: "Structure", item: "Wall", value: "Brickwork" },
      { group: "Structure", item: "Roof cover", value: "Roof Tiles / Concrete Slab / Metal Deck Roofing" },
      { group: "Structure", item: "Ceiling", value: "Concrete Slab / Plaster Ceiling" },
      { group: "Openings", item: "Windows", value: "Aluminium Framed Glass Window" },
      { group: "Openings", item: "Main entrance", value: "Solid Core Door" },
      { group: "Finishes", item: "Ground floor (living/dining/kitchen/leisure/bedroom)", value: "Porcelain Tiles" },
      { group: "Finishes", item: "First floor bedrooms", value: "Laminated Timber Flooring" },
      { group: "Finishes", item: "Master bath wall", value: "2700mm High Ceramic & Porcelain Wall Tiles" },
      { group: "Finishes", item: "Kitchen wall", value: "1500mm High Ceramic Wall Tiles / Plaster & Paint" },
      { group: "Sanitary", item: "WC / Wash basins / Showers", value: "3 / 3 / 3" },
      { group: "Sanitary", item: "Kitchen sink", value: "1" },
      { group: "Electrical", item: "Air-cond points", value: "6" },
      { group: "Electrical", item: "Water heater points", value: "3" },
      { group: "Electrical", item: "Data point", value: "1" },
      { group: "External", item: "Fencing", value: "Brickwall & Metal Grille" },
      { group: "External", item: "Turfing", value: "Provided" },
    ],
    disclaimer: DISCLAIMER_BASE,
    whatsappProjectLine: "Norton Garden Linked Garden Homes (32' x 65') at Eco Grandeur, Bandar Puncak Alam",
    dataSource: "EG Norton Garden Homes brochure",
    contentLastUpdated: "2026-11-23",
    featuredOrder: 3,
    theme: {
      background: "#06171A",
      surface: "#0E262A",
      primary: "#C9A45C",
      secondary: "#1F5560",
      accent: "#E3C88A",
      text: "#F4EEE1",
      muted: "#9FB4B1",
    },
  },
];
