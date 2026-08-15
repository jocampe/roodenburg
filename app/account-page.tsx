"use client";

import { useState } from "react";
import { copy, Locale } from "./site-data";
import { Breadcrumbs, SiteHeader } from "./site-header";

export function AccountPage({ locale }: { locale: Locale }) {
  const isNl = locale === "nl";
  const t = copy[locale];
  const base = `/${locale}`;
  const [mode, setMode] = useState<"login" | "register">("login");
  return <main className="account-page" id="main-content">
    <SiteHeader locale={locale} languagePath="/account" />
    <Breadcrumbs locale={locale} items={[{ label: isNl ? "Inloggen / Registreren" : "Login / Register" }]} />
    <section className="subpage-hero-compact account-hero"><div><span className="section-kicker">{isNl ? "Mijn Roodenburg" : "My Roodenburg"}</span><h1>{isNl ? "Welkom terug." : "Welcome back."}</h1></div></section>
    <section className="account-panel">
      <div className="segmented-filter"><button aria-pressed={mode === "login"} type="button" className={mode === "login" ? "is-active" : ""} onClick={() => setMode("login")}>{isNl ? "Inloggen" : "Login"}</button><button aria-pressed={mode === "register"} type="button" className={mode === "register" ? "is-active" : ""} onClick={() => setMode("register")}>{isNl ? "Registreren" : "Register"}</button></div>
      <h2>{mode === "login" ? (isNl ? "Inloggen" : "Login") : (isNl ? "Account aanmaken" : "Create account")}</h2>
      <p>{isNl ? "Deze accountomgeving is een frontend-concept. De echte authenticatie wordt in een latere ontwikkelfase aangesloten." : "This account area is a frontend concept. Real authentication will be connected in a later development phase."}</p>
      <form onSubmit={(event) => event.preventDefault()}>
        {mode === "register" && <label><span>{isNl ? "Naam" : "Name"}</span><input type="text" autoComplete="name" /></label>}
        <label><span>{isNl ? "E-mailadres" : "Email address"}</span><input type="email" autoComplete="email" /></label>
        <label><span>{isNl ? "Wachtwoord" : "Password"}</span><input type="password" autoComplete={mode === "login" ? "current-password" : "new-password"} /></label>
        <button type="submit">{mode === "login" ? (isNl ? "Inloggen" : "Login") : (isNl ? "Registreren" : "Register")}</button>
      </form>
    </section>
    <footer className="team-footer"><a href={base}>L.V. Roodenburg</a><span>{t.footerText}</span><a href={`${base}/sitemap`}>{t.structure} →</a></footer>
  </main>;
}
