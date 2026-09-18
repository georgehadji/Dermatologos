import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PageHero, { breadcrumbJsonLd, type Crumb } from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import DoctorIntro from "@/components/sections/DoctorIntro";
import VisitSteps from "@/components/sections/VisitSteps";
import ContactBlock from "@/components/sections/ContactBlock";
import { SITE_URL, doctor, pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: `Ο Ιατρός — ${doctor.name} | Δερματολόγος Περαία`,
  description: `${doctor.name}, ${doctor.specialty}. ${doctor.credentials.join(
    " · "
  )}. Δερματολογικό ιατρείο στην Περαία Θεσσαλονίκης.`,
  path: "/iatros",
});

const crumbs: Crumb[] = [{ label: "Ο Ιατρός", href: "/iatros" }];

export default function IatrosPage() {
  return (
    <>
      <Nav />
      <main id="main">
        <JsonLd data={breadcrumbJsonLd(crumbs, SITE_URL)} />
        <PageHero
          eyebrow="Ο Ιατρός"
          title={
            <>
              Διάγνωση
              <br />
              <em className="not-italic text-accent">που εξηγείται</em>
            </>
          }
          lead="Κλινική δερματολογία με νοσοκομειακό υπόβαθρο, σε ιατρείο που δέχεται χωρίς ραντεβού."
          crumbs={crumbs}
        />
        <DoctorIntro full />
        <VisitSteps />
        <ContactBlock />
      </main>
      <Footer />
    </>
  );
}
