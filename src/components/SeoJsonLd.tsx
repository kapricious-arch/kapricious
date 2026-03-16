interface SeoJsonLdProps {
  schema: Record<string, unknown> | Array<Record<string, unknown>>;
}

const SeoJsonLd = ({ schema }: SeoJsonLdProps) => {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
};

export default SeoJsonLd;
