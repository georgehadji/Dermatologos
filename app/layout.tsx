import type { Metadata, Viewport } from "next";
import { EB_Garamond, Manrope } from "next/font/google";
import { doctor } from "@/lib/site";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import Preloader from "@/components/Preloader";
import ScrollProgress from "@/components/ScrollProgress";
import JsonLd from "@/components/JsonLd";
import "./globals.css";

const garamond = EB_Garamond({
  subsets: ["greek", "latin"],
  weight: ["400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-eb-garamond",
  display: "swap",
});

const manrope = Manrope({
  subsets: ["greek", "latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-manrope",
  display: "swap",
});

const title = `${doctor.name} — ${doctor.specialty} | Περαία Θεσσαλονίκης`;
const description = `Δερματολογικό ιατρείο στην Περαία Θεσσαλονίκης. ${doctor.credentials.join(
  " · "
)}. Καθημερινά ${doctor.hours.open}–${doctor.hours.close}, ${doctor.hours.note}.`;

export const metadata: Metadata = {
  metadataBase: new URL("https://georgehadji.github.io/Dermatologos"),
  title,
  description,
  keywords: [
    "δερματολόγος Περαία",
    "δερματολόγος Θεσσαλονίκη",
    "αφροδισιολόγος",
    "ακμή",
    "ψωρίαση",
    "έκζεμα",
    "ατοπική δερματίτιδα",
    "παιδιατρική δερματολογία",
    doctor.name,
  ],
  authors: [{ name: doctor.name }],
  openGraph: {
    type: "website",
    locale: "el_GR",
    title,
    description,
    siteName: doctor.name,
  },
  twitter: { card: "summary_large_image", title, description },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#f7f5f0",
  width: "device-width",
  initialScale: 1,
};

/** Physician + LocalBusiness, so the practice can surface in local/map results. */
const jsonLd = {
  "@context": "https://schema.org",
  "@type": ["Physician", "MedicalBusiness"],
  name: doctor.name,
  medicalSpecialty: "Dermatology",
  description,
  telephone: doctor.phone,
  address: {
    "@type": "PostalAddress",
    streetAddress: doctor.address.street,
    addressLocality: doctor.address.area,
    addressRegion: doctor.address.region,
    postalCode: doctor.address.postal,
    addressCountry: "GR",
  },
  openingHoursSpecification: [
    {
      "@type": "OpeningHoursSpecification",
      dayOfWeek: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
      opens: doctor.hours.open,
      closes: doctor.hours.close,
    },
  ],
  aggregateRating: {
    "@type": "AggregateRating",
    ratingValue: doctor.rating.value,
    reviewCount: doctor.rating.count,
  },
  availableService: [
    "Κλινική Δερματολογία",
    "Ακμή",
    "Ψωρίαση",
    "Έκζεμα",
    "Ατοπική Δερματίτιδα",
    "Παθήσεις Τριχών",
    "Παθήσεις Ονύχων",
    "Παιδιατρική Δερματολογία",
  ].map((s) => ({ "@type": "MedicalTherapy", name: s })),
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="el" className={`${garamond.variable} ${manrope.variable}`}>
      <body className="grain antialiased">
        <JsonLd data={jsonLd} />
        <Preloader />
        <ScrollProgress />
        <Cursor />
        <SmoothScroll>{children}</SmoothScroll>
      </body>
    </html>
  );
}
