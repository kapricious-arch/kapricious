import type { MetadataRoute } from "next";
import { allDepartmentEvents, flagshipEvents } from "@/data/events/index";
import { getSiteUrl } from "@/lib/seo";

const sitemap = (): MetadataRoute.Sitemap => {
  const siteUrl = getSiteUrl();
  const staticRoutes = [
    "",
    "/events",
    "/register",
    "/cultural-register",
    "/certificate",
  ].map((path) => ({
    url: `${siteUrl}${path}`,
    lastModified: new Date("2026-03-16"),
    changeFrequency: "weekly" as const,
    priority: path === "" ? 1 : 0.8,
  }));

  const flagshipRoutes = flagshipEvents.map((event) => ({
    url: `${siteUrl}/event/${event.id}`,
    lastModified: new Date("2026-03-16"),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  const departmentRoutes = allDepartmentEvents.map((event) => ({
    url: `${siteUrl}/events/${event.id}`,
    lastModified: new Date("2026-03-16"),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticRoutes, ...flagshipRoutes, ...departmentRoutes];
};

export default sitemap;
