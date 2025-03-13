import { CustomLink } from "./CustomLink";

export const NotFound: React.FC<{
  title: string;
  description: string;
  href: string;
}> = ({ title, description, href }) => (
  <>
    <p className="mt-0 text-lg leading-8">{description}</p>
    <CustomLink
      title={title}
      href={href}
      target="_self"
      className="underline"
    />
  </>
);
