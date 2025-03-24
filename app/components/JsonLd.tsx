export const JsonLd: React.FC<{ value: Record<string, unknown> }> = ({
  value,
}) => (
  <script
    type="application/ld+json"
    dangerouslySetInnerHTML={{ __html: JSON.stringify(value) }}
  />
);
