import "server-only";

import { serverEnvSchema, type ServerEnv } from "@/validation/env";

let cachedEnvironment: ServerEnv | undefined;

export function getServerEnv(): ServerEnv {
  if (cachedEnvironment) {
    return cachedEnvironment;
  }

  const result = serverEnvSchema.safeParse(process.env);

  if (!result.success) {
    const fields = result.error.issues
      .map((issue) => issue.path.join("."))
      .filter(Boolean)
      .join(", ");

    throw new Error(
      `Invalid server environment configuration${fields ? `: ${fields}` : "."}`,
    );
  }

  cachedEnvironment = result.data;
  return cachedEnvironment;
}
