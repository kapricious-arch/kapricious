import type { Metadata } from "next";
import SeoJsonLd from "@/components/SeoJsonLd";
import EventsPage from "@/views/Events";
import { getEventsMetadata, getEventsSchema } from "@/lib/seo";

export const metadata: Metadata = getEventsMetadata();

const Events = () => {
  return (
    <>
      <SeoJsonLd schema={getEventsSchema()} />
      <EventsPage />
    </>
  );
};

export default Events;
