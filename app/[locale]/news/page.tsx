import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { NewsMediaPage } from "../../news-media-page";
import { isLocale } from "../../site-data";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  return { title: locale === "en" ? "News & media" : "Nieuws & media", description: locale === "en" ? "Latest club news, calendar, match reports and media." : "Het laatste clubnieuws, de agenda, wedstrijdverslagen en media." };
}

export default async function NewsRoute({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return <NewsMediaPage locale={locale} initialSection="news" />;
}
