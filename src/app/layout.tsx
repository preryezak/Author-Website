import type { Metadata, Viewport } from "next";
import { Newsreader, Source_Serif_4, DM_Sans } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/toaster";

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
});

const sourceSerif = Source_Serif_4({
  variable: "--font-source-serif",
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  display: "swap",
});

const dmSans = DM_Sans({
  variable: "--font-dm-sans",
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  style: ["normal", "italic"],
  display: "swap",
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
        url: "/images/cover.jpg",
        width: 1200,
        height: 1800,
        alt: "The Influential Spirit · book cover by Eryeza Kalalu",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Eryeza Kalalu · Pastor, Author & Bible Teacher",
    description: SITE_DESCRIPTION,
    images: ["/images/cover.jpg"],
  },
  icons: {
    icon: [
      { url: "/brand/logo-monogram.svg", type: "image/svg+xml" },
    ],
    apple: [{ url: "/brand/logo-monogram.svg" }],
  },
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
      offers: [
        {
          "@type": "Offer",
          name: "Digital Pre-order Edition",
          price: "12",
          priceCurrency: "USD",
          availability: "https://schema.org/PreOrder",
          url: "https://payhip.com/b/CidbX",
        },
        {
          "@type": "Offer",
          name: "Digital Pre-order Edition",
          price: "36000",
          priceCurrency: "UGX",
          availability: "https://schema.org/PreOrder",
          url: "https://selar.com/8818840887",
        },
      ],
    },
    {
      "@type": "PodcastSeries",
      name: "Devotion In Season",
      description:
        "Short episodes on faith, formation, and the practical realities of walking with God.",
      url: "https://www.iheart.com/podcast/269-devotion-in-season-198850928",
      author: { "@id": `${SITE_URL}/#person` },
      webFeed: "https://anchor.fm/s/103e4e254/podcast/rss",
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
        {/* Beehiiv attribution · keeps subscribe tracking from the embedded iframe */}
        <script
          async
          src="https://subscribe-forms.beehiiv.com/attribution.js"
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      </head>
      <body className="antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
