"use client";

import { CATEGORY_META, CATEGORY_ORDER } from "../taxonomy";

/** Anchors into the menu board. Order matches the board, top to bottom. */
export function CategoryJump() {
  return (
    <nav aria-label="Menu categories" className="overflow-x-auto">
      <ul className="flex min-w-max gap-2">
        {CATEGORY_ORDER.map((category) => (
          <li key={category}>
            <a
              href={`#${category}`}
              className="inline-block rounded-md border border-roast-600 bg-roast-850 px-3 py-1.5 text-xs text-chaff-300 transition-colors hover:border-ember-500 hover:text-ember-300"
            >
              {CATEGORY_META[category].label}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
