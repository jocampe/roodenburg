import { ContentFooter } from "./content-footer";
import { Locale, NewsPost, newsPosts } from "./site-data";
import { Breadcrumbs, SiteHeader } from "./site-header";

export function ArticlePage({ locale, post }: { locale: Locale; post: NewsPost }) {
  const isNl = locale === "nl";
  const base = `/${locale}`;
  const related = newsPosts.filter((item) => item.slug !== post.slug && item.kind === post.kind).slice(0, 3);

  return <main className="article-page" id="main-content">
    <SiteHeader locale={locale} languagePath={`/news/${post.slug}`} />
    <Breadcrumbs locale={locale} items={[
      { label: isNl ? "Nieuws & media" : "News & media", href: `${base}/news${post.kind === "report" ? "?section=reports" : ""}` },
      { label: post.title[locale] },
    ]} />

    <header className="article-hero">
      <div>
        <p><span>{post.category[locale]}</span><time>{post.published[locale]}</time></p>
        <h1>{post.title[locale]}</h1>
        <strong>{post.intro[locale]}</strong>
      </div>
    </header>

    <section className="article-layout">
      <article className="article-content">
        <figure><img src={post.image} alt={post.imageAlt[locale]} /><figcaption>{isNl ? "Conceptbeeld — wordt vervangen door clubfotografie" : "Sample image — to be replaced with club photography"}</figcaption></figure>
        <div className="article-copy">
          {post.body.map((paragraph, index) => <p key={index}>{paragraph[locale]}</p>)}
        </div>
      </article>
      <aside className="article-meta">
        <dl>
          <div><dt>{isNl ? "Gepubliceerd" : "Published"}</dt><dd>{post.published[locale]}</dd></div>
          <div><dt>{isNl ? "Door" : "By"}</dt><dd>{post.author[locale]}</dd></div>
          <div><dt>{isNl ? "Categorie" : "Category"}</dt><dd>{post.category[locale]}</dd></div>
        </dl>
        <a href={`${base}/news${post.kind === "report" ? "?section=reports" : ""}`}>{isNl ? "Meer uit deze categorie" : "More from this category"} <span>→</span></a>
      </aside>
    </section>

    <section className="related-stories">
      <div className="content-heading"><span className="section-kicker">{isNl ? "Lees verder" : "Continue reading"}</span><h2>{isNl ? "Meer van Roodenburg." : "More from Roodenburg."}</h2></div>
      <div className="related-grid">{related.map((item) => <a href={`${base}/news/${item.slug}`} key={item.slug}><span>{item.category[locale]}</span><h3>{item.title[locale]}</h3><p>{item.date[locale]} <b>→</b></p></a>)}</div>
    </section>

    <section className="sample-content-note"><strong>{isNl ? "Conceptinhoud" : "Sample content"}</strong><p>{isNl ? "Dit artikel toont het herbruikbare publicatiemodel. Tekst, auteur en beeld worden later vanuit het CMS beheerd." : "This article demonstrates the reusable publishing model. Text, author and imagery will later be managed through the CMS."}</p></section>
    <ContentFooter locale={locale} />
  </main>;
}
