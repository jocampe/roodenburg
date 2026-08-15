import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { contentSource } from "../../../../../content/content-source";
import { MatchDetailPage } from "../../../../../match-detail-page";
import { isLocale } from "../../../../../site-data";

export async function generateMetadata({ params }: { params: Promise<{ locale: string; team: string }> }): Promise<Metadata> {
  const { locale, team: slug } = await params;
  const team = await contentSource.getTeam(slug);
  return { title: locale === "en" ? `Match information${team ? ` — ${team.name}` : ""}` : `Wedstrijdinformatie${team ? ` — ${team.name}` : ""}`, description: locale === "en" ? "Kick-off, venue, competition and match status." : "Aanvang, locatie, wedstrijdtype en status." };
}

export default async function MatchPage({ params }: { params: Promise<{ locale: string; team: string; match: string }> }) {
  const { locale, team: teamSlug, match } = await params;
  if (!isLocale(locale)) notFound();
  const team = await contentSource.getTeam(teamSlug);
  if (!team) notFound();
  if (team.dataOrigin === "sportlink" && !team.matches?.some((candidate) => candidate.id === match)) notFound();
  return <MatchDetailPage locale={locale} team={team} matchId={match} />;
}
