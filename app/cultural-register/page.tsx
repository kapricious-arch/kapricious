import type { Metadata } from "next";
import SeoJsonLd from "@/components/SeoJsonLd";
import CulturalRegisterPage from "@/views/CulturalRegister";
import { getCulturalRegisterMetadata, getCulturalRegisterSchema } from "@/lib/seo";

export const metadata: Metadata = getCulturalRegisterMetadata();

const CulturalRegister = () => {
  return (
    <>
      <SeoJsonLd schema={getCulturalRegisterSchema()} />
      <CulturalRegisterPage />
    </>
  );
};

export default CulturalRegister;
