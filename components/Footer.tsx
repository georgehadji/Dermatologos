import Link from "next/link";
import FooterCaustics from "./webgl/FooterCaustics";
import { ArrowRightIcon, ClockIcon, MapPinIcon, PhoneIcon } from "./Icon";
import Year from "./Year";
import { doctor, legalNav, mapsLink, nav } from "@/lib/site";

/**
 * `isolate` is load-bearing. The caustics canvas sits at `-z-10`, and a
 * negative z-index child only paints above its parent's own background when
 * that parent is a stacking context. Without it the canvas falls behind the
 * page background and the whole footer renders as light text on cream.
 */
export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative isolate overflow-hidden bg-ink text-paper">
      <FooterCaustics className="absolute inset-0 -z-10" />

      {/*
        The caustic crests lift the background toward the accent, which drags
        small paper-coloured text under 4.5:1. This scrim holds the surface
        dark enough for body copy while the light still reads at the top edge.
      */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          // rgb(16 22 26) is --color-ink; a gradient needs the channels, not the token.
          background:
            "linear-gradient(to bottom, rgb(16 22 26 / 0) 0%, rgb(16 22 26 / 0.5) 14%, rgb(16 22 26 / 0.84) 46%, rgb(16 22 26 / 0.95) 100%)",
        }}
      />

      {/* max-md:pb-36 clears the fixed mobile call bar. */}
      <div className="shell relative py-20 max-md:pb-36 md:py-28">
        {/* ——— Action band: the one thing a visitor at the bottom still needs ——— */}
        <div className="grid gap-10 border-b border-paper/15 pb-12 md:grid-cols-12 md:items-end md:gap-8">
          <div className="md:col-span-7">
            <p className="eyebrow !text-accent-2">Χωρίς ραντεβού</p>
            <p className="display mt-4 text-[clamp(1.75rem,4vw,2.75rem)] leading-[1.12]">
              Το ιατρείο δέχεται {doctor.hours.label.toLowerCase()}
              <br />
              {doctor.hours.open}–{doctor.hours.close}.
            </p>
          </div>

          <div className="flex flex-wrap gap-3 md:col-span-5 md:justify-end">
            <a
              href={`tel:${doctor.phone}`}
              data-cursor="call"
              data-cursor-label="Κλήση"
              className="press inline-flex min-h-12 items-center gap-2.5 rounded-full bg-accent-2 px-6 py-3 font-semibold text-ink transition-colors t-quick hover:bg-paper"
            >
              <PhoneIcon className="size-4" />
              {doctor.phoneDisplay}
            </a>
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="press inline-flex min-h-12 items-center gap-2.5 rounded-full border border-paper/30 px-6 py-3 font-medium text-paper transition-colors t-quick hover:border-paper hover:bg-paper/10"
            >
              <MapPinIcon className="size-4" />
              Οδηγίες πρόσβασης
            </a>
          </div>
        </div>

        {/* ——— Colophon ——— */}
        <div className="mt-14 grid grid-cols-2 gap-x-8 gap-y-12 md:mt-16 md:grid-cols-12">
          <div className="col-span-2 md:col-span-4">
            <p className="display text-[clamp(1.75rem,4vw,2.5rem)] leading-[1.05]">
              {doctor.firstName}
              <br />
              <span className="italic text-accent-2">{doctor.lastName}</span>
            </p>
            <p className="mt-5 max-w-xs text-sm leading-relaxed text-paper/70">
              {doctor.specialty}
              <br />
              {doctor.credentials.join(" · ")}
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow !text-paper/60">Ιατρείο</p>
            <address className="mt-4 not-italic leading-relaxed text-paper/85">
              {doctor.address.street}
              <br />
              {doctor.address.area} {doctor.address.postal}
              <br />
              {doctor.address.region}
            </address>
          </div>

          <div className="md:col-span-2">
            <p className="eyebrow !text-paper/60">Ωράριο</p>
            <p className="mt-4 flex items-start gap-2 leading-relaxed text-paper/85">
              <ClockIcon className="mt-1 size-3.5 shrink-0 text-paper/60" />
              <span>
                {doctor.hours.label}
                <br />
                {doctor.hours.open}–{doctor.hours.close}
                <br />
                <span className="text-paper/60">{doctor.hours.note}</span>
              </span>
            </p>
          </div>

          <nav aria-label="Υποσέλιδο" className="col-span-2 md:col-span-3">
            <p className="eyebrow !text-paper/60">Πλοήγηση</p>
            <ul className="mt-2 grid grid-cols-2 md:grid-cols-1">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    data-cursor="link"
                    className="group inline-flex min-h-11 items-center gap-2 py-2.5 text-paper/85 transition-colors t-quick hover:text-accent-2"
                  >
                    <ArrowRightIcon className="size-3.5 -translate-x-1 opacity-0 transition t-base group-hover:translate-x-0 group-hover:opacity-100" />
                    <span className="-ml-5 transition-transform t-base group-hover:translate-x-1.5">
                      {item.label}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        {/* ——— Legal bar ——— */}
        <div className="mt-16 flex flex-col gap-3 border-t border-paper/15 pt-8 text-xs text-paper/65 md:flex-row md:items-center md:justify-between">
          <p>
            © <Year built={year} /> {doctor.name}. Με επιφύλαξη παντός δικαιώματος.
          </p>
          <ul className="flex flex-wrap gap-x-8">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-11 items-center underline-offset-4 transition-colors t-quick hover:text-paper hover:underline"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-4 max-w-3xl text-xs leading-relaxed text-paper/65">
          Το περιεχόμενο της ιστοσελίδας έχει ενημερωτικό χαρακτήρα και δεν
          υποκαθιστά την ιατρική συμβουλή, τη διάγνωση ή τη θεραπεία. Σε επείγον
          περιστατικό καλέστε το{" "}
          <a
            href="tel:166"
            className="font-semibold text-paper link-line-on link-line"
          >
            166
          </a>{" "}
          ή απευθυνθείτε στο πλησιέστερο τμήμα επειγόντων.
        </p>
      </div>
    </footer>
  );
}
