import { copy, Locale, newsItems, teamGroups } from "./site-data";
import { SiteHeader } from "./site-header";

const Arrow = () => <span aria-hidden="true">↗</span>;

function ClubCrest({ compact = false }: { compact?: boolean }) {
  return (
    <img
      className={`club-crest ${compact ? "club-crest--compact" : ""}`}
      src="/roodenburg-crest.png"
      alt=""
      width={compact ? 43 : 125}
      height={compact ? 46 : 132}
    />
  );
}

export function HomePage({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const base = `/${locale}`;
  const isNl = locale === "nl";

  return (
    <main id="main-content">
      <SiteHeader locale={locale} />

      <section className="hero" id="top">
        <div className="hero__shade" aria-hidden="true" />
        <div className="hero__identity">
          <span>{t.since}</span>
          <h1>L.V. Roodenburg</h1>
        </div>

        <div className="match-centre" id="wedstrijden">
          <article className="match-summary match-summary--result">
            <header><span>{t.latestMatch}</span><strong>ZA · 22 AUG</strong></header>
            <div className="result-line">
              <div><strong>Roodenburg 1</strong><small>{t.home}</small></div>
              <b>3</b><span>—</span><b>1</b>
              <div><strong>LSVV ’70 1</strong><small>{t.away}</small></div>
            </div>
            <small className="competition-label">{t.friendly} · Sportpark Noord</small>
          </article>

          <article className="match-summary match-summary--next">
            <header><span>{t.nextFixture}</span><strong>ZA · 29 AUG</strong></header>
            <div className="fixture-line">
              <div><strong>Roodenburg 1</strong><small>{t.home}</small></div>
              <div className="fixture-time"><b>14:30</b><span>Sportpark Noord</span></div>
              <div><strong>Voorschoten ’97 1</strong><small>{t.away}</small></div>
            </div>
          </article>

          <a className="match-centre__link" href={`${base}/teams/zaterdag-1/matches/roodenburg-voorschoten-29-aug`}>
            {t.matchCentre} <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      <section className="quick-strip" aria-label={isNl ? "Snel naar" : "Quick links"}>
        <p><span>{isNl ? "Snel naar" : "Quick links"}</span></p>
        <div>
          <a href={`${base}/teams/zaterdag-1?tab=matches&type=fixtures`}>{t.program} <span>→</span></a>
          <a href={`${base}/teams/zaterdag-1?tab=matches&type=results`}>{isNl ? "Uitslagen" : "Results"} <span>→</span></a>
          <a href={`${base}/club?section=contact`}>{t.contact} <span>→</span></a>
        </div>
      </section>

      <section className="section news-section" id="nieuws">
        <div className="section-heading">
          <div><span className="section-kicker">{t.newsEyebrow}</span><h2>{t.newsTitle}</h2></div>
          <a className="section-link" href={`${base}/news`}>{t.allNews} <span>→</span></a>
        </div>
        <div className="news-grid">
          {newsItems.map((item, index) => (
            <article className={`news-card news-card--${index + 1}`} key={item.title.nl}>
              <div className="news-card__visual" aria-hidden="true"><span>0{index + 1}</span></div>
              <div className="news-card__copy">
                <p><span>{item.category[locale]}</span>{item.date[locale]}</p>
                <h3>{item.title[locale]}</h3>
                <a href={`${base}/news/${item.slug}`} aria-label={`${item.title[locale]} — ${t.concept}`}>→</a>
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="section teams-section" id="teams">
        <div className="teams-intro">
          <span className="section-kicker">{t.teamEyebrow}</span>
          <h2>{t.teamTitle}</h2>
          <p>{t.teamIntro}</p>
          <a className="button button--dark" href={`${base}/teams`}>{t.viewTeams} <Arrow /></a>
        </div>
        <div className="team-groups">
          {teamGroups.map((group, index) => (
            <a href={`${base}/teams?category=${group.id}`} className="team-group" key={group.id}>
              <span>0{index + 1}</span>
              <div><h3>{group.title[locale]}</h3><p>{group.description[locale]}</p></div>
              <strong aria-hidden="true">→</strong>
            </a>
          ))}
        </div>
      </section>

      <section className="section gallery-section" aria-labelledby="gallery-title">
        <div className="section-heading gallery-heading">
          <div>
            <span className="section-kicker">{isNl ? "Langs de lijn" : "Around the club"}</span>
            <h2 id="gallery-title">{isNl ? "Dit is Roodenburg." : "This is Roodenburg."}</h2>
          </div>
          <a className="section-link section-link--light" href={`${base}/news?section=media`}>
            {isNl ? "Bekijk alle foto’s" : "View all photos"} <span>→</span>
          </a>
        </div>
        <div className="gallery-grid">
          <a className="gallery-tile gallery-tile--match" href={`${base}/news?section=media`}>
            <img src="/gallery-match.webp" alt={isNl ? "Voetbalwedstrijd bij Roodenburg" : "Football match at Roodenburg"} />
            <span>{isNl ? "Wedstrijddag" : "Matchday"}</span>
          </a>
          <a className="gallery-tile gallery-tile--youth" href={`${base}/news?section=media`}>
            <img src="/gallery-youth.webp" alt={isNl ? "Jeugdtraining bij Roodenburg" : "Youth training at Roodenburg"} />
            <span>{isNl ? "De jeugd" : "Youth football"}</span>
          </a>
          <a className="gallery-tile gallery-tile--club" href={`${base}/club?section=community`}>
            <img src="/gallery-club.webp" alt={isNl ? "Clubleden langs het veld" : "Club members beside the pitch"} />
            <span>{isNl ? "De vereniging" : "The community"}</span>
          </a>
        </div>
      </section>

      <footer className="site-footer">
        <div className="footer-brand"><ClubCrest compact /><div><strong>L.V. Roodenburg</strong><span>{t.footerText}</span></div></div>
        <nav aria-label="Footer">
          <a href={`${base}/sitemap`}>{t.structure}</a>
          <a href={`${base}/membership`}>{isNl ? "Lidmaatschap" : "Membership"}</a>
          <a href={`${base}/club?section=privacy`}>{t.privacy}</a>
          <a href={`${base}/account`}>{t.login}</a>
        </nav>
        <div className="language-switch" aria-label="Language / Taal">
          <a href="/nl" lang="nl" aria-current={locale === "nl" ? "page" : undefined}>NL</a>
          <span aria-hidden="true">/</span>
          <a href="/en" lang="en" aria-current={locale === "en" ? "page" : undefined}>EN</a>
        </div>
      </footer>
    </main>
  );
}
