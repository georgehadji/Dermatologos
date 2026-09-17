import Reveal from "@/components/Reveal";
import SplitLines from "@/components/SplitLines";
import { doctor } from "@/lib/site";

/**
 * We only have the aggregate (5.0 from one rating) from the public listing —
 * no review text — so nothing here is invented. The link sends visitors to the
 * source to read or add one.
 */
export default function Reviews() {
  return (
    <section className="section-y">
      <div className="shell grid gap-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="eyebrow">Αξιολογήσεις</p>
          <SplitLines as="h2" className="display mt-5 text-[clamp(2.25rem,6vw,4rem)]">
            Τι λένε οι ασθενείς
          </SplitLines>
        </div>

        <Reveal className="md:col-span-7 md:pl-8">
          <div className="flex items-end gap-6">
            <p className="display text-[clamp(4rem,12vw,8rem)] leading-none text-accent">
              {doctor.rating.value.toFixed(1)}
            </p>
            <div className="pb-3">
              <div className="flex gap-1" role="img" aria-label={`${doctor.rating.value} στα 5 αστέρια`}>
                {Array.from({ length: 5 }).map((_, i) => (
                  <svg key={i} viewBox="0 0 20 20" className="size-5 fill-accent" aria-hidden>
                    <path d="M10 1.5l2.6 5.3 5.9.9-4.2 4.1 1 5.8-5.3-2.8-5.3 2.8 1-5.8L1.5 7.7l5.9-.9z" />
                  </svg>
                ))}
              </div>
              <p className="mt-2 text-sm text-ink-2">
                {doctor.rating.count} καταχωρημένη αξιολόγηση
              </p>
            </div>
          </div>

          <p className="mt-8 max-w-lg leading-relaxed text-ink-2">
            Οι αξιολογήσεις συγκεντρώνονται σε δημόσιο κατάλογο επαγγελματιών υγείας.
            Μπορείτε να τις δείτε αναλυτικά ή να καταθέσετε τη δική σας εμπειρία.
          </p>

          <a
            href={doctor.sourceUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-cursor="link"
            className="mt-8 inline-flex items-center gap-3 text-sm font-semibold text-accent underline underline-offset-4"
          >
            Δείτε τις αξιολογήσεις
            <svg viewBox="0 0 24 24" fill="none" strokeWidth="1.5" className="size-4 stroke-accent" aria-hidden>
              <path d="M7 17L17 7M17 7H8m9 0v9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </Reveal>
      </div>
    </section>
  );
}
