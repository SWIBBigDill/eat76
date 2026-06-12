import type { MetadataRoute } from "next";
import { restaurants } from "@/data/restaurants";

const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? "https://eat76.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: appUrl, lastModified: new Date(), changeFrequency: "weekly", priority: 1 },
    { url: `${appUrl}/order`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${appUrl}/pricing`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${appUrl}/restaurants`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${appUrl}/drivers`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${appUrl}/account`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${appUrl}/account/notifications`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.4 },
  ];

  const restaurantRoutes: MetadataRoute.Sitemap = restaurants.map((r) => ({
    url: `${appUrl}/order/${r.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  return [...staticRoutes, ...restaurantRoutes];
}
