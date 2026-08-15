import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { MembershipPage } from "../../membership-page";
import { isLocale } from "../../site-data";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "en" ? "Membership" : "Lidmaatschap", description: locale === "en" ? "Join L.V. Roodenburg as a youth, senior or indoor football player." : "Word lid van L.V. Roodenburg bij de jeugd, senioren of het zaalvoetbal." };
}

export default async function MembershipRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <MembershipPage locale={locale} />;
}
