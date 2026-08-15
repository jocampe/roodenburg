import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { contentSource } from "../../../content/content-source";
import { isLocale } from "../../../site-data";
import { TeamPage } from "../../../team-page";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; team: string }> }): Promise<Metadata> {
  const { locale, team: slug } = await params;
  const team = await contentSource.getTeam(slug);
  if (!team) return {};
  return { title: team.name, description: locale === "en" ? `Squad, fixtures, results and standings for ${team.name}.` : `Selectie, programma, uitslagen en stand van ${team.name}.` };
}

export default async function ClubTeamPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; team: string }>;
  searchParams: Promise<{ tab?: string; type?: string }>;
}) {
  const { locale, team: slug } = await params;
  if (!isLocale(locale)) notFound();

  const team = await contentSource.getTeam(slug);
  if (!team) notFound();

  const query = await searchParams;
  const tabs = ["overview", "squad", "matches", "standings", "news"] as const;
  const initialTab = tabs.includes(query.tab as (typeof tabs)[number]) ? query.tab as (typeof tabs)[number] : "overview";
  const initialMatchView = query.type === "results" ? "results" : "fixtures";

  return <TeamPage locale={locale} team={team} initialTab={initialTab} initialMatchView={initialMatchView} />;
}
