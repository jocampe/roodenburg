import { contentSource } from "../../../content/content-source";

export const dynamicParams = false;

export function generateStaticParams() {
  return contentSource.listTeams().map((team) => ({ team: team.slug }));
}

export default function TeamLayout({ children }: { children: React.ReactNode }) {
  return children;
}
