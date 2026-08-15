import { APIError, type CollectionConfig, type Field } from "payload";
import {
  administrators,
  authenticated,
  editorialTeam,
  editors,
  hasAnyRole,
  publishedOrAuthenticated,
  sponsorTeam,
} from "../access";
import { buildPreviewURL } from "../preview-url";
import {
  memberPasswordResetEmail,
  notifyContactSubmission,
  notifyMemberChange,
} from "../infrastructure/email";
import { footballCollections } from "./football";

const localizedText = (name: string, label: string, required = false): Field => ({
  name,
  label,
  type: "text",
  localized: true,
  required,
});

const slugField: Field = {
  name: "slug",
  type: "text",
  required: true,
  unique: true,
  index: true,
  admin: { position: "sidebar" },
};

const publishedAtField: Field = {
  name: "publishedAt",
  type: "date",
  admin: { position: "sidebar" },
};

const editorialVersions = {
  drafts: { autosave: { interval: 30_000 }, schedulePublish: true },
  maxPerDoc: 50,
} as const;

export const Users: CollectionConfig = {
  slug: "users",
  auth: true,
  admin: { group: "Administration", useAsTitle: "email" },
  access: {
    create: administrators,
    delete: administrators,
    read: authenticated,
    update: administrators,
  },
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "roles",
      type: "select",
      hasMany: true,
      required: true,
      saveToJWT: true,
      defaultValue: ["editor"],
      options: [
        { label: "Administrator", value: "administrator" },
        { label: "Editor", value: "editor" },
        { label: "Team editor", value: "team-editor" },
        { label: "Sponsor editor", value: "sponsor-editor" },
      ],
    },
  ],
};

export const Members: CollectionConfig = {
  slug: "members",
  auth: {
    forgotPassword: {
      expiration: 30 * 60 * 1000,
      generateEmailHTML: (args) => memberPasswordResetEmail(args || {}).html,
      generateEmailSubject: (args) => memberPasswordResetEmail(args || {}).subject,
    },
    lockTime: 15 * 60 * 1000,
    maxLoginAttempts: 5,
    tokenExpiration: 8 * 60 * 60,
    useSessions: true,
  },
  admin: {
    group: "Members",
    useAsTitle: "email",
    defaultColumns: ["name", "email", "memberNumber", "status", "updatedAt"],
    description: "Website member accounts are separate from CMS staff accounts.",
  },
  access: {
    admin: ({ req }) => hasAnyRole(req.user, ["administrator"]),
    create: administrators,
    delete: administrators,
    read: administrators,
    update: administrators,
  },
  hooks: {
    beforeLogin: [({ user }) => {
      if (user.status !== "active") {
        throw new APIError("This member account is not active.", 401, null, false);
      }
      return user;
    }],
    afterChange: [notifyMemberChange],
  },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "memberNumber", type: "text", unique: true, index: true },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "pending",
      options: ["pending", "active", "suspended", "closed"],
      admin: { position: "sidebar" },
    },
    {
      name: "preferredLocale",
      type: "select",
      required: true,
      defaultValue: "nl",
      options: [
        { label: "Nederlands", value: "nl" },
        { label: "English", value: "en" },
      ],
      admin: { position: "sidebar" },
    },
    { name: "consentedAt", type: "date" },
    { name: "lastAuthenticatedAt", type: "date", admin: { readOnly: true } },
  ],
};

export const Media: CollectionConfig = {
  slug: "media",
  admin: { group: "Editorial", useAsTitle: "filename" },
  access: {
    create: editors,
    delete: editors,
    read: () => true,
    update: editors,
  },
  upload: {
    staticDir: "media",
    adminThumbnail: "thumbnail",
    mimeTypes: ["image/*"],
    imageSizes: [
      { name: "thumbnail", width: 400, height: 300, position: "centre" },
      { name: "card", width: 768, height: 512, position: "centre" },
      { name: "hero", width: 1920, height: 1080, position: "centre" },
    ],
  },
  fields: [
    localizedText("alt", "Alternative text", true),
    localizedText("caption", "Caption"),
    { name: "credit", type: "text" },
    { name: "consentReference", type: "text", admin: { position: "sidebar" } },
    { name: "expiresAt", type: "date", admin: { position: "sidebar" } },
  ],
};

export const NewsPosts: CollectionConfig = {
  slug: "news-posts",
  admin: {
    group: "Editorial",
    useAsTitle: "title",
    defaultColumns: ["title", "kind", "publishedAt", "_status"],
    preview: (document, { locale }) => buildPreviewURL({
      collection: "news-posts",
      locale: String(locale || "nl"),
      slug: String(document.slug || ""),
    }),
  },
  access: {
    create: editors,
    delete: editors,
    read: publishedOrAuthenticated,
    update: editors,
  },
  versions: editorialVersions,
  fields: [
    localizedText("title", "Title", true),
    slugField,
    {
      name: "kind",
      type: "select",
      required: true,
      defaultValue: "news",
      options: [
        { label: "News", value: "news" },
        { label: "Match report", value: "match-report" },
        { label: "Announcement", value: "announcement" },
      ],
      admin: { position: "sidebar" },
    },
    localizedText("intro", "Introduction", true),
    { name: "body", type: "richText", localized: true, required: true },
    { name: "category", type: "text", localized: true, admin: { position: "sidebar" } },
    publishedAtField,
    { name: "author", type: "relationship", relationTo: "users", admin: { position: "sidebar" } },
    { name: "heroImage", type: "relationship", relationTo: "media" },
    { name: "relatedPosts", type: "relationship", relationTo: "news-posts", hasMany: true },
  ],
};

export const ClubPages: CollectionConfig = {
  slug: "club-pages",
  admin: { group: "Editorial", useAsTitle: "title" },
  access: { create: editors, delete: editors, read: publishedOrAuthenticated, update: editors },
  versions: editorialVersions,
  fields: [
    { name: "key", type: "text", required: true, unique: true, index: true, admin: { position: "sidebar" } },
    localizedText("title", "Title", true),
    { name: "body", type: "richText", localized: true, required: true },
    { name: "heroImage", type: "relationship", relationTo: "media" },
    { name: "navigationOrder", type: "number", defaultValue: 0, admin: { position: "sidebar" } },
    {
      name: "sections",
      type: "array",
      fields: [
        localizedText("heading", "Heading"),
        { name: "content", type: "richText", localized: true },
        { name: "image", type: "relationship", relationTo: "media" },
      ],
    },
  ],
};

export const Events: CollectionConfig = {
  slug: "events",
  admin: { group: "Editorial", useAsTitle: "title" },
  access: { create: editors, delete: editors, read: publishedOrAuthenticated, update: editors },
  versions: editorialVersions,
  fields: [
    localizedText("title", "Title", true),
    slugField,
    { name: "description", type: "richText", localized: true, required: true },
    { name: "startsAt", type: "date", required: true },
    { name: "endsAt", type: "date" },
    localizedText("venue", "Venue"),
    { name: "registrationUrl", type: "text" },
    { name: "image", type: "relationship", relationTo: "media" },
    {
      name: "audience",
      type: "select",
      defaultValue: "everyone",
      options: ["everyone", "members", "youth", "seniors", "volunteers"],
    },
  ],
};

export const Sponsors: CollectionConfig = {
  slug: "sponsors",
  admin: { group: "Commercial", useAsTitle: "name" },
  access: { create: sponsorTeam, delete: sponsorTeam, read: publishedOrAuthenticated, update: sponsorTeam },
  versions: editorialVersions,
  fields: [
    { name: "name", type: "text", required: true },
    {
      name: "tier",
      type: "select",
      required: true,
      options: ["main", "premium", "club", "community"],
    },
    { name: "logo", type: "relationship", relationTo: "media", required: true },
    { name: "website", type: "text" },
    { name: "description", type: "richText", localized: true },
    { name: "displayOrder", type: "number", defaultValue: 0 },
    { name: "activeFrom", type: "date" },
    { name: "activeUntil", type: "date" },
  ],
};

export const TeamOverlays: CollectionConfig = {
  slug: "team-overlays",
  admin: {
    group: "Football",
    useAsTitle: "displayName",
    preview: (document, { locale }) => buildPreviewURL({
      collection: "team-overlays",
      locale: String(locale || "nl"),
      slug: String(document.routeSlug || ""),
    }),
  },
  access: { create: editorialTeam, delete: editorialTeam, read: publishedOrAuthenticated, update: editorialTeam },
  versions: editorialVersions,
  fields: [
    { name: "sportlinkTeamId", type: "text", required: true, unique: true, index: true },
    { name: "routeSlug", type: "text", required: true, unique: true, index: true },
    { name: "displayName", type: "text", required: true },
    { name: "description", type: "richText", localized: true },
    { name: "heroImage", type: "relationship", relationTo: "media" },
    {
      name: "staff",
      type: "array",
      fields: [
        { name: "name", type: "text", required: true },
        localizedText("role", "Role", true),
        { name: "photo", type: "relationship", relationTo: "media" },
      ],
    },
    { name: "relatedNews", type: "relationship", relationTo: "news-posts", hasMany: true },
  ],
};

export const ContactSubmissions: CollectionConfig = {
  slug: "contact-submissions",
  admin: { group: "Administration", useAsTitle: "subject", defaultColumns: ["subject", "email", "status", "createdAt"] },
  access: {
    create: administrators,
    delete: administrators,
    read: editors,
    update: editors,
  },
  hooks: { afterChange: [notifyContactSubmission] },
  fields: [
    { name: "name", type: "text", required: true },
    { name: "email", type: "email", required: true },
    { name: "phone", type: "text" },
    {
      name: "topic",
      type: "select",
      required: true,
      options: ["general", "membership", "team", "volunteering", "sponsoring", "organisation"],
    },
    { name: "subject", type: "text", required: true },
    { name: "message", type: "textarea", required: true },
    { name: "locale", type: "select", required: true, options: ["nl", "en"] },
    { name: "consentedAt", type: "date", required: true },
    {
      name: "status",
      type: "select",
      required: true,
      defaultValue: "new",
      options: ["new", "in-progress", "resolved", "spam"],
    },
    { name: "assignee", type: "relationship", relationTo: "users" },
    { name: "deleteAfter", type: "date", required: true },
  ],
};

export const collections: CollectionConfig[] = [
  Users,
  Members,
  Media,
  NewsPosts,
  ClubPages,
  Events,
  Sponsors,
  TeamOverlays,
  ContactSubmissions,
  ...footballCollections,
];
