import type { MetadataRoute } from "next";
import { SITE_URL, conditions } from "@/lib/site";
import { articles } from "@/lib/articles";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();

  // `as const` keeps changeFrequency a literal union; spreading through .map()
  // would otherwise widen it to string and fail the MetadataRoute.Sitemap type.
  const staticPages: MetadataRoute.Sitemap = (
    [
      { url: SITE_URL, changeFrequency: "monthly", priority: 1 },
      { url: `${SITE_URL}/iatros`, changeFrequency: "yearly", priority: 0.9 },
      { url: `${SITE_URL}/patheseis`, changeFrequency: "monthly", priority: 0.9 },
      { url: `${SITE_URL}/iatreio`, changeFrequency: "yearly", priority: 0.7 },
      { url: `${SITE_URL}/arthra`, changeFrequency: "weekly", priority: 0.8 },
      { url: `${SITE_URL}/epikoinonia`, changeFrequency: "yearly", priority: 0.9 },
      { url: `${SITE_URL}/politiki-aporritou`, changeFrequency: "yearly", priority: 0.2 },
      { url: `${SITE_URL}/oroi-chrisis`, changeFrequency: "yearly", priority: 0.2 },
    ] as const
  ).map((p) => ({ ...p, lastModified: now }));

  return [
    ...staticPages,
    ...conditions.map((c) => ({
      url: `${SITE_URL}/patheseis/${c.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...articles.map((a) => ({
      url: `${SITE_URL}/arthra/${a.slug}`,
      // Real publication date, so crawlers can tell fresh posts from old ones.
      lastModified: new Date(a.date),
      changeFrequency: "yearly" as const,
      priority: 0.6,
    })),
  ];
}
