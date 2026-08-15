export type Locale = "nl" | "en";

export const isLocale = (value: string): value is Locale =>
  value === "nl" || value === "en";

type Bilingual = Record<Locale, string>;

export const copy = {
  nl: {
    primaryNav: "Hoofdnavigatie",
    mobileNav: "Mobiele navigatie",
    openMenu: "Menu openen",
    homeLabel: "L.V. Roodenburg home",
    location: "Leiden-Noord",
    nav: ["Teams", "Nieuws & media", "De club"],
    join: "Lid worden",
    since: "Sinds 1927 · Sportpark Noord",
    headline: "Voetbal van",
    headlineAccent: "ons allemaal.",
    intro:
      "Midden in Leiden-Noord. Een club waar talent groeit, vrijwilligers het verschil maken en iedereen welkom is.",
    discover: "Ontdek de club",
    allMatches: "Bekijk alle wedstrijden",
    nextMatch: "Volgende wedstrijd",
    saturday: "ZA · 29 AUG",
    home: "Thuis",
    away: "Uit",
    opponent: "Tegenstander",
    matchInfo: "Wedstrijdinformatie",
    latestMatch: "Laatste wedstrijd",
    nextFixture: "Volgende wedstrijd",
    friendly: "Oefenwedstrijd",
    matchCentre: "Naar het wedstrijdcentrum",
    clubUpdate: "Clubupdate",
    updateText: "De voorbereiding op seizoen 2026–2027 is begonnen.",
    program: "Programma",
    cancellations: "Afgelastingen",
    contact: "Contact",
    newsEyebrow: "Laatste nieuws",
    newsTitle: "Wat er speelt bij Roodenburg",
    allNews: "Alle berichten",
    teamEyebrow: "Vind je team",
    teamTitle: "Eén club, op ieder veld.",
    teamIntro:
      "Bekijk senioren, jeugd en zaalvoetbal zonder door een eindeloos menu te hoeven zoeken.",
    viewTeams: "Bekijk alle teams",
    communityEyebrow: "Meer dan voetbal",
    communityTitle: "Thuis in Leiden-Noord.",
    communityText:
      "Van de Vrienden van Roodenburg tot wandelgroepen, kaartclubs en het 100-jarig archief: de vereniging leeft de hele week.",
    exploreClub: "Ontdek de vereniging",
    joinTitle: "Wil jij ook het blauw-zwart dragen?",
    joinText:
      "Bekijk de teams, contributie en inschrijving voor jeugd, senioren en zaalvoetbal op één duidelijke plek.",
    startRegistration: "Naar lidmaatschap",
    structure: "Volledige sitestructuur",
    footerText: "Voetbal en verbinding sinds 1927.",
    privacy: "Privacy",
    login: "Inloggen / Registreren",
    sitemap: "Sitemap",
    concept: "Conceptinhoud",
  },
  en: {
    primaryNav: "Primary navigation",
    mobileNav: "Mobile navigation",
    openMenu: "Open menu",
    homeLabel: "L.V. Roodenburg home",
    location: "Leiden-Noord",
    nav: ["Teams", "News & media", "The club"],
    join: "Become a member",
    since: "Since 1927 · Sportpark Noord",
    headline: "Football belongs to",
    headlineAccent: "all of us.",
    intro:
      "At the heart of Leiden-Noord. A club where talent grows, volunteers make the difference and everyone is welcome.",
    discover: "Discover the club",
    allMatches: "View all matches",
    nextMatch: "Next match",
    saturday: "SAT · 29 AUG",
    home: "Home",
    away: "Away",
    opponent: "Opponent",
    matchInfo: "Match information",
    latestMatch: "Last match",
    nextFixture: "Next match",
    friendly: "Friendly",
    matchCentre: "Go to match centre",
    clubUpdate: "Club update",
    updateText: "Preparations for the 2026–2027 season have begun.",
    program: "Fixtures",
    cancellations: "Cancellations",
    contact: "Contact",
    newsEyebrow: "Latest news",
    newsTitle: "What’s happening at Roodenburg",
    allNews: "All news",
    teamEyebrow: "Find your team",
    teamTitle: "One club, every pitch.",
    teamIntro:
      "Explore senior, youth and indoor football without searching through an endless menu.",
    viewTeams: "View all teams",
    communityEyebrow: "More than football",
    communityTitle: "At home in Leiden-Noord.",
    communityText:
      "From Friends of Roodenburg to walking groups, card clubs and the centenary archive: the club is alive all week.",
    exploreClub: "Explore the club",
    joinTitle: "Ready to wear blue and black?",
    joinText:
      "Find teams, fees and registration for youth, senior and indoor football in one clear place.",
    startRegistration: "Go to membership",
    structure: "Full site structure",
    footerText: "Football and community since 1927.",
    privacy: "Privacy",
    login: "Login / Register",
    sitemap: "Sitemap",
    concept: "Concept content",
  },
} as const;

export const navMenus: Array<{
  id: string;
  items: Array<{ label: Bilingual; href: string }>;
}> = [
  {
    id: "teams",
    items: [
      { label: { nl: "Senioren", en: "Senior teams" }, href: "/teams?category=senioren" },
      { label: { nl: "Jeugd", en: "Youth teams" }, href: "/teams?category=jeugd" },
      { label: { nl: "Pupillen", en: "Junior teams" }, href: "/teams?category=pupillen" },
      { label: { nl: "Zaalvoetbal", en: "Indoor football" }, href: "/teams?category=zaal" },
      { label: { nl: "Alle teams", en: "All teams" }, href: "/teams" },
    ],
  },
  {
    id: "media",
    items: [
      { label: { nl: "Laatste nieuws", en: "Latest news" }, href: "/news" },
      { label: { nl: "Agenda", en: "Calendar" }, href: "/news?section=calendar" },
      { label: { nl: "Wedstrijdverslagen", en: "Match reports" }, href: "/news?section=reports" },
      { label: { nl: "Foto & video", en: "Photo & video" }, href: "/news?section=media" },
      { label: { nl: "Clubarchief", en: "Club archive" }, href: "/news?section=archive" },
    ],
  },
  {
    id: "club",
    items: [
      { label: { nl: "Over Roodenburg", en: "About Roodenburg" }, href: "/club" },
      { label: { nl: "Lidmaatschap", en: "Membership" }, href: "/membership" },
      { label: { nl: "Historie", en: "History" }, href: "/club?section=history" },
      { label: { nl: "Organisatie", en: "Organisation" }, href: "/club?section=organisation" },
      { label: { nl: "Sportpark Noord", en: "Sportpark Noord" }, href: "/club?section=sportpark" },
      { label: { nl: "Vrijwilligers", en: "Volunteers" }, href: "/club?section=volunteers" },
      { label: { nl: "Sponsoren", en: "Sponsors" }, href: "/club?section=sponsors" },
      { label: { nl: "Contact", en: "Contact" }, href: "/club?section=contact" },
    ],
  },
];

export type NewsPost = {
  slug: string;
  kind: "news" | "report";
  category: Bilingual;
  title: Bilingual;
  date: Bilingual;
  published: Bilingual;
  author: Bilingual;
  intro: Bilingual;
  body: Bilingual[];
  image: string;
  imageAlt: Bilingual;
};

export const newsPosts: NewsPost[] = [
  {
    slug: "voorbereiding-nieuwe-seizoen-gestart",
    kind: "news",
    category: { nl: "Clubnieuws", en: "Club news" },
    title: {
      nl: "De voorbereiding op het nieuwe seizoen is gestart",
      en: "Preparations for the new season are underway",
    },
    date: { nl: "Deze week", en: "This week" },
    published: { nl: "14 augustus 2026", en: "14 August 2026" },
    author: { nl: "Redactie Roodenburg", en: "Roodenburg editorial team" },
    intro: { nl: "De teams keren terug op Sportpark Noord en de voorbereidingen voor seizoen 2026–2027 zijn in volle gang.", en: "Teams are returning to Sportpark Noord and preparations for the 2026–2027 season are well underway." },
    body: [
      { nl: "Na de zomerstop worden de velden, kleedkamers en trainingsmaterialen klaargemaakt voor de eerste volledige trainingsweek. Trainers en teamleiders ontvangen de laatste praktische informatie rechtstreeks via de club.", en: "After the summer break, the pitches, changing rooms and training equipment are being prepared for the first full training week. Coaches and team managers will receive the final practical information directly from the club." },
      { nl: "De actuele trainingstijden en teamindelingen worden gepubliceerd zodra deze definitief zijn. Spelers en ouders wordt gevraagd de communicatie van hun eigen team in de gaten te houden.", en: "Current training times and team classifications will be published once final. Players and parents are asked to follow communications from their own team." },
      { nl: "Ook buiten het veld wordt hard gewerkt. Vrijwilligers bereiden de kantine, wedstrijdorganisatie en ontvangst van bezoekende clubs voor.", en: "Work is also underway off the pitch. Volunteers are preparing the canteen, match operations and the welcome for visiting clubs." },
    ],
    image: "/gallery-match.webp",
    imageAlt: { nl: "Voetbalwedstrijd op Sportpark Noord", en: "Football match at Sportpark Noord" },
  },
  {
    slug: "samen-maken-we-iedere-wedstrijddag-mogelijk",
    kind: "news",
    category: { nl: "Vrijwilligers", en: "Volunteers" },
    title: {
      nl: "Samen maken we iedere wedstrijddag mogelijk",
      en: "Together we make every matchday possible",
    },
    date: { nl: "Cluboproep", en: "Club notice" },
    published: { nl: "11 augustus 2026", en: "11 August 2026" },
    author: { nl: "Vrijwilligerscommissie", en: "Volunteer committee" },
    intro: { nl: "Een gastvrije wedstrijddag ontstaat door de inzet van veel verschillende vrijwilligers.", en: "A welcoming matchday is made possible by many different volunteers." },
    body: [
      { nl: "Van de ontvangst van teams tot de kantine en van wedstrijdzaken tot vervoer: achter iedere speeldag staat een groep betrokken clubmensen.", en: "From welcoming teams to the canteen, and from match operations to transport, every matchday is supported by committed club members." },
      { nl: "De club zoekt hulp voor vaste rollen én voor losse momenten. Zo kan iedereen bijdragen op een manier die past bij de beschikbare tijd.", en: "The club is looking for help with both regular roles and occasional shifts, allowing everyone to contribute in a way that fits their available time." },
    ],
    image: "/gallery-club.webp",
    imageAlt: { nl: "Vrijwilligers en clubleden langs het veld", en: "Volunteers and club members beside the pitch" },
  },
  {
    slug: "vliegende-start-jeugdteams",
    kind: "news",
    category: { nl: "Jeugd", en: "Youth" },
    title: {
      nl: "Alles voor een vliegende start van de jeugdteams",
      en: "Everything youth teams need for a flying start",
    },
    date: { nl: "Seizoen 26/27", en: "Season 26/27" },
    published: { nl: "7 augustus 2026", en: "7 August 2026" },
    author: { nl: "Jeugdcommissie", en: "Youth committee" },
    intro: { nl: "De jeugdafdeling bereidt zich voor op een nieuw seizoen vol voetbalplezier en ontwikkeling.", en: "The youth department is preparing for a new season full of football development and enjoyment." },
    body: [
      { nl: "Teamindelingen, trainingsmomenten en begeleiding worden stap voor stap afgerond. De betreffende teams ontvangen hun definitieve informatie via de gebruikelijke kanalen.", en: "Team classifications, training slots and staff arrangements are being finalised step by step. Teams will receive definitive information through the usual channels." },
      { nl: "Nieuwe spelers kunnen via de lidmaatschapspagina bekijken welke leeftijdscategorie bij hen past en hoe een kennismaking werkt.", en: "New players can use the membership page to find the right age category and learn how an introduction works." },
    ],
    image: "/gallery-youth.webp",
    imageAlt: { nl: "Jeugdtraining bij Roodenburg", en: "Youth training at Roodenburg" },
  },
  {
    slug: "sportpark-klaar-voor-nieuw-seizoen",
    kind: "news",
    category: { nl: "Buurt", en: "Community" },
    title: { nl: "Sportpark Noord maakt zich klaar voor een nieuw seizoen", en: "Sportpark Noord gets ready for a new season" },
    date: { nl: "12 augustus", en: "12 August" },
    published: { nl: "12 augustus 2026", en: "12 August 2026" },
    author: { nl: "Redactie Roodenburg", en: "Roodenburg editorial team" },
    intro: { nl: "Op en rond het complex worden de laatste voorbereidingen getroffen.", en: "The final preparations are being made across the grounds." },
    body: [
      { nl: "De velden en gezamenlijke ruimtes worden gecontroleerd voordat trainingen en wedstrijden weer volledig beginnen.", en: "The pitches and shared spaces are being checked before training and matches fully resume." },
      { nl: "Bezoekers vinden praktische informatie over bereikbaarheid en voorzieningen op de Sportpark-pagina.", en: "Visitors can find practical information about directions and facilities on the Sportpark page." },
    ],
    image: "/gallery-club.webp",
    imageAlt: { nl: "Sportpark Noord", en: "Sportpark Noord" },
  },
  {
    slug: "indeling-seniorenteams-bekend",
    kind: "news",
    category: { nl: "Senioren", en: "Senior teams" },
    title: { nl: "Nieuwe indeling voor de seniorenteams bekend", en: "New senior team classifications announced" },
    date: { nl: "8 augustus", en: "8 August" },
    published: { nl: "8 augustus 2026", en: "8 August 2026" },
    author: { nl: "Voetbalcommissie", en: "Football committee" },
    intro: { nl: "De eerste seniorenteams hebben hun voorlopige competitie-indeling ontvangen.", en: "The first senior teams have received their provisional competition classifications." },
    body: [
      { nl: "De indeling vormt de basis voor het programma dat later via de teampagina’s zichtbaar wordt.", en: "The classifications form the basis for the fixtures that will later appear on team pages." },
      { nl: "Wijzigingen vanuit de bond worden automatisch verwerkt zodra de officiële gegevenskoppeling actief is.", en: "Association changes will be processed automatically once the official data connection is active." },
    ],
    image: "/gallery-match.webp",
    imageAlt: { nl: "Seniorenwedstrijd bij Roodenburg", en: "Senior match at Roodenburg" },
  },
  {
    slug: "trainingstijden-jeugd-september",
    kind: "news",
    category: { nl: "Jeugd", en: "Youth" },
    title: { nl: "Trainingstijden jeugd vanaf september", en: "Youth training schedule from September" },
    date: { nl: "4 augustus", en: "4 August" },
    published: { nl: "4 augustus 2026", en: "4 August 2026" },
    author: { nl: "Jeugdcommissie", en: "Youth committee" },
    intro: { nl: "De voorlopige veldverdeling voor de jeugdtrainingen is beschikbaar.", en: "The provisional pitch allocation for youth training is available." },
    body: [
      { nl: "De trainingstijden worden per team gepubliceerd en blijven zichtbaar op de betreffende teampagina.", en: "Training times will be published per team and remain visible on the relevant team page." },
      { nl: "Teamleiders informeren spelers en ouders wanneer een tijd of veld nog verandert.", en: "Team managers will inform players and parents if a time or pitch changes." },
    ],
    image: "/gallery-youth.webp",
    imageAlt: { nl: "Jeugdspelers tijdens een training", en: "Youth players during training" },
  },
  {
    slug: "roodenburg-1-lsvv-70-wedstrijdverslag",
    kind: "report",
    category: { nl: "Wedstrijdverslag", en: "Match report" },
    title: { nl: "Roodenburg 1 begint de voorbereiding met winst", en: "Roodenburg 1 starts preseason with a win" },
    date: { nl: "22 augustus", en: "22 August" },
    published: { nl: "22 augustus 2026", en: "22 August 2026" },
    author: { nl: "Redactie Roodenburg", en: "Roodenburg editorial team" },
    intro: { nl: "Roodenburg 1 won de oefenwedstrijd tegen LSVV ’70 met 3–1.", en: "Roodenburg 1 won its friendly against LSVV ’70 3–1." },
    body: [
      { nl: "De thuisploeg begon energiek en zocht vanaf de eerste minuten de aanval. Na rust ontstond meer ruimte en wist Roodenburg het verschil te maken.", en: "The home side started energetically and attacked from the opening minutes. More space opened up after half-time and Roodenburg made the difference." },
      { nl: "De wedstrijd leverde waardevolle minuten op voor de selectie en vormde een goede eerste test richting de competitie.", en: "The match provided valuable minutes for the squad and was a useful first test ahead of the competition." },
    ],
    image: "/gallery-match.webp",
    imageAlt: { nl: "Wedstrijd van Roodenburg 1", en: "Roodenburg 1 match" },
  },
  {
    slug: "jo15-1-uvs-jo15-2-wedstrijdverslag",
    kind: "report",
    category: { nl: "Wedstrijdverslag", en: "Match report" },
    title: { nl: "JO15-1 maakt veel minuten tegen UVS", en: "JO15-1 gets valuable minutes against UVS" },
    date: { nl: "19 augustus", en: "19 August" },
    published: { nl: "19 augustus 2026", en: "19 August 2026" },
    author: { nl: "Teamredactie JO15-1", en: "JO15-1 team editorial" },
    intro: { nl: "De jeugdploeg gebruikte de oefenwedstrijd om automatismen en posities te testen.", en: "The youth side used the friendly to test patterns and positions." },
    body: [
      { nl: "Met veel wissels kreeg de hele groep speeltijd. De trainers zagen goede momenten in de opbouw en duidelijke aandachtspunten zonder bal.", en: "With plenty of substitutions, the whole group received playing time. The coaches saw promising build-up play and clear areas to improve without the ball." },
    ],
    image: "/gallery-youth.webp",
    imageAlt: { nl: "Jeugdwedstrijd bij Roodenburg", en: "Youth match at Roodenburg" },
  },
  {
    slug: "zaal-1-fc-boshuizen-wedstrijdverslag",
    kind: "report",
    category: { nl: "Wedstrijdverslag", en: "Match report" },
    title: { nl: "Zaal 1 opent oefencampagne tegen FC Boshuizen", en: "Zaal 1 opens friendly campaign against FC Boshuizen" },
    date: { nl: "16 augustus", en: "16 August" },
    published: { nl: "16 augustus 2026", en: "16 August 2026" },
    author: { nl: "Teamredactie Zaal 1", en: "Zaal 1 team editorial" },
    intro: { nl: "De zaalploeg werkte de eerste wedstrijd van de voorbereiding af.", en: "The indoor side completed its first preseason match." },
    body: [
      { nl: "Het tempo lag direct hoog. De ploeg experimenteerde met verschillende combinaties en nam nuttige lessen mee naar de volgende training.", en: "The pace was high from the start. The team experimented with different combinations and took useful lessons into the next training session." },
    ],
    image: "/gallery-match.webp",
    imageAlt: { nl: "Voetbalwedstrijd van Roodenburg", en: "Roodenburg football match" },
  },
];

export const newsItems = newsPosts.filter((post) => post.kind === "news").slice(0, 3);

export const teamGroups: Array<{
  id: string;
  title: Bilingual;
  description: Bilingual;
  teams: string[];
}> = [
  {
    id: "senioren",
    title: { nl: "Senioren", en: "Senior teams" },
    description: { nl: "Zaterdag, zondag en 30+", en: "Saturday, Sunday and 30+" },
    teams: ["Zaterdag 1–4", "Zondag 2–4", "VR30+"],
  },
  {
    id: "jeugd",
    title: { nl: "Jeugd", en: "Youth teams" },
    description: { nl: "Meiden en jongens O13–O17", en: "Girls and boys U13–U17" },
    teams: ["MO17", "JO15", "JO14", "JO13", "MO13"],
  },
  {
    id: "pupillen",
    title: { nl: "Pupillen", en: "Junior teams" },
    description: { nl: "Van de ukken tot O12", en: "From minis to U12" },
    teams: ["JO12", "MO11", "JO11", "JO10", "MO9", "JO9", "JO8", "JO7", "Ukken"],
  },
  {
    id: "zaal",
    title: { nl: "Zaalvoetbal", en: "Indoor football" },
    description: { nl: "Heren- en vrouwenteams", en: "Men’s and women’s teams" },
    teams: ["Zaal 1–12", "Zaal VR1–2"],
  },
];

export type TeamCategory = "senioren" | "jeugd" | "pupillen" | "zaal";

export type ClubTeam = {
  slug: string;
  name: string;
  category: TeamCategory;
  football: Bilingual;
  competition: string;
  training: Bilingual;
  featured?: boolean;
};

export const clubTeams: ClubTeam[] = [
  { slug: "zaterdag-1", name: "Zaterdag 1", category: "senioren", football: { nl: "Veldvoetbal", en: "Outdoor football" }, competition: "4e klasse A", training: { nl: "Di & do · 20:00", en: "Tue & Thu · 20:00" }, featured: true },
  { slug: "zaterdag-2", name: "Zaterdag 2", category: "senioren", football: { nl: "Veldvoetbal", en: "Outdoor football" }, competition: "Reserve", training: { nl: "Di & do · 20:00", en: "Tue & Thu · 20:00" } },
  { slug: "zaterdag-3", name: "Zaterdag 3", category: "senioren", football: { nl: "Veldvoetbal", en: "Outdoor football" }, competition: "Reserve", training: { nl: "Wo · 20:00", en: "Wed · 20:00" } },
  { slug: "zaterdag-4", name: "Zaterdag 4", category: "senioren", football: { nl: "Veldvoetbal", en: "Outdoor football" }, competition: "Reserve", training: { nl: "Wo · 20:00", en: "Wed · 20:00" } },
  { slug: "zondag-2", name: "Zondag 2", category: "senioren", football: { nl: "Veldvoetbal", en: "Outdoor football" }, competition: "Reserve", training: { nl: "Do · 20:00", en: "Thu · 20:00" } },
  { slug: "vr30-1", name: "VR30+ 1", category: "senioren", football: { nl: "Vrouwen 30+", en: "Women 30+" }, competition: "7 tegen 7", training: { nl: "Vr · avond", en: "Fri · evening" } },
  { slug: "jo17-1", name: "JO17-1", category: "jeugd", football: { nl: "Jongens O17", en: "Boys U17" }, competition: "KNVB jeugd", training: { nl: "Di & do", en: "Tue & Thu" } },
  { slug: "mo17-1", name: "MO17-1", category: "jeugd", football: { nl: "Meiden O17", en: "Girls U17" }, competition: "KNVB jeugd", training: { nl: "Ma & wo", en: "Mon & Wed" } },
  { slug: "jo15-1", name: "JO15-1", category: "jeugd", football: { nl: "Jongens O15", en: "Boys U15" }, competition: "KNVB jeugd", training: { nl: "Di & do", en: "Tue & Thu" }, featured: true },
  { slug: "jo14-1", name: "JO14-1", category: "jeugd", football: { nl: "Jongens O14", en: "Boys U14" }, competition: "KNVB jeugd", training: { nl: "Ma & wo", en: "Mon & Wed" } },
  { slug: "jo13-1", name: "JO13-1", category: "jeugd", football: { nl: "Jongens O13", en: "Boys U13" }, competition: "KNVB jeugd", training: { nl: "Di & do", en: "Tue & Thu" } },
  { slug: "mo13-1", name: "MO13-1", category: "jeugd", football: { nl: "Meiden O13", en: "Girls U13" }, competition: "KNVB jeugd", training: { nl: "Ma & wo", en: "Mon & Wed" } },
  { slug: "jo12-1", name: "JO12-1", category: "pupillen", football: { nl: "Jongens O12", en: "Boys U12" }, competition: "KNVB pupillen", training: { nl: "Ma & wo", en: "Mon & Wed" } },
  { slug: "mo11-1", name: "MO11-1", category: "pupillen", football: { nl: "Meiden O11", en: "Girls U11" }, competition: "KNVB pupillen", training: { nl: "Di & do", en: "Tue & Thu" } },
  { slug: "jo11-1", name: "JO11-1", category: "pupillen", football: { nl: "Jongens O11", en: "Boys U11" }, competition: "KNVB pupillen", training: { nl: "Ma & wo", en: "Mon & Wed" } },
  { slug: "jo10-1", name: "JO10-1", category: "pupillen", football: { nl: "Jongens O10", en: "Boys U10" }, competition: "KNVB pupillen", training: { nl: "Di & do", en: "Tue & Thu" } },
  { slug: "jo9-1", name: "JO9-1", category: "pupillen", football: { nl: "Jongens O9", en: "Boys U9" }, competition: "KNVB pupillen", training: { nl: "Wo", en: "Wed" } },
  { slug: "jo8-1", name: "JO8-1", category: "pupillen", football: { nl: "Jongens O8", en: "Boys U8" }, competition: "KNVB pupillen", training: { nl: "Wo", en: "Wed" } },
  { slug: "jo7-1", name: "JO7-1", category: "pupillen", football: { nl: "Jongens O7", en: "Boys U7" }, competition: "Mini-pupillen", training: { nl: "Wo", en: "Wed" } },
  { slug: "ukken", name: "Ukken", category: "pupillen", football: { nl: "Kennismaken met voetbal", en: "First steps in football" }, competition: "Training", training: { nl: "Za · ochtend", en: "Sat · morning" } },
  { slug: "zaal-1", name: "Zaal 1", category: "zaal", football: { nl: "Heren zaalvoetbal", en: "Men's futsal" }, competition: "KNVB zaal", training: { nl: "Do · avond", en: "Thu · evening" }, featured: true },
  { slug: "zaal-2", name: "Zaal 2", category: "zaal", football: { nl: "Heren zaalvoetbal", en: "Men's futsal" }, competition: "KNVB zaal", training: { nl: "Wo · avond", en: "Wed · evening" } },
  { slug: "zaal-3", name: "Zaal 3", category: "zaal", football: { nl: "Heren zaalvoetbal", en: "Men's futsal" }, competition: "KNVB zaal", training: { nl: "Vr · avond", en: "Fri · evening" } },
  { slug: "zaal-vr1", name: "Zaal VR1", category: "zaal", football: { nl: "Vrouwen zaalvoetbal", en: "Women's futsal" }, competition: "KNVB zaal", training: { nl: "Ma · avond", en: "Mon · evening" } },
];

export const sitemapGroups: Array<{
  id: string;
  title: Bilingual;
  intro: Bilingual;
  items: Array<{ title: Bilingual; detail: Bilingual }>;
}> = [
  {
    id: "membership",
    title: { nl: "Lidmaatschap", en: "Membership" },
    intro: {
      nl: "Alles van kennismaken tot contributie.",
      en: "Everything from joining to membership fees.",
    },
    items: [
      { title: { nl: "Lid worden", en: "Become a member" }, detail: { nl: "Jeugd, senioren en zaalvoetbal", en: "Youth, senior and indoor football" } },
      { title: { nl: "Contributie", en: "Membership fees" }, detail: { nl: "Tarieven en inning via NIKKI", en: "Rates and collection through NIKKI" } },
      { title: { nl: "Gegevens wijzigen", en: "Update details" }, detail: { nl: "Contactgegevens beheren", en: "Manage your contact details" } },
      { title: { nl: "Lidmaatschap opzeggen", en: "Cancel membership" }, detail: { nl: "Termijnen en formulier", en: "Deadlines and form" } },
      { title: { nl: "Kleding", en: "Club kit" }, detail: { nl: "Tenue en clubkleding", en: "Team and club clothing" } },
    ],
  },
  {
    id: "club",
    title: { nl: "De club", en: "The club" },
    intro: {
      nl: "Wie we zijn, waar we spelen en hoe je ons bereikt.",
      en: "Who we are, where we play and how to reach us.",
    },
    items: [
      { title: { nl: "Missie & waarden", en: "Mission & values" }, detail: { nl: "Onze missie, normen en waarden", en: "Our mission, standards and values" } },
      { title: { nl: "Historie", en: "History" }, detail: { nl: "Sinds 1927 en op naar 100 jaar", en: "Since 1927 and heading for 100" } },
      { title: { nl: "Sportpark Noord", en: "Sportpark Noord" }, detail: { nl: "Complex, route en medegebruik", en: "Facilities, directions and shared use" } },
      { title: { nl: "Organisatie", en: "Organisation" }, detail: { nl: "Contact, vacatures en stages", en: "Contact, vacancies and internships" } },
      { title: { nl: "Privacy", en: "Privacy" }, detail: { nl: "AVG en clubbeleid", en: "GDPR and club policy" } },
    ],
  },
  {
    id: "media",
    title: { nl: "Nieuws & media", en: "News & media" },
    intro: {
      nl: "Blijf bij met wat er binnen de club gebeurt.",
      en: "Keep up with everything happening at the club.",
    },
    items: [
      { title: { nl: "Nieuws", en: "News" }, detail: { nl: "Club- en teamberichten", en: "Club and team updates" } },
      { title: { nl: "Agenda", en: "Calendar" }, detail: { nl: "Activiteiten en belangrijke data", en: "Activities and important dates" } },
      { title: { nl: "Foto's", en: "Photos" }, detail: { nl: "Teams, jeugd, historie en activiteiten", en: "Teams, youth, history and activities" } },
      { title: { nl: "Video", en: "Video" }, detail: { nl: "Clubbeelden en archief", en: "Club footage and archive" } },
      { title: { nl: "Roodenburg-archief", en: "Roodenburg archive" }, detail: { nl: "95 jaar, reünies en oude doos", en: "95 years, reunions and heritage" } },
    ],
  },
  {
    id: "community",
    title: { nl: "Club & buurt", en: "Club & community" },
    intro: {
      nl: "Roodenburg is de hele week in beweging.",
      en: "Roodenburg is active throughout the week.",
    },
    items: [
      { title: { nl: "Vrienden van Roodenburg", en: "Friends of Roodenburg" }, detail: { nl: "Leden en aanmelden", en: "Members and registration" } },
      { title: { nl: "Actief bij Roodenburg", en: "Activities at Roodenburg" }, detail: { nl: "Sport-, wandel-, kaart- en biljartgroepen", en: "Sports, walking, cards and billiards" } },
      { title: { nl: "Studenten & bedrijven", en: "Students & businesses" }, detail: { nl: "Footy, stages en samenwerking", en: "Footy, internships and partnerships" } },
      { title: { nl: "Vrijwilligers", en: "Volunteers" }, detail: { nl: "Help mee binnen de vereniging", en: "Help out around the club" } },
    ],
  },
];
