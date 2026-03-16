import type { Metadata } from "next";
import SeoJsonLd from "@/components/SeoJsonLd";
import EventDetailPage from "@/views/EventDetail";
import { getDepartmentEventMetadata, getDepartmentEventSchema } from "@/lib/seo";

interface EventDetailRouteProps {
  params: Promise<{
    eventId: string;
  }>;
}

export async function generateMetadata({ params }: EventDetailRouteProps): Promise<Metadata> {
  const { eventId } = await params;
  return getDepartmentEventMetadata(eventId);
}

const EventDetailRoute = async ({ params }: EventDetailRouteProps) => {
  const { eventId } = await params;

  return (
    <>
      <SeoJsonLd schema={getDepartmentEventSchema(eventId)} />
      <EventDetailPage />
    </>
  );
};

export default EventDetailRoute;
