import Link from "next/link";
import { articles } from "@/lib/articles";
import { formatDate } from "@/lib/format";

/*
 * Featured-first, not three equal columns.
 *
 * Three identical cards side by side is the shape every generated page ships,
 * and it says all three articles matter equally, which they don't — the newest
 * one does. The lead spans the row and reads at display size; the rest pair up
 * underneath. An odd tail spans the row too, so the hairline mesh never opens
 * a hole.
 */
export default function ArticleTeasers({ limit }: { limit?: number }) {
  const items = [...articles]
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit ?? articles.length);

  const [lead, ...rest] = items;
  if (!lead) return null;

  return (
    <section className="section-y">
      <div className="shell">
        {/*
          The heading belongs to the homepage teaser only. On /arthra the page's
          own h1 already reads «Επιστημονικά άρθρα»; printing it again directly
          underneath said the same thing twice in two sizes.
        */}
        {limit && (
          <div className="mb-14 flex flex-wrap items-end justify-between gap-6">
            <h2 className="display text-[clamp(2.25rem,6vw,4.5rem)]">Επιστημονικά άρθρα</h2>
            <Link
              href="/arthra"
              className="text-sm font-semibold text-accent link-line-on link-line"
            >
              Όλα τα άρθρα
            </Link>
          </div>
        )}

        <ul className="grid gap-px border border-line bg-line md:grid-cols-2">
          <li className="bg-paper md:col-span-2">
            <Link
              href={`/arthra/${lead.slug}`}
              className="press-sm group flex h-full flex-col gap-6 p-7 transition-colors t-quick hover:bg-paper-2 md:flex-row md:items-baseline md:gap-12 md:p-10"
            >
              <div className="md:w-1/2">
                <p className="eyebrow !text-accent">{lead.category}</p>
                <h3 className="display mt-4 text-[clamp(1.75rem,3.6vw,2.75rem)] leading-[1.1]">
                  {lead.title}
                </h3>
              </div>
              <div className="md:w-1/2">
                <p className="leading-relaxed text-ink-2">{lead.excerpt}</p>
                <Meta date={lead.date} minutes={lead.readingMinutes} />
              </div>
            </Link>
          </li>

          {rest.map((a, i) => (
            <li
              key={a.slug}
              className={`bg-paper ${
                rest.length % 2 === 1 && i === rest.length - 1 ? "md:col-span-2" : ""
              }`}
            >
              <Link
                href={`/arthra/${a.slug}`}
                className="press-sm group flex h-full flex-col p-7 transition-colors t-quick hover:bg-paper-2 md:p-9"
              >
                <p className="eyebrow !text-accent">{a.category}</p>

                <h3 className="display mt-5 text-2xl leading-[1.15] md:text-[1.75rem]">
                  {a.title}
                </h3>

                <p className="mt-4 flex-1 text-sm leading-relaxed text-ink-2">{a.excerpt}</p>

                <Meta date={a.date} minutes={a.readingMinutes} />
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

function Meta({ date, minutes }: { date: string; minutes: number }) {
  return (
    <p className="mt-8 flex items-center gap-3 text-xs text-ink-3">
      <time dateTime={date}>{formatDate(date)}</time>
      <span aria-hidden>·</span>
      <span>{minutes} λεπτά ανάγνωσης</span>
      <span
        aria-hidden
        className="ml-auto block h-px w-12 origin-right scale-x-50 bg-line transition-[transform,background-color] t-slow group-hover:scale-x-100 group-hover:bg-accent"
      />
    </p>
  );
}
