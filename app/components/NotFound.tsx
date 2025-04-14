import { CustomLink } from "./CustomLink";
import { PageLayout } from "./PageLayout";

export const NotFound: React.FC<{
  title: string;
  description: string;
  href?: string;
  action: string;
}> = ({ title, description, href, action }) => (
  <PageLayout title={title}>
    <p className="mt-4 text-lg leading-8">{description}</p>
    {href ? (
      <CustomLink
        title={action}
        href={href}
        target="_self"
        className="underline"
      />
    ) : null}
  </PageLayout>
);
