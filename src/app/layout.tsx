import type { Metadata, Viewport } from "next";
import { Newsreader, Source_Serif_4, DM_Sans } from "next/font/google";
import "./globals.css";
import "./checkout.css";
import { LAUNCH_PRICE_ENDS, GIVING } from "@/lib/site-content";
import { EDITIONS as EDITION_INFO, SELAR_URL, priceOf } from "@/lib/editions";
import MetaPixel from "@/components/site/meta-pixel";
import { META_PIXEL_ID } from "@/lib/pixel";

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
  verification: { other: { "facebook-domain-verification": "wlsg3whda7gtvstyg046vsoxqad956" } },
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
      alternativeHeadline: "30 Days to a Life of Kingdom Authority, Character, and Marketplace Impact",
      alternateName: "Becoming an Influence",
      bookEdition: "Second Edition (the first edition was titled Becoming an Influence)",
      description:
        "A 30-day Christian devotional by Pastor Eryeza Kalalu about the formation of the person behind the influence: character, integrity, leadership and faith at work, at home and in church. Each day takes ten to fifteen minutes and has a Scripture (NKJV), a reading, a reflection question, a practice for the day, a prayer and a declaration. Volume I of The Deep Encounter Library.",
      author: { "@id": `${SITE_URL}/#person` },
      publisher: { "@id": `${SITE_URL}/#person` },
      copyrightHolder: { "@id": `${SITE_URL}/#person` },
      copyrightYear: 2026,
      locationCreated: { "@type": "Place", name: "Kampala, Uganda" },
      isPartOf: { "@type": "BookSeries", name: "The Deep Encounter Library" },
      genre: ["Christian devotional", "Christian living", "Spiritual formation", "Christian leadership"],
      about: ["Spiritual formation", "Christian character", "Integrity at work", "Faith in the workplace", "Christian leadership", "Influence", "Discipleship", "Perseverance"],
      keywords: "30-day devotional, Christian devotional for work, marketplace ministry, Christian leadership devotional, spiritual formation, devotional with audiobook, African Christian author, Uganda",
      audience: { "@type": "Audience", audienceType: "Christians at work, in business, ministry and leadership; small groups and churches" },
      bookFormat: "https://schema.org/EBook",
      inLanguage: "en",
      datePublished: "2026-09-30",
      imageUrl: `${SITE_URL}/images/cover.jpg`,
      image: `${SITE_URL}/images/cover.jpg`,
      url: `${SITE_URL}/influential-spirit/`,
      workExample: [
        { "@type": "Book", name: "The Influential Spirit (Reader Edition PDF)", bookFormat: "https://schema.org/EBook", numberOfPages: 142, inLanguage: "en" },
        { "@type": "Book", name: "The Influential Spirit (EPUB for Apple Books, Kindle and Google Play Books)", bookFormat: "https://schema.org/EBook", inLanguage: "en" },
        { "@type": "Audiobook", name: "The Influential Spirit (audiobook)", bookFormat: "https://schema.org/AudiobookFormat", readBy: { "@id": `${SITE_URL}/#person` }, duration: "PT4H48M", inLanguage: "en" },
      ],
      // Reviews of the first edition (Becoming an Influence), labelled as such; no rating is claimed.
      review: [
        { "@type": "Review", name: "Review of the first edition, Becoming an Influence (Amazon Verified)", author: { "@type": "Person", name: "The Rebecca Review" }, reviewBody: "Each devotional in this book is thoughtful and has a conclusion and a short prayer which is meaningful. I felt that the message of this book was encouraging and timely for our day and age." },
        { "@type": "Review", name: "Review of the first edition, Becoming an Influence (Amazon Verified)", author: { "@type": "Person", name: "Jeff Mutenga" }, reviewBody: "This book is simple and practical and yet very instructive and inspiring." },
        { "@type": "Review", name: "Review of the first edition, Becoming an Influence (Amazon Verified)", author: { "@type": "Person", name: "Chris Gould" }, reviewBody: "Practical and full of wisdom gained from experience. This is not a dry theological treatise but is a clear explanation of the steps needed to follow Christ and be a good influence in this world." },
      ],
      // Built from src/lib/editions.ts at build time (dollar-based prices from 11 Nov 2026).
      offers: (["reader", "formation", "complete"] as const).flatMap((ed) =>
        (["USD", "KES", "NGN", "UGX"] as const).map((cur) => ({
          "@type": "Offer",
          name: EDITION_INFO[ed].name,
          price: String(priceOf(ed, cur)),
          priceCurrency: cur,
          availability: "https://schema.org/InStock",
          url: SELAR_URL[ed],
        })),
      ),
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
        {/* Meta Pixel from the head (Meta's standard placement) so PageView fires before the app hydrates; consent rules as in components/site/meta-pixel.tsx. */}
        {META_PIXEL_ID ? (
          <script
            dangerouslySetInnerHTML={{
              __html: `try{var c=null;try{c=localStorage.getItem("ek-cookie-choice")}catch(e){}if(c!=="declined"){window.__ekGeo=fetch("/api/geo",{cache:"no-store"}).then(function(r){return r.ok?r.json():null}).catch(function(){return null});var L=function(){if(window.fbq)return;!function(f,b,e,v,n,t,s){n=f.fbq=function(){n.callMethod?n.callMethod.apply(n,arguments):n.queue.push(arguments)};if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version="2.0";n.queue=[];t=b.createElement(e);t.async=!0;t.src=v;s=b.getElementsByTagName(e)[0];s.parentNode.insertBefore(t,s)}(window,document,"script","https://connect.facebook.net/en_US/fbevents.js");fbq("init","${META_PIXEL_ID}");fbq("track","PageView");if(/^.(influential-spirit|desk|signs|hear)/.test(location.pathname))fbq("track","ViewContent",{content_ids:["influential-spirit"],content_type:"product"})};var tz="";try{tz=Intl.DateTimeFormat().resolvedOptions().timeZone||""}catch(e){}if(c==="accepted"||(tz.indexOf("Africa/")===0&&tz!=="Africa/Ceuta"))L();else window.__ekGeo.then(function(g){if(g&&g.continent!=="EU")L()})}}catch(e){}`,
            }}
          />
        ) : null}
        {/* Self-hosted font files are the only font source; no Google Fonts request is made.
            No preconnects: the Beehiiv form and the iHeart player both load below the fold or on demand. */}
        {/* Prefetch (never prerender) same-origin pages on hover/touch so navigation feels instant. */}
        <script
          type="speculationrules"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({ prefetch: [{ where: { and: [{ href_matches: "/*" }, { not: { href_matches: "/api/*" } }, { not: { href_matches: "/video/*" } }] }, eagerness: "moderate" }] }),
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        {children}
        <MetaPixel />
      </body>
    </html>
  );
}
