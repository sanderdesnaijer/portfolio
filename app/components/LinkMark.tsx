import Link from "next/link";

type LinkMarkProps = {
  children?: React.ReactNode;
  value?: { href?: string };
};

export const LinkMark = ({ children, value }: LinkMarkProps) => {
  const href = value?.href ?? "";
  const isInternal = href.startsWith("/") || href.startsWith("#");
  return (
    <Link
      href={href}
      className="underline underline-offset-2 transition-all duration-100 hover:underline-offset-4"
      {...(isInternal ? {} : { target: "_blank", rel: "noopener noreferrer" })}
    >
      {children}
    </Link>
  );
};
