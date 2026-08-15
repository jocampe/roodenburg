import { contentSource } from "./content/content-source";
import { HomePage } from "./home-page";

export const dynamic = "force-dynamic";

export default async function Home() {
  const newsItems = (await contentSource.listNewsPosts("news")).slice(0, 3);
  return <HomePage locale="nl" newsItems={newsItems} />;
}
