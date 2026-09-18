import Link from "next/link";

export type Crumb = { label: string; href: string };

/*
 * Flat paper and a hairline. There was a two-stop radial bloom behind every
 * inner page — the same wash, eight times, which is how a signature turns into
 * wallpaper. The homepage hero keeps its wash; the inner pages are quiet.
 *
 * `eyebrow` is optional now. On most pages the breadcrumb above already says
 * where the reader is, so a kicker repeating it was label for label's sake.
 */
export default function PageHero({
  eyebrow,
  title,
  lead,
  crumbs = [],
  meta,
}: {
  eyebrow?: string;
  title: React.ReactNode;
  lead?: string;
  crumbs?: Crumb[];
  meta?: React.ReactNode;
}) {
  return (
    <header className="border-b border-line pb-16 pt-36 md:pb-24 md:pt-48">
      <div className="shell">
        {crumbs.length > 0 && (
          <nav aria-label="Διαδρομή" className="mb-8">
            <ol className="flex flex-wrap items-center gap-2 text-xs text-ink-3">
              <li>
                <Link href="/" className="transition-colors hover:text-accent">
                  Αρχική
                </Link>
              </li>
              {crumbs.map((c, i) => (
                <li key={c.href} className="flex items-center gap-2">
                  <span aria-hidden>/</span>
                  {i === crumbs.length - 1 ? (
                    <span className="text-ink-2">{c.label}</span>
                  ) : (
                    <Link href={c.href} className="transition-colors hover:text-accent">
                      {c.label}
                    </Link>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {eyebrow && <p className="eyebrow mb-5">{eyebrow}</p>}

        <h1 className="display max-w-[16ch] text-[clamp(2.5rem,8vw,6rem)]">{title}</h1>

        {lead && (
          <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-2 md:text-xl">{lead}</p>
        )}

        {meta && <div className="mt-10">{meta}</div>}
      </div>
    </header>
  );
}

/** BreadcrumbList JSON-LD; `crumbs` must be the same list the UI renders. */
export function breadcrumbJsonLd(crumbs: Crumb[], baseUrl: string) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [{ label: "Αρχική", href: "/" }, ...crumbs].map((c, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: c.label,
      item: `${baseUrl}${c.href === "/" ? "" : c.href}`,
    })),
  };
}
