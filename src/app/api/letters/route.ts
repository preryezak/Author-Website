import { NextResponse } from "next/server";

export const runtime = "edge";
export const dynamic = "force-dynamic";

const RSS_URL = "https://rss.beehiiv.com/feeds/m7Wi8T8MXS.xml";

type Letter = { title: string; link: string; pubDate: string; description: string };

function stripHtml(s: string) {
  return (s || "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}

export async function GET() {
  try {
    const res = await fetch(RSS_URL, {
      headers: { Accept: "application/rss+xml,application/xml,text/xml,*/*" },
      cache: "no-store",
    });
    if (!res.ok) {
      return NextResponse.json({ items: [] }, { status: 200 });
    }
    const xml = await res.text();
    const items: Letter[] = [];
    const itemRe = /<item>([\s\S]*?)<\/item>/g;
    let m: RegExpExecArray | null;
    const fieldRe = (tag: string) =>
      new RegExp(`<${tag}[^>]*><!\\[CDATA\\[([\\s\\S]*?)\\]\\]></${tag}>|<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, "i");
    const pick = (block: string, tag: string) => {
      const r = fieldRe(tag).exec(block);
      return r ? stripHtml(r[1] || r[2] || "") : "";
    };
    while ((m = itemRe.exec(xml)) && items.length < 12) {
      const block = m[1];
      items.push({
        title: pick(block, "title") || "Untitled",
        link: pick(block, "link") || "#",
        pubDate: pick(block, "pubDate"),
        description: pick(block, "description"),
      });
    }
    return NextResponse.json(
      { items },
      {
        status: 200,
        headers: {
          "cache-control": "public, max-age=300, stale-while-revalidate=600",
        },
      }
    );
  } catch {
    return NextResponse.json({ items: [] }, { status: 200 });
  }
}
