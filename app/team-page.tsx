"use client";

import { useEffect, useMemo, useState } from "react";
import { ClubTeam, clubTeams, copy, Locale } from "./site-data";
import { Breadcrumbs, SiteHeader } from "./site-header";

type TeamTab = "overview" | "squad" | "matches" | "standings" | "news";
type MatchView = "fixtures" | "results";
type LocationFilter = "all" | "home" | "away";
type CompetitionFilter = "all" | "league" | "cup" | "friendly";
type StandingSplit = "overall" | "home" | "away";

const squad = [
  { number: "01", name: "Doelman", role: { nl: "Keeper", en: "Goalkeeper" } },
  { number: "04", name: "Verdediger", role: { nl: "Verdediging", en: "Defence" } },
  { number: "08", name: "Middenvelder", role: { nl: "Middenveld", en: "Midfield" } },
  { number: "10", name: "Aanvaller", role: { nl: "Aanval", en: "Attack" } },
];

const matches = [
  { id: "roodenburg-lsvv-22-aug", date: "22 AUG", kind: "results" as const, competition: "friendly" as const, location: "home" as const, home: "TEAM", away: "LSVV ’70 1", score: "3 — 1", venue: "Sportpark Noord" },
  { id: "roodenburg-voorschoten-29-aug", date: "29 AUG", kind: "fixtures" as const, competition: "league" as const, location: "home" as const, home: "TEAM", away: "Voorschoten ’97 1", score: "14:30", venue: "Sportpark Noord", next: true },
  { id: "sporting-leiden-roodenburg-05-sep", date: "05 SEP", kind: "fixtures" as const, competition: "league" as const, location: "away" as const, home: "Sporting Leiden 1", away: "TEAM", score: "14:30", venue: "Sportpark Boshuizerkade" },
  { id: "roodenburg-foreholte-12-sep", date: "12 SEP", kind: "fixtures" as const, competition: "cup" as const, location: "home" as const, home: "TEAM", away: "Foreholte 1", score: "15:00", venue: "Sportpark Noord" },
  { id: "doocos-roodenburg-15-aug", date: "15 AUG", kind: "results" as const, competition: "friendly" as const, location: "away" as const, home: "DoCoS 1", away: "TEAM", score: "2 — 2", venue: "Sportpark Morskwartier" },
];

const standings: Record<StandingSplit, string[][]> = {
  overall: [
    ["1", "Roodenburg 1", "4", "10", "+7"],
    ["2", "Voorschoten ’97 1", "4", "9", "+5"],
    ["3", "LSVV ’70 1", "4", "7", "+2"],
    ["4", "Sporting Leiden 1", "4", "6", "+1"],
    ["5", "FC Oegstgeest 1", "4", "4", "−3"],
  ],
  home: [
    ["1", "Roodenburg 1", "2", "6", "+5"],
    ["2", "Voorschoten ’97 1", "2", "6", "+4"],
    ["3", "Sporting Leiden 1", "2", "4", "+2"],
    ["4", "LSVV ’70 1", "2", "3", "0"],
    ["5", "FC Oegstgeest 1", "2", "1", "−2"],
  ],
  away: [
    ["1", "Voorschoten ’97 1", "2", "3", "+1"],
    ["2", "Roodenburg 1", "2", "4", "+2"],
    ["3", "LSVV ’70 1", "2", "4", "+2"],
    ["4", "Sporting Leiden 1", "2", "2", "−1"],
    ["5", "FC Oegstgeest 1", "2", "3", "−1"],
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
  const [season, setSeason] = useState("2026-2027");
  const [standingSplit, setStandingSplit] = useState<StandingSplit>("overall");

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const requestedTab = params.get("tab") as TeamTab | null;
    if (requestedTab && validTabs.includes(requestedTab)) setActiveTab(requestedTab);
    if (params.get("type") === "results") setMatchView("results");
  }, []);

  const filteredMatches = useMemo(() => matches.filter((match) =>
    match.kind === matchView &&
    (location === "all" || match.location === location) &&
    (competition === "all" || match.competition === competition)
  ), [competition, location, matchView]);

  const show = (tab: Exclude<TeamTab, "overview">) => activeTab === "overview" || activeTab === tab;
  const teamName = (value: string) => value === "TEAM" ? team.name : value;
  const competitionLabel = (value: CompetitionFilter) => ({
    all: isNl ? "Alle competities" : "All competitions",
    league: isNl ? "Competitie" : "League",
    cup: isNl ? "Beker" : "Cup",
    friendly: isNl ? "Oefenwedstrijd" : "Friendly",
  })[value];

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
          <article>
            <span>{isNl ? "Laatste wedstrijd" : "Last match"}</span>
            <div><strong>{team.name}</strong><b>3 — 1</b><strong>LSVV ’70 1</strong></div>
            <small>22 AUG · {isNl ? "Oefenwedstrijd" : "Friendly"}</small>
          </article>
          <article className="is-next">
            <span>{isNl ? "Volgende wedstrijd" : "Next match"}</span>
            <div><strong>{team.name}</strong><b>14:30</b><strong>Voorschoten ’97 1</strong></div>
            <small>29 AUG · Sportpark Noord</small>
          </article>
        </aside>
        <div className="concept-badge">{isNl ? "Voorbeeldgegevens" : "Sample data"}</div>
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
          <label><span>{isNl ? "Wedstrijdtype" : "Competition"}</span><select value={competition} onChange={(event) => setCompetition(event.target.value as CompetitionFilter)}><option value="all">{competitionLabel("all")}</option><option value="league">{competitionLabel("league")}</option><option value="cup">{competitionLabel("cup")}</option><option value="friendly">{competitionLabel("friendly")}</option></select></label>
        </div>
        <div className="team-match-list">
          {filteredMatches.map((match) => <article className={match.next ? "is-next" : ""} key={match.id}>
            <time>{match.date}</time>
            <span>{competitionLabel(match.competition)}</span>
            <strong>{teamName(match.home)}</strong>
            <b>{match.score}</b>
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
          <label><span>{isNl ? "Seizoen" : "Season"}</span><select value={season} onChange={(event) => setSeason(event.target.value)}><option value="2026-2027">2026–2027</option><option value="2025-2026">2025–2026</option></select></label>
          <div className="segmented-filter" aria-label={isNl ? "Standweergave" : "Table split"}>
            {(["overall", "home", "away"] as StandingSplit[]).map((split) => <button aria-pressed={standingSplit === split} type="button" className={standingSplit === split ? "is-active" : ""} onClick={() => setStandingSplit(split)} key={split}>{split === "overall" ? (isNl ? "Totaal" : "Overall") : split === "home" ? (isNl ? "Thuis" : "Home") : (isNl ? "Uit" : "Away")}</button>)}
          </div>
        </div>
        <div className="standings-table" role="table" aria-label={isNl ? "Competitiestand" : "League standings"}>
          <div className="standings-row standings-row--head" role="row"><span>#</span><span>{isNl ? "Team" : "Team"}</span><span>GS</span><span>PT</span><span>DS</span></div>
          {standings[standingSplit].map((row) => {
            const cells = row[1] === "Roodenburg 1" ? [row[0], team.name, ...row.slice(2)] : row;
            return <div className={`standings-row ${row[1] === "Roodenburg 1" ? "is-roodenburg" : ""}`} role="row" key={row[1]}>{cells.map((cell, index) => <span key={index}>{cell}</span>)}</div>;
          })}
        </div>
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
