import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isLocale } from "../../site-data";
import { TeamsDirectory } from "../../teams-directory";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "en" ? "Teams" : "Teams", description: locale === "en" ? "Find every senior, youth, junior and indoor team at L.V. Roodenburg." : "Vind alle senioren-, jeugd-, pupillen- en zaalteams van L.V. Roodenburg." };
}

export default async function TeamsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <TeamsDirectory locale={locale} initialFilter="all" />;
}
