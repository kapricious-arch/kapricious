import type { Metadata } from "next";

import SeoJsonLd from "@/components/SeoJsonLd";
import { getAdminMetadata, getAdminSchema } from "@/lib/seo";
import AdminEventSummary from "@/views/AdminEventSummary";

export const metadata: Metadata = getAdminMetadata("/admin/summary");

const AdminSummaryPage = () => {
  return (
    <>
      <SeoJsonLd schema={getAdminSchema("/admin/summary")} />
      <AdminEventSummary />
    </>
  );
};

export default AdminSummaryPage;
