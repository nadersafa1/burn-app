import { env } from "@burn-app/env/server";
import transporter from "./lib/nodemailer";

const brandColors = {
  primary: "#FD6E20",
  primaryHover: "#e5631a",
  text: "#1f2937",
  textSecondary: "#6b7280",
  border: "#e5e7eb",
  background: "#ffffff",
};

const emailStyles = {
  wrapper:
    "font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; background-color: #f9fafb; padding: 40px 20px; line-height: 1.6; color: " +
    brandColors.text +
    ";",
  container:
    "max-width: 600px; margin: 0 auto; background-color: " +
    brandColors.background +
    "; border-radius: 8px; overflow: hidden; box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);",
  header:
    "background: linear-gradient(135deg, " +
    brandColors.primary +
    " 0%, " +
    brandColors.primaryHover +
    " 100%); padding: 32px 40px; text-align: center;",
  logo: "font-size: 24px; font-weight: 700; color: #ffffff; margin: 0; letter-spacing: -0.5px;",
  content: "padding: 40px;",
  heading:
    "font-size: 24px; font-weight: 600; color: " +
    brandColors.text +
    "; margin: 0 0 16px 0; line-height: 1.3;",
  paragraph:
    "font-size: 16px; color: " +
    brandColors.text +
    "; margin: 0 0 24px 0; line-height: 1.6;",
  buttonContainer: "text-align: center; margin: 32px 0;",
  button:
    "display: inline-block; padding: 14px 32px; background-color: " +
    brandColors.primary +
    "; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: 600; font-size: 16px;",
  footer:
    "padding: 24px 40px; background-color: #f9fafb; border-top: 1px solid " +
    brandColors.border +
    "; text-align: center;",
  footerText: "font-size: 12px; color: " + brandColors.textSecondary + "; margin: 0; line-height: 1.5;",
  footerLink: "color: " + brandColors.primary + "; text-decoration: none; font-weight: 500;",
};

function assertEmailConfig() {
  if (!env.NODEMAILER_HOST || !env.NODEMAILER_USER || !env.NODEMAILER_APP_PASSWORD) {
    const msg =
      "[Brnit] Email is not configured. Set NODEMAILER_HOST, NODEMAILER_USER, and NODEMAILER_APP_PASSWORD in apps/web/.env (or your deployment environment).";
    console.error(msg);
    throw new Error("Email is not configured. Please contact support.");
  }
}

export async function sendEmail({
  to,
  subject,
  meta,
}: {
  to: string;
  subject: string;
  meta: {
    description: string;
    link?: string;
    linkText?: string;
  };
}): Promise<{ success: boolean }> {
  assertEmailConfig();
  const baseUrl = env.BETTER_AUTH_URL || "http://localhost:3000";

  const mailOptions = {
    from: env.NODEMAILER_USER,
    to,
    subject: `Brnit - ${subject}`,
    html: `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Brnit - ${subject}</title>
    </head>
    <body style="${emailStyles.wrapper}">
      <div style="${emailStyles.container}">
        <div style="${emailStyles.header}">
          <h1 style="${emailStyles.logo}">Brnit</h1>
        </div>
        <div style="${emailStyles.content}">
          <h2 style="${emailStyles.heading}">${subject}</h2>
          <p style="${emailStyles.paragraph}">${meta.description}</p>
          ${
            meta.link
              ? `
          <div style="${emailStyles.buttonContainer}">
            <a href="${meta.link}" style="${emailStyles.button}">
              ${meta.linkText ?? "Get Started"}
            </a>
          </div>
          `
              : ""
          }
        </div>
        <div style="${emailStyles.footer}">
          <p style="${emailStyles.footerText}">
            This email was sent by Brnit.<br>
            <a href="${baseUrl}" style="${emailStyles.footerLink}">Visit our website</a>
          </p>
        </div>
      </div>
    </body>
    </html>
    `,
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (err) {
    console.error("[Brnit SendEmail]:", err);
    throw err;
  }
}
