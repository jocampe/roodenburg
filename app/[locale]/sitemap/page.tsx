import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { copy, isLocale, sitemapGroups, teamGroups } from "../../site-data";
import { Breadcrumbs, SiteHeader } from "../../site-header";

const sitemapLinks: Record<string, string[]> = {
  membership: ["/membership", "/membership", "/membership", "/membership", "/membership"],
  club: ["/club", "/club?section=history", "/club?section=sportpark", "/club?section=organisation", "/club?section=privacy"],
  media: ["/news", "/news?section=calendar", "/news?section=media", "/news?section=media", "/news?section=archive"],
  community: ["/club?section=community", "/club?section=community", "/club?section=community", "/club?section=volunteers"],
};

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "en" ? "Sitemap" : "Sitemap", description: locale === "en" ? "Explore every section of the L.V. Roodenburg website." : "Bekijk alle onderdelen van de website van L.V. Roodenburg." };
}

export default async function SitemapPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();

  const t = copy[locale];
  const isNl = locale === "nl";

  return (
    <main className="sitemap-page" id="main-content">
      <SiteHeader locale={locale} languagePath="/sitemap" />
      <Breadcrumbs locale={locale} items={[{ label: t.sitemap }]} />

      <section className="sitemap-hero">
        <span className="section-kicker">{isNl ? "Nieuwe navigatie" : "New navigation"}</span>
        <h1>{isNl ? "Alles van Roodenburg, logisch bij elkaar." : "Everything Roodenburg, clearly organised."}</h1>
        <p>{isNl
          ? "De inhoud van de huidige website blijft herkenbaar, maar herhaalde en verwante pagina’s worden samengebracht. Dit is de voorgestelde structuur voor de nieuwe site."
          : "The current website’s content remains recognisable, while repeated and related pages are brought together. This is the proposed structure for the new site."}</p>
      </section>

      <section className="sitemap-grid" aria-label={t.sitemap}>
        {sitemapGroups.map((group, groupIndex) => (
          <article className="sitemap-group" id={group.id} key={group.id}>
            <header><span>0{groupIndex + 1}</span><div><h2>{group.title[locale]}</h2><p>{group.intro[locale]}</p></div></header>
            <ul>
              {group.items.map((item, itemIndex) => (
                <li key={item.title.nl}><a href={`/${locale}${sitemapLinks[group.id]?.[itemIndex] || "/sitemap"}`}><div><strong>{item.title[locale]}</strong><span>{item.detail[locale]}</span></div><span aria-hidden="true">→</span></a></li>
              ))}
            </ul>
          </article>
        ))}
      </section>

      <section className="team-map" id="teams">
        <div className="team-map__intro">
          <span className="section-kicker">{isNl ? "Teams" : "Teams"}</span>
          <h2>{isNl ? "Eén teamtemplate, alle informatie." : "One team template, all information."}</h2>
          <p>{isNl
            ? "Competitie, beker, oefenwedstrijden, programma, uitslagen, topscorers en verslagen worden tabbladen binnen iedere teampagina. Zo blijft alles behouden zonder honderden menu-items."
            : "League, cup, friendlies, fixtures, results, top scorers and reports become sections within each team page. Everything stays available without hundreds of menu items."}</p>
        </div>
        <div className="team-map__groups">
          {teamGroups.map((group) => (
            <a href={`/${locale}/teams?category=${group.id}`} key={group.id}>
              <h3>{group.title[locale]}</h3>
              <p>{group.description[locale]}</p>
              <div>{group.teams.map((team) => <span key={team}>{team}</span>)}</div>
            </a>
          ))}
        </div>
      </section>

      <section className="consolidation-note">
        <strong>{isNl ? "Wat wordt samengevoegd?" : "What gets consolidated?"}</strong>
        <p>{isNl
          ? "De losse pagina’s voor inschrijving worden één lidmaatschapsroute met keuzes. Complex, route en medegebruik worden één Sportpark-pagina. Foto- en videocategorieën worden filters binnen Media. Jubilea, reünies en oude foto's vormen samen het clubarchief."
          : "Separate registration pages become one membership journey with clear choices. Facilities, directions and shared use become one Sportpark page. Photo and video categories become Media filters. Anniversaries, reunions and heritage photos form one club archive."}</p>
      </section>
    </main>
  );
}
