import { resetStore } from "@/lib/store";
import { sleep } from "@/lib/utils";

/**
 * The demo control behind "Reset demo data". It sits here rather than being
 * called from the sidebar so the store keeps exactly one entry point per
 * feature: component → hook → api → store.
 */
export async function resetDemoData(): Promise<void> {
  await sleep(120);
  resetStore();
}
