import type { Metadata } from "next";
import SeoJsonLd from "@/components/SeoJsonLd";
import CertificatePage from "@/views/Certificate";
import { getCertificateMetadata, getCertificateSchema } from "@/lib/seo";

export const metadata: Metadata = getCertificateMetadata();

const Certificate = () => {
  return (
    <>
      <SeoJsonLd schema={getCertificateSchema()} />
      <CertificatePage />
    </>
  );
};

export default Certificate;
