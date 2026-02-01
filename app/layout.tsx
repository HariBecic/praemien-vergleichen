import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://praemien-vergleichen.ch"
  ),
  title: {
    default: "Krankenkasse Schweiz 2026 | Prämien vergleichen & CHF 2'000 sparen",
    template: "%s | praemien-vergleichen.ch",
  },
  description:
    "Krankenkasse vergleichen 2026: Kostenloser Prämienrechner mit offiziellen BAG-Daten. Alle 27 Schweizer Krankenkassen, alle Kantone. Jetzt bis CHF 2'000 pro Jahr sparen!",
  keywords: [
    "Krankenkasse",
    "Krankenkasse Schweiz",
    "Krankenkasse vergleichen",
    "Krankenkassenprämien",
    "Krankenkassenprämien vergleichen",
    "Krankenkasse wechseln",
    "Krankenkasse 2026",
    "Prämienrechner",
    "Prämienrechner 2026",
    "Krankenkassenvergleich",
    "Krankenkassenvergleich Schweiz",
    "Grundversicherung",
    "Grundversicherung Schweiz",
    "günstigste Krankenkasse",
    "günstigste Krankenkasse Schweiz",
    "Krankenkasse wechseln Schweiz",
    "Krankenversicherung Schweiz",
    "obligatorische Krankenkasse",
    "KVG",
    "Krankenkasse Prämien",
    "Krankenkasse Franchise",
  ],
  openGraph: {
    title: "Krankenkasse Schweiz 2026 | Prämien vergleichen & CHF 2'000 sparen",
    description: "Kostenloser Krankenkassenvergleich mit offiziellen BAG-Daten. Alle 27 Schweizer Versicherer, alle Kantone. Jetzt vergleichen!",
    url: "https://praemien-vergleichen.ch",
    siteName: "praemien-vergleichen.ch",
    locale: "de_CH",
    type: "website",
    images: [
      {
        url: "/og-image.png",
        width: 1200,
        height: 630,
        alt: "Krankenkasse Schweiz - Prämienvergleich 2026",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "Krankenkasse Schweiz 2026 | Prämien vergleichen",
    description: "Kostenloser Krankenkassenvergleich mit offiziellen BAG-Daten. Bis CHF 2'000 sparen!",
    images: ["/og-image.png"],
  },
  alternates: { canonical: "https://praemien-vergleichen.ch" },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  verification: {
    google: "your-google-verification-code",
  },
  category: "finance",
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://praemien-vergleichen.ch/#organization",
  name: "praemien-vergleichen.ch",
  url: "https://praemien-vergleichen.ch",
  logo: {
    "@type": "ImageObject",
    url: "https://praemien-vergleichen.ch/logo.png",
    width: 200,
    height: 60,
  },
  description: "Unabhängiger Krankenkassenvergleich für die Schweiz mit offiziellen BAG-Daten",
  areaServed: {
    "@type": "Country",
    name: "Switzerland",
    alternateName: "Schweiz",
  },
  sameAs: [],
  contactPoint: {
    "@type": "ContactPoint",
    contactType: "customer service",
    availableLanguage: ["German"],
    areaServed: "CH",
  },
};

const webSiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "@id": "https://praemien-vergleichen.ch/#website",
  name: "praemien-vergleichen.ch - Krankenkasse Schweiz",
  alternateName: "Krankenkassen Prämienvergleich Schweiz",
  url: "https://praemien-vergleichen.ch",
  description: "Der unabhängige Krankenkassenvergleich für die Schweiz. Vergleichen Sie Prämien aller 27 Krankenkassen mit offiziellen BAG-Daten.",
  publisher: { "@id": "https://praemien-vergleichen.ch/#organization" },
  inLanguage: "de-CH",
  potentialAction: {
    "@type": "SearchAction",
    target: {
      "@type": "EntryPoint",
      urlTemplate: "https://praemien-vergleichen.ch/kanton/{search_term_string}",
    },
    "query-input": "required name=search_term_string",
  },
};

const webApplicationSchema = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  "@id": "https://praemien-vergleichen.ch/#application",
  name: "Krankenkassen-Prämienrechner Schweiz",
  url: "https://praemien-vergleichen.ch",
  description: "Kostenloser Prämienrechner für Schweizer Krankenkassen. Vergleichen Sie alle 27 Versicherer mit offiziellen BAG-Daten 2026.",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "CHF",
    description: "Kostenloser Krankenkassenvergleich",
  },
  areaServed: { "@type": "Country", name: "Switzerland" },
  inLanguage: "de-CH",
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: "4.9",
    bestRating: "5",
    worstRating: "1",
    ratingCount: "500",
    reviewCount: "127",
  },
  provider: { "@id": "https://praemien-vergleichen.ch/#organization" },
};

const serviceSchema = {
  "@context": "https://schema.org",
  "@type": "Service",
  "@id": "https://praemien-vergleichen.ch/#service",
  name: "Krankenkassen Prämienvergleich",
  serviceType: "Versicherungsvergleich",
  description: "Unabhängiger Vergleich aller Schweizer Krankenkassen-Prämien mit persönlicher Beratung",
  provider: { "@id": "https://praemien-vergleichen.ch/#organization" },
  areaServed: {
    "@type": "Country",
    name: "Switzerland",
  },
  hasOfferCatalog: {
    "@type": "OfferCatalog",
    name: "Krankenkassen-Vergleich",
    itemListElement: [
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Grundversicherung Vergleich",
          description: "Vergleich der obligatorischen Krankenpflegeversicherung (KVG)",
        },
      },
      {
        "@type": "Offer",
        itemOffered: {
          "@type": "Service",
          name: "Persönliche Beratung",
          description: "Kostenlose Beratung durch unabhängige Experten",
        },
      },
    ],
  },
  offers: {
    "@type": "Offer",
    price: "0",
    priceCurrency: "CHF",
  },
};

const breadcrumbSchema = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  itemListElement: [
    {
      "@type": "ListItem",
      position: 1,
      name: "Startseite",
      item: "https://praemien-vergleichen.ch",
    },
  ],
};

const jsonLdScripts = [
  organizationSchema,
  webSiteSchema,
  webApplicationSchema,
  serviceSchema,
  breadcrumbSchema,
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="de-CH">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap"
          rel="stylesheet"
        />
        {jsonLdScripts.map((schema, index) => (
          <script
            key={index}
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
          />
        ))}
      </head>
      <body className="font-sans antialiased text-white min-h-screen">
        <div className="mesh-bg" aria-hidden="true" />
        {children}

        {/* ── Meta Pixel (Facebook) ── */}
        {/* Replace YOUR_PIXEL_ID with your actual Facebook Pixel IDs */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window, document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '1487980762253972');
            fbq('init', '2547364825657601');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            height="1"
            width="1"
            style={{ display: "none" }}
            src="https://www.facebook.com/tr?id=1487980762253972&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </body>
    </html>
  );
}
