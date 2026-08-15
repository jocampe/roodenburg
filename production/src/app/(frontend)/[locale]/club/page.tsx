import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ClubPage } from "../../club-page";
import { isLocale } from "../../site-data";

const sections = ["about", "history", "organisation", "sportpark", "volunteers", "community", "sponsors", "contact", "privacy"] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "en" ? "The club" : "De club", description: locale === "en" ? "About L.V. Roodenburg, its history, organisation, partners and Sportpark Noord." : "Over L.V. Roodenburg, de historie, organisatie, partners en Sportpark Noord." };
}

export default async function ClubRoute({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ section?: string; topic?: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { section, topic } = await searchParams;
  const initialSection = sections.includes(section as typeof sections[number]) ? section as typeof sections[number] : "about";
  return <ClubPage locale={locale} initialSection={initialSection} initialTopic={topic || "general"} />;
}
