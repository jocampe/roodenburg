"use client";

import { FormEvent, useEffect, useState } from "react";
import { copy, Locale } from "./site-data";
import { Breadcrumbs, SiteHeader } from "./site-header";

type MemberView = {
  id: number | string;
  email: string;
  name: string;
  memberNumber: string;
  preferredLocale: Locale;
  status: "pending" | "active" | "suspended" | "closed";
};

type RequestState = "idle" | "loading" | "submitting" | "success" | "error";
type AccountMode = "login" | "register" | "forgot" | "reset";

export function AccountPage({ locale, resetToken = "" }: { locale: Locale; resetToken?: string }) {
  const isNl = locale === "nl";
  const t = copy[locale];
  const base = `/${locale}`;
  const [mode, setMode] = useState<AccountMode>(resetToken ? "reset" : "login");
  const [recoveryToken, setRecoveryToken] = useState(resetToken);
  const [member, setMember] = useState<MemberView | null>(null);
  const [requestState, setRequestState] = useState<RequestState>("loading");
  const [message, setMessage] = useState("");
  const [profileName, setProfileName] = useState("");
  const [preferredLocale, setPreferredLocale] = useState<Locale>(locale);

  useEffect(() => {
    const fragmentToken = new URLSearchParams(window.location.hash.slice(1)).get("reset") || "";
    const token = fragmentToken || resetToken;
    if (!token) return;
    let active = true;
    window.history.replaceState({}, "", window.location.pathname);
    queueMicrotask(() => {
      if (!active) return;
      setRecoveryToken(token);
      setMode("reset");
    });
    return () => { active = false; };
  }, [resetToken]);

  useEffect(() => {
    let active = true;
    fetch("/api/member/session", { cache: "no-store" })
      .then(async (response) => response.ok ? response.json() : null)
      .then((result) => {
        if (!active) return;
        if (result?.member) {
          setMember(result.member);
          setProfileName(result.member.name);
          setPreferredLocale(result.member.preferredLocale);
        }
        setRequestState("idle");
      })
      .catch(() => active && setRequestState("idle"));
    return () => { active = false; };
  }, []);

  const selectMode = (nextMode: AccountMode) => {
    setMode(nextMode);
    setMessage("");
    setRequestState("idle");
  };

  const submitAccount = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRequestState("submitting");
    setMessage("");
    const form = new FormData(event.currentTarget);
    const payload = Object.fromEntries(form.entries());

    try {
      const endpoint = mode === "forgot" ? "forgot-password" : mode === "reset" ? "reset-password" : mode;
      const requestBody = mode === "reset"
        ? { ...payload, token: recoveryToken }
        : { ...payload, consent: form.get("consent") === "on", locale };
      const response = await fetch(`/api/member/${endpoint}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.code || "request_failed");

      if (mode === "register") {
        event.currentTarget.reset();
        setRequestState("success");
        setMessage(isNl
          ? "Je aanvraag is ontvangen. De club activeert het account nadat je lidmaatschap is gecontroleerd."
          : "Your request has been received. The club will activate the account after checking your membership.");
      } else if (mode === "forgot") {
        event.currentTarget.reset();
        setRequestState("success");
        setMessage(isNl
          ? "Als er een actief account voor dit adres bestaat, ontvang je een e-mail met de volgende stap."
          : "If an active account exists for this address, you will receive an email with the next step.");
      } else if (mode === "reset") {
        window.history.replaceState({}, "", `/${locale}/account`);
        setRecoveryToken("");
        setMode("login");
        setRequestState("success");
        setMessage(isNl ? "Je wachtwoord is aangepast. Je kunt nu inloggen." : "Your password has been changed. You can now sign in.");
      } else {
        setMember(result.member);
        setProfileName(result.member.name);
        setPreferredLocale(result.member.preferredLocale);
        setRequestState("idle");
      }
    } catch (error) {
      const code = error instanceof Error ? error.message : "request_failed";
      setRequestState("error");
      setMessage(code === "account_unavailable"
        ? (isNl ? "Inloggen is nog niet mogelijk. Controleer je gegevens of wacht tot de club je account activeert." : "Login is not available yet. Check your details or wait for the club to activate your account.")
        : code === "invalid_or_expired_token"
          ? (isNl ? "Deze herstel-link is ongeldig of verlopen. Vraag een nieuwe link aan." : "This recovery link is invalid or expired. Request a new link.")
          : (isNl ? "Dat is niet gelukt. Controleer je gegevens en probeer het opnieuw." : "That did not work. Check your details and try again."));
    }
  };

  const saveProfile = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setRequestState("submitting");
    setMessage("");
    try {
      const response = await fetch("/api/member/session", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: profileName, preferredLocale }),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.code || "request_failed");
      setMember(result.member);
      setRequestState("success");
      setMessage(isNl ? "Je gegevens zijn bijgewerkt." : "Your details have been updated.");
    } catch {
      setRequestState("error");
      setMessage(isNl ? "Opslaan is niet gelukt. Log opnieuw in en probeer het nogmaals." : "Saving failed. Sign in again and retry.");
    }
  };

  const logout = async () => {
    await fetch("/api/member/logout", { method: "POST" });
    setMember(null);
    setMessage("");
    setRequestState("idle");
  };

  return <main className="account-page" id="main-content">
    <SiteHeader locale={locale} languagePath="/account" />
    <Breadcrumbs locale={locale} items={[{ label: isNl ? "Mijn Roodenburg" : "My Roodenburg" }]} />
    <section className="subpage-hero-compact account-hero"><div><span className="section-kicker">{isNl ? "Mijn Roodenburg" : "My Roodenburg"}</span><h1>{member ? (isNl ? `Welkom, ${member.name}.` : `Welcome, ${member.name}.`) : (isNl ? "Welkom terug." : "Welcome back.")}</h1></div></section>
    <section className={`account-panel${member ? " account-panel--member" : ""}`} aria-busy={requestState === "loading" || requestState === "submitting"}>
      {requestState === "loading" ? <p className="account-loading">{isNl ? "Account controleren…" : "Checking account…"}</p> : member ? <>
        <div className="account-member-heading"><div><span>{isNl ? "Actief ledenaccount" : "Active member account"}</span><h2>{isNl ? "Jouw gegevens" : "Your details"}</h2></div><button className="account-logout" type="button" onClick={logout}>{isNl ? "Uitloggen" : "Log out"}</button></div>
        <dl className="account-summary"><div><dt>{isNl ? "E-mailadres" : "Email address"}</dt><dd>{member.email}</dd></div><div><dt>{isNl ? "Lidnummer" : "Member number"}</dt><dd>{member.memberNumber || (isNl ? "Wordt door de club toegevoegd" : "Added by the club")}</dd></div></dl>
        <form onSubmit={saveProfile}>
          <label><span>{isNl ? "Naam" : "Name"}</span><input value={profileName} onChange={(event) => setProfileName(event.target.value)} type="text" autoComplete="name" minLength={2} maxLength={120} required /></label>
          <label><span>{isNl ? "Voorkeurstaal" : "Preferred language"}</span><select value={preferredLocale} onChange={(event) => setPreferredLocale(event.target.value as Locale)}><option value="nl">Nederlands</option><option value="en">English</option></select></label>
          <button type="submit" disabled={requestState === "submitting"}>{requestState === "submitting" ? (isNl ? "Opslaan…" : "Saving…") : (isNl ? "Gegevens opslaan" : "Save details")}</button>
        </form>
      </> : <>
        {(mode === "login" || mode === "register")
          ? <div className="segmented-filter"><button aria-pressed={mode === "login"} type="button" className={mode === "login" ? "is-active" : ""} onClick={() => selectMode("login")}>{isNl ? "Inloggen" : "Login"}</button><button aria-pressed={mode === "register"} type="button" className={mode === "register" ? "is-active" : ""} onClick={() => selectMode("register")}>{isNl ? "Registreren" : "Register"}</button></div>
          : <button className="account-back-link" type="button" onClick={() => selectMode("login")}>← {isNl ? "Terug naar inloggen" : "Back to login"}</button>}
        <h2>{mode === "login"
          ? (isNl ? "Inloggen" : "Login")
          : mode === "register"
            ? (isNl ? "Account aanvragen" : "Request an account")
            : mode === "forgot"
              ? (isNl ? "Wachtwoord vergeten" : "Forgot password")
              : (isNl ? "Nieuw wachtwoord" : "New password")}</h2>
        <p>{mode === "login"
          ? (isNl ? "Log in met je geactiveerde ledenaccount." : "Sign in with your activated member account.")
          : mode === "register"
            ? (isNl ? "Vraag een account aan met het e-mailadres dat bij de club bekend is. Een beheerder controleert en activeert de aanvraag." : "Request an account using the email address known to the club. An administrator will review and activate it.")
            : mode === "forgot"
              ? (isNl ? "Vul het e-mailadres van je actieve account in. Je ontvangt een herstel-link die 30 minuten geldig is." : "Enter the email address for your active account. You will receive a recovery link valid for 30 minutes.")
              : (isNl ? "Kies een nieuw wachtwoord van minimaal 12 tekens." : "Choose a new password of at least 12 characters.")}</p>
        <form onSubmit={submitAccount}>
          {mode === "register" && <label><span>{isNl ? "Naam" : "Name"}</span><input name="name" type="text" autoComplete="name" minLength={2} maxLength={120} required /></label>}
          {mode !== "reset" && <label><span>{isNl ? "E-mailadres" : "Email address"}</span><input name="email" type="email" autoComplete="email" maxLength={254} required /></label>}
          {(mode === "login" || mode === "register" || mode === "reset") && <label><span>{isNl ? "Wachtwoord" : "Password"}</span><input name="password" type="password" minLength={mode === "register" || mode === "reset" ? 12 : 1} maxLength={128} autoComplete={mode === "login" ? "current-password" : "new-password"} required />{(mode === "register" || mode === "reset") && <small>{isNl ? "Minimaal 12 tekens." : "At least 12 characters."}</small>}</label>}
          {mode === "register" && <><label className="account-consent"><input name="consent" type="checkbox" required /><span>{isNl ? "Ik geef toestemming om mijn gegevens te verwerken voor mijn ledenaccount." : "I consent to my details being processed for my member account."}</span></label><label className="form-trap" aria-hidden="true"><span>Website</span><input name="website" type="text" tabIndex={-1} autoComplete="off" /></label></>}
          <button type="submit" disabled={requestState === "submitting"}>{requestState === "submitting"
            ? (isNl ? "Even geduld…" : "Please wait…")
            : mode === "login"
              ? (isNl ? "Inloggen" : "Login")
              : mode === "register"
                ? (isNl ? "Account aanvragen" : "Request account")
                : mode === "forgot"
                  ? (isNl ? "Herstel-link aanvragen" : "Request recovery link")
                  : (isNl ? "Wachtwoord opslaan" : "Save password")}</button>
        </form>
        {mode === "login" && <button className="account-forgot-link" type="button" onClick={() => selectMode("forgot")}>{isNl ? "Wachtwoord vergeten?" : "Forgot password?"}</button>}
      </>}
      {message && <p className={`form-status form-status--${requestState}`} role="status" aria-live="polite">{message}</p>}
    </section>
    <footer className="team-footer"><a href={base}>L.V. Roodenburg</a><span>{t.footerText}</span><a href={`${base}/sitemap`}>{t.structure} →</a></footer>
  </main>;
}
