import { ContentFooter } from "./content-footer";
import { Locale } from "./site-data";
import { Breadcrumbs, SiteHeader } from "./site-header";

export function MembershipPage({ locale }: { locale: Locale }) {
  const isNl = locale === "nl";
  const base = `/${locale}`;
  return <main className="content-page" id="main-content">
    <SiteHeader locale={locale} languagePath="/membership" />
    <Breadcrumbs locale={locale} items={[{ label: isNl ? "De club" : "The club", href: `${base}/club` }, { label: isNl ? "Lidmaatschap" : "Membership" }]} />
    <section className="subpage-hero-compact content-hero content-hero--membership"><div><span className="section-kicker">{isNl ? "Word onderdeel van de club" : "Become part of the club"}</span><h1>{isNl ? "Lidmaatschap" : "Membership"}</h1><p>{isNl ? "Vind de juiste voetbalvorm en bekijk hoe aanmelden werkt." : "Find the right form of football and see how registration works."}</p></div></section>
    <section className="content-body membership-options"><div className="content-heading"><span className="section-kicker">{isNl ? "Kies je route" : "Choose your path"}</span><h2>{isNl ? "Voetbal voor iedereen." : "Football for everyone."}</h2></div><div className="membership-grid">{[
      ["01", isNl ? "Jeugd" : "Youth", isNl ? "Van de Ukken tot en met O17, voor jongens en meiden." : "From minis through U17, for boys and girls.", "pupillen"],
      ["02", isNl ? "Senioren" : "Senior teams", isNl ? "Veldvoetbal op zaterdag en zondag, plus 30+." : "Outdoor football on Saturday and Sunday, plus 30+.", "senioren"],
      ["03", isNl ? "Zaalvoetbal" : "Indoor football", isNl ? "Heren- en vrouwenteams in de zaalcompetitie." : "Men’s and women’s teams in indoor competition.", "zaal"],
    ].map(([number, title, text, category]) => <article key={title}><span>{number}</span><h3>{title}</h3><p>{text}</p><a href={`${base}/teams?category=${category}`}>{isNl ? "Bekijk teams" : "View teams"} →</a></article>)}</div></section>
    <section className="membership-process"><div><span className="section-kicker">{isNl ? "Zo werkt het" : "How it works"}</span><h2>{isNl ? "Van kennismaken naar het veld." : "From introduction to the pitch."}</h2></div><ol>{[
      [isNl ? "Vind een team" : "Find a team", isNl ? "Bekijk welke leeftijd of voetbalvorm bij je past." : "See which age group or format suits you."],
      [isNl ? "Neem contact op" : "Get in touch", isNl ? "Vraag naar ruimte en de mogelijkheid om mee te trainen." : "Ask about availability and joining a training session."],
      [isNl ? "Proeftraining" : "Trial training", isNl ? "Maak kennis met het team en de trainers." : "Meet the team and coaches."],
      [isNl ? "Inschrijving" : "Registration", isNl ? "Rond je officiële aanmelding bij de club af." : "Complete your official club registration."],
    ].map(([title, text], index) => <li key={title}><span>0{index + 1}</span><div><h3>{title}</h3><p>{text}</p></div></li>)}</ol></section>
    <section className="membership-info"><article><span>{isNl ? "Contributie" : "Membership fees"}</span><h3>{isNl ? "Duidelijke tarieven per categorie" : "Clear rates by category"}</h3><p>{isNl ? "De officiële seizoensbedragen en betaalmomenten worden hier door de club beheerd." : "Official seasonal rates and payment dates will be maintained here by the club."}</p></article><article><span>{isNl ? "Bestaand lid" : "Existing member"}</span><h3>{isNl ? "Wijzigen of opzeggen" : "Update or cancel"}</h3><p>{isNl ? "Gegevens wijzigen, overschrijven en opzeggen krijgen ieder een duidelijke route." : "Updating details, transfers and cancellations will each have a clear route."}</p></article><article><span>{isNl ? "Clubkleding" : "Club kit"}</span><h3>{isNl ? "Tenue en kleding" : "Kit and clothing"}</h3><p>{isNl ? "Informatie over het wedstrijdtenue en aanvullende clubkleding." : "Information about the match kit and additional club clothing."}</p></article></section>
    <section className="membership-contact"><div><span className="section-kicker">{isNl ? "Interesse?" : "Interested?"}</span><h2>{isNl ? "Neem contact op met Roodenburg." : "Get in touch with Roodenburg."}</h2></div><a className="button button--light" href={`${base}/club?section=contact`}>{isNl ? "Naar contact" : "Go to contact"} <span>↗</span></a></section>
    <section className="sample-content-note"><strong>{isNl ? "Conceptinhoud" : "Sample content"}</strong><p>{isNl ? "Tarieven en officiële formulieren worden pas toegevoegd nadat de club deze heeft bevestigd." : "Rates and official forms will be added after the club has confirmed them."}</p></section>
    <ContentFooter locale={locale} />
  </main>;
}
