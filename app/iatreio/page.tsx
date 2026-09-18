import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PageHero, { breadcrumbJsonLd, type Crumb } from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import LensReveal from "@/components/LensReveal";
import VisitSteps from "@/components/sections/VisitSteps";
import ContactBlock from "@/components/sections/ContactBlock";
import { SITE_URL, clinicImages, doctor, pageMetadata } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Το Ιατρείο | Δερματολογικό Ιατρείο Περαία Θεσσαλονίκης",
  description: `Ο χώρος του δερματολογικού ιατρείου στην ${doctor.address.area}, ${doctor.address.street}. Υποδοχή, αναμονή και εξεταστήριο.`,
  path: "/iatreio",
});

const crumbs: Crumb[] = [{ label: "Το Ιατρείο", href: "/iatreio" }];

export default function IatreioPage() {
  return (
    <>
      <Nav />
      <main id="main">
        <JsonLd data={breadcrumbJsonLd(crumbs, SITE_URL)} />

        <PageHero
          title={
            <>
              Το
              <br />
              <em className="not-italic text-accent">ιατρείο</em>
            </>
          }
          crumbs={crumbs}
        />

        <section className="section-y">
          <div className="shell">
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {clinicImages.map((img, i) => (
                <li key={img.src} className={i === 0 ? "sm:col-span-2" : undefined}>
                  <LensReveal
                    src={img.src}
                    alt={img.alt}
                    priority={i === 0}
                    radius={i === 0 ? 140 : 100}
                    className={`w-full rounded-sm ${i === 0 ? "aspect-[16/10]" : "aspect-[4/5]"}`}
                  />
                  <p className="mt-4 flex items-baseline gap-3 text-sm text-ink-2">
                    <span className="font-sans text-xs tabular-nums text-ink-3">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    {img.caption}
                  </p>
                </li>
              ))}
            </ul>

          </div>
        </section>

        <VisitSteps />
        <ContactBlock />
      </main>
      <Footer />
    </>
  );
}
