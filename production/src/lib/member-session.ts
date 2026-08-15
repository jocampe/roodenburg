import config from "@payload-config";
import { getPayload } from "payload";

export const memberCookieName = "roodenburg-member-session";

type MemberRecord = {
  id: number | string;
  collection?: string;
  email?: string | null;
  name?: string | null;
  memberNumber?: string | null;
  preferredLocale?: "nl" | "en" | null;
  status?: "pending" | "active" | "suspended" | "closed" | null;
  lastAuthenticatedAt?: string | null;
};

export const publicMember = (member: MemberRecord) => ({
  id: member.id,
  email: member.email || "",
  name: member.name || "",
  memberNumber: member.memberNumber || "",
  preferredLocale: member.preferredLocale || "nl",
  status: member.status || "pending",
});

const cookieValue = (request: Request, name: string) => {
  const cookieHeader = request.headers.get("cookie") || "";
  const match = cookieHeader
    .split(";")
    .map((part) => part.trim())
    .find((part) => part.startsWith(`${name}=`));
  if (!match) return "";
  try {
    return decodeURIComponent(match.slice(name.length + 1));
  } catch {
    return "";
  }
};

export const authenticateMember = async (request: Request) => {
  const token = cookieValue(request, memberCookieName);
  if (!token) return null;

  const payload = await getPayload({ config });
  const headers = new Headers({ authorization: `Bearer ${token}` });
  let member: MemberRecord | null = null;
  try {
    const { user } = await payload.auth({ headers });
    member = user as MemberRecord | null;
  } catch {
    return null;
  }

  if (!member || member.collection !== "members" || member.status !== "active") return null;
  return { member, payload };
};
