import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { LanguageHtml } from "./language-html";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "L.V. Roodenburg",
  description: "De voetbalclub van Leiden-Noord, thuis op Sportpark Noord.",
  other: {
    "codex-preview": "development",
  },
  icons: {
    icon: "/roodenburg-crest.png",
    shortcut: "/roodenburg-crest.png",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const isStaticDemo = process.env.GITHUB_PAGES === "true";
  return (
    <html lang="nl">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <LanguageHtml />
        <a className="skip-link" href="#main-content">Skip to content / Naar inhoud</a>
        {isStaticDemo && <aside className="static-demo-badge" role="note">Static demo · sample data · forms do not send</aside>}
        {children}
      </body>
    </html>
  );
}
