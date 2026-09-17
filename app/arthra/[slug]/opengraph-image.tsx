import { ogImage, size, contentType } from "@/lib/og";
import { articles } from "@/lib/articles";

export const alt = "Επιστημονικό άρθρο — Δερματολογικό Ιατρείο Περαία";
export { size, contentType };
// Required by output: "export" — the PNG is rendered once at build time.
export const dynamic = "force-static";


export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const a = articles.find((x) => x.slug === slug);

  return ogImage({
    eyebrow: a?.category ?? "Άρθρα",
    title: a?.title ?? "Επιστημονικά άρθρα",
    subtitle: a?.excerpt,
  });
}
