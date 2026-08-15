"use client";

import { useEffect, useMemo, useState } from "react";
import { clubTeams, copy, Locale, TeamCategory, teamGroups } from "./site-data";
import { Breadcrumbs, SiteHeader } from "./site-header";

type Filter = "all" | TeamCategory;

export function TeamsDirectory({ locale, initialFilter = "all" }: { locale: Locale; initialFilter?: Filter }) {
  const isNl = locale === "nl";
  const base = `/${locale}`;
  const t = copy[locale];
  const [filter, setFilter] = useState<Filter>(initialFilter);
  const [query, setQuery] = useState("");

  useEffect(() => {
    const category = new URLSearchParams(window.location.search).get("category") as TeamCategory | null;
    if (!category || !teamGroups.some((group) => group.id === category)) return;
    let active = true;
    queueMicrotask(() => active && setFilter(category));
    return () => { active = false; };
  }, []);

  const visibleTeams = useMemo(() => {
    const normalized = query.trim().toLocaleLowerCase(locale);
    return clubTeams.filter((team) => {
      const matchesCategory = filter === "all" || team.category === filter;
      const haystack = `${team.name} ${team.football[locale]} ${team.competition}`.toLocaleLowerCase(locale);
      return matchesCategory && (!normalized || haystack.includes(normalized));
    });
  }, [filter, locale, query]);

  const filters: Array<{ id: Filter; label: string }> = [
    { id: "all", label: isNl ? "Alle teams" : "All teams" },
    ...teamGroups.map((group) => ({ id: group.id as TeamCategory, label: group.title[locale] })),
  ];

  return (
    <main className="teams-page" id="main-content">
      <SiteHeader locale={locale} languagePath={`/teams${initialFilter === "all" ? "" : `?category=${initialFilter}`}`} />
      <Breadcrumbs locale={locale} items={[{ label: isNl ? "Teams" : "Teams" }]} />

      <section className="teams-directory-hero">
        <div>
          <span className="section-kicker">{isNl ? "Vind je team" : "Find your team"}</span>
          <h1>{isNl ? "Iedereen speelt mee." : "Everyone has a place."}</h1>
          <p>{isNl
            ? "Van de ukken tot de senioren, op het veld en in de zaal. Zoek direct op teamnaam of kies een categorie."
            : "From first-time players to senior football, outdoors and indoors. Search by team name or choose a category."}</p>
        </div>
        <div className="teams-directory-hero__count">
          <strong>{clubTeams.length}</strong>
          <span>{isNl ? "teams in dit concept" : "teams in this concept"}</span>
        </div>
        <div className="concept-badge">{isNl ? "Voorbeeldgegevens" : "Sample data"}</div>
      </section>

      <section className="team-finder" aria-labelledby="team-finder-title">
        <div className="team-finder__controls">
          <div>
            <span className="section-kicker">{isNl ? "Teamoverzicht" : "Team directory"}</span>
            <h2 id="team-finder-title">{isNl ? "Kies je elftal." : "Choose your side."}</h2>
          </div>
          <label className="team-search">
            <span>{isNl ? "Zoeken" : "Search"}</span>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder={isNl ? "Bijv. JO15 of Zaal" : "E.g. JO15 or Indoor"}
            />
          </label>
        </div>

        <div className="team-filter" role="group" aria-label={isNl ? "Filter teams" : "Filter teams"}>
          {filters.map((item) => (
            <button
              type="button"
              className={filter === item.id ? "is-active" : ""}
              aria-pressed={filter === item.id}
              onClick={() => setFilter(item.id)}
              key={item.id}
            >
              {item.label}
              <span>{item.id === "all" ? clubTeams.length : clubTeams.filter((team) => team.category === item.id).length}</span>
            </button>
          ))}
        </div>

        <div className="team-directory-grid" aria-live="polite">
          {visibleTeams.map((team, index) => (
            <a className={`team-directory-card ${team.featured ? "is-featured" : ""}`} href={`${base}/teams/${team.slug}`} key={team.slug}>
              <div className="team-directory-card__top">
                <span>{String(index + 1).padStart(2, "0")}</span>
                {team.featured && <em>{isNl ? "Uitgelicht" : "Featured"}</em>}
              </div>
              <div>
                <small>{team.football[locale]}</small>
                <h3>{team.name}</h3>
              </div>
              <dl>
                <div><dt>{isNl ? "Competitie" : "Competition"}</dt><dd>{team.competition}</dd></div>
                <div><dt>{isNl ? "Training" : "Training"}</dt><dd>{team.training[locale]}</dd></div>
              </dl>
              <span className="team-directory-card__arrow" aria-hidden="true">→</span>
            </a>
          ))}
          {visibleTeams.length === 0 && (
            <div className="team-finder__empty">
              <strong>{isNl ? "Geen team gevonden" : "No team found"}</strong>
              <span>{isNl ? "Probeer een andere zoekterm of bekijk alle teams." : "Try another search or view all teams."}</span>
              <button type="button" onClick={() => { setFilter("all"); setQuery(""); }}>
                {isNl ? "Wis filters" : "Clear filters"}
              </button>
            </div>
          )}
        </div>
      </section>

      <section className="team-directory-note">
        <span>{isNl ? "Van concept naar live" : "From concept to live"}</span>
        <p>{isNl
          ? "Teamnamen, indelingen en trainingstijden worden later uit de officiële clubadministratie gevuld. Iedere kaart gebruikt alvast hetzelfde herbruikbare teampagina-model."
          : "Team names, classifications and training times will later come from the official club administration. Every card already uses the same reusable team-page model."}</p>
      </section>

      <footer className="team-footer"><a href={base}>L.V. Roodenburg</a><span>{t.footerText}</span><a href={`${base}/sitemap`}>{t.structure} →</a></footer>
    </main>
  );
}
