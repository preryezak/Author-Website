import type { MetadataRoute } from "next";

// Required for `output: "export"` (static export): metadata routes must be
// explicitly static.
export const dynamic = "force-static";

/**
 * robots.txt for eryezakalalu.com.
 *
 * The author actively wants this site discoverable by search engines AND by
 * AI/LLM crawlers (the site is a citation surface for the author's books and
 * podcast), so the mainstream AI agents are allowed explicitly rather than left
 * to a wildcard. A wildcard `User-agent: *` block is still present so nothing is
 * accidentally excluded.
 *
 * If the author ever wants to opt OUT of AI training, switch those groups from
 * `allow: "/"` to `disallow: "/"`.
 */
const ALLOW_ALL = { allow: "/" as const };

const AI_AGENTS = [
  // OpenAI
  "GPTBot",
  "OAI-SearchBot",
  "ChatGPT-User",
  // Anthropic
  "ClaudeBot",
  "Claude-User",
  "Claude-SearchBot",
  "anthropic-ai",
  // Perplexity
  "PerplexityBot",
  "Perplexity-User",
  // Google (Gemini / AI training and summaries)
  "Google-Extended",
  // Apple + Amazon
  "Applebot",
  "Applebot-Extended",
  "Amazonbot",
  // Common Crawl + Meta + ByteDance + others
  "CCBot",
  "meta-externalagent",
  "facebookexternalhit",
  "Bytespider",
  "DuckAssistBot",
  "MistralAI-User",
  "cohere-ai",
];

const SEARCH_AGENTS = [
  "Googlebot",
  "Googlebot-Image",
  "Bingbot",
  "Slurp",
  "DuckDuckBot",
  "YandexBot",
  "Baiduspider",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: SEARCH_AGENTS, ...ALLOW_ALL },
      { userAgent: AI_AGENTS, ...ALLOW_ALL },
      { userAgent: "*", ...ALLOW_ALL },
    ],
    sitemap: "https://eryezakalalu.com/sitemap.xml",
    host: "https://eryezakalalu.com",
  };
}
