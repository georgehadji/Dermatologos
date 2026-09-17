import Link from "next/link";
import CausticsCanvas from "./webgl/CausticsCanvas";
import { doctor, legalNav, mapsLink, nav } from "@/lib/site";

export default function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="relative overflow-hidden text-paper">
      <CausticsCanvas className="absolute inset-0 -z-10" />

      <div className="shell relative py-24 md:py-32">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <p className="display text-[clamp(2rem,5vw,3.25rem)] leading-[1.05]">
              {doctor.firstName}
              <br />
              <span className="italic text-accent-2">{doctor.lastName}</span>
            </p>
            <p className="mt-6 max-w-xs text-sm leading-relaxed text-paper/65">
              {doctor.specialty}
              <br />
              {doctor.credentials.join(" · ")}
            </p>
          </div>

          <div className="md:col-span-3">
            <p className="eyebrow !text-paper/60">Ιατρείο</p>
            <address className="mt-5 not-italic leading-relaxed text-paper/85">
              {doctor.address.street}
              <br />
              {doctor.address.area} {doctor.address.postal}
              <br />
              {doctor.address.region}
            </address>
            <a
              href={mapsLink}
              target="_blank"
              rel="noopener noreferrer"
              data-cursor="link"
              className="mt-4 inline-block text-sm text-accent-2 underline underline-offset-4"
            >
              Οδηγίες πρόσβασης
            </a>
          </div>

          <div className="md:col-span-2">
            <p className="eyebrow !text-paper/60">Ωράριο</p>
            <p className="mt-5 leading-relaxed text-paper/85">
              {doctor.hours.label}
              <br />
              {doctor.hours.open}–{doctor.hours.close}
              <br />
              <span className="text-paper/55">{doctor.hours.note}</span>
            </p>
            <a
              href={`tel:${doctor.phone}`}
              data-cursor="call"
              data-cursor-label="Κλήση"
              className="mt-4 inline-block text-lg font-medium text-paper transition-colors hover:text-accent-2"
            >
              {doctor.phoneDisplay}
            </a>
          </div>

          <nav className="md:col-span-2">
            <p className="eyebrow !text-paper/60">Πλοήγηση</p>
            <ul className="mt-3">
              {nav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    data-cursor="link"
                    className="inline-block py-2.5 text-paper/85 transition-colors hover:text-accent-2"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-20 flex flex-col gap-4 border-t border-paper/15 pt-8 text-xs text-paper/60 md:flex-row md:items-center md:justify-between">
          <p>
            © {year} {doctor.name}. Με επιφύλαξη παντός δικαιώματος.
          </p>
          <ul className="flex flex-wrap gap-6">
            {legalNav.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="inline-block py-2.5 transition-colors hover:text-paper">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <p className="mt-6 max-w-2xl text-xs leading-relaxed text-paper/60">
          Το περιεχόμενο της ιστοσελίδας έχει ενημερωτικό χαρακτήρα και δεν
          υποκαθιστά την ιατρική συμβουλή, τη διάγνωση ή τη θεραπεία. Σε επείγον
          περιστατικό καλέστε το 166 ή απευθυνθείτε στο πλησιέστερο τμήμα επειγόντων.
        </p>
      </div>
    </footer>
  );
}
