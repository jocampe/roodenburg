import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { contentSource } from "../../content/content-source";
import { isLocale, TeamCategory } from "../../site-data";
import { TeamsDirectory } from "../../teams-directory";

const categories: TeamCategory[] = ["senioren", "jeugd", "pupillen", "zaal"];

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "en" ? "Teams" : "Teams", description: locale === "en" ? "Find every senior, youth, junior and indoor team at L.V. Roodenburg." : "Vind alle senioren-, jeugd-, pupillen- en zaalteams van L.V. Roodenburg." };
}

export default async function TeamsPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ category?: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { category } = await searchParams;
  const initialFilter = categories.includes(category as TeamCategory) ? category as TeamCategory : "all";
  const teams = await contentSource.listTeams();
  return <TeamsDirectory locale={locale} initialFilter={initialFilter} teams={teams} />;
}
