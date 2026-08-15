import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClubPage } from "../../club-page";
import { isLocale } from "../../site-data";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "en" ? "The club" : "De club", description: locale === "en" ? "About L.V. Roodenburg, its history, organisation, partners and Sportpark Noord." : "Over L.V. Roodenburg, de historie, organisatie, partners en Sportpark Noord." };
}

export default async function ClubRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <ClubPage locale={locale} initialSection="about" initialTopic="general" />;
}
