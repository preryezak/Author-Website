import type { Metadata } from "next";
import ListiclePage from "@/components/site/listicle-page";
import { LISTICLES } from "@/lib/listicles";

const L = LISTICLES.signs;

export const metadata: Metadata = {
  title: { absolute: L.metaTitle },
  description: L.metaDescription,
  alternates: { canonical: "/signs" },
  robots: { index: false, follow: true },
  openGraph: { type: "website", url: "/signs", title: L.metaTitle, description: L.metaDescription, images: [{ url: "/og.png", width: 1200, height: 630, alt: "The Influential Spirit" }] },
};
export const dynamic = "force-static";

/** Ad landing page. Not in the menu or the sitemap; reached from Meta ads. */
export default function Page() {
  return <ListiclePage l={L} />;
}
