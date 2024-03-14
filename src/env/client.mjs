// @ts-check
import { clientEnv, clientSchema } from "./schema.mjs";
import type { ClientEnvType } from "./types.mjs";

const _clientEnv = clientSchema.safeParse(clientEnv);

const formatErrors = (
  /** @type {import('zod').ZodFormattedError<Map<string,string>,string>} */
  errors,
) =>
  Object.entries(errors)
    .map(([name, value]) => {
      if (value && "_errors" in value)
        return `${name}: ${value._errors.join(", ")}\n`;
    })
    .filter(Boolean);

if (!_clientEnv.success) {
  console.error(
    "❌ Invalid environment variables:\n",
    ...formatErrors(_clientEnv.error.format()),
  );
  process.exit(1);
}

const requiredEnvKeys = ["NEXT_PUBLIC_API_URL"] as (keyof ClientEnvType)[];

for (let key of requiredEnvKeys) {
  if (!(_clientEnv.data as ClientEnvType)[key]) {
    console.error(`❌ Required environment variable missing: ${key}`);
    process.exit(1);
  }
}

for (let key of Object.keys(_clientEnv.data)) {
  if (key.startsWith("NEXT_PUBLIC_")) {
    continue;
  }
  console.warn(
    `❌ Invalid public environment variable name: ${key}. It must begin with 'NEXT_PUBLIC_'`,
  );
}

export const env = _clientEnv.data as ClientEnvType;

