# Demo Café

A frontend-only demo for a fictional specialty café and roastery in Dubai. It covers the public marketing site, the full ordering flow, and the staff view the bar runs the day from.

There is no backend, no database and no auth. Everything is in memory.

## Run it

```bash
npm install
npm run dev        # http://localhost:3000
```

Other scripts:

| Script | What it does |
| --- | --- |
| `npm run dev` | Dev server (Turbopack) |
| `npm run build` | Production build |
| `npm run start` | Serve the production build |
| `npm run lint` | ESLint |
| `npm run typecheck` | `tsc --noEmit` |

`npm run typecheck` and `npm run lint` both pass clean.

## What to show

**Customer side**

- `/` — the hero states the thesis: this is a roastery with a bar at the front, so the page opens with the last roast's profile curve and log rather than a stock latte.
- `/menu` — 32 items across 6 categories. Pick size, milk and extras on the card, then add to your order.
- `/about`, `/contact` — the story, the open lots, and a contact form (react-hook-form + zod, toast on success, nothing is sent).
- `/checkout` — five steps: pickup or delivery → your details → time slot → review → confirmation with an order number and ETA.

**Staff side**

- `/admin` — orders today, money taken, average prep time, live queue, best sellers chart.
- `/admin/orders` — the ticket board. Drag a ticket between columns or use the button on it. Open a ticket to edit quantities, change status, leave a note or cancel.
- `/admin/menu` — create, edit and delete items, toggle sold-out, change prices. Changes land on the public menu straight away.

**The loop worth demoing:** place an order at `/checkout`, then open `/admin/orders` — it is sitting at the top of the New column. Mark an item sold out in `/admin/menu` and it shows as sold out on `/menu`.

## Where the data lives

`src/lib/store/` is the demo's "backend": a module-level singleton with no React in it.

- `db.ts` — the singleton plus typed read/write functions for menu items and orders. Reads return structured clones so nothing outside can mutate state by accident.
- `seed.ts` — a fixed table of 32 menu items and 27 orders across today. Hand-written rather than randomly generated so the demo looks the same every time it is shown.
- `option-groups.ts` — the shared Size / Milk / Bean / Extra shot shapes.

Money is stored as an integer number of fils (1 AED = 100 fils) everywhere, and formatted only at the edge in `formatAed`. `computeTotals` in `src/lib/pricing.ts` is the single place subtotal, 5% VAT and the AED 12 delivery fee are calculated, so a total can never disagree with itself.

**Persistence:** add / edit / delete survive navigation for the whole browser session. A hard refresh re-evaluates the module and reseeds the day.

**Resetting:** the admin sidebar footer has a **Reset demo data** button. It calls `resetStore()`, clears the cart and invalidates every query.

**The deliberate failure:** `cancelOrder` throws roughly 10% of the time (`CANCEL_FAILURE_RATE` in `src/features/orders/api.ts`). The board moves the ticket to Cancelled optimistically, then rolls it back and raises an error toast when the write fails. Raise that constant to 1 if you want to demo the rollback on purpose.

## Architecture

Feature-sliced, with one direction of travel:

```
component → feature hook (TanStack) → feature api.ts → lib/store
```

`src/app/` holds routes only and stays thin — no business logic. `src/features/<domain>/` is where the real code lives, each with `schema.ts` (zod, with types derived via `z.infer`), `api.ts` (async functions over the store, each with a small `sleep` so loading and skeleton states are real), `hooks/` (TanStack queries and mutations that invalidate on success) and `components/`. Every feature exposes a barrel `index.ts`, and cross-feature imports go through the barrel rather than deep paths. Features never import from `app/`. UI components never touch `lib/store` directly.

`package.json` declares `"sideEffects": ["*.css"]` so the barrels tree-shake properly — without it the admin-only code (recharts, the form dialogs) rode along into the public pages and roughly doubled their first-load JS.

Even though the data is local, every read goes through TanStack Query and every write is a mutation that invalidates, so the demo behaves like a real app: loading skeletons, error states, optimistic status advances with rollback. Zustand holds only client selection state — the cart (`features/cart`) and the fake "logged in as" staff member (`features/staff`). A cart becomes an `Order` only when checkout writes it through `features/orders/api.ts`.

## Design

Dark, warm and committed to one look. The direction is the roastery at night: a brown-black canvas rather than a neutral one, ember gold from the drum as the primary accent, pistachio as the second. Structure borrows from the trade's own paper — menu cards are laid out like bag labels (code, strength ticks, perforation), and staff tickets like thermal receipts with a torn bottom edge.

Type is Bricolage Grotesque for display, Inter Tight for body, Geist Mono for every number, code and timestamp.

All colour, spacing, radius, shadow and type values are CSS variables in `src/styles/tokens.css`. `src/app/globals.css` maps them onto Tailwind utilities and onto the shadcn semantic names, so the generated primitives inherit the identity. There are no hardcoded hex values in components. Drink images are CSS gradients derived from category tokens — no photography anywhere.

Motion is deliberate and limited to three places: the hero reveal and roast-curve draw, the checkout step transitions, and list enter/exit on the admin board and menu table. Everything respects `prefers-reduced-motion`.

## Not real

Fictional café, fictional customers, fictional lots. No real people, brands or photographs. Nothing is emailed, charged or sent anywhere.
