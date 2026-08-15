import type { CollectionAfterChangeHook, Payload, SendEmailOptions } from "payload";
import { resolveSMTPConfiguration } from "./runtime-config";

type MemberRecord = {
  email?: string | null;
  name?: string | null;
  preferredLocale?: "nl" | "en" | null;
  status?: "pending" | "active" | "suspended" | "closed" | null;
};

type ContactRecord = {
  email?: string | null;
  message?: string | null;
  name?: string | null;
  subject?: string | null;
  topic?: string | null;
};

const escapeHTML = (input: unknown) => String(input ?? "")
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

const layout = (heading: string, body: string) => `<!doctype html>
<html lang="nl"><body style="background:#eef2f5;color:#07111f;font-family:Arial,sans-serif;margin:0;padding:32px">
<table role="presentation" style="background:#fff;border-collapse:collapse;margin:auto;max-width:620px;width:100%"><tr><td style="border-top:6px solid #0576c5;padding:34px">
<p style="color:#0576c5;font-size:12px;font-weight:700;letter-spacing:.08em;text-transform:uppercase">L.V. Roodenburg</p>
<h1 style="font-size:28px;margin:22px 0">${escapeHTML(heading)}</h1>${body}
<p style="border-top:1px solid #dce3ea;color:#6b7787;font-size:12px;margin-top:30px;padding-top:18px">L.V. Roodenburg · Leiden</p>
</td></tr></table></body></html>`;

const paragraph = (text: string) => `<p style="font-size:15px;line-height:1.65">${escapeHTML(text)}</p>`;

const action = (label: string, href: string) => `<p style="margin:28px 0"><a href="${escapeHTML(href)}" style="background:#0576c5;color:#fff;display:inline-block;font-size:14px;font-weight:700;padding:14px 20px;text-decoration:none">${escapeHTML(label)}</a></p>`;

export const sendConfiguredEmail = async (
  payload: Payload,
  message: SendEmailOptions,
  event: string,
) => {
  const smtp = resolveSMTPConfiguration();
  if (!smtp.enabled) return false;

  try {
    await payload.sendEmail({
      ...message,
      ...(smtp.replyTo && !message.replyTo ? { replyTo: smtp.replyTo } : {}),
    });
    payload.logger.info({ event }, "Transactional email sent");
    return true;
  } catch (error) {
    payload.logger.error({ err: error, event }, "Transactional email delivery failed");
    return false;
  }
};

export const memberPasswordResetEmail = ({ token, user }: { token?: string; user?: MemberRecord }) => {
  const locale = user?.preferredLocale === "en" ? "en" : "nl";
  const baseURL = (process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000").replace(/\/$/, "");
  // The fragment is handled in the browser and is not sent in HTTP requests or referrer headers.
  const resetURL = `${baseURL}/${locale}/account#reset=${encodeURIComponent(token || "")}`;
  const heading = locale === "en" ? "Reset your password" : "Stel je wachtwoord opnieuw in";
  const intro = locale === "en"
    ? "We received a request to reset the password for your My Roodenburg account."
    : "We hebben een verzoek ontvangen om het wachtwoord van je Mijn Roodenburg-account opnieuw in te stellen.";
  const expiry = locale === "en"
    ? "This link expires after 30 minutes. If you did not request this, you can ignore this email."
    : "Deze link verloopt na 30 minuten. Heb je dit niet aangevraagd, dan kun je deze e-mail negeren.";

  return {
    subject: `L.V. Roodenburg — ${heading}`,
    html: layout(heading, paragraph(intro) + action(locale === "en" ? "Choose a new password" : "Kies een nieuw wachtwoord", resetURL) + paragraph(expiry)),
  };
};

const memberStatusCopy = (member: MemberRecord) => {
  const english = member.preferredLocale === "en";
  const status = member.status || "pending";
  const copy = {
    pending: english
      ? ["Account request received", "Your request has been received. The club will review your membership before activating the account."]
      : ["Accountaanvraag ontvangen", "Je aanvraag is ontvangen. De club controleert je lidmaatschap voordat het account wordt geactiveerd."],
    active: english
      ? ["Your account is active", "Your My Roodenburg account has been activated. You can now sign in."]
      : ["Je account is actief", "Je Mijn Roodenburg-account is geactiveerd. Je kunt nu inloggen."],
    suspended: english
      ? ["Your account is suspended", "Your My Roodenburg account has been suspended. Contact the club if you believe this is incorrect."]
      : ["Je account is geblokkeerd", "Je Mijn Roodenburg-account is geblokkeerd. Neem contact op met de club als dit niet klopt."],
    closed: english
      ? ["Your account is closed", "Your My Roodenburg account has been closed. Contact the club if you need assistance."]
      : ["Je account is gesloten", "Je Mijn Roodenburg-account is gesloten. Neem contact op met de club als je hulp nodig hebt."],
  } as const;
  return { english, heading: copy[status][0], message: copy[status][1] };
};

export const notifyMemberChange: CollectionAfterChangeHook<MemberRecord & { id: number | string }> = async ({ doc, operation, previousDoc, req }) => {
  const smtp = resolveSMTPConfiguration();
  const statusChanged = operation === "create" || previousDoc?.status !== doc.status;
  if (!statusChanged || !doc.email) return doc;

  const copy = memberStatusCopy(doc);
  const signInURL = `${(process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000").replace(/\/$/, "")}/${copy.english ? "en" : "nl"}/account`;
  await sendConfiguredEmail(req.payload, {
    to: doc.email,
    subject: `L.V. Roodenburg — ${copy.heading}`,
    html: layout(copy.heading, paragraph(`${copy.english ? "Hello" : "Hallo"} ${doc.name || ""},`) + paragraph(copy.message) + (doc.status === "active" ? action(copy.english ? "Sign in" : "Inloggen", signInURL) : "")),
  }, `member.status.${doc.status || "pending"}`);

  if (operation === "create" && smtp.memberRecipients.length) {
    await sendConfiguredEmail(req.payload, {
      to: smtp.memberRecipients,
      subject: `New member account request — ${doc.name || doc.email}`,
      html: layout("New member account request", paragraph(`${doc.name || "Unknown name"} (${doc.email}) requested a website account.`) + action("Review member requests", `${(process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000").replace(/\/$/, "")}/admin/collections/members`)),
    }, "member.registration.admin");
  }
  return doc;
};

export const notifyContactSubmission: CollectionAfterChangeHook<ContactRecord & { id: number | string }> = async ({ doc, operation, req }) => {
  if (operation !== "create") return doc;
  const smtp = resolveSMTPConfiguration();
  if (!smtp.contactRecipients.length) return doc;

  await sendConfiguredEmail(req.payload, {
    to: smtp.contactRecipients,
    subject: `Website contact — ${doc.subject || doc.topic || "General"}`,
    html: layout("New website contact", paragraph(`From: ${doc.name || "Unknown"} (${doc.email || "No email"})`) + paragraph(doc.message || "") + action("Open contact workflow", `${(process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000").replace(/\/$/, "")}/admin/collections/contact-submissions`)),
  }, "contact.created");
  return doc;
};
