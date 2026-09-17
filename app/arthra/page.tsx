import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PageHero, { breadcrumbJsonLd, type Crumb } from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import ArticleTeasers from "@/components/sections/ArticleTeasers";
import ContactBlock from "@/components/sections/ContactBlock";
import { SITE_URL, doctor } from "@/lib/site";
import { articles } from "@/lib/articles";

export const metadata: Metadata = {
  title: "Επιστημονικά Άρθρα | Δερματολογία — Περαία Θεσσαλονίκης",
  description:
    "Άρθρα για ακμή, ψωρίαση, ατοπική δερματίτιδα, τριχόπτωση, ονυχομυκητίαση, σπίλους και αντηλιακή προστασία, γραμμένα για ασθενείς.",
  alternates: { canonical: `${SITE_URL}/arthra` },
};

const crumbs: Crumb[] = [{ label: "Άρθρα", href: "/arthra" }];

export default function ArthraPage() {
  const blog = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: `Άρθρα — ${doctor.name}`,
    url: `${SITE_URL}/arthra`,
    inLanguage: "el",
    author: { "@type": "Physician", name: doctor.name, medicalSpecialty: "Dermatology" },
    blogPost: articles.map((a) => ({
      "@type": "BlogPosting",
      headline: a.title,
      url: `${SITE_URL}/arthra/${a.slug}`,
      datePublished: a.date,
      description: a.excerpt,
    })),
  };

  return (
    <>
      <Nav />
      <main id="main">
        <JsonLd data={breadcrumbJsonLd(crumbs, SITE_URL)} />
        <JsonLd data={blog} />

        <PageHero
          eyebrow="Αρθρογραφία"
          title={
            <>
              Επιστημονικά
              <br />
              <em className="not-italic text-accent">άρθρα</em>
            </>
          }
          lead="Κείμενα για τις συχνότερες δερματολογικές παθήσεις, γραμμένα με στόχο να απαντούν στα ερωτήματα που ακούγονται πιο συχνά στο ιατρείο."
          crumbs={crumbs}
        />

        <ArticleTeasers />
        <ContactBlock />
      </main>
      <Footer />
    </>
  );
}
