import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { contentSource } from "../../../../../content/content-source";
import { demoMatchIds, MatchDetailPage } from "../../../../../match-detail-page";
import { isLocale } from "../../../../../site-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return demoMatchIds.map((match) => ({ match }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; team: string }> }): Promise<Metadata> {
  const { locale, team: slug } = await params;
  const team = contentSource.getTeam(slug);
  return { title: locale === "en" ? `Match information${team ? ` — ${team.name}` : ""}` : `Wedstrijdinformatie${team ? ` — ${team.name}` : ""}`, description: locale === "en" ? "Kick-off, venue, competition and match status." : "Aanvang, locatie, wedstrijdtype en status." };
}

export default async function MatchPage({ params }: { params: Promise<{ locale: string; team: string; match: string }> }) {
  const { locale, team: teamSlug, match } = await params;
  if (!isLocale(locale)) notFound();
  const team = contentSource.getTeam(teamSlug);
  if (!team) notFound();
  return <MatchDetailPage locale={locale} team={team} matchId={match} />;
}
