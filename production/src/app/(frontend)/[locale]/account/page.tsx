import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AccountPage } from "../../account-page";
import { isLocale } from "../../site-data";

export const metadata: Metadata = { title: "Login", robots: { index: false, follow: false } };

export default async function AccountRoute({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ resetToken?: string | string[] }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const query = await searchParams;
  const resetToken = typeof query.resetToken === "string" ? query.resetToken : "";
  return <AccountPage locale={locale} resetToken={resetToken} />;
}
