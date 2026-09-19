import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PageHero, { breadcrumbJsonLd, type Crumb } from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import ConditionsGrid from "@/components/sections/ConditionsGrid";
import ContactBlock from "@/components/sections/ContactBlock";
import { SITE_URL, conditions, doctor, pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Παθήσεις & Υπηρεσίες | Δερματολόγος Περαία Θεσσαλονίκης",
  description:
    "Ακμή, ψωρίαση, έκζεμα, ατοπική δερματίτιδα, παθήσεις τριχών και ονύχων, παιδιατρική δερματολογία. Δέκα πεδία κλινικής δερματολογίας στο ιατρείο της Περαίας.",
  path: "/patheseis",
});

const crumbs: Crumb[] = [{ label: "Παθήσεις", href: "/patheseis" }];

export default function PatheseisPage() {
  const collection = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Παθήσεις & Υπηρεσίες",
    url: `${SITE_URL}/patheseis`,
    about: { "@type": "Physician", name: doctor.name },
    hasPart: conditions.map((c) => ({
      "@type": "MedicalWebPage",
      name: c.title,
      url: `${SITE_URL}/patheseis/${c.slug}`,
      description: c.text,
    })),
  };

  return (
    <>
      <Nav />
      <main id="main">
        <JsonLd data={breadcrumbJsonLd(crumbs, SITE_URL)} />
        <JsonLd data={collection} />
        <PageHero
          title={
            <>
              Παθήσεις &amp;
              <br />
              <em className="not-italic text-accent">υπηρεσίες</em>
            </>
          }
          lead="Δέκα πεδία κλινικής δερματολογίας. Κάθε ενότητα εξηγεί τι να προσέξετε, πότε αξίζει να απευθυνθείτε σε ιατρό και πώς προσεγγίζεται στο ιατρείο."
          crumbs={crumbs}
        />
        {/* The lead above already says this; see ConditionsGrid's `intro` prop. */}
        <ConditionsGrid heading="Όλες οι παθήσεις" intro={null} showCta={false} />
        <ContactBlock />
      </main>
      <Footer />
    </>
  );
}
