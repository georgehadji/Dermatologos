import Reveal from "./Reveal";

export type LegalSection = {
  h: string;
  p: readonly string[];
  ul?: readonly string[];
};

/** Shared long-form layout for the privacy policy and terms pages. */
export default function LegalBody({ sections }: { sections: readonly LegalSection[] }) {
  return (
    <section className="section-y">
      <div className="shell grid gap-12 md:grid-cols-12">
        <nav aria-label="Περιεχόμενα" className="md:col-span-3">
          <p className="eyebrow">Περιεχόμενα</p>
          <ol className="mt-5 space-y-2.5 md:sticky md:top-28">
            {sections.map((s) => (
              <li key={s.h}>
                <a
                  href={`#${slugify(s.h)}`}
                  className="text-sm text-ink-2 transition-colors duration-300 hover:text-accent"
                >
                  {s.h}
                </a>
              </li>
            ))}
          </ol>
        </nav>

        <div className="md:col-span-8 md:col-start-5">
          {sections.map((s) => (
            <Reveal key={s.h} className="mb-14 scroll-mt-28" as="section">
              <h2 id={slugify(s.h)} className="display scroll-mt-28 text-2xl md:text-3xl">
                {s.h}
              </h2>
              {s.p.map((text) => (
                <p key={text} className="mt-5 leading-[1.75] text-ink-2">
                  {text}
                </p>
              ))}
              {s.ul && (
                <ul className="mt-6 space-y-px border-y border-line">
                  {s.ul.map((item) => (
                    <li key={item} className="flex gap-4 border-b border-line py-3.5 last:border-b-0">
                      <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
                      <span className="leading-relaxed text-ink-2">{item}</span>
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/** Greek-aware anchor ids: strip accents, then keep Latin/Greek letters and digits. */
function slugify(s: string): string {
  return s
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^\p{Letter}\p{Number}]+/gu, "-")
    .replace(/^-|-$/g, "");
}
