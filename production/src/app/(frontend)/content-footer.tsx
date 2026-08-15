import { copy, Locale } from "./site-data";

export function ContentFooter({ locale }: { locale: Locale }) {
  const t = copy[locale];
  const base = `/${locale}`;

  return (
    <footer className="site-footer">
      <div className="footer-brand">
        <img className="club-crest club-crest--compact" src="/roodenburg-crest.png" alt="" width="43" height="46" />
        <div><strong>L.V. Roodenburg</strong><span>{t.footerText}</span></div>
      </div>
      <nav aria-label="Footer">
        <a href={`${base}/sitemap`}>{t.structure}</a>
        <a href={`${base}/membership`}>{locale === "nl" ? "Lidmaatschap" : "Membership"}</a>
        <a href={`${base}/club?section=privacy`}>{t.privacy}</a>
        <a href={`${base}/account`}>{t.login}</a>
      </nav>
      <div className="language-switch" aria-label="Language / Taal">
        <a href="/nl" lang="nl" aria-current={locale === "nl" ? "page" : undefined}>NL</a>
        <span aria-hidden="true">/</span>
        <a href="/en" lang="en" aria-current={locale === "en" ? "page" : undefined}>EN</a>
      </div>
    </footer>
  );
}
