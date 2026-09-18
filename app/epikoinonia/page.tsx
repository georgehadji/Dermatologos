import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PageHero, { breadcrumbJsonLd, type Crumb } from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import ContactForm from "@/components/ContactForm";
import ContactBlock from "@/components/sections/ContactBlock";
import { SITE_URL, doctor, pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Επικοινωνία | Δερματολόγος Περαία Θεσσαλονίκης",
  description: `Δερματολογικό ιατρείο, ${doctor.addressLine}. Τηλέφωνο ${doctor.phoneDisplay}. ${doctor.hours.label} ${doctor.hours.open}–${doctor.hours.close}, ${doctor.hours.note}.`,
  path: "/epikoinonia",
});

const crumbs: Crumb[] = [{ label: "Επικοινωνία", href: "/epikoinonia" }];

export default function EpikoinoniaPage() {
  const contactPage = {
    "@context": "https://schema.org",
    "@type": "ContactPage",
    url: `${SITE_URL}/epikoinonia`,
    inLanguage: "el",
    mainEntity: {
      "@type": "MedicalBusiness",
      name: doctor.name,
      telephone: doctor.phone,
      address: {
        "@type": "PostalAddress",
        streetAddress: doctor.address.street,
        addressLocality: doctor.address.area,
        addressRegion: doctor.address.region,
        postalCode: doctor.address.postal,
        addressCountry: "GR",
      },
    },
  };

  return (
    <>
      <Nav />
      <main id="main">
        <JsonLd data={breadcrumbJsonLd(crumbs, SITE_URL)} />
        <JsonLd data={contactPage} />

        <PageHero
          title={
            <>
              Ας μιλήσουμε
              <br />
              <em className="not-italic text-accent">για το δέρμα σας</em>
            </>
          }
          lead="Για ιατρικό ζήτημα κλείστε ραντεβού τηλεφωνικά ή επισκεφθείτε το ιατρείο εντός του ωραρίου. Η φόρμα εξυπηρετεί γενικά ερωτήματα."
          crumbs={crumbs}
        />

        <section className="section-y">
          <div className="shell grid gap-14 md:grid-cols-12">
            <div className="md:col-span-4">
              <h2 className="display text-3xl md:text-4xl">Φόρμα επικοινωνίας</h2>
              <p className="mt-6 leading-relaxed text-ink-2">
                Συμπληρώστε τα στοιχεία σας και θα λάβετε απάντηση το συντομότερο
                δυνατό. Τα πεδία με αστερίσκο είναι υποχρεωτικά.
              </p>
              <a
                href={`tel:${doctor.phone}`}
                className="display mt-8 inline-block text-[clamp(1.5rem,3.5vw,2.25rem)] transition-colors t-quick hover:text-accent"
              >
                {doctor.phoneDisplay}
              </a>
            </div>

            <div className="md:col-span-8 md:pl-8">
              <ContactForm />
            </div>
          </div>
        </section>

        <ContactBlock withForm />
      </main>
      <Footer />
    </>
  );
}
