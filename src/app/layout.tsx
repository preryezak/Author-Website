import type { Metadata, Viewport } from "next";
import { Newsreader, Source_Serif_4, DM_Sans } from "next/font/google";
import "./globals.css";
import { LAUNCH_PRICE_ENDS, GIVING } from "@/lib/site-content";

/*
 * Fonts: variable files (no `weight` list), so each style is ONE file covering
 * every weight. The previous fixed-weight setup shipped 22 font files and
 * preloaded them all, which competed with the hero for bandwidth on mobile.
 * Now: 5 files and NO font preloads. Measured on PageSpeed Insights (mobile,
 * slow 4G), preloaded fonts (122 KB) competed with the one render-blocking
 * stylesheet; text now paints at once in a metric-matched fallback and swaps.
 * DM Sans is never set in italic, so its italic file is dropped.
 * The unused shadcn <Toaster /> (and its JS) was removed from the layout.
 */
const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  preload: false,
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  style: ["normal"],
  display: "swap",
  preload: false,
});

const SITE_URL = "https://eryezakalalu.com";
const SITE_DESCRIPTION =
  "Pastor Eryeza Kalalu writes on prayer, spiritual health and hearing God. Author of The Influential Spirit. Host of the Devotion In Season podcast.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Eryeza Kalalu · Pastor, Author & Bible Teacher",
    template: "%s · Eryeza Kalalu",
  },
  description: SITE_DESCRIPTION,
  applicationName: "Eryeza Kalalu",
  authors: [{ name: "Pastor Eryeza Kalalu" }],
  creator: "Pastor Eryeza Kalalu",
  publisher: "Eryeza Kalalu",
  keywords: [
    "Eryeza Kalalu",
    "The Influential Spirit",
    "Devotion In Season",
    "Christian discipleship",
    "prayer",
    "spiritual formation",
    "Bible teacher",
    "pastor",
    "devotional",
    "Kampala",
    "Uganda",
    "Rivers of Life Healing Centre",
  ],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE_URL,
    siteName: "Eryeza Kalalu",
    title: "Eryeza Kalalu · Pastor, Author & Bible Teacher",
    description: SITE_DESCRIPTION,
    locale: "en",
    images: [
      {
        url: "/og.png",
        width: 1200,
        height: 630,
        alt: "Eryeza Kalalu · Pastor, Author & Bible Teacher",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eryeza Kalalu · Pastor, Author & Bible Teacher",
    description: SITE_DESCRIPTION,
    images: ["/og.png"],
  },
  // Browser icon: the existing ink monogram (logo-monogram.svg) rendered on the
  // paper colour it was designed for, exported as favicon.ico and PNG frames.
  // The tile carries its own background, so the mark reads on both light and
  // dark tab bars, and it stays the same mark as the masthead. Chosen over the
  // gold monogram on ink by measurement: 15.24:1 contrast against 6.01:1, and
  // it holds its strokes at every favicon size.
  icons: {
    icon: [
      { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
      { url: "/brand/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/brand/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
  },
  manifest: "/manifest.webmanifest",
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  category: "religion",
};

export const viewport: Viewport = {
  themeColor: "#F5F0E8",
  width: "device-width",
  initialScale: 1,
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Person",
      "@id": `${SITE_URL}/#person`,
      name: "Pastor Eryeza Kalalu",
      jobTitle: "Pastor, Author & Bible Teacher",
      description:
        "Pastor Eryeza Kalalu writes on prayer, spiritual health and hearing God. Author of The Influential Spirit. Host of the Devotion In Season podcast.",
      image: `${SITE_URL}/images/author.jpg`,
      url: SITE_URL,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Kawuku",
        addressCountry: "UG",
      },
      worksFor: {
        "@type": "Organization",
        name: "Rivers of Life Healing Centre",
      },
      sameAs: [
        "https://open.spotify.com/show/7xWARwXWq7Zm3qHuyOvfrH",
        "https://podcasts.apple.com/nl/podcast/devotional-podcast/id1759589414",
        "https://www.iheart.com/podcast/269-devotion-in-season-198850928",
      ],
      // Giving (handoff P0-5): the /give/ page, which links out to Flutterwave.
      ...(GIVING.url
        ? { potentialAction: { "@type": "DonateAction", name: "Support the ministry", recipient: { "@id": `${SITE_URL}/#person` }, target: { "@type": "EntryPoint", urlTemplate: `${SITE_URL}/give/` } } }
        : {}),
    },
    {
      "@type": "Book",
      "@id": `${SITE_URL}/#book`,
      name: "The Influential Spirit",
      alternateName: "Becoming an Influence",
      description:
        "A 30-day devotional about the formation of the person behind the influence. Volume I of The Deep Encounter Library.",
      author: { "@id": `${SITE_URL}/#person` },
      bookFormat: "https://schema.org/EBook",
      inLanguage: "en",
      datePublished: "2026-09-30",
      imageUrl: `${SITE_URL}/images/cover.jpg`,
      // Launch prices run until 31 Oct 2026 (priceValidUntil). From 1 Nov the
      // full prices apply ($15 / UGX 45,000): update these on the next rebuild.
      offers: [
        {
          "@type": "Offer",
          name: "Reader Edition",
          price: "12",
          priceCurrency: "USD",
          priceValidUntil: "2026-10-31",
          availability: "https://schema.org/InStock",
          url: "https://payhip.com/b/CidbX",
        },
        {
          "@type": "Offer",
          name: "Reader Edition",
          price: "36000",
          priceCurrency: "UGX",
          priceValidUntil: "2026-10-31",
          availability: "https://schema.org/InStock",
          url: "https://selar.com/8818840887",
        },
      ],
    },
    {
      "@type": "PodcastSeries",
      "@id": `${SITE_URL}/#podcast`,
      name: "Devotion In Season",
      description:
        "Short episodes on faith, formation, and the practical realities of walking with God.",
      url: "https://www.iheart.com/podcast/269-devotion-in-season-198850928",
      author: { "@id": `${SITE_URL}/#person` },
      inLanguage: "en",
      // Live feed (verified 2026-09-22 and 2026-10-01). The old s/103e4e254 id is dead.
      webFeed: "https://anchor.fm/s/f7311ecc/podcast/rss",
      sameAs: [
        "https://www.iheart.com/podcast/269-devotion-in-season-198850928",
        "https://open.spotify.com/show/7xWARwXWq7Zm3qHuyOvfrH",
        "https://podcasts.apple.com/nl/podcast/devotional-podcast/id1759589414",
      ],
    },
    {
      "@type": "WebSite",
      "@id": `${SITE_URL}/#website`,
      url: SITE_URL,
      name: "Eryeza Kalalu",
      description: SITE_DESCRIPTION,
      inLanguage: "en",
      publisher: { "@id": `${SITE_URL}/#person` },
      copyrightHolder: { "@id": `${SITE_URL}/#person` },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${newsreader.variable} ${sourceSerif.variable} ${dmSans.variable}`}
    >
      <head>
        {/* Before first paint: the launch-price switch (components/site/price.tsx) and hiding the cookie notice for visitors who already chose (components/site/cookie-banner.tsx). */}
        <script
          dangerouslySetInnerHTML={{
            __html: `try{var d=document.documentElement;if(Date.now()>=${Date.parse(LAUNCH_PRICE_ENDS)})d.setAttribute("data-price-phase","full");if(localStorage.getItem("ek-cookie-choice"))d.classList.add("ek-cookie-set")}catch(e){}`,
          }}
        />
        {/* Self-hosted font files are the only font source; no Google Fonts request is made.
            No preconnects: the Beehiiv form and the iHeart player both load below the fold or on demand. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
