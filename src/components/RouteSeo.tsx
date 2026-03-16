import { useEffect } from "react";
import { matchPath, useLocation } from "react-router-dom";
import {
  allDepartmentEvents,
  flagshipEvents,
  getDepartmentEventById,
  getEventById,
} from "@/data/events/index";

const SITE_NAME = "Kapricious 2026";
const SITE_TITLE = "Kapricious 2026 | Tech Fest at KMEA Engineering College, Edathala, Aluva";
const DEFAULT_DESCRIPTION =
  "Kapricious 2026 is the flagship tech fest of KMEA Engineering College, Edathala, Aluva, Kerala. Explore flagship events, department competitions, cultural programs, and registrations for March 27-28, 2026.";
const DEFAULT_KEYWORDS = [
  "Kapricious 2026",
  "KMEA tech fest",
  "KMEA Engineering College",
  "KMEA College Edathala",
  "Edathala Aluva tech fest",
  "Kerala engineering college fest",
  "college tech fest 2026",
  "department events",
  "cultural events",
];
const DEFAULT_IMAGE_PATH = "/logo.png";
const ORGANIZATION_NAME = "KMEA Engineering College";
const ORGANIZATION_EMAIL = "kapricious@kmeacollege.ac.in";
const ORGANIZATION_ADDRESS = {
  "@type": "PostalAddress",
  addressLocality: "Aluva",
  addressRegion: "Kerala",
  addressCountry: "IN",
};
const VENUE_PLACE = {
  "@type": "Place",
  name: "KMEA Engineering College",
  address: ORGANIZATION_ADDRESS,
};

type SeoConfig = {
  title: string;
  description: string;
  keywords?: string[];
  robots?: string;
  image?: string;
  schema?: Record<string, unknown> | Array<Record<string, unknown>>;
};

const trimTrailingSlash = (value: string) => value.replace(/\/+$/, "");

const buildAbsoluteUrl = (origin: string, path: string) => {
  if (/^https?:\/\//i.test(path)) return path;
  return `${origin}${path.startsWith("/") ? path : `/${path}`}`;
};

const toIsoDate = (value: string) => {
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return undefined;
  }

  return parsedDate.toISOString().split("T")[0];
};

const createOrganizationSchema = (origin: string) => ({
  "@context": "https://schema.org",
  "@type": "CollegeOrUniversity",
  name: ORGANIZATION_NAME,
  url: origin,
  email: ORGANIZATION_EMAIL,
  address: ORGANIZATION_ADDRESS,
});

const createWebsiteSchema = (origin: string) => ({
  "@context": "https://schema.org",
  "@type": "WebSite",
  name: SITE_NAME,
  url: origin,
  description: DEFAULT_DESCRIPTION,
});

const createFestivalSchema = (origin: string, canonicalUrl: string, imageUrl: string) => ({
  "@context": "https://schema.org",
  "@type": "Festival",
  name: SITE_NAME,
  description: DEFAULT_DESCRIPTION,
  url: canonicalUrl,
  image: imageUrl,
  startDate: "2026-03-27",
  endDate: "2026-03-28",
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: VENUE_PLACE,
  organizer: {
    "@type": "CollegeOrUniversity",
    name: ORGANIZATION_NAME,
    url: origin,
    email: ORGANIZATION_EMAIL,
  },
});

const createEventListSchema = (origin: string) => ({
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "Kapricious 2026 Events",
  itemListElement: [
    ...flagshipEvents.map((event, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: event.title,
      url: `${origin}/event/${event.id}`,
    })),
    ...allDepartmentEvents.map((event, index) => ({
      "@type": "ListItem",
      position: flagshipEvents.length + index + 1,
      name: event.title,
      url: `${origin}/events/${event.id}`,
    })),
  ],
});

const createPageSchema = (name: string, description: string, canonicalUrl: string) => ({
  "@context": "https://schema.org",
  "@type": "WebPage",
  name,
  description,
  url: canonicalUrl,
});

const createEventSchema = ({
  name,
  description,
  canonicalUrl,
  imageUrl,
  startDate,
  venue,
}: {
  name: string;
  description: string;
  canonicalUrl: string;
  imageUrl: string;
  startDate?: string;
  venue: string;
}) => ({
  "@context": "https://schema.org",
  "@type": "Event",
  name,
  description,
  url: canonicalUrl,
  image: imageUrl,
  ...(startDate ? { startDate } : {}),
  eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
  eventStatus: "https://schema.org/EventScheduled",
  location: {
    "@type": "Place",
    name: venue,
    address: ORGANIZATION_ADDRESS,
  },
  organizer: {
    "@type": "CollegeOrUniversity",
    name: ORGANIZATION_NAME,
    email: ORGANIZATION_EMAIL,
  },
});

const upsertMetaTag = (selector: string, attributes: Record<string, string>, content?: string) => {
  const existing = document.head.querySelector<HTMLMetaElement>(selector);

  if (!content) {
    existing?.remove();
    return;
  }

  const metaTag = existing ?? document.createElement("meta");

  Object.entries(attributes).forEach(([key, value]) => {
    metaTag.setAttribute(key, value);
  });

  metaTag.setAttribute("content", content);

  if (!existing) {
    document.head.appendChild(metaTag);
  }
};

const upsertLinkTag = (rel: string, href: string) => {
  const existing = document.head.querySelector<HTMLLinkElement>(`link[rel="${rel}"]`);
  const linkTag = existing ?? document.createElement("link");

  linkTag.setAttribute("rel", rel);
  linkTag.setAttribute("href", href);

  if (!existing) {
    document.head.appendChild(linkTag);
  }
};

const upsertJsonLd = (schema?: Record<string, unknown> | Array<Record<string, unknown>>) => {
  const existing = document.getElementById("route-seo-json-ld");

  if (!schema) {
    existing?.remove();
    return;
  }

  const scriptTag = existing ?? document.createElement("script");
  scriptTag.id = "route-seo-json-ld";
  scriptTag.setAttribute("type", "application/ld+json");
  scriptTag.textContent = JSON.stringify(schema);

  if (!existing) {
    document.head.appendChild(scriptTag);
  }
};

const RouteSeo = () => {
  const location = useLocation();

  useEffect(() => {
    const rawSiteUrl = import.meta.env.VITE_SITE_URL?.trim();
    const origin = trimTrailingSlash(rawSiteUrl || window.location.origin);
    const pathname = location.pathname === "/" ? "/" : trimTrailingSlash(location.pathname);
    const canonicalUrl = `${origin}${pathname === "/" ? "" : pathname}`;
    const defaultImageUrl = buildAbsoluteUrl(origin, DEFAULT_IMAGE_PATH);

    const getSeoConfig = (): SeoConfig => {
      const flagshipMatch = matchPath("/event/:eventId", pathname);
      if (flagshipMatch?.params.eventId) {
        const event = getEventById(flagshipMatch.params.eventId);

        if (!event) {
          return {
            title: `Page Not Found | ${SITE_NAME}`,
            description: "The page you are looking for could not be found on the Kapricious 2026 website.",
            robots: "noindex, nofollow",
            keywords: DEFAULT_KEYWORDS,
            schema: createPageSchema("Page Not Found", "Kapricious 2026 page not found", canonicalUrl),
          };
        }

        const description = `${event.title} is a flagship ${event.category.toLowerCase()} event at Kapricious 2026, the tech fest of KMEA Engineering College, Edathala, Aluva. View the venue, schedule, prize, and registration details.`;

        return {
          title: `${event.title} | Kapricious 2026 Flagship Event`,
          description,
          keywords: [
            ...DEFAULT_KEYWORDS,
            event.title,
            event.category,
            "KMEA flagship event",
          ],
          image: event.image,
          schema: createEventSchema({
            name: event.title,
            description,
            canonicalUrl,
            imageUrl: buildAbsoluteUrl(origin, event.image),
            startDate: toIsoDate(event.date),
            venue: event.venue,
          }),
        };
      }

      const departmentEventMatch = matchPath("/events/:eventId", pathname);
      if (departmentEventMatch?.params.eventId) {
        const event = getDepartmentEventById(departmentEventMatch.params.eventId);

        if (!event) {
          return {
            title: `Page Not Found | ${SITE_NAME}`,
            description: "The page you are looking for could not be found on the Kapricious 2026 website.",
            robots: "noindex, nofollow",
            keywords: DEFAULT_KEYWORDS,
            schema: createPageSchema("Page Not Found", "Kapricious 2026 page not found", canonicalUrl),
          };
        }

        const description = `${event.title} is a ${event.departmentName} event at Kapricious 2026, the tech fest of KMEA Engineering College, Edathala, Aluva. Check the date, venue, prize pool, rules, and registration details.`;

        return {
          title: `${event.title} | ${event.departmentName} Event | Kapricious 2026`,
          description,
          keywords: [
            ...DEFAULT_KEYWORDS,
            event.title,
            event.departmentName,
            `${event.departmentName} event`,
          ],
          image: event.image,
          schema: createEventSchema({
            name: event.title,
            description,
            canonicalUrl,
            imageUrl: buildAbsoluteUrl(origin, event.image),
            startDate: toIsoDate(event.date),
            venue: event.venue,
          }),
        };
      }

      if (pathname === "/") {
        return {
          title: SITE_TITLE,
          description: DEFAULT_DESCRIPTION,
          keywords: DEFAULT_KEYWORDS,
          schema: [
            createOrganizationSchema(origin),
            createWebsiteSchema(origin),
            createFestivalSchema(origin, canonicalUrl, defaultImageUrl),
          ],
        };
      }

      if (pathname === "/events") {
        const description =
          "Browse flagship events, department competitions, workshops, and cultural highlights at Kapricious 2026, KMEA Engineering College, Edathala, Aluva.";

        return {
          title: `Events | ${SITE_NAME}`,
          description,
          keywords: [...DEFAULT_KEYWORDS, "Kapricious events", "KMEA event registration"],
          schema: [
            createPageSchema("Kapricious 2026 Events", description, canonicalUrl),
            createEventListSchema(origin),
          ],
        };
      }

      if (pathname === "/register") {
        const description =
          "Register for Kapricious 2026 events at KMEA Engineering College, Edathala, Aluva. Choose your category, event, and complete your fest registration online.";

        return {
          title: `Register | ${SITE_NAME}`,
          description,
          keywords: [...DEFAULT_KEYWORDS, "Kapricious registration", "KMEA fest registration"],
          schema: createPageSchema("Kapricious 2026 Registration", description, canonicalUrl),
        };
      }

      if (pathname === "/cultural-register") {
        const description =
          "Register for Kapricious 2026 cultural events at KMEA Engineering College, Edathala, Aluva and join the fest's stage, performance, and creative competitions.";

        return {
          title: `Cultural Registration | ${SITE_NAME}`,
          description,
          keywords: [...DEFAULT_KEYWORDS, "Kapricious cultural events", "cultural fest registration"],
          schema: createPageSchema("Kapricious 2026 Cultural Registration", description, canonicalUrl),
        };
      }

      if (pathname === "/certificate") {
        const description =
          "Find and download Kapricious 2026 participation certificates from the official KMEA Engineering College fest portal.";

        return {
          title: `Certificates | ${SITE_NAME}`,
          description,
          robots: "noindex, nofollow",
          keywords: DEFAULT_KEYWORDS,
          schema: createPageSchema("Kapricious 2026 Certificates", description, canonicalUrl),
        };
      }

      if (pathname === "/admin" || pathname === "/admin/dashboard") {
        return {
          title: `Admin | ${SITE_NAME}`,
          description: "Kapricious 2026 admin portal.",
          robots: "noindex, nofollow",
          keywords: DEFAULT_KEYWORDS,
          schema: createPageSchema("Kapricious 2026 Admin", "Kapricious 2026 admin portal", canonicalUrl),
        };
      }

      if (matchPath("/departments/:deptId", pathname)) {
        const description =
          "Department-specific Kapricious 2026 event listings for KMEA Engineering College, Edathala, Aluva.";

        return {
          title: `Department Events | ${SITE_NAME}`,
          description,
          robots: "noindex, follow",
          keywords: DEFAULT_KEYWORDS,
          schema: createPageSchema("Kapricious 2026 Department Events", description, canonicalUrl),
        };
      }

      return {
        title: `Page Not Found | ${SITE_NAME}`,
        description: "The page you are looking for could not be found on the Kapricious 2026 website.",
        robots: "noindex, nofollow",
        keywords: DEFAULT_KEYWORDS,
        schema: createPageSchema("Page Not Found", "Kapricious 2026 page not found", canonicalUrl),
      };
    };

    const seo = getSeoConfig();
    const imageUrl = buildAbsoluteUrl(origin, seo.image || DEFAULT_IMAGE_PATH);
    const robotsContent =
      seo.robots || "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";

    document.title = seo.title;

    upsertMetaTag('meta[name="description"]', { name: "description" }, seo.description);
    upsertMetaTag('meta[name="keywords"]', { name: "keywords" }, seo.keywords?.join(", "));
    upsertMetaTag('meta[name="robots"]', { name: "robots" }, robotsContent);
    upsertMetaTag('meta[property="og:site_name"]', { property: "og:site_name" }, SITE_NAME);
    upsertMetaTag('meta[property="og:locale"]', { property: "og:locale" }, "en_IN");
    upsertMetaTag('meta[property="og:type"]', { property: "og:type" }, "website");
    upsertMetaTag('meta[property="og:title"]', { property: "og:title" }, seo.title);
    upsertMetaTag('meta[property="og:description"]', { property: "og:description" }, seo.description);
    upsertMetaTag('meta[property="og:url"]', { property: "og:url" }, canonicalUrl);
    upsertMetaTag('meta[property="og:image"]', { property: "og:image" }, imageUrl);
    upsertMetaTag(
      'meta[property="og:image:alt"]',
      { property: "og:image:alt" },
      `${SITE_NAME} logo`
    );
    upsertMetaTag('meta[name="twitter:card"]', { name: "twitter:card" }, "summary_large_image");
    upsertMetaTag('meta[name="twitter:title"]', { name: "twitter:title" }, seo.title);
    upsertMetaTag(
      'meta[name="twitter:description"]',
      { name: "twitter:description" },
      seo.description
    );
    upsertMetaTag('meta[name="twitter:image"]', { name: "twitter:image" }, imageUrl);
    upsertLinkTag("canonical", canonicalUrl);
    upsertJsonLd(seo.schema);
  }, [location.pathname]);

  return null;
};

export default RouteSeo;
