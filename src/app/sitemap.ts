import type { MetadataRoute } from "next";
import { getLiveJobs } from "@/lib/db/jobs";
import { regions } from "@/lib/content/regions";
import { services } from "@/lib/content/services";
import { trades } from "@/lib/content/trades";
import { site } from "@/lib/site";

/**
 * Expired roles are dropped rather than listed — a sitemap full of closed jobs
 * is the fastest way to lose crawl trust in this category.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const live = await getLiveJobs(now);
  const url = (path: string) => `${site.url}${path}`;

  const staticPages: [string, number, MetadataRoute.Sitemap[number]["changeFrequency"]][] = [
    ["/", 1, "weekly"],
    ["/labour-hire", 0.9, "monthly"],
    ["/trades", 0.8, "monthly"],
    ["/sydney", 0.8, "monthly"],
    ["/jobs", 0.9, "daily"],
    ["/workers", 0.7, "monthly"],
    ["/workers/register", 0.8, "monthly"],
    ["/compliance", 0.8, "monthly"],
    ["/request-labour", 0.9, "monthly"],
    ["/contact", 0.6, "yearly"],
    ["/privacy", 0.4, "yearly"],
  ];

  return [
    ...staticPages.map(([path, priority, changeFrequency]) => ({
      url: url(path),
      lastModified: now,
      changeFrequency,
      priority,
    })),
    ...services.map((service) => ({
      url: url(`/labour-hire/${service.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...trades.map((trade) => ({
      url: url(`/trades/${trade.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...regions.map((region) => ({
      url: url(`/sydney/${region.slug}`),
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.8,
    })),
    ...live.map((job) => ({
      url: url(`/jobs/${job.slug}`),
      lastModified: new Date(job.posted),
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
  ];
}
