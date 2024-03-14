// @ts-check
import { z } from "zod";

const requiredForProduction = () =>
  process.env.NODE_ENV === "production"
    ? z.string().min(1).trim().nonempty()
    : z.string().min(1).trim().optional();

function stringToBoolean() {
  return z.preprocess(
    (str) => str.toLowerCase() === "true",
    z.boolean()
  );
}

export const serverSchema = z.object({
  DATABASE_URL: z.string().url(),
  NODE_ENV: z.enum(["development", "test", "production"]),
  NEXTAUTH_SECRET: requiredForProduction(),
  NEXTAUTH_URL: z
    .preprocess(
      (str) => process.env.VERCEL_URL ?? str,
      process.env.VERCEL
        ? z.string()
        : z.string().url()
    ),
  OPENAI_API_KEY: z.string(),

  GOOGLE_CLIENT_ID: requiredForProduction(),
  GOOGLE_CLIENT_SECRET: requiredForProduction(),
  GITHUB_CLIENT_ID: requiredForProduction(),
  GITHUB_CLIENT_SECRET: requiredForProduction(),
  DISCORD_CLIENT_ID: requiredForProduction(),
  DISCORD_CLIENT_SECRET: requiredForProduction(),

  STRIPE_SECRET_KEY: z.string().optional(),
  STRIPE_WEBHOOK_SECRET: z.string().optional(),
  STRIPE_SUBSCRIPTION_PRICE_ID: z.string().optional(),
});

type ServerEnv = {
  [K in keyof z.input<typeof serverSchema>]: string | undefined;
};

export const serverEnv: ServerEnv = {
  DATABASE_URL: process.env.DATABASE_URL,
  NODE_ENV: process.env.NODE_ENV,
  NEXTAUTH_SECRET: process.env.NEXTAUTH_SECRET,
  NEXTAUTH_URL: process.env.NEXTAUTH_URL,
  OPENAI_API_KEY: process.env.OPENAI_API_KEY,
  GOOGLE_CLIENT_ID: process.env.GOOGLE_CLIENT_ID,
  GOOGLE_CLIENT_SECRET: process.env.GOOGLE_CLIENT_SECRET,
  GITHUB_CLIENT_ID: process.env.GITHUB_CLIENT_ID,
  GITHUB_CLIENT_SECRET: process.env.GITHUB_CLIENT_SECRET,
  DISCORD_CLIENT_ID: process.env.DISCORD_CLIENT_ID,
  DISCORD_CLIENT_SECRET: process.env.DISCORD_CLIENT_SECRET,

  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY,
  STRIPE_WEBHOOK_SECRET: process.env.STRIPE_WEBHOOK_SECRET,
  STRIPE_SUBSCRIPTION_PRICE_ID: process.env.STRIPE_SUBSCRIPTION_PRICE_ID,
};

export const clientSchema = z.object({
  NEXT_PUBLIC_VERCEL_ENV: z.enum(["production", "preview", "development"]),
  NEXT_PUBLIC_FF_AUTH_ENABLED: stringToBoolean(),
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: z.string().optional(),
  NEXT_PUBLIC_FF_SUB_ENABLED: stringToBoolean(),
});

type ClientEnv = {
  [K in keyof z.input<typeof clientSchema>]: string | undefined;
};

export const clientEnv: ClientEnv = {
  NEXT_PUBLIC_VERCEL_ENV: process.env.NEXT_PUBLIC_VERCEL_ENV ?? "development",
  NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY: process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY,
  NEXT_PUBLIC_FF_AUTH_ENABLED: process.env.NEXT_PUBLIC_FF_AUTH_ENABLED,
  NEXT_PUBLIC_FF_SUB_ENABLED: process.env.NEXT_PUBLIC_FF_SUB_ENABLED,
};
