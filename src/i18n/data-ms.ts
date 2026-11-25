import type { FAQ, GalleryImage, Project, UnitType, WhatsAppContext } from "@/data/types";

/**
 * Bahasa Melayu content for the developments. Facts, figures, permit numbers and brand or product names
 * stay exactly as in the developer documents; only the wording around them is written in Malay.
 */

type ProjectText = Partial<
  Pick<
    Project,
    | "productLabel"
    | "propertyType"
    | "tagline"
    | "description"
    | "highlights"
    | "facilities"
    | "totalUnitsLabel"
    | "priceRangeLabel"
    | "priceNote"
    | "priceSource"
    | "bumiputraDiscount"
    | "salesStatus"
    | "expectedCompletion"
    | "landTenure"
    | "restrictionOfInterest"
    | "developerLicense"
    | "advertisingPermit"
    | "advertisingPermitValidity"
    | "approvingAuthority"
    | "buildingPlanRef"
    | "locationAccessNote"
    | "disclaimer"
    | "whatsappProjectLine"
    | "dataSource"
    | "spotlight"
  >
> & { salesGallery?: Partial<Project["salesGallery"]> };

const NS = "Tidak dinyatakan dalam brosur atau senarai harga";
const RESTRICTION = "Tanah boleh dipindah milik, dipajak atau dicagarkan dengan kelulusan terlebih dahulu daripada Pihak Berkuasa Negeri";
const EG_ACCESS = "Mudah dihubungi melalui Lebuhraya LATAR, Guthrie Corridor Expressway (GCE) dan Lebuhraya DASH.";
const EG_HOURS = "Isnin hingga Jumaat, 9 pagi hingga 6 petang · Hujung minggu dan cuti umum, 10 pagi hingga 6 petang";
const EG_DISTRICT =
  "Terletak di kawasan yang sedang pesat membangun di barat laut Lembah Klang, Eco Grandeur mudah dihubungi melalui Lebuhraya LATAR, Guthrie Corridor Expressway dan Lebuhraya DASH.";
const DISCLAIMER_BASE =
  "Semua ilustrasi, lukisan seni dan gambar adalah gambaran artis semata-mata. Pelan, susun atur, spesifikasi dan maklumat tertakluk kepada perubahan dan tidak membentuk sebarang tawaran atau kontrak. Sila rujuk perjanjian jual beli bagi unit sebenar yang dibeli.";
const CONFIRM_UNIT = "Harga setiap unit dan pakej semasa perlu disahkan dengan perunding.";

export const PROJECTS_MS: Record<string, ProjectText> = {
  "wellington-garden-terrace": {
    productLabel: "Rumah Teres Dua Tingkat · 18' x 65'",
    propertyType: "Rumah Teres Dua Tingkat",
    tagline: "Pulang ke rumah yang dikelilingi landskap menghijau.",
    description: `Dengan fasad yang elegan dan menarik perhatian, rumah teres di Wellington Garden direka luas dan tersusun untuk mereka yang menghargai perkara penting dalam hidup. ${EG_DISTRICT}`,
    highlights: [
      "4 bilik tidur · 3 bilik air",
      "Keluasan binaan 1,469 hingga 1,694 sq ft (mengikut butiran permit)",
      "Pajakan 99 tahun (tamat 16/06/2121)",
      "Jangkaan siap November 2026",
    ],
    priceRangeLabel: "Julat harga permit",
    priceNote: `Harga minimum dan maksimum seperti yang dinyatakan dalam butiran permit iklan bagi fasa P2F-2 dan P2F-4 (Jenis T1 hingga T5). Diskaun 7% untuk pembeli Bumiputera. ${CONFIRM_UNIT}`,
    priceSource: "Brosur digital pemaju (Permit Iklan & Jualan 14505-7/10-2027/0781(R)-(S))",
    bumiputraDiscount: "Diskaun 7% untuk Bumiputera",
    salesStatus: "Sedang dijual, status unit perlu disahkan dengan perunding",
    landTenure: "Pajakan, 99 tahun (tamat 16/06/2121)",
    restrictionOfInterest: RESTRICTION,
    developerLicense: "14505/09-2028/1134(R) · sah 21/09/2023 hingga 20/09/2028",
    advertisingPermitValidity: "05/10/2026 hingga 04/10/2027",
    locationAccessNote: EG_ACCESS,
    salesGallery: { hours: EG_HOURS },
    disclaimer: `${DISCLAIMER_BASE} Iklan ini telah diluluskan oleh Jabatan Perumahan Negara.`,
    whatsappProjectLine: "Wellington Garden Terrace Homes (18' x 65') di Eco Grandeur, Bandar Puncak Alam",
    dataSource: "Brosur digital EG Wellington Garden Terrace Home",
  },
  "wellington-garden-homes": {
    productLabel: "Garden Home Dua Tingkat · 24' x 55'",
    propertyType: "Garden Home Dua Tingkat",
    tagline: "Nikmati hidup yang tenang dalam persekitaran yang selamat dan menghijau.",
    description: `Wellington Garden memperkenalkan generasi baharu Garden Home yang cantik dan tersusun. Dengan empat bilik tidur, rumah ini menawarkan ruang yang cukup untuk keperluan keluarga anda. ${EG_DISTRICT}`,
    highlights: [
      "4 bilik tidur · 3 bilik air",
      "Keluasan binaan 1,651 hingga 1,700 sq ft",
      "Jenis G1 hingga G4, lot sudut/hujung dan lot tengah",
      "Jangkaan siap November 2026",
    ],
    priceRangeLabel: "Julat harga permit",
    priceNote: `Julat ini menggabungkan butiran permit P2F-1 (RM990,000 hingga RM1,230,000; 174 unit) dan P2F-3 (RM976,800 hingga RM1,252,800; 126 unit). Diskaun 7% untuk pembeli Bumiputera. ${CONFIRM_UNIT}`,
    priceSource: "Brosur pemaju (Permit Iklan & Jualan 14505-7/10-2027/0781(R)-(S))",
    bumiputraDiscount: "Diskaun 7% untuk Bumiputera",
    salesStatus: "Sedang dijual, status unit perlu disahkan dengan perunding",
    landTenure: "99 tahun (tamat 16/06/2121)",
    restrictionOfInterest: RESTRICTION,
    developerLicense: "14505/09-2028/1134(A) · sah 21/09/2023 hingga 20/09/2028",
    advertisingPermitValidity: "05/10/2026 hingga 04/10/2027",
    locationAccessNote: EG_ACCESS,
    salesGallery: { hours: EG_HOURS },
    disclaimer: `${DISCLAIMER_BASE} Iklan ini telah diluluskan oleh Jabatan Perumahan Negara.`,
    whatsappProjectLine: "Wellington Garden Garden Homes (24' x 55') di Eco Grandeur, Bandar Puncak Alam",
    dataSource: "Brosur EG Wellington Garden Home",
  },
  "norton-garden": {
    productLabel: "Linked Garden Home · 32' x 65'",
    propertyType: "Linked Garden Home Dua Tingkat (konsep Semi-D)",
    tagline: "Sebuah rumah di dalam taman. Kediaman Modern Victorian yang mendamaikan.",
    description:
      "Pulang ke Norton Garden, dikelilingi taman yang menghijau. Kediaman bergaya Modern Victorian ini dilengkapi clubhouse eksklusif untuk penduduk sahaja. Linked Garden Home menawarkan pengalaman hidup ala Semi-D yang diilhamkan estetika Victoria, diringkaskan mengikut citarasa moden, dengan ruang yang luas dan praktikal untuk keluarga. Taman lorong belakang selebar 20 kaki melanjutkan lagi suasana hidup bertaman.",
    highlights: [
      "4 bilik tidur · 3 bilik air",
      "Keluasan binaan 2,090 hingga 2,258 sq ft",
      "Clubhouse eksklusif untuk penduduk",
      "Taman lorong belakang 20 kaki",
    ],
    facilities: ["Clubhouse eksklusif untuk penduduk", "Taman lorong belakang 20 kaki"],
    priceRangeLabel: "Julat harga permit",
    priceNote:
      "Tempoh sah permit iklan dalam brosur (11/08/2022 hingga 10/08/2025) telah tamat dan jangkaan siapnya ialah Julai 2025. Harga, status unit dan status permit semasa perlu disahkan semula dengan pemaju sebelum dipaparkan.",
    priceSource: "Brosur pemaju (Permit Iklan & Jualan 14505-6/08-2025/0109(A)-(S))",
    bumiputraDiscount: "Diskaun 7% untuk Bumiputera (mengikut brosur)",
    salesStatus: "Status unit & harga akan disahkan semula",
    expectedCompletion: "Julai 2025 (mengikut brosur, sahkan status terkini)",
    landTenure: "Pajakan, 99 tahun (tamat 18/11/2119)",
    restrictionOfInterest: RESTRICTION,
    developerLicense: "14505/09-2028/1134(A) · sah 21/09/2023 hingga 20/09/2028",
    advertisingPermitValidity: "11/08/2022 hingga 10/08/2025 (telah tamat)",
    locationAccessNote: EG_ACCESS,
    salesGallery: { hours: EG_HOURS },
    disclaimer: DISCLAIMER_BASE,
    whatsappProjectLine: "Norton Garden Linked Garden Homes (32' x 65') di Eco Grandeur, Bandar Puncak Alam",
    dataSource: "Brosur EG Norton Garden Homes",
  },
  "airria-plus": {
    productLabel: "Rumah Teres Dua Tingkat · 20' x 65' hingga 22' x 68'",
    propertyType: "Rumah Teres Dua Tingkat",
    tagline: "Nostalgia dalam rekaan moden. Hidup yang kembali tenang.",
    description:
      "Airria Plus ialah projek kediaman seluas 59 ekar di Kundang, dirancang mengelilingi taman tasik pusat seluas 7 ekar. Rumah teres dua tingkatnya menggabungkan fasad moden yang kemas dengan rentak hidup yang lebih tenang: berjalan petang di tepi tasik, anak-anak bermain di luar, keluarga sentiasa dekat. Setiap jenis rumah mempunyai empat bilik tidur dan tiga bilik air, termasuk bilik tidur di tingkat bawah dan ruang belajar di tingkat atas, dan penduduk berkongsi clubhouse di tepi tasik.",
    highlights: [
      "4 bilik tidur · 3 bilik air bagi setiap jenis",
      "Keluasan binaan 2,046 hingga 2,443 sq ft",
      "Projek 59 ekar dengan taman tasik pusat 7 ekar",
      "Senarai harga Fasa 3: 156 lot, dari RM672,100",
    ],
    facilities: [
      "Clubhouse dengan gimnasium",
      "Gelanggang badminton",
      "Kolam renang 25m & kolam kanak-kanak",
      "Taman tasik pusat 7 ekar",
      "Rumah pokok & denai hutan",
      "Trek jogging & berbasikal 1km",
      "Amfiteater",
      "Taman permainan kanak-kanak",
      "Gim luar",
      "Tapak BBQ",
      "Gelanggang sukan pelbagai guna",
      "Taman rempah komuniti",
      "Tadika",
      "Surau",
      "Kafe",
      "Pondok pengawal",
    ],
    totalUnitsLabel: "156 lot dalam senarai harga Fasa 3 (Blok 24, 25, 31 hingga 35, 37 hingga 43)",
    priceRangeLabel: "Julat harga Fasa 3",
    priceNote:
      "Harga jualan bersih daripada senarai harga Fasa 3 pemaju bertarikh 7 September 2026. Lot yang dikhaskan untuk pembeli Bumiputera menerima diskaun 7% daripada harga kasar SPA, dan harga bersih selepas diskaun itulah yang dipaparkan. Harga, pakej dan status unit boleh berubah, jadi sahkan unit dengan perunding sebelum membuat keputusan.",
    priceSource: "Senarai harga jualan Fasa 3 Adenland Airria Plus (07/09/2026)",
    bumiputraDiscount: "7% bagi lot Bumiputera (71 daripada 156 lot Fasa 3)",
    salesStatus: "Fasa 3 sedang dijual, status unit perlu disahkan dengan perunding",
    expectedCompletion: "Akan disahkan",
    landTenure: NS,
    restrictionOfInterest: NS,
    developerLicense: NS,
    advertisingPermit: NS,
    advertisingPermitValidity: NS,
    approvingAuthority: NS,
    buildingPlanRef: NS,
    locationAccessNote:
      "Mudah dihubungi melalui Lebuhraya LATAR, Guthrie Corridor Expressway dan Lebuhraya Utara-Selatan, berhampiran Rawang, Kuang dan Sungai Buloh.",
    salesGallery: { heading: "Pemaju", hours: "Untuk lawatan show unit di Kundang, atur masa dengan Aqil." },
    disclaimer:
      "Semua lukisan dan gambaran adalah gambaran artis semata-mata; gambar di halaman ini diolah daripada render pemaju supaya kelihatan lebih realistik dan bukan gambar rumah yang telah siap. Maklumat boleh berubah tanpa notis dan bukan representasi pemaju. Sila rujuk perjanjian jual beli yang telah disetemkan.",
    whatsappProjectLine: "rumah teres Airria Plus (20' x 65' hingga 22' x 68') di Kundang",
    dataSource: "Brosur Airria Plus Kundang dan senarai harga jualan Fasa 3 (07/09/2026)",
    spotlight: {
      label: "Laris",
      reasons: [
        "26 kemudahan mengelilingi taman tasik pusat 7 ekar",
        "Rentak hidup lebih tenang, jauh dari kesesakan bandar",
        "Rumah teres 4 bilik tidur dari RM672,100",
      ],
    },
  },
};

/** Image captions (place and product names stay as they are) */
export const CAPTIONS_MS: Record<string, string> = {
  "Terrace Homes, Types T2 & T5": "Terrace Homes, Jenis T2 & T5",
  "Garden Home 24' x 55' (semi detached)": "Garden Home 24' x 55' (Semi-D)",
  "Linked Garden Homes, Types G1 & G2": "Linked Garden Homes, Jenis G1 & G2",
  "Double storey terrace homes": "Rumah teres dua tingkat",
  "Clubhouse and infinity pool by the central lake": "Clubhouse dan infinity pool di tepi tasik pusat",
  "Central lake park and amphitheatre deck": "Taman tasik pusat dan dek amfiteater",
  "Tree house overlooking the lake": "Rumah pokok menghadap tasik",
  "Kids playground at the clubhouse": "Taman permainan kanak-kanak di clubhouse",
  "Aerial view of the 59 acre development": "Pandangan udara projek seluas 59 ekar",
};

export const SPEC_ITEMS_MS: Record<string, string> = {
  Structure: "Struktur",
  Wall: "Dinding",
  "Roof cover": "Penutup bumbung",
  "Roof frame": "Kerangka bumbung",
  Ceiling: "Siling",
  Windows: "Tingkap",
  "Main entrance": "Pintu utama",
  Doors: "Pintu",
  Ironmongery: "Kelengkapan besi",
  Floor: "Lantai",
  "Ground floor (living/dining/kitchen/bedroom)": "Tingkat bawah (ruang tamu/makan/dapur/bilik tidur)",
  "Ground floor (living/dining/kitchen/leisure/bedroom)": "Tingkat bawah (ruang tamu/makan/dapur/rehat/bilik tidur)",
  "First floor bedrooms": "Bilik tidur tingkat atas",
  "Kitchen wall": "Dinding dapur",
  "Bath wall": "Dinding bilik air",
  "Bath walls": "Dinding bilik air",
  "Master bath wall": "Dinding bilik air utama",
  "Other walls": "Dinding lain",
  "WC / Wash basins / Showers": "Tandas / Sinki basuh tangan / Pancuran",
  "Tap points": "Titik paip",
  "Kitchen sink": "Sinki dapur",
  "Air conditioner points": "Titik penghawa dingin",
  "Water heater points": "Titik pemanas air",
  "Fiber wall socket": "Soket dinding gentian optik",
  "Fibre wall socket": "Soket dinding gentian optik",
  "Data point": "Titik data",
  "Lighting points": "Titik lampu",
  "13A power points": "Soket kuasa 13A",
  "Ceiling fan points": "Titik kipas siling",
  "Distribution board": "Papan agihan",
  Fencing: "Pagar",
  Turfing: "Rumput",
};

export const SPEC_VALUES_MS: Record<string, string> = {
  "Reinforced Concrete": "Konkrit bertetulang",
  "Reinforced concrete": "Konkrit bertetulang",
  "Brickworks / Reinforced Concrete": "Kerja bata / Konkrit bertetulang",
  Brickwork: "Kerja bata",
  "Roof Tiles / Concrete Slab / Metal Deck": "Jubin bumbung / Papak konkrit / Dek logam",
  "Roof Tiles / Concrete Slab / Metal Deck Roofing": "Jubin bumbung / Papak konkrit / Bumbung dek logam",
  "Concrete Slab / Plaster Ceiling": "Papak konkrit / Siling plaster",
  "Aluminium Framed Glass Casement / Top Hung / Fixed Glass": "Tingkap kaca berbingkai aluminium jenis casement / top hung / kaca tetap",
  "Aluminium Framed Glass Window": "Tingkap kaca berbingkai aluminium",
  "Aluminium framed glass windows": "Tingkap kaca berbingkai aluminium",
  "Solid Core Door": "Pintu solid core",
  "Porcelain Tiles": "Jubin porselin",
  "Ceramic Tiles": "Jubin seramik",
  "Laminated Timber": "Lantai kayu laminasi",
  "Laminated Timber Flooring": "Lantai kayu laminasi",
  "1500mm High Ceramic Wall Tiles / Plaster & Paint": "Jubin dinding seramik setinggi 1500mm / Plaster & cat",
  "2700mm High Ceramic Tiles / Plaster & Paint": "Jubin seramik setinggi 2700mm / Plaster & cat",
  "2700mm High Ceramic & Porcelain Wall Tiles": "Jubin dinding seramik & porselin setinggi 2700mm",
  "Brick Wall and Metal Grille": "Dinding bata dan gril logam",
  "Brickwall & Metal Grille": "Dinding bata & gril logam",
  Provided: "Disediakan",
  "Concrete wall / Masonry wall": "Dinding konkrit / Dinding batu",
  "Roof tiles / Metal roofing sheet": "Jubin bumbung / Kepingan bumbung logam",
  "Metal roof frame / Reinforced concrete frame": "Kerangka bumbung logam / Kerangka konkrit bertetulang",
  "Skim coat / Plaster ceiling": "Skim coat / Siling plaster",
  "Timber door / Aluminium framed glass doors": "Pintu kayu / Pintu kaca berbingkai aluminium",
  "Selected locksets": "Set kunci pilihan",
  "Selected tiles / Cement render": "Jubin pilihan / Lepa simen",
  "1500mm high selected tiles, plaster and paint": "Jubin pilihan setinggi 1500mm, plaster dan cat",
  "Full height selected tiles": "Jubin pilihan setinggi siling",
  "Plaster and paint": "Plaster dan cat",
  "16 (intermediate) · 17 (corner & end)": "16 (lot tengah) · 17 (lot sudut & hujung)",
  "1500mm high fence": "Pagar setinggi 1500mm",
};

export function captionMs(img: GalleryImage): GalleryImage {
  return { ...img, caption: CAPTIONS_MS[img.caption] ?? img.caption };
}

/* Unit types */

const KEY_SPACES_MS: Record<string, string> = {
  "Ground floor Bedroom 3 with Bath 2": "Bilik tidur 3 dengan bilik air 2 di tingkat bawah",
  "Ground floor Bedroom 4 with Bath 3": "Bilik tidur 4 dengan bilik air 3 di tingkat bawah",
  "Ground floor Bedroom 4": "Bilik tidur 4 di tingkat bawah",
  "First floor study area": "Ruang belajar di tingkat atas",
  "First floor family area": "Ruang keluarga di tingkat atas",
  "Ground floor leisure area": "Ruang rehat di tingkat bawah",
  "Master bedroom with balcony": "Bilik tidur utama dengan balkoni",
  "Living, dining & kitchen": "Ruang tamu, ruang makan & dapur",
  "Living & dining": "Ruang tamu & ruang makan",
  "Kitchen & yard": "Dapur & ruang ampaian",
  "Yard & store": "Ruang ampaian & stor",
  Yard: "Ruang ampaian",
  Store: "Stor",
  Kitchen: "Dapur",
  "Four bedrooms": "Empat bilik tidur",
  "Car porch": "Porch kereta",
  "Corner / end lot": "Lot sudut / hujung",
  "Double volume void": "Ruang double volume",
  "Side patio": "Patio sisi",
};

const WT_MS = "Dilukis semula daripada brosur EcoWorld Wellington Garden supaya lebih jelas.";
const WG_MS = "Bukan mengikut skala. Dilukis semula daripada brosur EcoWorld Wellington Garden supaya lebih jelas; rujuk kit jualan pemaju untuk susun atur muktamad.";
const NG_MS = "Bukan mengikut skala. Dilukis semula daripada brosur EcoWorld Norton Garden supaya lebih jelas; rujuk kit jualan pemaju untuk susun atur muktamad.";
const AP_MS = "Bukan mengikut skala. Diambil daripada brosur Airria Plus; rujuk kit jualan pemaju dan SPA untuk susun atur muktamad.";
const AP_AVAIL = "Status unit perlu disahkan dengan perunding.";

const UNIT_TEXT_MS: Record<string, { floorPlanNote: string; availabilityNote?: string }> = {
  "wt-t2": { floorPlanNote: `Bukan mengikut skala. Brosur menunjukkan pelan ini untuk Jenis T2 & T5. ${WT_MS}` },
  "wt-t3": { floorPlanNote: `Bukan mengikut skala. Brosur menunjukkan pelan ini untuk Jenis T3 & T5. ${WT_MS}` },
  "wt-t5": {
    floorPlanNote:
      "Bukan mengikut skala. Brosur menunjukkan T5 bersama susun atur T2/T3; pelan yang dipaparkan ialah susun atur T2 & T5 yang dikongsi. Sahkan susun atur sebenar dengan galeri jualan.",
  },
  "wg-g1": { floorPlanNote: WG_MS },
  "wg-g2": { floorPlanNote: WG_MS },
  "wg-g3": { floorPlanNote: WG_MS },
  "wg-g4": { floorPlanNote: WG_MS },
  "ng-g1": { floorPlanNote: NG_MS },
  "ng-g2": { floorPlanNote: NG_MS },
  "ng-g3": { floorPlanNote: NG_MS },
  "ng-g4": { floorPlanNote: NG_MS },
  "ng-g5": { floorPlanNote: NG_MS },
  "ap-a1": {
    floorPlanNote: `${AP_MS} Brosur menunjukkan Jenis A1; sahkan susun atur A2 hingga A6 dengan perunding.`,
    availabilityNote: `Harga bersih bagi 91 lot Jenis A dalam senarai harga Fasa 3 (7 Sep 2026). ${AP_AVAIL}`,
  },
  "ap-b1": {
    floorPlanNote: `${AP_MS} Brosur menunjukkan Jenis B1; sahkan susun atur B2 hingga B6 dengan perunding.`,
    availabilityNote: `Harga bersih bagi 55 lot Jenis B dalam senarai harga Fasa 3 (7 Sep 2026). ${AP_AVAIL}`,
  },
  "ap-c1": {
    floorPlanNote: `${AP_MS} Brosur menunjukkan Jenis C1; sahkan susun atur C2 dengan perunding.`,
    availabilityNote: `Harga bersih bagi 4 lot sudut Jenis C dalam senarai harga Fasa 3 (7 Sep 2026). ${AP_AVAIL}`,
  },
  "ap-d1": {
    floorPlanNote: `${AP_MS} Brosur menunjukkan Jenis D1; sahkan susun atur D2 dengan perunding.`,
    availabilityNote: `Harga bersih bagi 6 lot Jenis D dalam senarai harga Fasa 3 (7 Sep 2026). Keluasan tanah 2,852 hingga 4,370 sq ft. ${AP_AVAIL}`,
  },
};

const AVAILABILITY_MS: Record<string, string> = {
  "Availability requires consultant confirmation.": "Status unit perlu disahkan oleh perunding.",
  "Availability and pricing must be reconfirmed with the developer.": "Status unit dan harga perlu disahkan semula dengan pemaju.",
};

/** "Intermediate (A1, A2), from RM672,100" -> "Lot tengah (A1, A2), dari RM672,100" */
function positionMs(s: string) {
  return s
    .replace(/^Corner \/ End lot/, "Lot sudut / hujung")
    .replace(/^Corner \/ End/, "Lot sudut / hujung")
    .replace(/^End lot with extra land/, "Lot hujung dengan tanah lebihan")
    .replace(/^End lot/, "Lot hujung")
    .replace(/^Corner/, "Lot sudut")
    .replace(/^Intermediate/, "Lot tengah")
    .replace(", from ", ", dari ")
    .replace(/ to /g, " hingga ");
}

/** "Terrace Home Type C1 (corner)" -> "Rumah Teres Jenis C1 (lot sudut)" */
function unitNameMs(s: string) {
  return s
    .replace(/^Terrace Home /, "Rumah Teres ")
    .replace(/ Type /, " Jenis ")
    .replace("(corner & end)", "(lot sudut & hujung)")
    .replace("(corner)", "(lot sudut)");
}

export function unitMs(u: UnitType): UnitType {
  const text = UNIT_TEXT_MS[u.id];
  return {
    ...u,
    name: unitNameMs(u.name),
    storeys: u.storeys === "Double storey" ? "Dua tingkat" : u.storeys,
    variants: u.variants.map((v) => ({ ...v, position: positionMs(v.position) })),
    keySpaces: u.keySpaces.map((k) => KEY_SPACES_MS[k] ?? k),
    floorPlanNote: text?.floorPlanNote ?? u.floorPlanNote,
    priceLabel: u.priceLabel === "Price on request" ? "Harga atas permintaan" : u.priceLabel.replace(/ to /g, " hingga "),
    availabilityNote: text?.availabilityNote ?? AVAILABILITY_MS[u.availabilityNote] ?? u.availabilityNote,
    image: u.image ? captionMs(u.image) : null,
  };
}

/* FAQ */

const SRC_MS: Record<string, string> = {
  "Developer digital brochure": "Brosur digital pemaju",
  "Developer brochure": "Brosur pemaju",
  "Airria Plus brochure": "Brosur Airria Plus",
  "Phase 3 price list, 07/09/2026": "Senarai harga Fasa 3, 07/09/2026",
  "Brochure and price list": "Brosur dan senarai harga",
};

const WT = "wellington-garden-terrace";
const WG = "wellington-garden-homes";
const NG = "norton-garden";
const AP = "airria-plus";

const QA_MS: Record<string, [string, string][]> = {
  [WT]: [
    ["Apakah jenis pegangan tanahnya?", "Pajakan, 99 tahun, tamat pada 16/06/2121."],
    ["Bilakah jangkaan siapnya?", "Brosur menyatakan jangkaan siap pada November 2026. Sila sahkan status pembinaan dan serahan kunci terkini dengan perunding."],
    ["Siapakah pemajunya?", "Paragon Pinnacle Sdn. Bhd. (1098122-T), sebuah syarikat EcoWorld. Lesen pemaju 14505/09-2028/1134(R)."],
    [
      "Berapa banyak unit dan apakah saiz yang ditawarkan?",
      "Sebanyak 305 unit merangkumi fasa P2F-2 (160 unit) dan P2F-4 (145 unit), Jenis T1 hingga T5, dengan keluasan binaan dari 1,469 hingga 1,694 sq ft. Status unit semasa perlu disahkan dengan perunding.",
    ],
    ["Adakah diskaun Bumiputera?", "Brosur menyatakan diskaun 7% untuk pembeli Bumiputera."],
    [
      "Di manakah galeri jualannya?",
      "EcoWorld Gallery @ Eco Grandeur, Lot 6232, Persiaran Mokhtar Dahari, 42300 Bandar Puncak Alam, Selangor. Dibuka Isnin hingga Jumaat 9 pagi hingga 6 petang, hujung minggu dan cuti umum 10 pagi hingga 6 petang. Waze: Eco Grandeur Sales Gallery.",
    ],
  ],
  [WG]: [
    ["Apakah jenis pegangan tanahnya?", "Brosur menyatakan 99 tahun, tamat pada 16/06/2121."],
    ["Bilakah jangkaan siapnya?", "Brosur menyatakan jangkaan siap pada November 2026. Sila sahkan status pembinaan dan serahan kunci terkini dengan perunding."],
    ["Berapa bilik tidur Garden Home ini?", "Keempat-empat jenis (G1 hingga G4) mempunyai empat bilik tidur dan tiga bilik air, dengan keluasan binaan dari 1,651 hingga 1,700 sq ft."],
    ["Berapa jumlah unitnya?", "Sebanyak 300 unit: P2F-1 (174 unit) dan P2F-3 (126 unit). Status unit semasa perlu disahkan dengan perunding."],
    ["Adakah diskaun Bumiputera?", "Brosur menyatakan diskaun 7% untuk pembeli Bumiputera."],
    [
      "Apakah kemudahan yang dipaparkan dalam brosur?",
      "Brosur menampilkan Grand Entrance, Wellington Place, Stargazer's Gazebo dan Pocket Garden. Tanya perunding untuk senarai kemudahan penuh.",
    ],
  ],
  [NG]: [
    ["Apakah jenis pegangan tanahnya?", "Pajakan, 99 tahun, tamat pada 18/11/2119."],
    [
      "Adakah Norton Garden masih ada unit?",
      "Brosur menyenaraikan jangkaan siap pada Julai 2025, dan tempoh sah permit iklannya telah tamat. Sila hubungi perunding untuk mengesahkan status unit dan harga semasa.",
    ],
    [
      "Apa yang membezakan susun atur Norton Garden?",
      "Linked Garden Home ini menawarkan pengalaman hidup ala Semi-D di atas lot 32' x 65', dengan taman lorong belakang 20 kaki dan clubhouse eksklusif untuk penduduk. Jenis G2, G4 dan G5 mempunyai ruang keluarga di tingkat atas.",
    ],
    ["Berapa jumlah unitnya?", "Brosur menyenaraikan 192 unit Garden Home dalam Fasa 2A-2, dengan keluasan binaan dari 2,090 hingga 2,258 sq ft."],
    ["Adakah tanah ini mempunyai bebanan?", "Brosur menyenaraikan Public Bank Berhad (6463-H) sebagai bebanan tanah."],
  ],
  [AP]: [
    [
      "Di manakah Airria Plus dan siapakah pemajunya?",
      "Airria Plus ialah projek kediaman seluas 59 ekar di Kundang, Selangor, oleh Adenland (Kundang) Sdn Bhd (970958-D). Ia boleh dihubungi melalui Lebuhraya LATAR, Guthrie Corridor Expressway dan Lebuhraya Utara-Selatan.",
    ],
    [
      "Berapakah harga rumah Fasa 3?",
      "Harga jualan bersih dalam senarai harga Fasa 3 bermula dari RM672,100 (Jenis A lot tengah) hingga RM1,074,200 (Jenis D lot sudut), melibatkan 156 lot di Blok 24, 25, 31 hingga 35 dan 37 hingga 43. Harga dan status unit boleh berubah, jadi sahkan unit dengan perunding.",
    ],
    [
      "Bagaimanakah diskaun Bumiputera dikira?",
      "Sebanyak 71 daripada 156 lot Fasa 3 ialah lot Bumiputera. Lot ini disenaraikan dengan harga kasar SPA dan diskaun Bumiputera 7%; harga bersih itulah yang dipaparkan di halaman ini. Contohnya, lot Bumiputera Jenis A lot tengah berharga RM722,688 kasar, tolak RM50,588, menjadikannya RM672,100 bersih. Lot lain tidak menerima diskaun.",
    ],
    [
      "Apakah jenis rumah yang ditawarkan?",
      "Semuanya rumah teres dua tingkat dengan empat bilik tidur dan tiga bilik air. Jenis A berukuran 20' x 65' (2,046 hingga 2,094 sq ft), Jenis B 20' x 68' (2,165 hingga 2,213 sq ft), Jenis C lot sudut 22' x 65' (2,308 sq ft) dan Jenis D lot sudut atau lot hujung 22' x 68' (2,443 sq ft). Setiap susun atur mempunyai bilik tidur di tingkat bawah dan ruang belajar di tingkat atas.",
    ],
    [
      "Apakah kemudahan yang dirancang?",
      "Clubhouse dengan gelanggang badminton, gimnasium, kafe, tadika, surau dan pejabat pengurusan, bersebelahan taman tasik pusat seluas 7 ekar yang menempatkan kolam renang 25m, kolam kanak-kanak, tapak BBQ, dua taman permainan kanak-kanak, dua gim luar, dek tinjau, amfiteater, rumah pokok, denai hutan, trek jogging dan berbasikal 1km, taman rempah komuniti, sunken lounge, gelanggang sukan pelbagai guna, taman dan pondok pengawal.",
    ],
    [
      "Apakah jenis pegangan tanah dan bilakah jangkaan siapnya?",
      "Kedua-duanya tidak dinyatakan dalam brosur atau senarai harga. Tanya Aqil tentang pegangan tanah, lesen pemaju, permit iklan dan jangkaan tarikh siap sebelum anda membuat booking.",
    ],
  ],
};

export function faqsMs(list: FAQ[]): FAQ[] {
  return list.map((f) => {
    const qa = QA_MS[f.projectSlug]?.[f.sortOrder - 1];
    return { ...f, question: qa?.[0] ?? f.question, answer: qa?.[1] ?? f.answer, source: SRC_MS[f.source] ?? f.source };
  });
}

export const NEARBY_NAMES_MS: Record<string, string> = {
  "North South Expressway": "Lebuhraya Utara-Selatan",
  "Sungai Buloh Hospital": "Hospital Sungai Buloh",
  "LATAR Highway": "Lebuhraya LATAR",
  "DASH Highway": "Lebuhraya DASH",
  "LATAR Expressway": "Lebuhraya LATAR",
};

/* Site wide wording */

export const SITE_MS = {
  consultantTitle: "Perunding Hartanah",
  serviceApproach:
    "Bimbingan peribadi dari pertanyaan pertama hingga kunci di tangan, supaya anda membuat keputusan hartanah yang tepat, melalui proses pembelian dengan yakin dan akhirnya menerima kunci rumah sendiri.",
  consentText:
    "Saya bersetuju untuk dihubungi oleh Aqil Hazim berkenaan pertanyaan ini dan membenarkan butiran yang saya berikan diproses bagi tujuan tersebut.",
  calculatorDisclaimer:
    "Semua pengiraan adalah anggaran untuk tujuan perancangan sahaja. Ia bukan sebut harga bank, kelulusan pembiayaan atau nasihat undang-undang.",
  upfront: {
    "Down payment": "Bayaran pendahuluan",
    "SPA legal fees": "Yuran guaman SPA",
    "Loan agreement legal fees": "Yuran guaman perjanjian pinjaman",
    "Stamp duty (MOT & loan)": "Duti setem (MOT & pinjaman)",
  } as Record<string, string>,
};

/** Supports {project}, {location}, {unit}, {config}, {price}, {shortlist}, {consultant} */
export const WHATSAPP_MS: Record<WhatsAppContext, string> = {
  general: "Hi {consultant}, saya sedang mencari rumah dan ingin dapatkan panduan peribadi.",
  project_overview: "Hi {consultant}, saya berminat dengan {project} ({location}). Boleh kongsikan maklumat lanjut tentang projek ini?",
  unit_type: "Hi {consultant}, saya ingin tahu lebih lanjut tentang {unit} di {project} ({config}). {price}",
  price: "Hi {consultant}, boleh kongsikan senarai harga terkini dan pakej semasa untuk {project}? Saya faham promosi tertakluk kepada terma pemaju.",
  availability: "Hi {consultant}, adakah {unit} di {project} masih ada? Saya faham status unit perlu disahkan oleh {consultant}.",
  virtual_tour: "Hi {consultant}, saya sudah melihat susun atur {unit} di {project}. Boleh kita atur lawatan atau sesi walkthrough?",
  financial_planner: "Hi {consultant}, saya sudah mencuba perancang kewangan di laman anda dan ingin berbincang tentang anggaran untuk {project}.",
  comparison: "Hi {consultant}, saya sedang membandingkan pilihan ini: {shortlist}. Boleh bantu saya pilih yang paling sesuai?",
  viewing: "Hi {consultant}, saya ingin mengatur lawatan untuk {project}{unit}.",
};
