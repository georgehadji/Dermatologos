import Link from "next/link";
import Reveal from "@/components/Reveal";
import SplitLines from "@/components/SplitLines";
import { articles } from "@/lib/articles";
import { formatDate } from "@/lib/format";

export default function ArticleTeasers({ limit }: { limit?: number }) {
  const items = [...articles]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit ?? articles.length);

  return (
    <section className="section-y">
      <div className="shell">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="eyebrow">Αρθρογραφία</p>
            <SplitLines as="h2" className="display mt-5 text-[clamp(2.25rem,6vw,4.5rem)]">
              Επιστημονικά άρθρα
            </SplitLines>
          </div>
          {limit && (
            <Link
              href="/arthra"
              data-cursor="link"
              className="text-sm font-semibold text-accent underline underline-offset-4"
            >
              Όλα τα άρθρα
            </Link>
          )}
        </div>

        <Reveal as="ul" stagger className="mt-14 grid gap-px border border-line bg-line md:grid-cols-3">
          {items.map((a) => (
            <li key={a.slug} className="bg-paper">
              <Link
                href={`/arthra/${a.slug}`}
                data-cursor="link"
                data-cursor-label="Ανάγνωση"
                className="group flex h-full flex-col p-7 transition-colors duration-500 hover:bg-paper-2 md:p-9"
              >
                <p className="eyebrow !text-accent">{a.category}</p>

                <h3 className="display mt-5 text-2xl leading-[1.15] md:text-[1.75rem]">
                  {a.title}
                </h3>

                <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-2">{a.excerpt}</p>

                <p className="mt-8 flex items-center gap-3 text-xs text-ink-3">
                  <time dateTime={a.date}>{formatDate(a.date)}</time>
                  <span aria-hidden>·</span>
                  <span>{a.readingMinutes} λεπτά ανάγνωσης</span>
                  <span
                    aria-hidden
                    className="ml-auto block h-px w-12 origin-right scale-x-50 bg-line transition-[transform,background-color] duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] group-hover:scale-x-100 group-hover:bg-accent"
                  />
                </p>
              </Link>
            </li>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
