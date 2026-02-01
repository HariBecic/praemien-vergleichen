import type { Metadata } from "next";
import Script from "next/script";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://praemien-vergleichen.ch"
  ),
  title: {
    default: "Krankenkassen Prämien vergleichen 2026 | Bis zu CHF 2'000 sparen",
    template: "%s | praemien-vergleichen.ch",
  },
  description:
    "Vergleichen Sie Krankenkassenprämien 2026 kostenlos. Offizielle BAG-Daten, alle Versicherer, alle Franchisen. Jetzt Sparpotenzial berechnen.",
  keywords: [
    "Krankenkassenprämien vergleichen",
    "Krankenkasse wechseln",
    "Prämienrechner 2026",
    "Krankenkassenvergleich Schweiz",
    "Grundversicherung Prämien",
    "günstigste Krankenkasse",
  ],
  openGraph: {
    title: "Krankenkassen Prämien vergleichen 2026 | Bis zu CHF 2'000 sparen",
    description: "Kostenloser Prämienvergleich mit offiziellen BAG-Daten. Alle Versicherer auf einen Blick.",
    url: "https://praemien-vergleichen.ch",
    siteName: "praemien-vergleichen.ch",
    locale: "de_CH",
    type: "website",
  },
  alternates: { canonical: "https://praemien-vergleichen.ch" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "WebApplication",
  name: "Krankenkassen-Prämienrechner",
  url: "https://praemien-vergleichen.ch",
  description: "Kostenloser Prämienvergleich für Schweizer Krankenkassen mit offiziellen BAG-Daten",
  applicationCategory: "FinanceApplication",
  operatingSystem: "Web",
  offers: { "@type": "Offer", price: "0", priceCurrency: "CHF" },
  areaServed: { "@type": "Country", name: "Switzerland" },
  inLanguage: "de-CH",
};

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
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
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
