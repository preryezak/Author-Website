/**
 * Build-time RSS helpers for the author site.
 *
 * The site is deployed as a fully static export (Cloudflare Pages, output dir
 * `dist`). That means there is no Node/Edge server at runtime to serve
 * `/api/letters` or `/api/episodes`, so those feeds are read at BUILD time and
 * baked into the static HTML. Both helpers fail soft: a feed outage during the
 * build yields an empty list rather than a failed build.
 */

export type LetterItem = { title: string; link: string; pubDate: string; description: string };
export type EpisodeItem = { title: string; link: string; pubDate: string };

export const LETTERS_RSS = "https://rss.beehiiv.com/feeds/m7Wi8T8MXS.xml";
export const EPISODES_RSS = "https://anchor.fm/s/103e4e254/podcast/rss";

function decodeEntities(s: string): string {
  return (s || "")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function stripHtml(s: string): string {
  return decodeEntities(s.replace(/<[^>]+>/g, " "));
}

function field(block: string, tag: string): string {
  const re = new RegExp(
    `<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>|<${tag}[^>]*>([\\s\\S]*?)</${tag}>`,
    "i"
  );
  const m = re.exec(block);
  return m ? (m[1] ?? m[2] ?? "") : "";
}

function items(xml: string, limit: number): string[] {
  const out: string[] = [];
  const re = /<item>([\s\S]*?)<\/item>/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(xml)) && out.length < limit) out.push(m[1]);
  return out;
}

async function fetchXml(url: string): Promise<string> {
  try {
    // RSS feeds over plain HTTPS are outside Next's normal fetch caching, so
    // opt out of the build cache to always get the freshest content.
    const res = await fetch(url, {
      headers: { Accept: "application/rss+xml,application/xml,text/xml,*/*" },
      cache: "no-store",
    });
    if (!res.ok) return "";
    return await res.text();
  } catch {
    return "";
  }
}

export async function getLetters(limit = 6): Promise<LetterItem[]> {
  const xml = await fetchXml(LETTERS_RSS);
  if (!xml) return [];
  return items(xml, limit).map((b) => ({
    title: decodeEntities(field(b, "title")) || "Untitled",
    link: decodeEntities(field(b, "link")) || "#",
    pubDate: decodeEntities(field(b, "pubDate")),
    description: stripHtml(field(b, "description")),
  }));
}

export async function getEpisodes(limit = 3): Promise<EpisodeItem[]> {
  const xml = await fetchXml(EPISODES_RSS);
  if (!xml) return [];
  return items(xml, limit).map((b) => ({
    title: decodeEntities(field(b, "title")) || "Untitled",
    link: decodeEntities(field(b, "link")) || "#",
    pubDate: decodeEntities(field(b, "pubDate")),
  }));
}
