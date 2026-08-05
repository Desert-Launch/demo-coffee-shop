import { sleep } from "@/lib/utils";
import type { ContactValues } from "./schema";

/**
 * Nothing leaves the browser. The delay is here so the button's pending state
 * behaves the way it would against a real inbox.
 */
export async function sendMessage(values: ContactValues): Promise<ContactValues> {
  await sleep(400);
  return values;
}
