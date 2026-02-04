import "dotenv/config";
import { createEnv } from "@t3-oss/env-core";
import { z } from "zod";

const skipValidation = process.env.SKIP_ENV_VALIDATION === "true";

export const env = createEnv({
  server: {
    DATABASE_URL: skipValidation ? z.string().default("") : z.string().min(1),
    BETTER_AUTH_SECRET: skipValidation ? z.string().default("") : z.string().min(32),
    BETTER_AUTH_URL: skipValidation ? z.url().default("http://localhost") : z.url(),
    CORS_ORIGIN: skipValidation ? z.url().default("http://localhost") : z.url(),
    NODE_ENV: z.enum(["development", "production", "test"]).default("development"),
  },
  runtimeEnv: process.env,
  emptyStringAsUndefined: true,
});
