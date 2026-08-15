"use client";

import { usePathname } from "next/navigation";
import { Breadcrumbs, SiteHeader } from "./site-header";

export function NotFoundPage() {
  const pathname = usePathname();
  const locale = pathname.startsWith("/en") ? "en" : "nl";
  const isNl = locale === "nl";
  const base = `/${locale}`;

  return <main className="not-found-page" id="main-content">
    <SiteHeader locale={locale} />
    <Breadcrumbs locale={locale} items={[{ label: isNl ? "Pagina niet gevonden" : "Page not found" }]} />
    <section className="not-found-content">
      <span>404</span>
      <div><p className="section-kicker">L.V. Roodenburg</p><h1>{isNl ? "Deze pagina staat buitenspel." : "This page is offside."}</h1><p>{isNl ? "De link is mogelijk verouderd of de pagina is verplaatst. Ga verder naar een van de vaste onderdelen van de website." : "The link may be outdated or the page may have moved. Continue to one of the website’s main sections."}</p><div><a className="button button--dark" href={base}>{isNl ? "Naar home" : "Go home"} <span>↗</span></a><a className="not-found-link" href={`${base}/teams`}>{isNl ? "Bekijk teams" : "View teams"} <span>→</span></a></div></div>
    </section>
  </main>;
}
