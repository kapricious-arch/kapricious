import type { Metadata } from "next";
import SeoJsonLd from "@/components/SeoJsonLd";
import NotFoundPage from "@/views/NotFound";
import { getNotFoundMetadata, getNotFoundSchema } from "@/lib/seo";

export const metadata: Metadata = getNotFoundMetadata();

const NotFound = () => {
  return (
    <>
      <SeoJsonLd schema={getNotFoundSchema()} />
      <NotFoundPage />
    </>
  );
};

export default NotFound;
