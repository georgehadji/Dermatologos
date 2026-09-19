import Link from "next/link";
import LensReveal from "@/components/LensReveal";
import { conditions, doctor } from "@/lib/site";

/**
 * Two layouts, one section.
 *
 * On /iatros (`full`) this is still portrait-left, name-right: nothing above it
 * on that page carries either. On the homepage the hero now holds the portrait
 * and the name, so repeating both here was the same face and the same words
 * twice inside one scroll. The teaser instead leads with the credential that
 * separates this practice from the next listing, and the prose sits opposite.
 */
export default function DoctorIntro({ full = false }: { full?: boolean }) {
  const prose = (
    <div className="space-y-5 text-lg leading-relaxed text-ink-2">
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
            Το ιατρείο δέχεται καθημερινά τις απογευματινές ώρες, με ή χωρίς
            ραντεβού. Όποιος θέλει προγραμματίζει τηλεφωνικά· όποιος δεν
            προλαβαίνει, έρχεται απευθείας. Η δεύτερη επιλογή μετράει σε οξέα
            περιστατικά, όπως ένα εξάνθημα που εμφανίστηκε ξαφνικά.
          </p>
        </>
      )}
    </div>
  );

  /*
   * /iatros only. On the homepage both tiles said something the reader had
   * just been told: the hours are on the hero's utility strip a screen above,
   * and "10 πεδία" is the eyebrow of the section immediately below. On /iatros
   * neither of those is on the page, so the tiles carry their own weight.
   *
   * Two stats, not three. The third was the 5.0 rating, rendered at display
   * size in accent — off a single review. Reviews.tsx says in its own docblock
   * that showing it that way overclaims; this section was doing exactly that,
   * two screens above.
   */
  const stats = (
    <ul className="mt-12 grid grid-cols-2 gap-px border border-line bg-line">
      <Stat value={String(conditions.length)} label="Πεδία κλινικής δερματολογίας" />
      <Stat
        value={`${doctor.hours.open}–${doctor.hours.close}`}
        label="Καθημερινά, με ή χωρίς ραντεβού"
      />
    </ul>
  );

  return (
    <section id="iatros" className="section-y">
      <div className="shell grid gap-16 md:grid-cols-12 md:gap-12">
        {full ? (
          <>
            <div className="md:col-span-5">
              <LensReveal
                src="/images/dermatologos-athanasios-chrysospathis.webp"
                detailSrc="/images/dermatologos-athanasios-chrysospathis.webp"
                alt={`${doctor.name}, ${doctor.specialty}`}
                className="aspect-[4/5] w-full rounded-sm"
                radius={128}
                priority
              />
            </div>

            <div className="md:col-span-7 md:pl-8">
              <h2 className="display text-[clamp(2.25rem,6vw,4.5rem)]">
                {doctor.firstName}{" "}
                <em className="not-italic text-accent">{doctor.lastName}</em>
              </h2>
              <div className="mt-8">{prose}</div>
              {stats}
            </div>
          </>
        ) : (
          <>
            {/*
              The heading is a credential, not a promise. The obvious candidate
              was the "ο ασθενής φεύγει γνωρίζοντας…" sentence from the prose
              below, but CONTENT.md files that paragraph as copy the practice
              has not reviewed, and a heading is the loudest place on the page
              to put a claim nobody has signed off. The directorship at 424 ΓΣΝΕ
              is on the public listing, so it can carry the weight instead. The
              sentence stays in the body, at the size it has always been.

              Sentence scale, not name scale — the same reason PageHero carries
              a `compact` flag. Set at 4.5rem this reads as a slogan; at 2.75rem
              it reads as something the practice means.
            */}
            <h2 className="display text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.12] md:col-span-5">
              Νοσοκομειακή εμπειρία,{" "}
              <em className="not-italic text-accent">στο ιατρείο της Περαίας</em>
            </h2>

            <div className="md:col-span-6 md:col-start-7">
              {prose}
              <Link
                href="/iatros"
                className="link-line-on link-line mt-10 inline-flex items-center gap-3 text-sm font-semibold text-accent"
              >
                Περισσότερα για τον ιατρό
              </Link>
            </div>
          </>
        )}
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
