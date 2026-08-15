import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { contentSource } from "../../content/content-source";
import { NewsMediaPage } from "../../news-media-page";
import { isLocale } from "../../site-data";

const sections = ["news", "calendar", "reports", "media", "archive"] as const;

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "en" ? "News & media" : "Nieuws & media", description: locale === "en" ? "Latest club news, calendar, match reports and media." : "Het laatste clubnieuws, de agenda, wedstrijdverslagen en media." };
}

export default async function NewsRoute({ params, searchParams }: { params: Promise<{ locale: string }>; searchParams: Promise<{ section?: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  const { section } = await searchParams;
  const initialSection = sections.includes(section as typeof sections[number]) ? section as typeof sections[number] : "news";
  const posts = await contentSource.listNewsPosts();
  return <NewsMediaPage locale={locale} initialSection={initialSection} posts={posts} />;
}
