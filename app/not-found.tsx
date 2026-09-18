import Link from "next/link";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import { doctor, nav } from "@/lib/site";

export default function NotFound() {
  return (
    <>
      <Nav />
      <main id="main" className="flex min-h-[80svh] items-center pb-24 pt-40">
        <div className="shell">
          <p className="eyebrow">Σφάλμα 404</p>

          <h1 className="display mt-6 text-[clamp(3rem,12vw,9rem)] leading-[0.9]">
            Η σελίδα
            <br />
            <em className="not-italic text-accent">δεν βρέθηκε</em>
          </h1>

          <p className="mt-8 max-w-md text-lg leading-relaxed text-ink-2">
            Ο σύνδεσμος που ακολουθήσατε ίσως έχει αλλάξει ή δεν υπάρχει πλέον.
            Δοκιμάστε από την πλοήγηση παρακάτω.
          </p>

          <ul className="mt-12 flex flex-wrap gap-3">
            <li>
              <Link
                href="/"
                className="press inline-block rounded-full bg-accent px-6 py-3 text-sm font-semibold text-paper transition-colors t-quick hover:bg-ink"
              >
                Αρχική
              </Link>
            </li>
            {nav.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="press inline-block rounded-full border border-line px-6 py-3 text-sm text-ink-2 transition-colors t-quick hover:border-accent hover:text-accent"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <p className="mt-12 text-sm text-ink-3">
            Ή καλέστε απευθείας στο{" "}
            <a href={`tel:${doctor.phone}`} className="text-accent link-line-on link-line">
              {doctor.phoneDisplay}
            </a>
            .
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
