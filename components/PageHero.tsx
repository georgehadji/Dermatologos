import Link from "next/link";
import SplitLines from "./SplitLines";
import Reveal from "./Reveal";

export type Crumb = { label: string; href: string };

export default function PageHero({
  eyebrow,
  title,
  lead,
  crumbs = [],
  meta,
}: {
  eyebrow: string;
  title: React.ReactNode;
  lead?: string;
  crumbs?: Crumb[];
  meta?: React.ReactNode;
}) {
  return (
    <header className="relative overflow-hidden border-b border-line pb-16 pt-36 md:pb-24 md:pt-48">
      {/* Soft echo of the home hero's shader, painted in CSS so inner pages stay light. */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            "radial-gradient(52% 60% at 78% 10%, color-mix(in srgb, var(--color-skin-1) 55%, transparent) 0%, transparent 60%), radial-gradient(40% 50% at 12% 0%, color-mix(in srgb, var(--color-accent-2) 14%, transparent) 0%, transparent 62%)",
        }}
      />

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

        <p className="eyebrow">{eyebrow}</p>

        <SplitLines as="h1" className="display mt-5 max-w-[16ch] text-[clamp(2.5rem,8vw,6rem)]">
          {title}
        </SplitLines>

        {lead && (
          <Reveal>
            <p className="mt-8 max-w-2xl text-lg leading-relaxed text-ink-2 md:text-xl">{lead}</p>
          </Reveal>
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
