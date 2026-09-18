import type { Metadata, Viewport } from "next";
import { EB_Garamond, Manrope } from "next/font/google";
import { SITE_URL, doctor, mapsLink } from "@/lib/site";
import SmoothScroll from "@/components/SmoothScroll";
import Cursor from "@/components/Cursor";
import ScrollProgress from "@/components/ScrollProgress";
import MobileCallBar from "@/components/MobileCallBar";
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

const title = `${doctor.name} — Δερματολόγος Περαία Θεσσαλονίκης`;
const description = `Δερματολογικό ιατρείο στην Περαία Θεσσαλονίκης. ${doctor.credentials.join(
  " · "
)}. Καθημερινά ${doctor.hours.open}–${doctor.hours.close}, ${doctor.hours.note}.`;

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
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
  alternates: { canonical: "/" },
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
  /*
   * One canonical node for the practice. Every other page used to mint its own
   * anonymous `{"@type":"Physician", name}` stub, leaving search and AI
   * knowledge graphs to guess they all described the same person. Author,
   * publisher and reviewer references elsewhere point at these ids instead.
   */
  "@id": `${SITE_URL}/#physician`,
  url: SITE_URL,
  image: `${SITE_URL}/opengraph-image.png`,
  hasMap: mapsLink,
  /* The public directory listing the practice already appears in. */
  sameAs: [doctor.sourceUrl],
  areaServed: [
    { "@type": "City", name: "Περαία" },
    { "@type": "City", name: "Θεσσαλονίκη" },
  ],
  /*
   * No `geo` block. The street address has never been resolved to verified
   * coordinates, and an approximate pin on a walk-in clinic sends patients to
   * the wrong door — worse than no pin at all. See the launch checklist.
   */
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
  /*
   * No aggregateRating here on purpose. The only rating on record is a single
   * 5.0 from a public directory. Emitting a perfect score off one review is
   * exactly the pattern Google's review-snippet guidelines treat as spam, and a
   * manual action would cost more than the star row could ever earn.
   */
  /*
   * Conditions treated are knowledge, not services. The previous version typed
   * "Ακμή" and "Ψωρίαση" as MedicalTherapy — a disease declared as a treatment,
   * which misdescribes the practice to anything reading the graph.
   */
  knowsAbout: [
    "Κλινική Δερματολογία",
    "Ακμή",
    "Ψωρίαση",
    "Έκζεμα",
    "Ατοπική Δερματίτιδα",
    "Παθήσεις Τριχών",
    "Παθήσεις Ονύχων",
    "Παιδιατρική Δερματολογία",
  ],
  availableService: [
    { "@type": "MedicalProcedure", name: "Κλινική δερματολογική εξέταση" },
    { "@type": "MedicalProcedure", name: "Δερματοσκόπηση σπίλων" },
    { "@type": "MedicalProcedure", name: "Έλεγχος τριχωτού κεφαλής" },
    { "@type": "MedicalProcedure", name: "Εκτίμηση παθήσεων ονύχων" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="el" className={`${garamond.variable} ${manrope.variable}`}>
      <body className="grain antialiased">
        <JsonLd data={jsonLd} />

        {/*
          First thing in the tab order. Visually hidden until focused, so
          keyboard and screen-reader users can jump past the navigation
          instead of tabbing through it on every page.
        */}
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-accent focus:px-5 focus:py-3 focus:font-semibold focus:text-paper"
        >
          Μετάβαση στο περιεχόμενο
        </a>
        <ScrollProgress />
        <Cursor />
        <SmoothScroll>{children}</SmoothScroll>
        <MobileCallBar />
      </body>
    </html>
  );
}
