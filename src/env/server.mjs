// @ts-check

import { serverSchema, serverEnv } from "./schema.mjs";
import { env as clientEnv, formatErrors } from "./client.mjs";

const validateEnv = () => {
  const _serverEnv = serverSchema.safeParse(serverEnv);

  if (!_serverEnv.success) {
    console.error(
      "Invalid environment variables:\n",
      ...formatErrors(_serverEnv.error.format())
    );
    throw new Error("Invalid environment variables");
  }

  for (const key of Object.keys(_serverEnv.data)) {
    if (key.startsWith("NEXT_PUBLIC_")) {
      console.warn("You are exposing a server-side env-variable:", key);

      throw new Error("Exposing server-side env-variable");
    }
  }

  return _serverEnv.data;
};

const env = { ...validateEnv(), ...clientEnv };

export default env;
