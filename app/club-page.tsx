"use client";

import { useEffect, useState } from "react";
import { ContentFooter } from "./content-footer";
import { Locale } from "./site-data";
import { Breadcrumbs, SiteHeader } from "./site-header";

type ClubSection = "about" | "history" | "organisation" | "sportpark" | "volunteers" | "community" | "sponsors" | "contact" | "privacy";
const validSections: ClubSection[] = ["about", "history", "organisation", "sportpark", "volunteers", "community", "sponsors", "contact", "privacy"];
const labels = {
  about: { nl: "Over ons", en: "About us" }, sportpark: { nl: "Sportpark", en: "Sportpark" },
  history: { nl: "Historie", en: "History" }, organisation: { nl: "Organisatie", en: "Organisation" },
  volunteers: { nl: "Vrijwilligers", en: "Volunteers" }, community: { nl: "Club & buurt", en: "Club & community" },
  sponsors: { nl: "Sponsoren", en: "Sponsors" },
  contact: { nl: "Contact", en: "Contact" }, privacy: { nl: "Privacy", en: "Privacy" },
} as const;

export function ClubPage({ locale, initialSection = "about", initialTopic = "general" }: { locale: Locale; initialSection?: ClubSection; initialTopic?: string }) {
  const isNl = locale === "nl";
  const base = `/${locale}`;
  const [activeSection, setActiveSection] = useState<ClubSection>(validSections.includes(initialSection) ? initialSection : "about");
  const [contactTopic, setContactTopic] = useState(initialTopic);
  const [formSent, setFormSent] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(window.location.search);
    const requested = query.get("section") as ClubSection | null;
    const requestedTopic = query.get("topic");
    if ((!requested || !validSections.includes(requested)) && !requestedTopic) return;
    let active = true;
    queueMicrotask(() => {
      if (!active) return;
      if (requested && validSections.includes(requested)) setActiveSection(requested);
      if (requestedTopic) setContactTopic(requestedTopic);
    });
    return () => { active = false; };
  }, []);

  const selectSection = (section: ClubSection) => {
    setActiveSection(section);
    window.history.replaceState({}, "", section === "about" ? `${base}/club` : `${base}/club?section=${section}`);
  };

  return <main className="content-page" id="main-content">
    <SiteHeader locale={locale} languagePath={`/club${activeSection === "about" ? "" : `?section=${activeSection}${activeSection === "contact" && contactTopic !== "general" ? `&topic=${contactTopic}` : ""}`}`} />
    <Breadcrumbs locale={locale} items={[{ label: isNl ? "De club" : "The club" }]} />
    <section className="subpage-hero-compact content-hero content-hero--club"><div><span className="section-kicker">Sinds 1927</span><h1>{isNl ? "De club" : "The club"}</h1><p>{isNl ? "Voetbal, ontwikkeling en verbinding in Leiden-Noord." : "Football, development and connection in Leiden-Noord."}</p></div></section>
    <nav className="content-tabs" aria-label={isNl ? "Clubonderwerpen" : "Club topics"}>{validSections.map((section) => <button aria-pressed={activeSection === section} className={activeSection === section ? "is-active" : ""} key={section} onClick={() => selectSection(section)}>{labels[section][locale]}</button>)}</nav>

    {activeSection === "about" && <section className="content-body club-story"><div className="content-heading"><span className="section-kicker">{isNl ? "Onze vereniging" : "Our club"}</span><h2>{isNl ? "Thuis in Leiden-Noord." : "At home in Leiden-Noord."}</h2></div><div className="story-grid"><article className="story-lead"><p>{isNl ? "L.V. Roodenburg is sinds 1927 een ontmoetingsplek waar prestatief en recreatief voetbal samenkomen. De club bouwt op jeugd, vrijwilligers en een sterke band met de buurt." : "Since 1927, L.V. Roodenburg has been a meeting place where competitive and recreational football come together. The club is built on youth, volunteers and a strong connection with the neighbourhood."}</p></article><div className="value-grid"><article><span>01</span><h3>{isNl ? "Samen" : "Together"}</h3><p>{isNl ? "Iedereen draagt bij aan een veilige en gastvrije club." : "Everyone contributes to a safe and welcoming club."}</p></article><article><span>02</span><h3>{isNl ? "Ontwikkelen" : "Develop"}</h3><p>{isNl ? "Spelers en vrijwilligers krijgen ruimte om te groeien." : "Players and volunteers get room to grow."}</p></article><article><span>03</span><h3>{isNl ? "Respect" : "Respect"}</h3><p>{isNl ? "Op en naast het veld behandelen we elkaar met respect." : "On and off the pitch, we treat each other with respect."}</p></article><article><span>04</span><h3>{isNl ? "Plezier" : "Enjoyment"}</h3><p>{isNl ? "Voetbalplezier is de basis van de vereniging." : "Enjoying football is the foundation of the club."}</p></article></div></div></section>}

    {activeSection === "history" && <section className="content-body history-section">
      <div className="content-heading"><span className="section-kicker">1927 — 2027</span><h2>{isNl ? "Bijna honderd jaar Roodenburg." : "Almost one hundred years of Roodenburg."}</h2></div>
      <div className="history-intro"><p>{isNl ? "De historie van Roodenburg is verweven met Leiden-Noord. Deze tijdlijn brengt jubileumverhalen, elftalfoto’s en herinneringen straks samen in één doorlopend clubverhaal." : "Roodenburg’s history is interwoven with Leiden-Noord. This timeline will bring anniversary stories, team photos and memories together in one continuous club story."}</p><strong>100</strong></div>
      <div className="history-timeline">
        {[
          ["1927", isNl ? "De oprichting" : "The foundation", isNl ? "Het begin van de vereniging en haar plek in Leiden-Noord." : "The beginning of the club and its place in Leiden-Noord."],
          ["1977", isNl ? "Vijftig jaar" : "Fifty years", isNl ? "Een halve eeuw voetbal, vrijwilligers en verenigingsleven." : "Half a century of football, volunteers and club life."],
          ["2022", isNl ? "95-jarig jubileum" : "95th anniversary", isNl ? "Verhalen en beelden uit verschillende generaties komen samen." : "Stories and images from different generations come together."],
          ["2027", isNl ? "Op naar honderd" : "Heading for one hundred", isNl ? "Een nieuw hoofdstuk met respect voor de geschiedenis." : "A new chapter that respects the club’s history."],
        ].map(([year, title, text]) => <article key={year}><time>{year}</time><div><h3>{title}</h3><p>{text}</p></div></article>)}
      </div>
      <a className="history-archive-link" href={`${base}/news?section=archive`}>{isNl ? "Bekijk het clubarchief" : "View the club archive"} <span>→</span></a>
    </section>}

    {activeSection === "organisation" && <section className="content-body organisation-section">
      <div className="content-heading"><span className="section-kicker">{isNl ? "Achter de club" : "Behind the club"}</span><h2>{isNl ? "Zo is Roodenburg georganiseerd." : "How Roodenburg is organised."}</h2></div>
      <div className="organisation-grid">
        {[
          ["01", isNl ? "Bestuur" : "Board", isNl ? "Koers, beleid en algemene verenigingszaken." : "Direction, policy and general club matters."],
          ["02", isNl ? "Voetbalzaken" : "Football operations", isNl ? "Senioren, wedstrijdzaken en technische organisatie." : "Senior teams, match operations and technical organisation."],
          ["03", isNl ? "Jeugdcommissie" : "Youth committee", isNl ? "Jeugdteams, begeleiding en ontwikkeling." : "Youth teams, support and development."],
          ["04", isNl ? "Accommodatie" : "Facilities", isNl ? "Velden, clubhuis, materiaal en onderhoud." : "Pitches, clubhouse, equipment and maintenance."],
          ["05", isNl ? "Communicatie" : "Communications", isNl ? "Website, nieuws, media en clubinformatie." : "Website, news, media and club information."],
          ["06", isNl ? "Commercie" : "Commercial", isNl ? "Sponsoring, partners en lokale samenwerking." : "Sponsorship, partners and local collaboration."],
        ].map(([number, title, text]) => <article key={number}><span>{number}</span><h3>{title}</h3><p>{text}</p><a href={`${base}/club?section=contact&topic=organisation`}>{isNl ? "Neem contact op" : "Get in touch"} →</a></article>)}
      </div>
      <div className="organisation-opportunities"><div><span className="section-kicker">{isNl ? "Meedoen" : "Get involved"}</span><h3>{isNl ? "Vacatures, stages en clubrollen" : "Vacancies, internships and club roles"}</h3></div><p>{isNl ? "Open rollen en stageplaatsen kunnen hier als beheersbare berichten worden gepubliceerd." : "Open roles and internships can be published here as manageable posts."}</p></div>
    </section>}

    {activeSection === "sportpark" && <section className="content-body"><div className="content-heading"><span className="section-kicker">Leiden-Noord</span><h2>Sportpark Noord.</h2></div><div className="location-grid"><article className="location-card"><span>{isNl ? "Bezoekadres" : "Visitor address"}</span><h3>Sportpark Noord</h3><p>Obrechtstraat 4<br />2324 VH Leiden</p><a href="https://www.openstreetmap.org/search?query=Sportpark%20Noord%20Leiden" target="_blank" rel="noreferrer">{isNl ? "Open route" : "Open directions"} <span>↗</span></a></article><article><span>{isNl ? "Op het complex" : "At the ground"}</span><ul><li>{isNl ? "Wedstrijd- en trainingsvelden" : "Match and training pitches"}</li><li>{isNl ? "Clubhuis en bestuurskamer" : "Clubhouse and boardroom"}</li><li>{isNl ? "Kleedkamers" : "Changing rooms"}</li><li>{isNl ? "Fiets- en autoparkeren" : "Bicycle and car parking"}</li></ul></article></div></section>}

    {activeSection === "volunteers" && <section className="content-body"><div className="content-heading"><span className="section-kicker">{isNl ? "Samen maken we de club" : "Together we make the club"}</span><h2>{isNl ? "Doe mee als vrijwilliger." : "Join as a volunteer."}</h2></div><div className="opportunity-grid">{[[isNl ? "Wedstrijddagen" : "Matchdays", isNl ? "Ontvangst, vervoer, kantine en wedstrijdzaken." : "Welcome desk, transport, canteen and match operations."],[isNl ? "Teams" : "Teams", isNl ? "Trainers, leiders en ondersteuning rond het veld." : "Coaches, team managers and pitch-side support."],[isNl ? "Cluborganisatie" : "Club operations", isNl ? "Communicatie, evenementen, onderhoud en bestuur." : "Communications, events, maintenance and governance."]].map(([title, text], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p><a href={`${base}/club?section=contact&topic=volunteering`}>{isNl ? "Neem contact op" : "Get in touch"} →</a></article>)}</div></section>}

    {activeSection === "community" && <section className="content-body"><div className="content-heading"><span className="section-kicker">{isNl ? "Meer dan voetbal" : "More than football"}</span><h2>{isNl ? "Een club voor de buurt." : "A club for the community."}</h2></div><div className="community-programmes"><article><strong>{isNl ? "Vrienden van Roodenburg" : "Friends of Roodenburg"}</strong><p>{isNl ? "Een betrokken netwerk dat clubinitiatieven ondersteunt." : "An engaged network supporting club initiatives."}</p></article><article><strong>{isNl ? "Actief bij Roodenburg" : "Activities at Roodenburg"}</strong><p>{isNl ? "Wandelen, kaarten, biljarten en ontmoeting door de week." : "Walking, cards, billiards and weekday social activities."}</p></article><article><strong>{isNl ? "Studenten & bedrijven" : "Students & businesses"}</strong><p>{isNl ? "Ruimte voor stages, samenwerking en sportactiviteiten." : "Opportunities for internships, partnerships and sports activities."}</p></article></div></section>}

    {activeSection === "sponsors" && <section className="content-body sponsors-section">
      <div className="content-heading"><span className="section-kicker">{isNl ? "Samen sterker" : "Stronger together"}</span><h2>{isNl ? "Partners van Roodenburg." : "Roodenburg partners."}</h2></div>
      <div className="sponsor-intro"><p>{isNl ? "Lokale en regionale partners helpen de club investeren in voetbal, jeugd en de buurt. De definitieve partnernamen en logo’s worden door de club beheerd." : "Local and regional partners help the club invest in football, youth and the community. Final partner names and logos will be managed by the club."}</p><a className="button button--dark" href={`${base}/club?section=contact&topic=sponsoring`}>{isNl ? "Word sponsor" : "Become a sponsor"} <span>↗</span></a></div>
      <div className="sponsor-showcase">
        <article className="sponsor-feature"><span>{isNl ? "Hoofdpartner" : "Main partner"}</span><strong>{isNl ? "Partnerlogo" : "Partner logo"}</strong></article>
        {[1,2,3,4,5,6].map((item) => <article key={item}><span>{isNl ? "Clubpartner" : "Club partner"}</span><strong>{isNl ? "Logo volgt" : "Logo pending"}</strong></article>)}
      </div>
      <div className="sponsor-packages">{[
        [isNl ? "Zichtbaarheid" : "Visibility", isNl ? "Borden, digitale uitingen en wedstrijddagen." : "Pitch boards, digital visibility and matchdays."],
        [isNl ? "Team & jeugd" : "Team & youth", isNl ? "Gerichte ondersteuning van teams en jeugdactiviteiten." : "Targeted support for teams and youth activities."],
        [isNl ? "Maatwerk" : "Tailored partnership", isNl ? "Een samenwerking die aansluit op bedrijf en club." : "A partnership shaped around the business and the club."],
      ].map(([title, text], index) => <article key={title}><span>0{index + 1}</span><h3>{title}</h3><p>{text}</p></article>)}</div>
    </section>}

    {activeSection === "contact" && <section className="content-body contact-section">
      <div className="content-heading"><span className="section-kicker">{isNl ? "We helpen je graag" : "We’re happy to help"}</span><h2>Contact.</h2></div>
      <div className="contact-layout">
        <aside className="contact-details"><span>{isNl ? "Algemeen" : "General"}</span><h3>L.V. Roodenburg</h3><p>Obrechtstraat 4<br />2324 VH Leiden</p><a href="mailto:info@lvroodenburg.nl">info@lvroodenburg.nl</a><dl><div><dt>{isNl ? "Lidmaatschap" : "Membership"}</dt><dd>{isNl ? "Aanmelden en contributie" : "Registration and fees"}</dd></div><div><dt>{isNl ? "Teams" : "Teams"}</dt><dd>{isNl ? "Training en begeleiding" : "Training and team support"}</dd></div><div><dt>{isNl ? "Sponsoring" : "Sponsorship"}</dt><dd>{isNl ? "Partners en mogelijkheden" : "Partners and opportunities"}</dd></div></dl></aside>
        <form className="contact-form" onSubmit={(event) => { event.preventDefault(); setFormSent(true); }}>
          <div className="contact-form__heading"><span>{isNl ? "Stuur een bericht" : "Send a message"}</span><p>{isNl ? "Kies een onderwerp, dan komt je vraag later bij de juiste clubrol terecht." : "Choose a topic so your question can later reach the right club role."}</p></div>
          <label><span>{isNl ? "Onderwerp" : "Topic"}</span><select value={contactTopic} onChange={(event) => setContactTopic(event.target.value)}><option value="general">{isNl ? "Algemene vraag" : "General question"}</option><option value="membership">{isNl ? "Lidmaatschap" : "Membership"}</option><option value="team">{isNl ? "Teamvraag" : "Team question"}</option><option value="volunteering">{isNl ? "Vrijwilligerswerk" : "Volunteering"}</option><option value="sponsoring">{isNl ? "Sponsoring" : "Sponsorship"}</option><option value="organisation">{isNl ? "Organisatie" : "Organisation"}</option></select></label>
          <div className="contact-form__row"><label><span>{isNl ? "Naam" : "Name"}</span><input name="name" autoComplete="name" required /></label><label><span>{isNl ? "E-mailadres" : "Email address"}</span><input name="email" type="email" autoComplete="email" required /></label></div>
          <label><span>{isNl ? "Bericht" : "Message"}</span><textarea name="message" rows={6} required /></label>
          <label className="contact-consent"><input type="checkbox" required /><span>{isNl ? "Ik geef toestemming om mijn gegevens te gebruiken voor het beantwoorden van deze vraag." : "I consent to my details being used to answer this question."}</span></label>
          <button type="submit">{isNl ? "Bericht controleren" : "Review message"} <span>→</span></button>
          {formSent && <p className="form-demo-message" role="status">{isNl ? "De formuliercontrole werkt. In deze frontendfase is er nog niets verzonden." : "Form validation works. Nothing has been sent during this frontend phase."}</p>}
        </form>
      </div>
    </section>}

    {activeSection === "privacy" && <section className="content-body legal-copy"><div className="content-heading"><span className="section-kicker">AVG</span><h2>{isNl ? "Privacy & gegevens." : "Privacy & data."}</h2></div><p>{isNl ? "Deze pagina wordt de centrale plek voor het privacybeleid, bewaartermijnen, beeldmateriaal en contact met de privacycoördinator. De definitieve tekst wordt voor ingebruikname door de club aangeleverd en gecontroleerd." : "This page will be the central place for the privacy policy, retention periods, image use and contact with the privacy coordinator. The final text will be supplied and reviewed by the club before launch."}</p></section>}

    <section className="sample-content-note"><strong>{isNl ? "Conceptinhoud" : "Sample content"}</strong><p>{isNl ? "Adres en algemene structuur zijn voorbereid; namen, contactrollen en beleid worden later met de club gecontroleerd." : "The address and general structure are prepared; names, contact roles and policies will be verified with the club later."}</p></section>
    <ContentFooter locale={locale} />
  </main>;
}
