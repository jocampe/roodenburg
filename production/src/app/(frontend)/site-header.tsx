"use client";

import { useState } from "react";
import { clubTeams, copy, Locale, navMenus, TeamCategory } from "./site-data";

export type BreadcrumbItem = {
  label: string;
  href?: string;
};

function ClubCrest() {
  return (
    <img
      className="club-crest club-crest--compact"
      src="/roodenburg-crest.png"
      alt=""
      width="43"
      height="46"
    />
  );
}

function LanguageSwitch({ locale, path = "" }: { locale: Locale; path?: string }) {
  return (
    <div className="language-switch" aria-label="Language / Taal">
      <a href={`/nl${path}`} lang="nl" aria-current={locale === "nl" ? "page" : undefined}>NL</a>
      <span aria-hidden="true">/</span>
      <a href={`/en${path}`} lang="en" aria-current={locale === "en" ? "page" : undefined}>EN</a>
    </div>
  );
}

export function SiteHeader({ locale, languagePath = "" }: { locale: Locale; languagePath?: string }) {
  const t = copy[locale];
  const base = `/${locale}`;
  const [openDesktopMenu, setOpenDesktopMenu] = useState<string | null>(null);
  const [openMobileMenu, setOpenMobileMenu] = useState<string | null>(null);

  return (
    <header className="site-header">
      <a className="brand" href={base} aria-label={t.homeLabel}>
        <ClubCrest />
        <span>
          <strong>L.V. Roodenburg</strong>
          <small>{t.location}</small>
        </span>
      </a>

      <nav className="desktop-nav" aria-label={t.primaryNav}>
        {navMenus.map((menu, index) => (
          <details className="nav-item" key={menu.id} open={openDesktopMenu === menu.id}>
            <summary
              aria-expanded={openDesktopMenu === menu.id}
              onClick={(event) => {
                event.preventDefault();
                setOpenDesktopMenu((current) => current === menu.id ? null : menu.id);
              }}
            >
              {t.nav[index]} <span aria-hidden="true">⌄</span>
            </summary>
            <div className="nav-panel">
              <strong>{t.nav[index]}</strong>
              <div className="nav-panel__links">
                {menu.items.map((item) => {
                  const category = menu.id === "teams"
                    ? new URLSearchParams(item.href.split("?")[1] || "").get("category") as TeamCategory | null
                    : null;
                  const categoryTeams = category ? clubTeams.filter((team) => team.category === category) : [];

                  return categoryTeams.length > 0 ? (
                    <div className="nav-team-category" key={item.label.nl}>
                      <a href={`${base}${item.href}`}>{item.label[locale]} <span aria-hidden="true">⌄</span></a>
                      <div className="nav-team-flyout" aria-label={item.label[locale]}>
                        {categoryTeams.map((team) => (
                          <a href={`${base}/teams/${team.slug}`} key={team.slug}>{team.name}</a>
                        ))}
                      </div>
                    </div>
                  ) : <a href={`${base}${item.href}`} key={item.label.nl}>{item.label[locale]}</a>;
                })}
              </div>
              <a className="nav-panel__all" href={`${base}/sitemap`}>
                {t.structure} <span aria-hidden="true">→</span>
              </a>
            </div>
          </details>
        ))}
      </nav>

      <div className="header-tools">
        <LanguageSwitch locale={locale} path={languagePath} />
        <a className="account-link" href={`${base}/account`}>{t.login}</a>
      </div>

      <details className="mobile-menu">
        <summary aria-label={t.openMenu}><span /><span /></summary>
        <nav aria-label={t.mobileNav}>
          <LanguageSwitch locale={locale} path={languagePath} />
          <a className="mobile-account-link" href={`${base}/account`}>{t.login}</a>
          {navMenus.map((menu, index) => (
            <details className="mobile-nav-group" key={menu.id} open={openMobileMenu === menu.id}>
              <summary
                aria-expanded={openMobileMenu === menu.id}
                onClick={(event) => {
                  event.preventDefault();
                  setOpenMobileMenu((current) => current === menu.id ? null : menu.id);
                }}
              >
                {t.nav[index]} <span aria-hidden="true">+</span>
              </summary>
              <div>
                {menu.items.map((item) => {
                  const category = menu.id === "teams"
                    ? new URLSearchParams(item.href.split("?")[1] || "").get("category") as TeamCategory | null
                    : null;
                  const categoryTeams = category ? clubTeams.filter((team) => team.category === category) : [];

                  return categoryTeams.length > 0 ? (
                    <details className="mobile-team-category" key={item.label.nl}>
                      <summary>{item.label[locale]} <span aria-hidden="true">+</span></summary>
                      <div>
                        <a className="mobile-team-category__all" href={`${base}${item.href}`}>
                          {locale === "nl" ? `Alle ${item.label.nl.toLowerCase()}` : `All ${item.label.en.toLowerCase()}`}
                        </a>
                        {categoryTeams.map((team) => <a href={`${base}/teams/${team.slug}`} key={team.slug}>{team.name}</a>)}
                      </div>
                    </details>
                  ) : <a href={`${base}${item.href}`} key={item.label.nl}>{item.label[locale]}</a>;
                })}
              </div>
            </details>
          ))}
        </nav>
      </details>
    </header>
  );
}

export function Breadcrumbs({ locale, items }: { locale: Locale; items: BreadcrumbItem[] }) {
  const home = locale === "nl" ? "Home" : "Home";

  return (
    <nav className="breadcrumbs" aria-label={locale === "nl" ? "Kruimelpad" : "Breadcrumbs"}>
      <ol>
        <li><a href={`/${locale}`}>{home}</a></li>
        {items.map((item, index) => (
          <li key={`${item.label}-${index}`} aria-current={index === items.length - 1 ? "page" : undefined}>
            {item.href && index !== items.length - 1 ? <a href={item.href}>{item.label}</a> : <span>{item.label}</span>}
          </li>
        ))}
      </ol>
    </nav>
  );
}
