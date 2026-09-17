import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PageHero, { breadcrumbJsonLd, type Crumb } from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import ContactBlock from "@/components/sections/ContactBlock";
import { SITE_URL, conditions, doctor } from "@/lib/site";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return conditions.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const c = conditions.find((x) => x.slug === slug);
  if (!c) return {};

  return {
    title: `${c.title} — Δερματολόγος Περαία Θεσσαλονίκης`,
    description: c.text,
    alternates: { canonical: `${SITE_URL}/patheseis/${c.slug}` },
    openGraph: {
      type: "article",
      title: `${c.title} | ${doctor.name}`,
      description: c.text,
    },
  };
}

export default async function ConditionPage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const c = conditions.find((x) => x.slug === slug);
  if (!c) notFound();

  const idx = conditions.findIndex((x) => x.slug === slug);
  const next = conditions[(idx + 1) % conditions.length];
  const crumbs: Crumb[] = [
    { label: "Παθήσεις", href: "/patheseis" },
    { label: c.title, href: `/patheseis/${c.slug}` },
  ];

  const medical = {
    "@context": "https://schema.org",
    "@type": "MedicalWebPage",
    name: c.title,
    url: `${SITE_URL}/patheseis/${c.slug}`,
    description: c.text,
    inLanguage: "el",
    lastReviewed: "2026-09-01",
    reviewedBy: { "@type": "Physician", name: doctor.name, medicalSpecialty: "Dermatology" },
    about: {
      "@type": "MedicalCondition",
      name: c.title,
      signOrSymptom: c.symptoms.map((s) => ({ "@type": "MedicalSymptom", name: s })),
    },
    specialty: "Dermatology",
  };

  return (
    <>
      <Nav />
      <main id="main">
        <JsonLd data={breadcrumbJsonLd(crumbs, SITE_URL)} />
        <JsonLd data={medical} />

        <PageHero
          eyebrow={`Πάθηση ${c.n}`}
          title={c.title}
          lead={c.intro}
          crumbs={crumbs}
        />

        <section className="section-y">
          <div className="shell grid gap-14 md:grid-cols-12">
            <Reveal className="md:col-span-6">
              <h2 className="display text-3xl md:text-4xl">Τι παρατηρείτε</h2>
              <ul className="mt-8 space-y-px border-y border-line">
                {c.symptoms.map((s) => (
                  <li key={s} className="flex gap-4 border-b border-line py-4 last:border-b-0">
                    <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
                    <span className="leading-relaxed text-ink-2">{s}</span>
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal className="md:col-span-6">
              <h2 className="display text-3xl md:text-4xl">Πότε να απευθυνθείτε σε ιατρό</h2>
              <ul className="mt-8 space-y-px border-y border-line">
                {c.whenToVisit.map((s) => (
                  <li key={s} className="flex gap-4 border-b border-line py-4 last:border-b-0">
                    <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
                    <span className="leading-relaxed text-ink-2">{s}</span>
                  </li>
                ))}
              </ul>
            </Reveal>
          </div>
        </section>

        <section className="bg-paper-2 py-20 md:py-28">
          <div className="shell grid gap-10 md:grid-cols-12">
            <h2 className="display text-3xl md:col-span-4 md:text-4xl">
              Η προσέγγιση
              <br />
              στο ιατρείο
            </h2>
            <Reveal className="md:col-span-8">
              <p className="max-w-2xl text-lg leading-relaxed text-ink-2 md:text-xl">
                {c.approach}
              </p>
              <p className="mt-8 rounded-lg border border-line bg-blush px-5 py-4 text-sm leading-relaxed text-ink-2">
                Οι πληροφορίες αυτής της σελίδας έχουν ενημερωτικό χαρακτήρα και δεν
                υποκαθιστούν την κλινική εξέταση. Η διάγνωση και η θεραπεία
                εξατομικεύονται σε κάθε περιστατικό.
              </p>
            </Reveal>
          </div>
        </section>

        <section className="section-y">
          <div className="shell">
            <Link
              href={`/patheseis/${next.slug}`}
              data-cursor="link"
              data-cursor-label="Επόμενο"
              className="group block border-t border-line pt-8"
            >
              <p className="eyebrow">Επόμενη πάθηση</p>
              <p className="display mt-4 text-[clamp(2rem,6vw,4rem)] transition-transform duration-[600ms] ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:translate-x-3">
                {next.title}
              </p>
            </Link>
          </div>
        </section>

        <ContactBlock />
      </main>
      <Footer />
    </>
  );
}
