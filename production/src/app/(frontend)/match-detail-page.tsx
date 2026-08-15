import { ClubTeam, copy, Locale } from "./site-data";
import { Breadcrumbs, SiteHeader } from "./site-header";

const matchNames: Record<string, { date: string; time: string; home: string; away: string; score?: string; type: { nl: string; en: string }; venue: string }> = {
  "roodenburg-lsvv-22-aug": { date: "22 augustus 2026", time: "Afgelopen", home: "TEAM", away: "LSVV ’70 1", score: "3 — 1", type: { nl: "Oefenwedstrijd", en: "Friendly" }, venue: "Sportpark Noord" },
  "roodenburg-voorschoten-29-aug": { date: "29 augustus 2026", time: "14:30", home: "TEAM", away: "Voorschoten ’97 1", type: { nl: "Competitie", en: "League" }, venue: "Sportpark Noord" },
  "sporting-leiden-roodenburg-05-sep": { date: "5 september 2026", time: "14:30", home: "Sporting Leiden 1", away: "TEAM", type: { nl: "Competitie", en: "League" }, venue: "Sportpark Boshuizerkade" },
  "roodenburg-foreholte-12-sep": { date: "12 september 2026", time: "15:00", home: "TEAM", away: "Foreholte 1", type: { nl: "Beker", en: "Cup" }, venue: "Sportpark Noord" },
  "doocos-roodenburg-15-aug": { date: "15 augustus 2026", time: "Afgelopen", home: "DoCoS 1", away: "TEAM", score: "2 — 2", type: { nl: "Oefenwedstrijd", en: "Friendly" }, venue: "Sportpark Morskwartier" },
};

export function MatchDetailPage({ locale, team, matchId }: { locale: Locale; team: ClubTeam; matchId: string }) {
  const isNl = locale === "nl";
  const base = `/${locale}`;
  const t = copy[locale];
  const fallback = matchNames[matchId] || matchNames["roodenburg-voorschoten-29-aug"];
  const sourceMatch = team.matches?.find((candidate) => candidate.id === matchId);
  const date = sourceMatch
    ? new Intl.DateTimeFormat(isNl ? "nl-NL" : "en-GB", { day: "numeric", month: "long", year: "numeric" }).format(new Date(sourceMatch.startsAt))
    : fallback.date;
  const time = sourceMatch
    ? new Intl.DateTimeFormat(isNl ? "nl-NL" : "en-GB", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(sourceMatch.startsAt))
    : fallback.time;
  const type = sourceMatch ? ({
    league: { nl: "Competitie", en: "League" },
    cup: { nl: "Beker", en: "Cup" },
    friendly: { nl: "Oefenwedstrijd", en: "Friendly" },
    other: { nl: "Overig", en: "Other" },
  })[sourceMatch.competition] : fallback.type;
  const home = sourceMatch?.home || fallback.home;
  const away = sourceMatch?.away || fallback.away;
  const score = sourceMatch
    ? (sourceMatch.homeScore !== null && sourceMatch.awayScore !== null ? `${sourceMatch.homeScore} — ${sourceMatch.awayScore}` : undefined)
    : fallback.score;
  const venue = sourceMatch?.venue || fallback.venue;
  const status = sourceMatch?.status || (fallback.score ? "finished" : "scheduled");
  const teamName = (name: string) => name === "TEAM" ? team.name : name;

  return <main className="match-detail-page" id="main-content">
    <SiteHeader locale={locale} languagePath={`/teams/${team.slug}/matches/${matchId}`} />
    <Breadcrumbs locale={locale} items={[
      { label: "Teams", href: `${base}/teams` },
      { label: team.name, href: `${base}/teams/${team.slug}` },
      { label: isNl ? "Wedstrijdinformatie" : "Match information" },
    ]} />
    <section className="subpage-hero-compact match-detail-hero">
      <div><span className="section-kicker">{type[locale]} · {team.competition}</span><h1>{isNl ? "Wedstrijdinformatie" : "Match information"}</h1></div>
      <div className="concept-badge">{team.dataOrigin === "sportlink" ? "Sportlink" : (isNl ? "Voorbeeldgegevens" : "Sample data")}</div>
    </section>
    <section className="match-detail-card">
      <header><span>{date}</span><strong>{venue}</strong></header>
      <div className="match-detail-score">
        <div>{home === "TEAM" || teamName(home).toLowerCase().includes("roodenburg") ? <img src="/roodenburg-crest.png" alt="" /> : <span className="opponent-mark" aria-hidden="true">{teamName(home).slice(0, 3).toUpperCase()}</span>}<strong>{teamName(home)}</strong></div>
        <b>{score || time}</b>
        <div>{away === "TEAM" || teamName(away).toLowerCase().includes("roodenburg") ? <img src="/roodenburg-crest.png" alt="" /> : <span className="opponent-mark" aria-hidden="true">{teamName(away).slice(0, 3).toUpperCase()}</span>}<strong>{teamName(away)}</strong></div>
      </div>
      <dl>
        <div><dt>{isNl ? "Aanvang" : "Kick-off"}</dt><dd>{time}</dd></div>
        <div><dt>{isNl ? "Locatie" : "Venue"}</dt><dd>{venue}</dd></div>
        <div><dt>{isNl ? "Wedstrijdtype" : "Competition"}</dt><dd>{type[locale]}</dd></div>
        <div><dt>{isNl ? "Status" : "Status"}</dt><dd>{status === "finished" ? (isNl ? "Afgelopen" : "Full time") : status === "postponed" ? (isNl ? "Uitgesteld" : "Postponed") : status === "cancelled" ? (isNl ? "Afgelast" : "Cancelled") : (isNl ? "Gepland" : "Scheduled")}</dd></div>
      </dl>
    </section>
    <section className="match-detail-info">
      <article><span>01</span><h2>{isNl ? "Praktische informatie" : "Practical information"}</h2><p>{isNl ? "Route, veldnummer en eventuele wedstrijdupdates worden hier getoond zodra de officiële gegevens beschikbaar zijn." : "Directions, pitch number and any match updates will appear here once official data is available."}</p></article>
      <article><span>02</span><h2>{isNl ? "Wedstrijdverslag" : "Match report"}</h2><p>{isNl ? "Na afloop kan hier het verslag, de doelpuntenmakers en een fotoselectie worden toegevoegd." : "After full time, this area can contain the report, goalscorers and a photo selection."}</p></article>
    </section>
    <footer className="team-footer"><a href={base}>L.V. Roodenburg</a><span>{t.footerText}</span><a href={`${base}/teams/${team.slug}?tab=matches`}>{isNl ? "Alle wedstrijden" : "All matches"} →</a></footer>
  </main>;
}
