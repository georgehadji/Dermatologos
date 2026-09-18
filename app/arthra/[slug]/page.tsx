import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import PageHero, { breadcrumbJsonLd, type Crumb } from "@/components/PageHero";
import JsonLd from "@/components/JsonLd";
import Reveal from "@/components/Reveal";
import ContactBlock from "@/components/sections/ContactBlock";
import { SITE_URL, conditions, doctor } from "@/lib/site";
import { articles, type Block } from "@/lib/articles";
import { formatDate } from "@/lib/format";

type Params = { slug: string };

export function generateStaticParams(): Params[] {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<Params>;
}): Promise<Metadata> {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  if (!a) return {};

  return {
    /*
     * No brand suffix. Greek article titles already run long, and appending the
     * doctor's name pushed several past 75 characters — truncating exactly the
     * brand the suffix was meant to reinforce.
     */
    title: a.title,
    description: a.excerpt,
    alternates: { canonical: `${SITE_URL}/arthra/${a.slug}` },
    openGraph: {
      type: "article",
      title: a.title,
      description: a.excerpt,
      publishedTime: a.date,
      authors: [doctor.name],
    },
  };
}

export default async function ArticlePage({ params }: { params: Promise<Params> }) {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);
  if (!a) notFound();

  const idx = articles.findIndex((x) => x.slug === slug);
  const next = articles[(idx + 1) % articles.length];
  const related = conditions.filter((c) => a.related.includes(c.slug));

  const crumbs: Crumb[] = [
    { label: "Άρθρα", href: "/arthra" },
    { label: a.title, href: `/arthra/${a.slug}` },
  ];

  const schema = {
    "@context": "https://schema.org",
    /*
     * MedicalWebPage, not MedicalScholarlyArticle. The latter means
     * peer-reviewed journal literature; these are patient-education pages that
     * carry their own "this does not replace an examination" disclaimer.
     * Claiming journal provenance for them misrepresents the content.
     */
    "@type": "MedicalWebPage",
    headline: a.title,
    description: a.excerpt,
    url: `${SITE_URL}/arthra/${a.slug}`,
    datePublished: a.date,
    dateModified: a.date,
    inLanguage: "el",
    articleSection: a.category,
    wordCount: a.body.reduce(
      (n, b) =>
        n +
        (b.t === "ul"
          ? b.items.join(" ").split(/\s+/).length
          : b.text.split(/\s+/).length),
      0
    ),
    author: { "@id": `${SITE_URL}/#physician` },
    image: `${SITE_URL}/arthra/${a.slug}/opengraph-image.png`,
    publisher: { "@id": `${SITE_URL}/#physician` },
    audience: { "@type": "MedicalAudience", audienceType: "Patient" },
    mainEntityOfPage: { "@type": "WebPage", "@id": `${SITE_URL}/arthra/${a.slug}` },
  };

  return (
    <>
      <Nav />
      <main id="main">
        <JsonLd data={breadcrumbJsonLd(crumbs, SITE_URL)} />
        <JsonLd data={schema} />

        <PageHero
          eyebrow={a.category}
          title={a.title}
          crumbs={crumbs}
          meta={
            <p className="flex flex-wrap items-center gap-3 text-sm text-ink-3">
              <time dateTime={a.date}>{formatDate(a.date)}</time>
              <span aria-hidden>·</span>
              <span>{a.readingMinutes} λεπτά ανάγνωσης</span>
              <span aria-hidden>·</span>
              <span>{doctor.name}</span>
            </p>
          }
        />

        <article className="section-y">
          <div className="shell grid gap-12 md:grid-cols-12">
            <Reveal className="md:col-span-8 md:col-start-3">
              <p className="display text-[clamp(1.35rem,2.6vw,1.85rem)] leading-[1.45] text-ink">
                {a.excerpt}
              </p>

              <div className="mt-12 space-y-7">
                {a.body.map((b, i) => (
                  <Prose key={i} block={b} />
                ))}
              </div>

              {related.length > 0 && (
                <aside className="mt-16 border-t border-line pt-8">
                  <p className="eyebrow">Σχετικές παθήσεις</p>
                  <ul className="mt-5 flex flex-wrap gap-3">
                    {related.map((c) => (
                      <li key={c.slug}>
                        <Link
                          href={`/patheseis/${c.slug}`}
                          data-cursor="link"
                          className="press inline-block rounded-full border border-line px-4 py-2 text-sm text-ink-2 transition-colors t-quick hover:border-accent hover:text-accent"
                        >
                          {c.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </aside>
              )}

              <Link
                href={`/arthra/${next.slug}`}
                data-cursor="link"
                data-cursor-label="Επόμενο"
                className="group mt-16 block border-t border-line pt-8"
              >
                <p className="eyebrow">Επόμενο άρθρο</p>
                <p className="display mt-4 text-[clamp(1.5rem,4vw,2.5rem)] leading-[1.15] transition-transform t-slow group-hover:translate-x-3">
                  {next.title}
                </p>
              </Link>
            </Reveal>
          </div>
        </article>

        <ContactBlock />
      </main>
      <Footer />
    </>
  );
}

function Prose({ block }: { block: Block }) {
  switch (block.t) {
    case "h":
      return <h2 className="display pt-6 text-[clamp(1.6rem,3.4vw,2.25rem)]">{block.text}</h2>;
    case "ul":
      return (
        <ul className="space-y-px border-y border-line">
          {block.items.map((item) => (
            <li key={item} className="flex gap-4 border-b border-line py-4 last:border-b-0">
              <span aria-hidden className="mt-2.5 size-1.5 shrink-0 rounded-full bg-accent" />
              <span className="leading-relaxed text-ink-2">{item}</span>
            </li>
          ))}
        </ul>
      );
    case "note":
      return (
        <p className="rounded-lg border border-line bg-blush px-5 py-4 text-sm leading-relaxed text-ink-2">
          {block.text}
        </p>
      );
    default:
      return <p className="text-lg leading-[1.75] text-ink-2">{block.text}</p>;
  }
}
