import Link from "next/link";
import LensReveal from "@/components/LensReveal";
import Reveal from "@/components/Reveal";
import SplitLines from "@/components/SplitLines";
import { conditions, doctor } from "@/lib/site";

export default function DoctorIntro({ full = false }: { full?: boolean }) {
  return (
    <section id="iatros" className="section-y">
      <div className="shell grid gap-16 md:grid-cols-12 md:gap-12">
        <div className="md:col-span-5">
          <LensReveal
            src="/images/doctor-portrait.png"
            detailSrc="/images/doctor-portrait.png"
            alt={`${doctor.name}, ${doctor.specialty}`}
            className="aspect-[4/5] w-full rounded-sm"
            radius={128}
            priority
          />
          <p className="mt-4 text-xs text-ink-3">
            Περάστε τον δείκτη πάνω από τη φωτογραφία — ο φακός λειτουργεί όπως ένα
            δερματοσκόπιο.
          </p>
        </div>

        <div className="md:col-span-7 md:pl-8">
          <p className="eyebrow">Ο Ιατρός</p>

          <SplitLines as="h2" className="display mt-5 text-[clamp(2.25rem,6vw,4.5rem)]">
            {doctor.firstName}{" "}
            <em className="not-italic text-accent">{doctor.lastName}</em>
          </SplitLines>

          <Reveal className="mt-8 space-y-5 text-lg leading-relaxed text-ink-2">
            <p>
              Δερματολόγος — Αφροδισιολόγος, Διδάκτωρ του Δημοκρίτειου Πανεπιστημίου
              Θράκης και πρώην Διευθυντής της Δερματολογικής Κλινικής του 424 Γενικού
              Στρατιωτικού Νοσοκομείου Εκπαιδεύσεως.
            </p>
            <p>
              Το ιατρείο στην Περαία λειτουργεί με προσανατολισμό στην κλινική
              δερματολογία: στη διάγνωση που τεκμηριώνεται και στη θεραπεία που
              εξηγείται. Ο ασθενής φεύγει γνωρίζοντας τι έχει, τι θα κάνει, για πόσο
              και τι αναμένεται να συμβεί.
            </p>
            {full && (
              <>
                <p>
                  Η νοσοκομειακή εμπειρία σε δερματολογική κλινική διαμορφώνει έναν
                  τρόπο εξέτασης που δεν περιορίζεται στη βλάβη που φέρνει τον ασθενή
                  στο ιατρείο. Η επισκόπηση είναι συνολική, γιατί πολλά δερματικά
                  ευρήματα αποκτούν νόημα μόνο σε συνδυασμό μεταξύ τους ή με το
                  γενικό ιστορικό.
                </p>
                <p>
                  Το ιατρείο δέχεται χωρίς ραντεβού, καθημερινά τις απογευματινές ώρες.
                  Η επιλογή αυτή εξυπηρετεί όσους δεν μπορούν να προγραμματίσουν
                  επίσκεψη μέρες νωρίτερα, ιδίως σε οξέα περιστατικά όπως ένα
                  εξάνθημα που εμφανίστηκε ξαφνικά.
                </p>
              </>
            )}
          </Reveal>

          <Reveal as="ul" stagger className="mt-12 grid grid-cols-2 gap-px border border-line bg-line sm:grid-cols-3">
            <Stat value={String(conditions.length)} label="Πεδία κλινικής δερματολογίας" />
            <Stat value={`${doctor.hours.open}–${doctor.hours.close}`} label="Καθημερινά, χωρίς ραντεβού" />
            <Stat
              value={doctor.rating.value.toFixed(1)}
              label={`Αξιολόγηση (${doctor.rating.count})`}
            />
          </Reveal>

          {!full && (
            <Link
              href="/iatros"
              data-cursor="link"
              className="mt-10 inline-flex items-center gap-3 text-sm font-semibold text-accent underline underline-offset-4"
            >
              Περισσότερα για τον ιατρό
            </Link>
          )}
        </div>
      </div>
    </section>
  );
}

function Stat({ value, label }: { value: string; label: string }) {
  return (
    <li className="bg-paper px-5 py-6">
      <p className="display text-3xl text-accent md:text-4xl">{value}</p>
      <p className="mt-2 text-xs leading-snug text-ink-2">{label}</p>
    </li>
  );
}
