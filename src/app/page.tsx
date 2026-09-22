import SitePage from "@/components/site/site-page";
import { getLetters, getEpisodes } from "@/lib/rss";

/**
 * Homepage. Rendered statically at build time (see next.config.ts
 * `output: "export"`), so the Beehiiv letters and Anchor/iHeart podcast
 * episode lists are fetched during the build and baked into the HTML.
 * If either feed is unreachable at build time the section falls back to its
 * empty state instead of failing the build.
 */
export const dynamic = "force-static";

export default async function Home() {
  const [letters, episodes] = await Promise.all([getLetters(6), getEpisodes(30)]);
  return <SitePage letters={letters} episodes={episodes} />;
}
