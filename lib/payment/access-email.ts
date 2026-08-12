import { accessEmailTemplate } from "@/data/config/email";
import { getPackageAccessKey } from "@/data/professions";
import type { Profession, PurchasePackage } from "@/data/professions/types";
import { createAccessToken } from "@/lib/course-access";

export type AccessEmailInput = {
  invId: string;
  email: string;
  profession: Profession;
  purchasePackage: PurchasePackage;
};

type AccessEmailResult =
  | {
      sent: true;
    }
  | {
      sent: false;
      reason: string;
    };

function getPublicSiteUrl() {
  return (
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.SITE_URL?.trim() ||
    "https://poacalling.com"
  ).replace(/\/$/, "");
}

function getResendConfig() {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = process.env.ACCESS_EMAIL_FROM?.trim();

  if (!apiKey || !from) {
    return null;
  }

  return { apiKey, from };
}

function buildAccessLink(input: AccessEmailInput) {
  const accessKey = getPackageAccessKey(
    input.profession.slug,
    input.purchasePackage.slug,
  );
  const token = createAccessToken({
    email: input.email,
    programSlug: accessKey,
    purchaseId: input.invId,
  });
  const siteUrl = getPublicSiteUrl();

  return `${siteUrl}/course/${input.profession.slug}/basic?token=${encodeURIComponent(
    token,
  )}`;
}

function buildEmailText(input: AccessEmailInput, accessLink: string) {
  void accessLink;

  return accessEmailTemplate.body
    .replace(
      "[Название программы]",
      `${input.profession.title} — ${input.purchasePackage.title}`,
    )
    .replace(
      "Откройте защищенную ссылку:\n[ACCESS_LINK]",
      "Откройте образовательную программу по кликабельной кнопке в этом письме.",
    );
}

function buildEmailHtml(input: AccessEmailInput, accessLink: string) {
  const text = buildEmailText(input, accessLink)
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => `<p>${line}</p>`)
    .join("");

  return `<div style="font-family:Arial,sans-serif;line-height:1.6;color:#1f2a24">${text}<p><a href="${accessLink}" style="display:inline-block;padding:14px 22px;border-radius:999px;background:#183d2f;color:#ffffff;text-decoration:none;font-weight:700">Открыть образовательную программу</a></p></div>`;
}

export async function sendAccessEmail(
  input: AccessEmailInput,
): Promise<AccessEmailResult> {
  const resendConfig = getResendConfig();

  if (!resendConfig) {
    return {
      sent: false,
      reason: "Email provider env is not configured",
    };
  }

  const accessLink = buildAccessLink(input);
  const response = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendConfig.apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: resendConfig.from,
      to: input.email,
      subject: accessEmailTemplate.subject,
      text: buildEmailText(input, accessLink),
      html: buildEmailHtml(input, accessLink),
    }),
  });

  if (!response.ok) {
    return {
      sent: false,
      reason: `Email provider responded with HTTP ${response.status}`,
    };
  }

  return { sent: true };
}
