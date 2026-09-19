import { visitSteps } from "@/lib/site";

export default function VisitSteps() {
  return (
    <section id="episkepsi" className="section-y bg-blush">
      <div className="shell grid gap-14 md:grid-cols-12">
        <div className="md:col-span-4">
          {/*
            The eyebrow carries the heading role now that the display headline
            is gone. The four steps below are h3s, so something has to sit above
            them or the outline skips a level.
          */}
          <h2 className="eyebrow">Η επίσκεψη</h2>

          {/*
            Set in the display face rather than at body size. The four step
            titles below are 30px, so with this at 16px the steps outranked the
            header of their own section — the largest type in the block was the
            detail, not the frame. Promoting the existing sentence gives the
            section an anchor without claiming anything the copy did not
            already say.
          */}
          {/*
            The 4vw term is set so the deck overtakes the step titles the
            moment `md:` lifts them from 24px to 30px at 768. A gentler curve
            left the inversion in place across the whole tablet range.
          */}
          <p className="display mt-6 max-w-sm text-[clamp(1.625rem,4vw,2rem)] leading-[1.25] text-ink">
            Με ή χωρίς ραντεβού, σε σταθερό απογευματινό ωράριο. Τέσσερα βήματα,
            από την πόρτα μέχρι την επανεκτίμηση.
          </p>
        </div>

        {/*
          The rail used to fill on scroll and each step used to fade up. Four
          steps in a numbered list already read as a sequence; the scrubbing was
          the page telling the reader something the markup had already said.
        */}
        <ol className="relative md:col-span-8 md:pl-10">
          <span
            aria-hidden
            className="absolute left-0 top-2 hidden h-[calc(100%-1rem)] w-px bg-line md:block"
          />

          {visitSteps.map((s) => (
            <li key={s.n} className="relative border-b border-line py-8 last:border-b-0 md:py-10">
              <span
                aria-hidden
                className="absolute -left-10 top-10 hidden size-2 -translate-x-1/2 rounded-full bg-accent md:block"
              />
              <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:gap-10">
                <span className="font-sans text-xs tabular-nums text-ink-3">{s.n}</span>
                <div>
                  <h3 className="display text-2xl md:text-3xl">{s.title}</h3>
                  <p className="mt-3 max-w-xl leading-relaxed text-ink-2">{s.text}</p>
                </div>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
