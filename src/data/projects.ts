import type { GalleryImage, Project, Spec } from "./types";

/**
 * Project content migrated from the Base44 app (6b03e14baf639027c969822b) on 23 Nov 2026.
 * Every value comes from the developer brochures. Do not add figures that are not in a verified source.
 * Floor plans are still hosted on Base44 media storage; photography is HD (see IMAGES).
 */


/**
 * HD imagery: the Base44 originals were only 800 to 1000px wide, so they were upscaled to 4K
 * (Higgsfield, bytedance upscaler) and re encoded as 2560px WebP. The Terrace render was
 * cropped to remove brochure text. Hosted on the owner's Higgsfield media storage.
 */
const HD = "https://d2ol7oe51mr4n9.cloudfront.net/user_2wyjxahmz9PtKeHoIbEemDKyafc";

export const IMAGES = {
  /** Home hero: Stargazer's Gazebo, upscaled to 3840x2215 (the gazebo sign is kept from the original so its lettering stays exact) */
  gazebo: `${HD}/024ad470-fe7a-4ca5-93bf-f01d216beea2.webp`,
  wellingtonSemiD: `${HD}/c46a4708-29a1-4433-97fa-fe3e4f80aa50.webp`,
  wellingtonTerrace: `${HD}/6d81629e-efa6-4b86-be94-89ce0325be62.webp`,
  norton: `${HD}/cd79d036-11b5-4d7a-ab5b-b9f0e7152ab4.webp`,
  portrait: `${HD}/41eeccf2-e265-4d21-a032-5f9c9b498fe5.webp`,
  /** Owner-supplied keys photo: cropped waist to just above the head (4:5), lighting graded, upscaled to 4K */
  portraitKeys: `${HD}/120b6b04-3156-4b78-9d84-5625b521806d.webp`,
  /** Owner, seated on a stool in his own brown suit against the same sage wall (pose from the owner's reference). Face kept from his real photo; 1520x2688 (9:16). */
  portraitSeated: `${HD}/189f4455-8881-4ab7-92d4-3bb22fd478d5.webp`,
  /** portraitSeated cropped from just below the chest to above the head, upscaled to 4K (3978x4096) */
  portraitSeatedChest: `${HD}/f0e79b7b-8a22-4111-a3a4-7b5468fe1c25.webp`,
  /** Head-and-shoulders crop of portraitSeated, for round avatars (380x380) */
  portraitSeatedFace: `${HD}/ab01bf0b-f607-496b-a1b1-11add7c38c47.webp`,
  /** The same photo, animated subtly (key sways, pointing finger moves). First and last frames match it, so it loops seamlessly. */
  portraitKeysLoop: `${HD}/dcc7f0be-799d-4e85-a4d3-19aa7fcf6832.mp4`,
  portraitKeysLoopSmall: `${HD}/2ed4494d-9bf4-4855-8cec-fd01b3effc54.mp4`,
  /** Home hero cinemagraph mask, made from the photo: R = sky (drifts), G = trees (sway); gazebo held still */
  heroMask: `${HD}/ec907008-c283-46b9-97e6-8fd656f98178.png`,
  /** Link previews (Open Graph), 1200x630 JPEG under 110KB so WhatsApp and Facebook show them */
  ogDefault: `${HD}/75bf974c-1d36-4cd4-8e16-7222cc473e92.jpg`,
  ogAbout: `${HD}/8e83fb6a-d931-4d65-bcc0-6093355ccae9.jpg`,
  /** Journey film (scroll-scrubbed): blueprint of Wellington Garden Homes becoming the finished render. Short GOP for smooth seeking. */
  journeyFilm: `${HD}/edae5c31-ee9b-47bb-b865-720d1f9d0e4f.mp4`,
  journeyFilmSmall: `${HD}/c984ebfc-d35e-4f7b-962e-283c91b5b293.mp4`,
  /** VP9 in MP4, for browsers without H.264 */
  journeyFilmVp9: `${HD}/c1a179af-18ac-4848-9790-aa9d5407c8c8.mp4`,
  journeyPoster: `${HD}/b076f37b-b1dc-4fd8-9777-2c394d9738df.webp`,
  journeyStill: `${HD}/eab0ceb2-b75c-4090-81f1-83bec111517a.webp`,
} as const;

/** Link preview per development (1200x630 JPEG, labelled "Artist's impression") */
export const OG_BY_SLUG: Record<string, string> = {
  "wellington-garden-terrace": `${HD}/331f0c17-521c-4bcc-988b-34da0c72c29f.jpg`,
  "wellington-garden-homes": `${HD}/e1a47948-7341-4e3f-aca0-9d6a4d858d52.jpg`,
  "norton-garden": `${HD}/e08cdf74-7133-41a8-bcb6-7f2bbd5e8d31.jpg`,
};

/** Base for floor plans: owner's media storage (moved off Base44, 24 Nov 2026; byte-identical copies). */
export const MEDIA_BASE = HD;

const gazebo: GalleryImage = {
  url: IMAGES.gazebo,
  caption: "Stargazer's Gazebo, Wellington Garden",
  label: "Artist's impression",
};

const SALES_GALLERY = {
  name: "EcoWorld Gallery @ Eco Grandeur",
  address:
    "Lot 6232, Persiaran Mokhtar Dahari, Eco Grandeur, 42300 Bandar Puncak Alam, Selangor Darul Ehsan",
  hours: "Mon to Fri, 9am to 6pm · Weekends and public holidays, 10am to 6pm",
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
  { group: "Electrical", item: "Air conditioner points", value: "2" },
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
      "With eye catching and elegant facades, the spacious and well planned terrace homes in Wellington Garden are designed for discerning individuals who value the important things in life. Located in the up and coming district northwest of the Klang Valley, Eco Grandeur is accessible via the LATAR Highway, Guthrie Corridor Expressway and DASH Highway.",
    highlights: [
      "4 bedrooms · 3 bathrooms",
      "Built up 1,469 to 1,694 sq ft (per permit details)",
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
      "Minimum and maximum prices as stated in the advertising permit details for phases P2F-2 and P2F-4 (Types T1 to T5). 7% discount for Bumiputra. Unit level pricing and current packages must be confirmed with the consultant.",
    priceSource: "Developer digital brochure (Advertising & Sales Permit 14505-7/10-2027/0781(R)-(S))",
    priceLastVerified: "2026-11-23",
    bumiputraDiscount: "7% discount for Bumiputra",
    salesStatus: "Selling, availability to be confirmed with consultant",
    expectedCompletion: "November 2026",
    landTenure: "Leasehold, 99 years (expiry 16/06/2121)",
    landEncumbrances: null,
    restrictionOfInterest:
      "The land can be transferred, leased or charged with prior approval by the State Authority",
    developerBrand: "EcoWorld",
    developerEntity: "Paragon Pinnacle Sdn. Bhd. (1098122-T)",
    developerLicense: "14505/09-2028/1134(R) · valid 21/09/2023 to 20/09/2028",
    advertisingPermit: "14505-7/10-2027/0781(R)-(S)",
    advertisingPermitValidity: "05/10/2026 to 04/10/2027",
    approvingAuthority: "Majlis Perbandaran Kuala Selangor (MPKS)",
    buildingPlanRef:
      "Bil. (20) dlm. MDKS 200.11/280/4/12/2022-01 / 03, Bil. (21) dlm. MDKS 200.11/280/4/12/2022-02 & Bil. (19) dlm. MDKS 200.11/280/4/12/2022-04",
    locationAccessNote: ACCESS,
    salesGallery: SALES_GALLERY,
    specifications: wellingtonSpecs("Ceramic Tiles"),
    disclaimer: `${DISCLAIMER_BASE} Iklan ini telah diluluskan oleh Jabatan Perumahan Negara.`,
    whatsappProjectLine: "Wellington Garden Terrace Homes (18' x 65') at Eco Grandeur, Bandar Puncak Alam",
    dataSource: "EG Wellington Garden Terrace Home digital brochure",
    contentLastUpdated: "2026-11-23",
    featuredOrder: 1,
    theme: { accent: "#8FD9B6" },
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
      "Wellington Garden brings a new iteration of beautiful, well planned garden homes. With four bedrooms, these homes offer the space to suit your unique requirements. Located in the up and coming district northwest of the Klang Valley, Eco Grandeur is accessible via the LATAR Highway, Guthrie Corridor Expressway and DASH Highway.",
    highlights: [
      "4 bedrooms · 3 bathrooms",
      "Built up 1,651 to 1,700 sq ft",
      "Types G1 to G4, corner/end and intermediate",
      "Expected completion November 2026",
    ],
    facilities: WELLINGTON_FACILITIES,
    heroImage: { url: IMAGES.wellingtonSemiD, caption: "Garden Home 24' x 55' (semi detached)", label: "Artist's impression" },
    gallery: [
      { url: IMAGES.wellingtonSemiD, caption: "Garden Home 24' x 55' (semi detached)", label: "Artist's impression" },
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
      "Range combines permit details for P2F-1 (RM990,000 to RM1,230,000; 174 units) and P2F-3 (RM976,800 to RM1,252,800; 126 units). 7% discount for Bumiputra. Unit level pricing and current packages must be confirmed with the consultant.",
    priceSource: "Developer brochure (Advertising & Sales Permit 14505-7/10-2027/0781(R)-(S))",
    priceLastVerified: "2026-11-23",
    bumiputraDiscount: "7% discount for Bumiputra",
    salesStatus: "Selling, availability to be confirmed with consultant",
    expectedCompletion: "November 2026",
    landTenure: "99 years (expiry 16/06/2121)",
    landEncumbrances: null,
    restrictionOfInterest:
      "The land can be transferred, leased or charged with prior approval by the State Authority",
    developerBrand: "EcoWorld",
    developerEntity: "Paragon Pinnacle Sdn. Bhd. (1098122-T)",
    developerLicense: "14505/09-2028/1134(A) · valid 21/09/2023 to 20/09/2028",
    advertisingPermit: "14505-7/10-2027/0781(R)-(S)",
    advertisingPermitValidity: "05/10/2026 to 04/10/2027",
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
    theme: { accent: "#BFCDB3" },
  },
  {
    slug: "norton-garden",
    name: "Norton Garden",
    productName: "Linked Garden Homes",
    productLabel: "Linked Garden Home · 32' x 65'",
    propertyType: "Double Storey Linked Garden Home (semi detached living)",
    category: "Landed",
    township: "Eco Grandeur",
    location: "Bandar Puncak Alam",
    state: "Selangor",
    tagline: "A home in a garden. A Modern Victorian haven.",
    description:
      "Come home to Norton Garden and be surrounded by lush gardens, a Modern Victorian haven with an exclusive clubhouse designed only for residents. The linked Garden Home offers a semi detached living experience inspired by the Victorian aesthetic, streamlined to reflect modern tastes, with generous and practical spaces for family life. 20 ft back lane gardens extend the garden living experience.",
    highlights: [
      "4 bedrooms · 3 bathrooms",
      "Built up 2,090 to 2,258 sq ft",
      "Exclusive residents' clubhouse",
      "20 ft back lane gardens",
    ],
    facilities: ["Exclusive residents' clubhouse", "20 ft back lane gardens"],
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
      "The brochure's advertising permit validity period (11/08/2022 to 10/08/2025) has ended and its expected completion date was July 2025. Pricing, availability and current permit status must be reconfirmed with the developer before display.",
    priceSource: "Developer brochure (Advertising & Sales Permit 14505-6/08-2025/0109(A)-(S))",
    priceLastVerified: null,
    bumiputraDiscount: "7% discount for Bumiputra (per brochure)",
    salesStatus: "Availability & pricing to be reconfirmed",
    expectedCompletion: "July 2025 (per brochure, reconfirm current status)",
    landTenure: "Leasehold, 99 years (expiry 18/11/2119)",
    landEncumbrances: "Public Bank Berhad (6463-H)",
    restrictionOfInterest:
      "The land can be transferred, leased or charged with prior approval by the State Authority",
    developerBrand: "EcoWorld",
    developerEntity: "Paragon Pinnacle Sdn. Bhd. (1098122-T)",
    developerLicense: "14505/09-2028/1134(A) · valid 21/09/2023 to 20/09/2028",
    advertisingPermit: "14505-6/08-2025/0109(A)-(S)",
    advertisingPermitValidity: "11/08/2022 to 10/08/2025 (ended)",
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
      { group: "Electrical", item: "Air conditioner points", value: "6" },
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
    theme: { accent: "#9CCBB9" },
  },
];
