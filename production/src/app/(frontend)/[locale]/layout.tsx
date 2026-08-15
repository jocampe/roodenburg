import type { Metadata } from "next";
import { isLocale } from "../site-data";

export async function generateMetadata({ params }: { params: Promise<{ locale: string }> }): Promise<Metadata> {
  const { locale } = await params;
  const isNl = isLocale(locale) ? locale === "nl" : true;
  return {
    title: { default: "L.V. Roodenburg", template: "%s | L.V. Roodenburg" },
    description: isNl
      ? "Clubinformatie, teams, wedstrijden en nieuws van L.V. Roodenburg in Leiden-Noord."
      : "Club information, teams, matches and news from L.V. Roodenburg in Leiden-Noord.",
    keywords: ["L.V. Roodenburg", "voetbal Leiden", "Sportpark Noord", "football Leiden"],
  };
}

export default function LocaleLayout({ children }: { children: React.ReactNode }) {
  return children;
}
