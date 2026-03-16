import type { Metadata } from "next";
import SeoJsonLd from "@/components/SeoJsonLd";
import RegisterPage from "@/views/Register";
import { getRegisterMetadata, getRegisterSchema } from "@/lib/seo";

export const metadata: Metadata = getRegisterMetadata();

const Register = () => {
  return (
    <>
      <SeoJsonLd schema={getRegisterSchema()} />
      <RegisterPage />
    </>
  );
};

export default Register;
