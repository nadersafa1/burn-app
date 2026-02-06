import type { User } from "better-auth";
import { sendEmail } from "../send-email";

export async function sendVerificationEmail({
  user,
  url,
}: {
  user: User;
  url: string;
}) {
  await sendEmail({
    to: user.email,
    subject: "Email Verification",
    meta: {
      description: "Click the link below to verify your email address",
      link: url,
      linkText: "Verify Email",
    },
  });
}
