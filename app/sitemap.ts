import type { MetadataRoute } from "next";
import { getAllCantonSlugs } from "@/lib/canton-data";
import { getAllRatgeberSlugs } from "@/lib/ratgeber-data";

const BASE_URL = "https://praemien-vergleichen.ch";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date().toISOString();

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: BASE_URL,
      lastModified: now,
      changeFrequency: "weekly",
      priority: 1.0,
    },
    {
      url: `${BASE_URL}/kanton`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.9,
    },
    {
      url: `${BASE_URL}/ratgeber`,
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${BASE_URL}/datenschutz`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
    {
      url: `${BASE_URL}/impressum`,
      lastModified: now,
      changeFrequency: "yearly",
      priority: 0.3,
    },
  ];

  // Canton pages (26)
  const cantonPages: MetadataRoute.Sitemap = getAllCantonSlugs().map(
    (slug) => ({
      url: `${BASE_URL}/kanton/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })
  );

  // Ratgeber pages
  const ratgeberPages: MetadataRoute.Sitemap = getAllRatgeberSlugs().map(
    (slug) => ({
      url: `${BASE_URL}/ratgeber/${slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.7,
    })
  );

  return [...staticPages, ...cantonPages, ...ratgeberPages];
}
