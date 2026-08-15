import type { Access } from "payload";

export type Role = "administrator" | "editor" | "team-editor" | "sponsor-editor";

export const userRoles = (user: unknown): Role[] => {
  if (!user || typeof user !== "object" || !("roles" in user)) return [];
  const roles = (user as { roles?: unknown }).roles;
  return Array.isArray(roles) ? (roles.filter((role) => typeof role === "string") as Role[]) : [];
};

export const hasAnyRole = (user: unknown, allowed: readonly Role[]) =>
  userRoles(user).some((role) => allowed.includes(role));

export const authenticated: Access = ({ req }) => Boolean(req.user);

export const administrators: Access = ({ req }) => hasAnyRole(req.user, ["administrator"]);

export const editors: Access = ({ req }) => {
  return hasAnyRole(req.user, ["administrator", "editor"]);
};

export const editorialTeam: Access = ({ req }) => {
  return hasAnyRole(req.user, ["administrator", "editor", "team-editor"]);
};

export const sponsorTeam: Access = ({ req }) => {
  return hasAnyRole(req.user, ["administrator", "editor", "sponsor-editor"]);
};

export const publishedOrAuthenticated: Access = ({ req }) => {
  if (req.user) return true;
  return { _status: { equals: "published" } };
};
