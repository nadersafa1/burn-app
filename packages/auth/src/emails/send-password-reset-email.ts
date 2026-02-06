import type { User } from "better-auth";
import { sendEmail } from "../send-email";

export async function sendPasswordResetEmail({
  user,
  url,
}: {
  user: User;
  url: string;
}) {
  await sendEmail({
    to: user.email,
    subject: "Password Reset",
    meta: {
      description: "Click the link below to reset your password",
      link: url,
      linkText: "Reset Password",
    },
  });
}
