import type { MetadataRoute } from "next";

// Required for `output: "export"` (static export): metadata routes must be
// explicitly static.
export const dynamic = "force-static";

const SITE_URL = "https://eryezakalalu.com";

/** Every real route (trailing slash, as served). Keep in step with src/app/<route>/. */
const ROUTES: { path: string; changeFrequency: "weekly" | "monthly" | "yearly"; priority: number }[] = [
  { path: "/", changeFrequency: "weekly", priority: 1 },
  { path: "/influential-spirit/", changeFrequency: "weekly", priority: 0.9 },
  { path: "/podcast/", changeFrequency: "weekly", priority: 0.8 },
  { path: "/resources/", changeFrequency: "weekly", priority: 0.8 },
  { path: "/books/", changeFrequency: "monthly", priority: 0.7 },
  { path: "/letter/", changeFrequency: "weekly", priority: 0.7 },
  { path: "/speaking/", changeFrequency: "monthly", priority: 0.7 },
  { path: "/about/", changeFrequency: "monthly", priority: 0.6 },
  { path: "/give/", changeFrequency: "monthly", priority: 0.5 },
  { path: "/contact/", changeFrequency: "yearly", priority: 0.4 },
  { path: "/privacy/", changeFrequency: "yearly", priority: 0.2 },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  return ROUTES.map((r) => ({ url: `${SITE_URL}${r.path}`, lastModified, changeFrequency: r.changeFrequency, priority: r.priority }));
}
