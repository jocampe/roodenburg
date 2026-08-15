"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function LanguageHtml() {
  const pathname = usePathname();

  useEffect(() => {
    document.documentElement.lang = pathname.startsWith("/en") ? "en" : "nl";
  }, [pathname]);

  return null;
}
