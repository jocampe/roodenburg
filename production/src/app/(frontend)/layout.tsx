import type { Metadata } from "next";
import type { ReactNode } from "react";
import { LanguageHtml } from "./language-html";
import { PreviewBanner } from "./preview-banner";
import "./styles.css";

export const metadata: Metadata = {
  title: "L.V. Roodenburg",
  description: "Official club website production foundation",
};

export default function FrontendLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="nl">
      <body><LanguageHtml /><PreviewBanner />{children}</body>
    </html>
  );
}
