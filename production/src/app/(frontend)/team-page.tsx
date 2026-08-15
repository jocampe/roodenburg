"use client";

import { useEffect, useMemo, useState } from "react";
import { ClubMatch, ClubStanding, ClubTeam, clubTeams, copy, Locale } from "./site-data";
import { Breadcrumbs, SiteHeader } from "./site-header";

type TeamTab = "overview" | "squad" | "matches" | "standings" | "news";
type MatchView = "fixtures" | "results";
type LocationFilter = "all" | "home" | "away";
type CompetitionFilter = "all" | ClubMatch["competition"];
type StandingSplit = "overall" | "home" | "away";

const squad = [
  { number: "01", name: "Doelman", role: { nl: "Keeper", en: "Goalkeeper" } },
  { number: "04", name: "Verdediger", role: { nl: "Verdediging", en: "Defence" } },
  { number: "08", name: "Middenvelder", role: { nl: "Middenveld", en: "Midfield" } },
  { number: "10", name: "Aanvaller", role: { nl: "Aanval", en: "Attack" } },
];

const fallbackMatches: ClubMatch[] = [
  { id: "roodenburg-lsvv-22-aug", startsAt: "2026-08-22T12:30:00.000Z", kind: "results", status: "finished", competition: "friendly", competitionName: "Oefenwedstrijd", location: "home", home: "TEAM", away: "LSVV ’70 1", homeScore: 3, awayScore: 1, venue: "Sportpark Noord" },
  { id: "roodenburg-voorschoten-29-aug", startsAt: "2026-08-29T12:30:00.000Z", kind: "fixtures", status: "scheduled", competition: "league", competitionName: "Competitie", location: "home", home: "TEAM", away: "Voorschoten ’97 1", homeScore: null, awayScore: null, venue: "Sportpark Noord", next: true },
  { id: "sporting-leiden-roodenburg-05-sep", startsAt: "2026-09-05T12:30:00.000Z", kind: "fixtures", status: "scheduled", competition: "league", competitionName: "Competitie", location: "away", home: "Sporting Leiden 1", away: "TEAM", homeScore: null, awayScore: null, venue: "Sportpark Boshuizerkade" },
  { id: "roodenburg-foreholte-12-sep", startsAt: "2026-09-12T13:00:00.000Z", kind: "fixtures", status: "scheduled", competition: "cup", competitionName: "Beker", location: "home", home: "TEAM", away: "Foreholte 1", homeScore: null, awayScore: null, venue: "Sportpark Noord" },
  { id: "doocos-roodenburg-15-aug", startsAt: "2026-08-15T12:30:00.000Z", kind: "results", status: "finished", competition: "friendly", competitionName: "Oefenwedstrijd", location: "away", home: "DoCoS 1", away: "TEAM", homeScore: 2, awayScore: 2, venue: "Sportpark Morskwartier" },
];

const fallbackStandings: Record<StandingSplit, ClubStanding[]> = {
  overall: [
    { position: 1, clubName: "Roodenburg 1", played: 4, points: 10, goalDifference: 7 },
    { position: 2, clubName: "Voorschoten ’97 1", played: 4, points: 9, goalDifference: 5 },
    { position: 3, clubName: "LSVV ’70 1", played: 4, points: 7, goalDifference: 2 },
    { position: 4, clubName: "Sporting Leiden 1", played: 4, points: 6, goalDifference: 1 },
    { position: 5, clubName: "FC Oegstgeest 1", played: 4, points: 4, goalDifference: -3 },
  ],
  home: [
    { position: 1, clubName: "Roodenburg 1", played: 2, points: 6, goalDifference: 5 },
    { position: 2, clubName: "Voorschoten ’97 1", played: 2, points: 6, goalDifference: 4 },
    { position: 3, clubName: "Sporting Leiden 1", played: 2, points: 4, goalDifference: 2 },
    { position: 4, clubName: "LSVV ’70 1", played: 2, points: 3, goalDifference: 0 },
    { position: 5, clubName: "FC Oegstgeest 1", played: 2, points: 1, goalDifference: -2 },
  ],
  away: [
    { position: 1, clubName: "Voorschoten ’97 1", played: 2, points: 3, goalDifference: 1 },
    { position: 2, clubName: "Roodenburg 1", played: 2, points: 4, goalDifference: 2 },
    { position: 3, clubName: "LSVV ’70 1", played: 2, points: 4, goalDifference: 2 },
    { position: 4, clubName: "Sporting Leiden 1", played: 2, points: 2, goalDifference: -1 },
    { position: 5, clubName: "FC Oegstgeest 1", played: 2, points: 3, goalDifference: -1 },
  ],
};

const validTabs: TeamTab[] = ["overview", "squad", "matches", "standings", "news"];

export function TeamPage({
  locale,
  team = clubTeams[0],
  initialTab = "overview",
  initialMatchView = "fixtures",
}: {
  locale: Locale;
  team?: ClubTeam;
  initialTab?: TeamTab;
  initialMatchView?: MatchView;
}) {
  const t = copy[locale];
  const isNl = locale === "nl";
  const base = `/${locale}`;
  const [activeTab, setActiveTab] = useState<TeamTab>(validTabs.includes(initialTab) ? initialTab : "overview");
  const [matchView, setMatchView] = useState<MatchView>(initialMatchView);
  const [location, setLocation] = useState<LocationFilter>("all");
  const [competition, setCompetition] = useState<CompetitionFilter>("all");
  const [season, setSeason] = useState(team.season || "2026-2027");
  const [standingSplit, setStandingSplit] = useState<StandingSplit>("overall");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedTab = params.get("tab") as TeamTab | null;
    if (requestedTab && validTabs.includes(requestedTab)) setActiveTab(requestedTab);
    if (params.get("type") === "results") setMatchView("results");
  }, []);

  const matches = team.dataOrigin === "sportlink" ? (team.matches || []) : fallbackMatches;
  const filteredMatches = useMemo(() => matches.filter((match) =>
    match.kind === matchView &&
    (location === "all" || match.location === location) &&
    (competition === "all" || match.competition === competition)
  ), [competition, location, matchView, matches]);

  const show = (tab: Exclude<TeamTab, "overview">) => activeTab === "overview" || activeTab === tab;
  const teamName = (value: string) => value === "TEAM" ? team.name : value;
  const competitionLabel = (value: CompetitionFilter) => ({
    all: isNl ? "Alle competities" : "All competitions",
    league: isNl ? "Competitie" : "League",
    cup: isNl ? "Beker" : "Cup",
    friendly: isNl ? "Oefenwedstrijd" : "Friendly",
    other: isNl ? "Overig" : "Other",
  })[value];
  const formatDate = (startsAt: string) => new Intl.DateTimeFormat(isNl ? "nl-NL" : "en-GB", { day: "2-digit", month: "short" }).format(new Date(startsAt)).replace(".", "").toUpperCase();
  const formatTime = (startsAt: string) => new Intl.DateTimeFormat(isNl ? "nl-NL" : "en-GB", { hour: "2-digit", minute: "2-digit", hour12: false }).format(new Date(startsAt));
  const matchScore = (match: ClubMatch) => match.homeScore !== null && match.awayScore !== null ? `${match.homeScore} — ${match.awayScore}` : formatTime(match.startsAt);
  const latestMatch = [...matches].filter((match) => match.kind === "results").sort((a, b) => b.startsAt.localeCompare(a.startsAt))[0];
  const nextMatch = [...matches].filter((match) => match.kind === "fixtures" && match.status === "scheduled").sort((a, b) => a.startsAt.localeCompare(b.startsAt))[0];
  const activeStandings = team.dataOrigin === "sportlink" ? (team.standings?.[standingSplit] || []) : fallbackStandings[standingSplit];

  const tabs: Array<{ id: TeamTab; nl: string; en: string }> = [
    { id: "overview", nl: "Overzicht", en: "Overview" },
    { id: "squad", nl: "Selectie & staf", en: "Squad & staff" },
    { id: "matches", nl: "Programma & uitslagen", en: "Fixtures & results" },
    { id: "standings", nl: "Stand", en: "Standings" },
    { id: "news", nl: "Teamnieuws", en: "Team news" },
  ];

  return (
    <main className="team-page" id="main-content">
      <SiteHeader locale={locale} languagePath={`/teams/${team.slug}?tab=${activeTab}${activeTab === "matches" ? `&type=${matchView}` : ""}`} />
      <Breadcrumbs locale={locale} items={[
        { label: "Teams", href: `${base}/teams` },
        { label: team.name },
      ]} />

      <section className="team-hero team-hero--compact">
        <div className="team-hero__image" aria-hidden="true" />
        <div className="team-hero__shade" aria-hidden="true" />
        <div className="team-hero__content">
          <p>{team.football[locale]}</p>
          <h1>{team.name}</h1>
          <div className="team-hero__meta">
            <span><small>{isNl ? "Competitie" : "Competition"}</small><strong>{team.competition}</strong></span>
            <span><small>{isNl ? "Training" : "Training"}</small><strong>{team.training[locale]}</strong></span>
          </div>
        </div>
        <aside className="team-hero-matches" aria-label={isNl ? "Laatste en volgende wedstrijd" : "Last and next match"}>
          {latestMatch && <article>
            <span>{isNl ? "Laatste wedstrijd" : "Last match"}</span>
            <div><strong>{teamName(latestMatch.home)}</strong><b>{matchScore(latestMatch)}</b><strong>{teamName(latestMatch.away)}</strong></div>
            <small>{formatDate(latestMatch.startsAt)} · {competitionLabel(latestMatch.competition)}</small>
          </article>}
          {nextMatch && <article className="is-next">
            <span>{isNl ? "Volgende wedstrijd" : "Next match"}</span>
            <div><strong>{teamName(nextMatch.home)}</strong><b>{matchScore(nextMatch)}</b><strong>{teamName(nextMatch.away)}</strong></div>
            <small>{formatDate(nextMatch.startsAt)} · {nextMatch.venue}</small>
          </article>}
        </aside>
        <div className="concept-badge">{team.dataOrigin === "sportlink" ? "Sportlink" : (isNl ? "Voorbeeldgegevens" : "Sample data")}</div>
      </section>

      <nav className="team-tabs" aria-label={isNl ? "Teamnavigatie" : "Team navigation"}>
        {tabs.map((tab) => (
          <button
            type="button"
            className={activeTab === tab.id ? "is-active" : ""}
            aria-pressed={activeTab === tab.id}
            onClick={() => setActiveTab(tab.id)}
            key={tab.id}
          >{isNl ? tab.nl : tab.en}</button>
        ))}
      </nav>

      {show("squad") && <section className="team-content-section team-squad" id="selectie">
        <div className="team-section-heading">
          <div><span className="section-kicker">{isNl ? "Het team" : "The team"}</span><h2>{isNl ? "Selectie & staf" : "Squad & staff"}</h2></div>
          <span className="team-section-note">{isNl ? "Voorbeeldweergave — namen volgen" : "Sample view — names to follow"}</span>
        </div>
        <div className="squad-grid">
          {squad.map((player) => (
            <article className="player-card" key={player.number}>
              <div className="player-card__portrait"><span>{player.number}</span></div>
              <div><small>{player.role[locale]}</small><h3>{player.name}</h3></div>
            </article>
          ))}
          <article className="staff-card">
            <span>{isNl ? "Technische staf" : "Technical staff"}</span>
            <div><small>{isNl ? "Hoofdtrainer" : "Head coach"}</small><strong>{isNl ? "Naam volgt" : "Name to follow"}</strong></div>
            <div><small>{isNl ? "Teammanager" : "Team manager"}</small><strong>{isNl ? "Naam volgt" : "Name to follow"}</strong></div>
          </article>
        </div>
      </section>}

      {show("matches") && <section className="team-content-section match-list-section" id="wedstrijden">
        <div className="team-section-heading">
          <div><span className="section-kicker">{isNl ? "Wedstrijdcentrum" : "Match centre"}</span><h2>{isNl ? "Programma & uitslagen" : "Fixtures & results"}</h2></div>
        </div>
        <div className="team-match-controls">
          <div className="segmented-filter" aria-label={isNl ? "Type wedstrijden" : "Match type"}>
            {(["fixtures", "results"] as MatchView[]).map((view) => <button aria-pressed={matchView === view} type="button" className={matchView === view ? "is-active" : ""} onClick={() => setMatchView(view)} key={view}>{view === "fixtures" ? (isNl ? "Programma" : "Fixtures") : (isNl ? "Uitslagen" : "Results")}</button>)}
          </div>
          <label><span>{isNl ? "Locatie" : "Location"}</span><select value={location} onChange={(event) => setLocation(event.target.value as LocationFilter)}><option value="all">{isNl ? "Thuis & uit" : "Home & away"}</option><option value="home">{isNl ? "Thuis" : "Home"}</option><option value="away">{isNl ? "Uit" : "Away"}</option></select></label>
          <label><span>{isNl ? "Wedstrijdtype" : "Competition"}</span><select value={competition} onChange={(event) => setCompetition(event.target.value as CompetitionFilter)}><option value="all">{competitionLabel("all")}</option><option value="league">{competitionLabel("league")}</option><option value="cup">{competitionLabel("cup")}</option><option value="friendly">{competitionLabel("friendly")}</option><option value="other">{competitionLabel("other")}</option></select></label>
        </div>
        <div className="team-match-list">
          {filteredMatches.map((match) => <article className={match.next ? "is-next" : ""} key={match.id}>
            <time>{formatDate(match.startsAt)}</time>
            <span>{competitionLabel(match.competition)}</span>
            <strong>{teamName(match.home)}</strong>
            <b>{matchScore(match)}</b>
            <strong>{teamName(match.away)}</strong>
            <em>{match.venue}</em>
            <a className="match-info-link" href={`${base}/teams/${team.slug}/matches/${match.id}`} aria-label={isNl ? `Wedstrijdinformatie ${teamName(match.home)} tegen ${teamName(match.away)}` : `Match information ${teamName(match.home)} versus ${teamName(match.away)}`}>i</a>
          </article>)}
          {filteredMatches.length === 0 && <div className="team-matches-empty">{isNl ? "Geen wedstrijden voor deze filters." : "No matches for these filters."}</div>}
        </div>
      </section>}

      {show("standings") && <section className="team-content-section standings-section" id="stand">
        <div className="team-section-heading">
          <div><span className="section-kicker">{team.competition}</span><h2>{isNl ? "Stand" : "Standings"}</h2></div>
          <span className="team-section-note">{isNl ? "Na 4 wedstrijden" : "After 4 matches"}</span>
        </div>
        <div className="standings-controls">
          <label><span>{isNl ? "Seizoen" : "Season"}</span><select value={season} onChange={(event) => setSeason(event.target.value)}><option value={team.season || "2026-2027"}>{(team.season || "2026-2027").replace("-", "–")}</option>{team.dataOrigin !== "sportlink" && <option value="2025-2026">2025–2026</option>}</select></label>
          <div className="segmented-filter" aria-label={isNl ? "Standweergave" : "Table split"}>
            {(["overall", "home", "away"] as StandingSplit[]).map((split) => <button aria-pressed={standingSplit === split} type="button" className={standingSplit === split ? "is-active" : ""} onClick={() => setStandingSplit(split)} key={split}>{split === "overall" ? (isNl ? "Totaal" : "Overall") : split === "home" ? (isNl ? "Thuis" : "Home") : (isNl ? "Uit" : "Away")}</button>)}
          </div>
        </div>
        <div className="standings-table" role="table" aria-label={isNl ? "Competitiestand" : "League standings"}>
          <div className="standings-row standings-row--head" role="row"><span>#</span><span>{isNl ? "Team" : "Team"}</span><span>GS</span><span>PT</span><span>DS</span></div>
          {activeStandings.map((row) => {
            const isRoodenburg = row.clubName.toLowerCase().includes("roodenburg");
            const cells = [row.position, isRoodenburg ? team.name : row.clubName, row.played, row.points, `${row.goalDifference > 0 ? "+" : ""}${row.goalDifference}`];
            return <div className={`standings-row ${isRoodenburg ? "is-roodenburg" : ""}`} role="row" key={`${row.position}-${row.clubName}`}>{cells.map((cell, index) => <span key={index}>{cell}</span>)}</div>;
          })}
        </div>
        {activeStandings.length === 0 && <p className="sample-season-note">{isNl ? "Er is nog geen officiële stand beschikbaar." : "Official standings are not available yet."}</p>}
        {season === "2025-2026" && <p className="sample-season-note">{isNl ? "Voorbeeldweergave voor het gekozen seizoen." : "Sample view for the selected season."}</p>}
      </section>}

      {show("news") && <section className="team-content-section team-news" id="nieuws">
        <div className="team-section-heading"><div><span className="section-kicker">{isNl ? "Van het team" : "From the team"}</span><h2>{isNl ? "Laatste berichten" : "Latest stories"}</h2></div></div>
        <div className="team-news-grid">
          <article><span>{isNl ? "Voorbereiding" : "Pre-season"}</span><h3>{isNl ? `${team.name} begint aan het nieuwe seizoen` : `${team.name} starts the new season`}</h3><a href={`${base}/sitemap#media`}>{isNl ? "Lees bericht" : "Read story"} →</a></article>
          <article><span>{isNl ? "Wedstrijdverslag" : "Match report"}</span><h3>{isNl ? "Sterke tweede helft levert oefenzege op" : "Strong second half secures friendly win"}</h3><a href={`${base}/sitemap#media`}>{isNl ? "Lees bericht" : "Read story"} →</a></article>
        </div>
      </section>}

      <footer className="team-footer"><a href={base}>L.V. Roodenburg</a><span>{t.footerText}</span><a href={`${base}/sitemap`}>{t.structure} →</a></footer>
    </main>
  );
}
