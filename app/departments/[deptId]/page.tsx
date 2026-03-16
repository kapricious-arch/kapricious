import type { Metadata } from "next";
import SeoJsonLd from "@/components/SeoJsonLd";
import DepartmentEventsPage from "@/views/DepartmentEvents";
import { getDepartmentListingMetadata, getDepartmentListingSchema } from "@/lib/seo";

interface DepartmentEventsRouteProps {
  params: Promise<{
    deptId: string;
  }>;
}

export async function generateMetadata({
  params,
}: DepartmentEventsRouteProps): Promise<Metadata> {
  const { deptId } = await params;
  return getDepartmentListingMetadata(deptId);
}

const DepartmentEventsRoute = async ({ params }: DepartmentEventsRouteProps) => {
  const { deptId } = await params;

  return (
    <>
      <SeoJsonLd schema={getDepartmentListingSchema(deptId)} />
      <DepartmentEventsPage />
    </>
  );
};

export default DepartmentEventsRoute;
