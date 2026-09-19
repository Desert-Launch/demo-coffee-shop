/**
 * What this demo is, in one place. The Desert Launch bar, the share-preview
 * card, the metadata and the structured data all read from here, so they can
 * never disagree about the name, the URL or the language.
 */
export type DemoLang = "en" | "ar";

export const DEMO = {
  /** Short id the landing site uses; also the subdomain and utm_campaign. */
  slug: "cafe",
  name: "Demo Café",
  /** Latin-only name for the share-preview image, whose default font has no Arabic. */
  latinName: "Demo Café",
  url: "https://cafe.demos.desertlaunch.dev",
  /** Language of the bar and the metadata. Typed as the union so the shared
   *  code that handles both languages stays identical in every demo. */
  lang: "en" as DemoLang,
  /** Interface languages the demo itself offers. */
  languages: ["en"],
  kind: "café and roastery",
  city: "Dubai",
  /** One paragraph for share previews and search snippets. */
  description:
    "A working demo of a café website with its bar view, by Desert Launch: a 32-item menu with options, order-ahead for pickup or delivery with a time slot, and the ticket board staff run the day from. Fictional café, sample data.",
  /** Plain statement that the business is invented. */
  fiction:
    "A fictional business: the names, prices, address and phone numbers are invented, and the data is sample data that resets on refresh.",
  features: [
      "32-item menu across six categories with size, milk and extras",
      "Five-step checkout: pickup or delivery, details, time slot, review, confirmation",
      "Ticket board with drag between columns",
      "Menu management: create, edit, delete, sold-out, prices",
      "Changes on the admin side appear on the public menu immediately",
      "Optimistic cancellation with a deliberate ~10% failure to show rollback"
  ],
  repo: "https://github.com/Desert-Launch/demo-coffee-shop",
} as const;
