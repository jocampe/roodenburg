"use client";

import { useEffect, useState } from "react";
import { ContentFooter } from "./content-footer";
import { newsPosts as fallbackNewsPosts, Locale, NewsPost } from "./site-data";
import { Breadcrumbs, SiteHeader } from "./site-header";

type MediaSection = "news" | "calendar" | "reports" | "media" | "archive";
const validSections: MediaSection[] = ["news", "calendar", "reports", "media", "archive"];

const labels = {
  news: { nl: "Nieuws", en: "News" },
  calendar: { nl: "Agenda", en: "Calendar" },
  reports: { nl: "Wedstrijdverslagen", en: "Match reports" },
  media: { nl: "Foto & video", en: "Photo & video" },
  archive: { nl: "Clubarchief", en: "Club archive" },
} as const;

export function NewsMediaPage({ locale, initialSection = "news", posts = fallbackNewsPosts }: { locale: Locale; initialSection?: MediaSection; posts?: readonly NewsPost[] }) {
  const isNl = locale === "nl";
  const base = `/${locale}`;
  const [activeSection, setActiveSection] = useState<MediaSection>(validSections.includes(initialSection) ? initialSection : "news");

  useEffect(() => {
    const requested = new URLSearchParams(window.location.search).get("section") as MediaSection | null;
    if (requested && validSections.includes(requested)) setActiveSection(requested);
  }, []);

  const selectSection = (section: MediaSection) => {
    setActiveSection(section);
    window.history.replaceState({}, "", section === "news" ? `${base}/news` : `${base}/news?section=${section}`);
  };

  return (
    <main className="content-page" id="main-content">
      <SiteHeader locale={locale} languagePath={`/news${activeSection === "news" ? "" : `?section=${activeSection}`}`} />
      <Breadcrumbs locale={locale} items={[{ label: isNl ? "Nieuws & media" : "News & media" }]} />
      <section className="subpage-hero-compact content-hero">
        <div>
          <span className="section-kicker">L.V. Roodenburg</span>
          <h1>{isNl ? "Nieuws & media" : "News & media"}</h1>
          <p>{isNl ? "Alles wat er speelt binnen de teams, de club en Sportpark Noord." : "Everything happening across the teams, the club and Sportpark Noord."}</p>
        </div>
      </section>

      <nav className="content-tabs" aria-label={isNl ? "Nieuwsfilter" : "News filter"}>
        {validSections.map((section) => (
          <button aria-pressed={activeSection === section} className={activeSection === section ? "is-active" : ""} key={section} onClick={() => selectSection(section)}>
            {labels[section][locale]}
          </button>
        ))}
      </nav>

      {activeSection === "news" && <section className="content-body">
        <div className="content-heading"><span className="section-kicker">{isNl ? "Laatste berichten" : "Latest updates"}</span><h2>{isNl ? "Wat er speelt." : "What’s happening."}</h2></div>
        <div className="news-archive-grid">
          {posts.filter((item) => item.kind === "news").map((item, index) => (
            <article className="archive-card" key={item.title.nl}>
              <div className={`archive-card__visual archive-card__visual--${(index % 3) + 1}`}><span>0{index + 1}</span></div>
              <div><p><span>{item.category[locale]}</span>{item.date[locale]}</p><h3>{item.title[locale]}</h3><a href={`${base}/news/${item.slug}`}>{isNl ? "Lees bericht" : "Read article"} <span>→</span></a></div>
            </article>
          ))}
        </div>
      </section>}

      {activeSection === "calendar" && <section className="content-body">
        <div className="content-heading"><span className="section-kicker">{isNl ? "Clubagenda" : "Club calendar"}</span><h2>{isNl ? "Op de planning." : "Coming up."}</h2></div>
        <div className="agenda-list">
          {[
            ["29", "AUG", isNl ? "Start competitieprogramma" : "Competition programme starts", isNl ? "Sportpark Noord · hele dag" : "Sportpark Noord · all day"],
            ["05", "SEP", isNl ? "Open jeugdtraining" : "Open youth training", "10:00 · Veld 2"],
            ["12", "SEP", isNl ? "Vrijwilligersavond" : "Volunteer evening", "19:30 · Clubhuis"],
            ["26", "SEP", isNl ? "Roodenburg familiedag" : "Roodenburg family day", isNl ? "Vanaf 11:00" : "From 11:00"],
          ].map(([day, month, title, detail]) => <article key={title}><time><b>{day}</b><span>{month}</span></time><div><h3>{title}</h3><p>{detail}</p></div><span aria-hidden="true">→</span></article>)}
        </div>
      </section>}

      {activeSection === "reports" && <section className="content-body">
        <div className="content-heading"><span className="section-kicker">{isNl ? "Langs de lijn" : "From the touchline"}</span><h2>{isNl ? "Wedstrijdverslagen." : "Match reports."}</h2></div>
        <div className="report-grid">
          {posts.filter((item) => item.kind === "report").map((item) => <article key={item.slug}><span>{item.category[locale]} · {item.date[locale]}</span><h3>{item.title[locale]}</h3><p>{item.intro[locale]}</p><a href={`${base}/news/${item.slug}`}>{isNl ? "Bekijk verslag" : "View report"} <span>→</span></a></article>)}
        </div>
      </section>}

      {activeSection === "media" && <section className="content-body media-body">
        <div className="content-heading"><span className="section-kicker">{isNl ? "Beeldbank" : "Media library"}</span><h2>{isNl ? "Roodenburg in beeld." : "Roodenburg in pictures."}</h2></div>
        <div className="media-gallery">
          <figure><img src="/gallery-match.webp" alt={isNl ? "Wedstrijd bij Roodenburg" : "Match at Roodenburg"} /><figcaption>{isNl ? "Wedstrijddag" : "Matchday"}</figcaption></figure>
          <figure><img src="/gallery-youth.webp" alt={isNl ? "Jeugdtraining" : "Youth training"} /><figcaption>{isNl ? "Jeugd" : "Youth"}</figcaption></figure>
          <figure><img src="/gallery-club.webp" alt={isNl ? "Clubleven" : "Club life"} /><figcaption>{isNl ? "De vereniging" : "The community"}</figcaption></figure>
        </div>
      </section>}

      {activeSection === "archive" && <section className="content-body archive-body">
        <div className="content-heading"><span className="section-kicker">1927 — nu</span><h2>{isNl ? "Ons clubarchief." : "Our club archive."}</h2></div>
        <div className="archive-timeline">
          {["1927", "1977", "2022", "2027"].map((year, index) => <article key={year}><strong>{year}</strong><div><h3>{[isNl ? "De oprichting" : "The foundation", isNl ? "Vijftig jaar Roodenburg" : "Fifty years of Roodenburg", isNl ? "95-jarig jubileum" : "95th anniversary", isNl ? "Op naar honderd jaar" : "Heading for one hundred"][index]}</h3><p>{isNl ? "Foto’s, verhalen en documenten krijgen hier een vaste plek." : "Photos, stories and documents will have a permanent home here."}</p></div></article>)}
        </div>
      </section>}

      <section className="sample-content-note"><strong>{isNl ? "CMS-koppeling actief" : "CMS connection active"}</strong><p>{isNl ? "Gepubliceerde berichten komen uit het CMS. De goedgekeurde voorbeeldberichten blijven beschikbaar totdat de redactie de eerste inhoud publiceert." : "Published stories come from the CMS. The approved sample stories remain available until editors publish the first content."}</p></section>
      <ContentFooter locale={locale} />
    </main>
  );
}
