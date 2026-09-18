import Link from "next/link";
import Reveal from "@/components/Reveal";
import SplitLines from "@/components/SplitLines";
import Magnetic from "@/components/Magnetic";
import { doctor, mapsEmbed, mapsLink } from "@/lib/site";
import { ClockIcon, MapPinIcon, PhoneIcon } from "@/components/Icon";

export default function ContactBlock({ withForm = false }: { withForm?: boolean }) {
  return (
    <section id="epikoinonia" className="section-y bg-paper-2">
      <div className="shell grid gap-14 md:grid-cols-12">
        <div className="md:col-span-5">
          <p className="eyebrow">Επικοινωνία</p>
          <SplitLines as="h2" className="display mt-5 text-[clamp(2.25rem,6vw,4rem)]">
            Περαία,
            <br />
            Θεσσαλονίκης
          </SplitLines>

          <Reveal className="mt-10 space-y-8">
            <div>
              <p className="eyebrow flex items-center gap-2"><MapPinIcon className="size-3.5" />Διεύθυνση</p>
              <address className="mt-3 not-italic text-lg leading-relaxed text-ink">
                {doctor.address.street}
                <br />
                {doctor.address.area} {doctor.address.postal}, {doctor.address.region}
              </address>
              <a
                href={mapsLink}
                target="_blank"
                rel="noopener noreferrer"
                data-cursor="link"
                className="mt-3 inline-block text-sm text-accent link-line-on link-line"
              >
                Οδηγίες πρόσβασης
              </a>
            </div>

            <div>
              <p className="eyebrow flex items-center gap-2"><ClockIcon className="size-3.5" />Ωράριο</p>
              <p className="mt-3 text-lg text-ink">
                {doctor.hours.label} {doctor.hours.open}–{doctor.hours.close}
              </p>
              <p className="mt-1 text-sm text-ink-2">Δεκτοί ασθενείς {doctor.hours.note}.</p>
            </div>

            <div>
              <p className="eyebrow flex items-center gap-2"><PhoneIcon className="size-3.5" />Τηλέφωνο</p>
              <Magnetic strength={12}>
                <a
                  href={`tel:${doctor.phone}`}
                  data-cursor="call"
                  data-cursor-label="Κλήση"
                  className="display mt-3 inline-block text-[clamp(1.75rem,4vw,2.75rem)] text-ink transition-colors t-quick hover:text-accent"
                >
                  {doctor.phoneDisplay}
                </a>
              </Magnetic>
            </div>

            {!withForm && (
              <Link
                href="/epikoinonia"
                data-cursor="link"
                className="press inline-flex items-center gap-3 rounded-full bg-accent px-7 py-3.5 font-semibold text-paper transition-colors t-quick hover:bg-ink"
              >
                Φόρμα επικοινωνίας
              </Link>
            )}
          </Reveal>
        </div>

        <div className="md:col-span-7">
          <div className="aspect-[4/3] w-full overflow-hidden rounded-sm border border-line bg-paper md:aspect-[3/2]">
            <iframe
              src={mapsEmbed}
              title={`Χάρτης: ${doctor.addressLine}`}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen={false}
              className="size-full grayscale-[0.35] contrast-[1.05]"
            />
          </div>
          <p className="mt-4 text-xs text-ink-3">Χάρτης Google · φορτώνεται μόνο όταν εμφανιστεί στην οθόνη.</p>
        </div>
      </div>
    </section>
  );
}
