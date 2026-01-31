import { expo } from "@better-auth/expo";
import { db } from "@burn-app/db";
import * as schema from "@burn-app/db/schema/auth";
import { env } from "@burn-app/env/server";
import { betterAuth } from "better-auth";
import { drizzleAdapter } from "better-auth/adapters/drizzle";
import { nextCookies } from "better-auth/next-js";

export const auth = betterAuth({
  database: drizzleAdapter(db, {
    provider: "pg",

    schema: schema,
  }),
  trustedOrigins: [env.CORS_ORIGIN, "mybettertapp://", "exp://"],
  emailAndPassword: {
    enabled: true,
  },
  plugins: [nextCookies(), expo()],
});
