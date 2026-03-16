import type { Metadata } from "next";
import SeoJsonLd from "@/components/SeoJsonLd";
import AdminDashboardPage from "@/views/AdminDashboard";
import { getAdminMetadata, getAdminSchema } from "@/lib/seo";

export const metadata: Metadata = getAdminMetadata("/admin/dashboard");

const AdminDashboard = () => {
  return (
    <>
      <SeoJsonLd schema={getAdminSchema("/admin/dashboard")} />
      <AdminDashboardPage />
    </>
  );
};

export default AdminDashboard;
