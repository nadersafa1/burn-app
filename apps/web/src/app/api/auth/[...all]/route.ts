import { config } from "dotenv";
import path from "path";

// Ensure server env (including NODEMAILER_*) is loaded from apps/web/.env when this route runs
config({ path: path.resolve(process.cwd(), ".env") });

import { auth } from "@burn-app/auth";
import { toNextJsHandler } from "better-auth/next-js";

export const { GET, POST } = toNextJsHandler(auth.handler);
