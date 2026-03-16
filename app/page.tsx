import type { Metadata } from "next";
import SeoJsonLd from "@/components/SeoJsonLd";
import IndexPage from "@/views/Index";
import { getHomeMetadata, getHomeSchema } from "@/lib/seo";

export const metadata: Metadata = getHomeMetadata();

const Home = () => {
  return (
    <>
      <SeoJsonLd schema={getHomeSchema()} />
      <IndexPage />
    </>
  );
};

export default Home;
