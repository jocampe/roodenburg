import type { GlobalConfig } from "payload";
import { editors } from "../access";

export const SiteSettings: GlobalConfig = {
  slug: "site-settings",
  label: "Site settings",
  admin: { group: "Settings" },
  access: { read: () => true, update: editors },
  versions: { drafts: true, max: 25 },
  fields: [
    { name: "clubName", type: "text", required: true, defaultValue: "L.V. Roodenburg" },
    { name: "contactEmail", type: "email" },
    { name: "contactPhone", type: "text" },
    { name: "address", type: "textarea" },
    {
      name: "socialLinks",
      type: "array",
      fields: [
        { name: "label", type: "text", required: true },
        { name: "url", type: "text", required: true },
      ],
    },
    {
      name: "footerLinks",
      type: "array",
      fields: [
        { name: "label", type: "text", localized: true, required: true },
        { name: "url", type: "text", required: true },
      ],
    },
    { name: "notice", type: "textarea", localized: true },
    { name: "defaultSeoTitle", type: "text", localized: true },
    { name: "defaultSeoDescription", type: "textarea", localized: true },
  ],
};

export const MembershipSettings: GlobalConfig = {
  slug: "membership-settings",
  label: "Membership settings",
  admin: { group: "Settings" },
  access: { read: () => true, update: editors },
  versions: { drafts: true, max: 25 },
  fields: [
    { name: "season", type: "text", required: true },
    { name: "registrationUrl", type: "text" },
    { name: "contactEmail", type: "email" },
    { name: "intro", type: "richText", localized: true },
    {
      name: "fees",
      type: "array",
      fields: [
        { name: "label", type: "text", localized: true, required: true },
        { name: "ageFrom", type: "number" },
        { name: "ageTo", type: "number" },
        { name: "amountEuros", type: "number", required: true, min: 0 },
      ],
    },
  ],
};

export const FootballSyncState: GlobalConfig = {
  slug: "football-sync-state",
  label: "Football sync state",
  admin: { group: "Football data" },
  access: { read: () => true, update: () => false },
  fields: [
    { name: "currentSnapshotId", type: "text", index: true, admin: { readOnly: true } },
    { name: "provider", type: "select", options: ["sportlink"], admin: { readOnly: true } },
    { name: "lastSuccessfulAt", type: "date", admin: { readOnly: true } },
    { name: "sourceGeneratedAt", type: "date", admin: { readOnly: true } },
    { name: "teamCount", type: "number", min: 0, defaultValue: 0, admin: { readOnly: true } },
    { name: "matchCount", type: "number", min: 0, defaultValue: 0, admin: { readOnly: true } },
    { name: "standingCount", type: "number", min: 0, defaultValue: 0, admin: { readOnly: true } },
  ],
};

export const globals: GlobalConfig[] = [SiteSettings, MembershipSettings, FootballSyncState];
