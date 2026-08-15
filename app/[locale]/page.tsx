import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { HomePage } from "../home-page";
import { isLocale } from "../site-data";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isNl = locale !== "en";
  return {
    title: { absolute: "L.V. Roodenburg" },
    description: isNl ? "Teams, wedstrijden, nieuws en clubinformatie van L.V. Roodenburg." : "Teams, matches, news and club information from L.V. Roodenburg.",
  };
}

export default async function LocalizedHome({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;

  if (!isLocale(locale)) notFound();

  return <HomePage locale={locale} />;
}
