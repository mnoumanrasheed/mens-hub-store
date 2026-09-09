import "server-only";

import { sessionEnvSchema } from "@/validation/env";

export function getSessionSecret(): Uint8Array {
  const { SESSION_SECRET } = sessionEnvSchema.parse(process.env);
  return new TextEncoder().encode(SESSION_SECRET);
}
