import type { MetadataRoute } from "next";

const SITE_URL = "https://eryezakalalu.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  const sections = [
    "",
    "#top",
    "#book",
    "#author",
    "#books",
    "#podcast",
    "#thebook",
    "#editions",
    "#excerpt",
    "#reviews",
    "#questions",
    "#letter",
  ];
  return sections.map((path) => ({
    url: path === "" ? `${SITE_URL}/` : `${SITE_URL}/${path}`,
    lastModified,
    changeFrequency: path === "" ? ("weekly" as const) : ("monthly" as const),
    priority: path === "" ? 1 : 0.6,
  }));
}
