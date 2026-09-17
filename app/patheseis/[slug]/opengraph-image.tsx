import { ogImage, size, contentType } from "@/lib/og";
import { conditions } from "@/lib/site";

export const alt = "Πάθηση — Δερματολογικό Ιατρείο Περαία";
export { size, contentType };
// Required by output: "export" — the PNG is rendered once at build time.
export const dynamic = "force-static";


export function generateStaticParams() {
  return conditions.map((c) => ({ slug: c.slug }));
}

export default async function Image({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const c = conditions.find((x) => x.slug === slug);

  return ogImage({
    eyebrow: "Παθήσεις & Υπηρεσίες",
    title: c?.title ?? "Παθήσεις",
    subtitle: c?.text,
  });
}
