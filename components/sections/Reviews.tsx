import Reveal from "@/components/Reveal";
import SplitLines from "@/components/SplitLines";
import { doctor } from "@/lib/site";

/**
 * The public listing gives an aggregate of 5.0 from a single rating and no
 * review text. One rating is not social proof: rendering it at display size
 * overclaims, and it is also the exact shape Google flags as review spam.
 *
 * So the section leads with what is verifiable — the record — and reports the
 * rating honestly, at the size a single rating deserves.
 */
export default function Reviews() {
  const record = [
    { k: "Ειδικότητα", v: doctor.specialty },
    { k: "Ακαδημαϊκός τίτλος", v: doctor.credentials[0] },
    { k: "Προϋπηρεσία", v: doctor.credentials[1] },
    {
      k: "Ιατρείο",
      v: `${doctor.address.street}, ${doctor.address.area} ${doctor.address.postal}`,
    },
  ];

  return (
    <section className="section-y">
      <div className="shell grid gap-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="eyebrow">Διαπιστεύσεις</p>
          <SplitLines as="h2" className="display mt-5 text-[clamp(2.25rem,6vw,4rem)]">
            Πού στηρίζεται
            <br />
            η εμπιστοσύνη
          </SplitLines>
        </div>

        <Reveal className="md:col-span-7 md:pl-8">
          <dl className="border-t border-line">
            {record.map((row) => (
              <div
                key={row.k}
                className="grid gap-1 border-b border-line py-5 sm:grid-cols-[11rem_1fr] sm:gap-6"
              >
                <dt className="eyebrow pt-1">{row.k}</dt>
                <dd className="leading-relaxed text-ink">{row.v}</dd>
              </div>
            ))}
          </dl>

          <div className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-3 text-sm text-ink-2">
            <span
              className="flex gap-0.5"
              role="img"
              aria-label={`${doctor.rating.value} στα 5 αστέρια`}
            >
              {Array.from({ length: 5 }).map((_, i) => (
                <svg key={i} viewBox="0 0 20 20" className="size-4 fill-accent" aria-hidden>
                  <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8L1.5 7.7l5.9-.9z" />
                </svg>
              ))}
            </span>
            <span>
              {doctor.rating.value.toFixed(1)} από {doctor.rating.count} αξιολόγηση σε
              δημόσιο κατάλογο επαγγελματιών υγείας.
            </span>
            <a
              href={doctor.sourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="inline-flex min-h-11 items-center gap-2 font-semibold text-accent link-line-on link-line"
            >
              Δείτε ή καταθέστε αξιολόγηση
              <svg
                viewBox="0 0 24 24"
                fill="none"
                strokeWidth="1.5"
                className="size-4 stroke-accent"
                aria-hidden
              >
                <path d="M7 17L17 7M17 7H8m9 0v9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
