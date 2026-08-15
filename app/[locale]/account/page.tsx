import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { AccountPage } from "../../account-page";
import { isLocale } from "../../site-data";

export const metadata: Metadata = { title: "Login", robots: { index: false, follow: false } };

export default async function AccountRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <AccountPage locale={locale} />;
}
