import { subDays, subMinutes } from "date-fns";

import type {
  MenuItem,
  Order,
  OrderLine,
  OrderStatus,
  OrderType,
  OptionSelection,
} from "@/types";
import {
  beanGroup,
  breadGroup,
  milkGroup,
  serveGroup,
  shotGroup,
  sizeGroup,
} from "./option-groups";
import { computeTotals } from "@/lib/pricing";

/* ---------------------------------------------------------------------------
   Menu — 32 items across 6 categories
--------------------------------------------------------------------------- */

type SeedMenuItem = Omit<MenuItem, "id" | "createdAt"> & { ageDays: number };

const MENU_SEED: SeedMenuItem[] = [
  // --- Espresso -----------------------------------------------------------
  {
    code: "ESP-01",
    name: "Espresso",
    description: "A double shot, pulled short. Whatever is on the hopper today.",
    category: "espresso",
    basePriceFils: 1400,
    intensity: 5,
    tags: ["high-caffeine"],
    optionGroups: [beanGroup(), shotGroup()],
    available: true,
    isSignature: false,
    ageDays: 420,
  },
  {
    code: "ESP-02",
    name: "Cortado",
    description: "Equal parts espresso and steamed milk. Served in glass.",
    category: "espresso",
    basePriceFils: 1800,
    intensity: 4,
    tags: [],
    optionGroups: [milkGroup(), shotGroup()],
    available: true,
    isSignature: false,
    ageDays: 420,
  },
  {
    code: "ESP-03",
    name: "Flat white",
    description: "Ristretto base, thin microfoam. The house benchmark.",
    category: "espresso",
    basePriceFils: 2200,
    intensity: 4,
    tags: ["signature"],
    optionGroups: [sizeGroup(300, 600), milkGroup(), shotGroup()],
    available: true,
    isSignature: true,
    ageDays: 420,
  },
  {
    code: "ESP-04",
    name: "Cappuccino",
    description: "Classic build, dusted with cocoa only if you ask.",
    category: "espresso",
    basePriceFils: 2200,
    intensity: 3,
    tags: [],
    optionGroups: [sizeGroup(), milkGroup(), shotGroup()],
    available: true,
    isSignature: false,
    ageDays: 420,
  },
  {
    code: "ESP-05",
    name: "Latte",
    description: "Long milk, gentle extraction. The easy one.",
    category: "espresso",
    basePriceFils: 2400,
    intensity: 3,
    tags: [],
    optionGroups: [sizeGroup(), milkGroup(), shotGroup()],
    available: true,
    isSignature: false,
    ageDays: 420,
  },
  {
    code: "ESP-06",
    name: "Spanish latte",
    description: "Condensed milk stirred through, less sweet than most.",
    category: "espresso",
    basePriceFils: 2600,
    intensity: 3,
    tags: [],
    optionGroups: [sizeGroup(), milkGroup(), shotGroup()],
    available: true,
    isSignature: false,
    ageDays: 300,
  },
  {
    code: "ESP-07",
    name: "Pistachio latte",
    description: "We grind Aleppo pistachios into the paste every Tuesday.",
    category: "espresso",
    basePriceFils: 3200,
    intensity: 3,
    tags: ["signature", "contains-nuts"],
    optionGroups: [sizeGroup(), milkGroup(), shotGroup()],
    available: true,
    isSignature: true,
    ageDays: 180,
  },

  // --- Filter -------------------------------------------------------------
  {
    code: "FIL-01",
    name: "V60",
    description: "One origin, brewed to order. Ask the bar what is open.",
    category: "filter",
    basePriceFils: 2600,
    intensity: 3,
    tags: [],
    optionGroups: [beanGroup()],
    available: true,
    isSignature: false,
    ageDays: 420,
  },
  {
    code: "FIL-02",
    name: "Batch brew",
    description: "Brewed every twenty minutes. Poured in seconds.",
    category: "filter",
    basePriceFils: 1600,
    intensity: 3,
    tags: [],
    optionGroups: [sizeGroup(300, 500)],
    available: true,
    isSignature: false,
    ageDays: 420,
  },
  {
    code: "FIL-03",
    name: "Chemex for two",
    description: "600 ml, two cups, one origin. Comes with tasting notes.",
    category: "filter",
    basePriceFils: 4200,
    intensity: 3,
    tags: [],
    optionGroups: [beanGroup()],
    available: true,
    isSignature: false,
    ageDays: 260,
  },
  {
    code: "FIL-04",
    name: "Aeropress",
    description: "Short steep, hard press. Heavier body than the V60.",
    category: "filter",
    basePriceFils: 2400,
    intensity: 4,
    tags: [],
    optionGroups: [beanGroup()],
    available: true,
    isSignature: false,
    ageDays: 260,
  },
  {
    code: "FIL-05",
    name: "Cold drip carafe",
    description: "Twelve hours on the tower. Clean, tea-like, no ice.",
    category: "filter",
    basePriceFils: 3400,
    intensity: 4,
    tags: ["high-caffeine"],
    optionGroups: [],
    available: false,
    isSignature: false,
    ageDays: 120,
  },

  // --- Cold ---------------------------------------------------------------
  {
    code: "CLD-01",
    name: "Iced latte",
    description: "Poured over clear ice so it does not go watery.",
    category: "cold",
    basePriceFils: 2600,
    intensity: 3,
    tags: [],
    optionGroups: [sizeGroup(), milkGroup(), shotGroup()],
    available: true,
    isSignature: false,
    ageDays: 420,
  },
  {
    code: "CLD-02",
    name: "Iced Spanish latte",
    description: "The Gulf standard, built cold. Our best seller since 2019.",
    category: "cold",
    basePriceFils: 2800,
    intensity: 3,
    tags: ["signature"],
    optionGroups: [sizeGroup(), milkGroup(), shotGroup()],
    available: true,
    isSignature: true,
    ageDays: 420,
  },
  {
    code: "CLD-03",
    name: "Cold brew",
    description: "Eighteen hours, no heat. Black and bracing.",
    category: "cold",
    basePriceFils: 2400,
    intensity: 5,
    tags: ["vegan", "high-caffeine"],
    optionGroups: [sizeGroup(300, 500)],
    available: true,
    isSignature: false,
    ageDays: 400,
  },
  {
    code: "CLD-04",
    name: "Espresso tonic",
    description: "Tonic, a wide strip of orange peel, then the shot on top.",
    category: "cold",
    basePriceFils: 3000,
    intensity: 4,
    tags: ["signature", "vegan"],
    optionGroups: [beanGroup()],
    available: true,
    isSignature: true,
    ageDays: 200,
  },
  {
    code: "CLD-05",
    name: "Iced pistachio latte",
    description: "Same paste as the hot one, shaken hard over ice.",
    category: "cold",
    basePriceFils: 3400,
    intensity: 3,
    tags: ["contains-nuts"],
    optionGroups: [sizeGroup(), milkGroup()],
    available: true,
    isSignature: false,
    ageDays: 180,
  },
  {
    code: "CLD-06",
    name: "Date shake",
    description: "Khalas dates, tahini, cold milk. Blended thick.",
    category: "cold",
    basePriceFils: 3200,
    intensity: 1,
    tags: ["signature"],
    optionGroups: [sizeGroup(), milkGroup()],
    available: true,
    isSignature: true,
    ageDays: 150,
  },

  // --- Tea ----------------------------------------------------------------
  {
    code: "TEA-01",
    name: "Karak",
    description: "Boiled long with cardamom and saffron. Nine dirhams, always.",
    category: "tea",
    basePriceFils: 900,
    intensity: 2,
    tags: ["signature"],
    optionGroups: [sizeGroup(200, 400)],
    available: true,
    isSignature: true,
    ageDays: 420,
  },
  {
    code: "TEA-02",
    name: "Moroccan mint",
    description: "Gunpowder green, fresh mint, poured from height.",
    category: "tea",
    basePriceFils: 1800,
    intensity: 1,
    tags: ["vegan"],
    optionGroups: [sizeGroup(200, 400)],
    available: true,
    isSignature: false,
    ageDays: 380,
  },
  {
    code: "TEA-03",
    name: "Matcha latte",
    description: "Ceremonial grade from Uji, whisked to order.",
    category: "tea",
    basePriceFils: 2800,
    intensity: 2,
    tags: [],
    optionGroups: [sizeGroup(), milkGroup()],
    available: true,
    isSignature: false,
    ageDays: 240,
  },
  {
    code: "TEA-04",
    name: "Hibiscus and rose",
    description: "Steeped cold overnight, served long over ice.",
    category: "tea",
    basePriceFils: 2200,
    intensity: 1,
    tags: ["vegan", "seasonal"],
    optionGroups: [sizeGroup(200, 400)],
    available: true,
    isSignature: false,
    ageDays: 90,
  },

  // --- Bakery -------------------------------------------------------------
  {
    code: "BAK-01",
    name: "Butter croissant",
    description: "Laminated here, baked at five. Gone by eleven most days.",
    category: "bakery",
    basePriceFils: 1400,
    intensity: 0,
    tags: [],
    optionGroups: [serveGroup()],
    available: true,
    isSignature: false,
    ageDays: 420,
  },
  {
    code: "BAK-02",
    name: "Za'atar croissant",
    description: "Wild thyme and sesame folded through the dough.",
    category: "bakery",
    basePriceFils: 1600,
    intensity: 0,
    tags: ["signature"],
    optionGroups: [serveGroup()],
    available: true,
    isSignature: true,
    ageDays: 300,
  },
  {
    code: "BAK-03",
    name: "Pistachio kunafa bun",
    description: "Kataifi baked into the crown, orange blossom syrup.",
    category: "bakery",
    basePriceFils: 2600,
    intensity: 0,
    tags: ["signature", "contains-nuts"],
    optionGroups: [serveGroup()],
    available: true,
    isSignature: true,
    ageDays: 160,
  },
  {
    code: "BAK-04",
    name: "Date and tahini cookie",
    description: "Chewy, not sweet. Made with Khalas dates from Liwa.",
    category: "bakery",
    basePriceFils: 1200,
    intensity: 0,
    tags: ["vegan"],
    optionGroups: [],
    available: true,
    isSignature: false,
    ageDays: 200,
  },
  {
    code: "BAK-05",
    name: "Cardamom knot",
    description: "Twisted, proofed overnight, pearl sugar on top.",
    category: "bakery",
    basePriceFils: 1800,
    intensity: 0,
    tags: [],
    optionGroups: [serveGroup()],
    available: false,
    isSignature: false,
    ageDays: 140,
  },

  // --- Food ---------------------------------------------------------------
  {
    code: "FOD-01",
    name: "Halloumi and za'atar toastie",
    description: "Grilled halloumi, tomato, za'atar butter, pressed hard.",
    category: "food",
    basePriceFils: 3800,
    intensity: 0,
    tags: [],
    optionGroups: [breadGroup()],
    available: true,
    isSignature: false,
    ageDays: 300,
  },
  {
    code: "FOD-02",
    name: "Shakshuka bowl",
    description: "Two eggs in spiced tomato, labneh, bread to mop it up.",
    category: "food",
    basePriceFils: 4200,
    intensity: 0,
    tags: ["signature"],
    optionGroups: [breadGroup()],
    available: true,
    isSignature: true,
    ageDays: 280,
  },
  {
    code: "FOD-03",
    name: "Avocado and dukkah toast",
    description: "Smashed avocado, hazelnut dukkah, lemon, olive oil.",
    category: "food",
    basePriceFils: 3600,
    intensity: 0,
    tags: ["vegan", "contains-nuts"],
    optionGroups: [breadGroup()],
    available: true,
    isSignature: false,
    ageDays: 280,
  },
  {
    code: "FOD-04",
    name: "Labneh plate",
    description: "Strained here, olive oil, za'atar, cucumber, warm bread.",
    category: "food",
    basePriceFils: 3200,
    intensity: 0,
    tags: [],
    optionGroups: [breadGroup()],
    available: true,
    isSignature: false,
    ageDays: 220,
  },
  {
    code: "FOD-05",
    name: "Chicken za'atar wrap",
    description: "Marinated overnight, garlic sauce, pickled turnip.",
    category: "food",
    basePriceFils: 3900,
    intensity: 0,
    tags: [],
    optionGroups: [],
    available: true,
    isSignature: false,
    ageDays: 120,
  },
];

export function createSeedMenu(now: Date): MenuItem[] {
  return MENU_SEED.map(({ ageDays, ...item }) => ({
    ...item,
    id: `menu_${item.code.toLowerCase().replace("-", "_")}`,
    createdAt: subDays(now, ageDays).toISOString(),
  }));
}

/* ---------------------------------------------------------------------------
   Orders — a plausible day on the bar
   Written as a fixed table rather than generated randomly so the demo looks the
   same every time it is shown.
--------------------------------------------------------------------------- */

interface SeedOrderLine {
  code: string;
  quantity: number;
  /** Choice ids, matched against the item's own option groups. */
  choices: string[];
  note?: string;
}

interface SeedOrder {
  reference: string;
  customer: string;
  phone: string;
  email: string;
  type: OrderType;
  channel: "online" | "walk-in";
  area?: string;
  addressLine?: string;
  status: OrderStatus;
  minutesAgo: number;
  lines: SeedOrderLine[];
  note?: string;
  cancellationReason?: string;
}

const ORDER_SEED: SeedOrder[] = [
  {
    reference: "DB-4801",
    customer: "Layla Haddad",
    phone: "+971 50 118 4402",
    email: "layla.haddad@example.ae",
    type: "pickup",
    channel: "online",
    status: "completed",
    minutesAgo: 428,
    lines: [
      { code: "ESP-03", quantity: 1, choices: ["m", "oat"] },
      { code: "BAK-01", quantity: 1, choices: ["warmed"] },
    ],
  },
  {
    reference: "DB-4802",
    customer: "Omar Al Falasi",
    phone: "+971 55 903 7781",
    email: "omar.alfalasi@example.ae",
    type: "delivery",
    channel: "online",
    area: "Business Bay",
    addressLine: "Bay Square 11, office 604",
    status: "completed",
    minutesAgo: 405,
    lines: [
      { code: "CLD-02", quantity: 2, choices: ["l", "full"] },
      { code: "BAK-02", quantity: 2, choices: ["warmed"] },
    ],
  },
  {
    reference: "DB-4803",
    customer: "Sara Nasser",
    phone: "+971 52 447 1190",
    email: "sara.nasser@example.ae",
    type: "pickup",
    channel: "walk-in",
    status: "completed",
    minutesAgo: 392,
    lines: [{ code: "TEA-01", quantity: 2, choices: ["s"] }],
  },
  {
    reference: "DB-4804",
    customer: "Yousef Bin Zayed",
    phone: "+971 50 662 0038",
    email: "yousef.binzayed@example.ae",
    type: "pickup",
    channel: "online",
    status: "completed",
    minutesAgo: 371,
    lines: [
      { code: "FIL-01", quantity: 1, choices: ["sidama"] },
      { code: "BAK-04", quantity: 1, choices: [] },
    ],
  },
  {
    reference: "DB-4805",
    customer: "Aisha Rahman",
    phone: "+971 56 210 5514",
    email: "aisha.rahman@example.ae",
    type: "delivery",
    channel: "online",
    area: "Al Quoz 1",
    addressLine: "Alserkal Avenue, unit 24",
    status: "cancelled",
    minutesAgo: 356,
    cancellationReason: "Customer could not meet the driver.",
    lines: [{ code: "ESP-07", quantity: 1, choices: ["m", "oat"] }],
  },
  {
    reference: "DB-4806",
    customer: "Daniel Okonkwo",
    phone: "+971 54 771 6620",
    email: "daniel.okonkwo@example.ae",
    type: "pickup",
    channel: "walk-in",
    status: "completed",
    minutesAgo: 338,
    lines: [
      { code: "ESP-01", quantity: 1, choices: ["wadi", "single"] },
      { code: "FOD-03", quantity: 1, choices: ["sourdough"] },
    ],
  },
  {
    reference: "DB-4807",
    customer: "Meera Krishnan",
    phone: "+971 50 339 8827",
    email: "meera.krishnan@example.ae",
    type: "delivery",
    channel: "online",
    area: "Dubai Design District",
    addressLine: "Building 6, level 3",
    status: "completed",
    minutesAgo: 317,
    lines: [
      { code: "TEA-03", quantity: 1, choices: ["m", "almond"] },
      { code: "BAK-03", quantity: 1, choices: ["warmed"] },
    ],
  },
  {
    reference: "DB-4808",
    customer: "Khalid Al Marri",
    phone: "+971 55 504 2213",
    email: "khalid.almarri@example.ae",
    type: "pickup",
    channel: "online",
    status: "completed",
    minutesAgo: 298,
    lines: [{ code: "CLD-03", quantity: 1, choices: ["l"] }],
  },
  {
    reference: "DB-4809",
    customer: "Hannah Weber",
    phone: "+971 52 880 3341",
    email: "hannah.weber@example.ae",
    type: "pickup",
    channel: "walk-in",
    status: "completed",
    minutesAgo: 276,
    lines: [
      { code: "ESP-04", quantity: 1, choices: ["m", "skimmed"] },
      { code: "BAK-01", quantity: 2, choices: ["as-is"] },
    ],
  },
  {
    reference: "DB-4810",
    customer: "Fatima Al Suwaidi",
    phone: "+971 50 447 9902",
    email: "fatima.alsuwaidi@example.ae",
    type: "delivery",
    channel: "online",
    area: "Jumeirah 1",
    addressLine: "Villa 32, street 14b",
    status: "completed",
    minutesAgo: 254,
    lines: [
      { code: "CLD-06", quantity: 2, choices: ["m", "full"] },
      { code: "FOD-02", quantity: 1, choices: ["sourdough"] },
    ],
  },
  {
    reference: "DB-4811",
    customer: "Rami Chahine",
    phone: "+971 56 129 4470",
    email: "rami.chahine@example.ae",
    type: "pickup",
    channel: "online",
    status: "completed",
    minutesAgo: 231,
    lines: [{ code: "FIL-02", quantity: 1, choices: ["l"] }],
  },
  {
    reference: "DB-4812",
    customer: "Priya Menon",
    phone: "+971 54 663 1128",
    email: "priya.menon@example.ae",
    type: "pickup",
    channel: "walk-in",
    status: "completed",
    minutesAgo: 208,
    lines: [
      { code: "ESP-06", quantity: 1, choices: ["m", "full"] },
      { code: "BAK-05", quantity: 1, choices: ["warmed"] },
    ],
  },
  {
    reference: "DB-4813",
    customer: "Tom Ashworth",
    phone: "+971 50 992 7714",
    email: "tom.ashworth@example.ae",
    type: "delivery",
    channel: "online",
    area: "Barsha Heights",
    addressLine: "The Onyx tower 2, apt 1806",
    status: "cancelled",
    minutesAgo: 186,
    cancellationReason: "Kitchen ran out of sourdough.",
    lines: [{ code: "FOD-01", quantity: 2, choices: ["sourdough"] }],
  },
  {
    reference: "DB-4814",
    customer: "Noura Al Ali",
    phone: "+971 55 336 8802",
    email: "noura.alali@example.ae",
    type: "pickup",
    channel: "online",
    status: "completed",
    minutesAgo: 164,
    lines: [
      { code: "ESP-07", quantity: 1, choices: ["l", "oat"] },
      { code: "BAK-03", quantity: 1, choices: ["as-is"] },
    ],
  },
  {
    reference: "DB-4815",
    customer: "Ivan Petrov",
    phone: "+971 52 771 0093",
    email: "ivan.petrov@example.ae",
    type: "pickup",
    channel: "walk-in",
    status: "completed",
    minutesAgo: 142,
    lines: [{ code: "CLD-04", quantity: 1, choices: ["wadi"] }],
  },
  {
    reference: "DB-4816",
    customer: "Zainab Iqbal",
    phone: "+971 50 228 4416",
    email: "zainab.iqbal@example.ae",
    type: "delivery",
    channel: "online",
    area: "Al Safa",
    addressLine: "Safa Park gate 3, villa 7",
    status: "completed",
    minutesAgo: 121,
    lines: [
      { code: "TEA-04", quantity: 2, choices: ["l"] },
      { code: "BAK-04", quantity: 3, choices: [] },
    ],
  },
  {
    reference: "DB-4817",
    customer: "Marcus Bello",
    phone: "+971 56 904 3327",
    email: "marcus.bello@example.ae",
    type: "pickup",
    channel: "online",
    status: "completed",
    minutesAgo: 98,
    lines: [
      { code: "ESP-03", quantity: 2, choices: ["s", "full"] },
      { code: "FOD-05", quantity: 1, choices: [] },
    ],
  },
  {
    reference: "DB-4818",
    customer: "Huda Kassem",
    phone: "+971 54 118 2205",
    email: "huda.kassem@example.ae",
    type: "delivery",
    channel: "online",
    area: "Downtown Dubai",
    addressLine: "Burj Views C, apt 2204",
    status: "ready",
    minutesAgo: 26,
    lines: [
      { code: "CLD-05", quantity: 1, choices: ["m", "oat"] },
      { code: "BAK-02", quantity: 1, choices: ["warmed"] },
    ],
    note: "Leave with concierge.",
  },
  {
    reference: "DB-4819",
    customer: "Ella Novak",
    phone: "+971 50 553 7719",
    email: "ella.novak@example.ae",
    type: "pickup",
    channel: "online",
    status: "ready",
    minutesAgo: 19,
    lines: [{ code: "FIL-03", quantity: 1, choices: ["sidama"] }],
  },
  {
    reference: "DB-4820",
    customer: "Abdulla Al Hammadi",
    phone: "+971 55 447 1180",
    email: "abdulla.alhammadi@example.ae",
    type: "pickup",
    channel: "walk-in",
    status: "ready",
    minutesAgo: 14,
    lines: [
      { code: "TEA-01", quantity: 3, choices: ["m"] },
      { code: "BAK-01", quantity: 3, choices: ["warmed"] },
    ],
  },
  {
    reference: "DB-4821",
    customer: "Grace Mwangi",
    phone: "+971 52 336 9924",
    email: "grace.mwangi@example.ae",
    type: "delivery",
    channel: "online",
    area: "Al Quoz 3",
    addressLine: "Warehouse 14, street 8",
    status: "preparing",
    minutesAgo: 11,
    lines: [
      { code: "ESP-05", quantity: 2, choices: ["l", "oat", "single"] },
      { code: "FOD-04", quantity: 1, choices: ["seeded"] },
    ],
  },
  {
    reference: "DB-4822",
    customer: "Tariq Sadek",
    phone: "+971 50 771 6603",
    email: "tariq.sadek@example.ae",
    type: "pickup",
    channel: "online",
    status: "preparing",
    minutesAgo: 8,
    lines: [
      { code: "CLD-02", quantity: 1, choices: ["l", "full"] },
      { code: "ESP-01", quantity: 1, choices: ["wadi"] },
    ],
    note: "Extra hot, please.",
  },
  {
    reference: "DB-4823",
    customer: "Lina Farouk",
    phone: "+971 56 220 4471",
    email: "lina.farouk@example.ae",
    type: "pickup",
    channel: "walk-in",
    status: "preparing",
    minutesAgo: 6,
    lines: [{ code: "TEA-02", quantity: 1, choices: ["m"] }],
  },
  {
    reference: "DB-4824",
    customer: "Jonas Lindqvist",
    phone: "+971 54 903 2218",
    email: "jonas.lindqvist@example.ae",
    type: "delivery",
    channel: "online",
    area: "Umm Suqeim 2",
    addressLine: "Street 21b, villa 4",
    status: "new",
    minutesAgo: 4,
    lines: [
      { code: "CLD-01", quantity: 2, choices: ["m", "almond"] },
      { code: "BAK-03", quantity: 2, choices: ["warmed"] },
    ],
  },
  {
    reference: "DB-4825",
    customer: "Maryam Al Blooshi",
    phone: "+971 50 118 3390",
    email: "maryam.alblooshi@example.ae",
    type: "pickup",
    channel: "online",
    status: "new",
    minutesAgo: 3,
    lines: [
      { code: "ESP-07", quantity: 1, choices: ["m", "oat"] },
      { code: "CLD-06", quantity: 1, choices: ["m", "full"] },
    ],
  },
  {
    reference: "DB-4826",
    customer: "Nadia Haddad",
    phone: "+971 55 660 7712",
    email: "nadia.haddad@example.ae",
    type: "pickup",
    channel: "online",
    status: "new",
    minutesAgo: 2,
    lines: [{ code: "FIL-04", quantity: 1, choices: ["colombia-decaf"] }],
  },
  {
    reference: "DB-4827",
    customer: "Samir Qureshi",
    phone: "+971 52 447 8830",
    email: "samir.qureshi@example.ae",
    type: "delivery",
    channel: "online",
    area: "Business Bay",
    addressLine: "Executive Towers J, apt 3110",
    status: "new",
    minutesAgo: 1,
    lines: [
      { code: "ESP-03", quantity: 1, choices: ["m", "full"] },
      { code: "FOD-02", quantity: 1, choices: ["sourdough"] },
      { code: "TEA-01", quantity: 1, choices: ["s"] },
    ],
    note: "Ring the doorbell twice.",
  },
];

function buildOrderLine(
  item: MenuItem,
  seedLine: SeedOrderLine,
  index: number,
): OrderLine {
  const selections: OptionSelection[] = [];

  for (const group of item.optionGroups) {
    const choice = group.choices.find((c) => seedLine.choices.includes(c.id));
    if (!choice) continue;
    selections.push({
      groupId: group.id,
      groupLabel: group.label,
      choiceId: choice.id,
      choiceLabel: choice.label,
      priceDeltaFils: choice.priceDeltaFils,
    });
  }

  const unitPriceFils =
    item.basePriceFils +
    selections.reduce((sum, s) => sum + s.priceDeltaFils, 0);

  return {
    id: `${seedLine.code.toLowerCase()}_${index}`,
    menuItemId: item.id,
    code: item.code,
    name: item.name,
    category: item.category,
    quantity: seedLine.quantity,
    unitPriceFils,
    selections,
    note: seedLine.note ?? "",
  };
}

export function createSeedOrders(menu: MenuItem[], now: Date): Order[] {
  const byCode = new Map(menu.map((item) => [item.code, item]));

  return ORDER_SEED.map((seed) => {
    const lines = seed.lines
      .map((seedLine, lineIndex) => {
        const item = byCode.get(seedLine.code);
        if (!item) return null;
        return buildOrderLine(item, seedLine, lineIndex);
      })
      .filter((line): line is OrderLine => line !== null);

    const placedAt = subMinutes(now, seed.minutesAgo);
    const totals = computeTotals(lines, seed.type);

    const readyAt =
      seed.status === "ready" || seed.status === "completed"
        ? subMinutes(placedAt, -Math.min(9, seed.minutesAgo)).toISOString()
        : null;

    return {
      id: `order_${seed.reference.toLowerCase().replace("-", "_")}`,
      reference: seed.reference,
      type: seed.type,
      channel: seed.channel,
      status: seed.status,
      lines,
      customer: {
        name: seed.customer,
        phone: seed.phone,
        email: seed.email,
        address:
          seed.type === "delivery"
            ? {
                line1: seed.addressLine ?? "",
                area: seed.area ?? "",
                city: "Dubai",
                notes: "",
              }
            : null,
      },
      ...totals,
      placedAt: placedAt.toISOString(),
      scheduledFor: null,
      readyAt,
      completedAt:
        seed.status === "completed"
          ? subMinutes(placedAt, -Math.min(16, seed.minutesAgo)).toISOString()
          : null,
      cancelledAt:
        seed.status === "cancelled"
          ? subMinutes(placedAt, -Math.min(7, seed.minutesAgo)).toISOString()
          : null,
      cancellationReason: seed.cancellationReason ?? "",
      staffNote: seed.note ?? "",
    } satisfies Order;
  });
}
