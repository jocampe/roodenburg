import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ArticlePage } from "../../../article-page";
import { contentSource } from "../../../content/content-source";
import { isLocale } from "../../../site-data";

export const dynamicParams = false;

export function generateStaticParams() {
  return contentSource.listNewsPosts().map((post) => ({ slug: post.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ locale: string; slug: string }> }): Promise<Metadata> {
  const { locale, slug } = await params;
  if (!isLocale(locale)) return {};
  const post = contentSource.getNewsPost(slug);
  if (!post) return {};
  return { title: post.title[locale], description: post.intro[locale] };
}

export default async function ArticleRoute({ params }: { params: Promise<{ locale: string; slug: string }> }) {
  const { locale, slug } = await params;
  if (!isLocale(locale)) notFound();
  const post = contentSource.getNewsPost(slug);
  if (!post) notFound();
  return <ArticlePage locale={locale} post={post} />;
}
