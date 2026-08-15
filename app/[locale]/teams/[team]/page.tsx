import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { contentSource } from "../../../content/content-source";
import { isLocale } from "../../../site-data";
import { TeamPage } from "../../../team-page";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; team: string }> }): Promise<Metadata> {
  const { locale, team: slug } = await params;
  const team = contentSource.getTeam(slug);
  if (!team) return {};
  return { title: team.name, description: locale === "en" ? `Squad, fixtures, results and standings for ${team.name}.` : `Selectie, programma, uitslagen en stand van ${team.name}.` };
}

export default async function ClubTeamPage({
  params,
}: {
  params: Promise<{ locale: string; team: string }>;
}) {
  const { locale, team: slug } = await params;
  if (!isLocale(locale)) notFound();

  const team = contentSource.getTeam(slug);
  if (!team) notFound();

  return <TeamPage locale={locale} team={team} initialTab="overview" initialMatchView="fixtures" />;
}
