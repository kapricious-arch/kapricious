import type { Metadata } from "next";
import SeoJsonLd from "@/components/SeoJsonLd";
import AdminLoginPage from "@/views/AdminLogin";
import { getAdminMetadata, getAdminSchema } from "@/lib/seo";

export const metadata: Metadata = getAdminMetadata("/admin");

const Admin = () => {
  return (
    <>
      <SeoJsonLd schema={getAdminSchema("/admin")} />
      <AdminLoginPage />
    </>
  );
};

export default Admin;
