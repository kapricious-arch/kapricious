import type { Metadata } from "next";
import SeoJsonLd from "@/components/SeoJsonLd";
import FlagshipEventDetailPage from "@/views/FlagshipEventDetail";
import { getFlagshipEventMetadata, getFlagshipEventSchema } from "@/lib/seo";

interface FlagshipEventRouteProps {
  params: Promise<{
    eventId: string;
  }>;
}

export async function generateMetadata({ params }: FlagshipEventRouteProps): Promise<Metadata> {
  const { eventId } = await params;
  return getFlagshipEventMetadata(eventId);
}

const FlagshipEventRoute = async ({ params }: FlagshipEventRouteProps) => {
  const { eventId } = await params;

  return (
    <>
      <SeoJsonLd schema={getFlagshipEventSchema(eventId)} />
      <FlagshipEventDetailPage />
    </>
  );
};

export default FlagshipEventRoute;
