import type { MetadataRoute } from "next";

// Required for `output: "export"` (static export): metadata routes must be
// explicitly static.
export const dynamic = "force-static";

const SITE_URL = "https://eryezakalalu.com";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();
  // The site is a single page with in-page sections; only the root is a real
  // URL, so the sitemap lists it once rather than repeating fragment anchors.
  return [
    {
      url: `${SITE_URL}/`,
      lastModified,
      changeFrequency: "weekly" as const,
      priority: 1,
    },
  ];
}
