import Link from "next/link";
import React from "react";
import { DynamicElement } from "./DynamicElement";

const isInternalLink = (href: string) =>
  href.startsWith("/") || href.startsWith("#");

export const CustomLink: React.FC<{
  href: string;
  title: string;
  target?: string;
  icon?: React.ReactNode;
  className?: string;
}> = ({ href, title, target, icon, className }) => {
  const resolvedTarget = target ?? (isInternalLink(href) ? "_self" : "_blank");

  return (
    <Link
      className={`flex w-full no-underline underline-offset-4 group-hover/item:underline hover:underline ${className}`}
      href={href}
      target={resolvedTarget}
      aria-label={title}
      {...(resolvedTarget === "_blank" && {
        rel: "noopener noreferrer",
      })}
    >
      {icon}
      <DynamicElement
        as={"span"}
        className="mt-0 mb-0 text-base font-normal after:mt-[3px]"
      >
        {title}
      </DynamicElement>
    </Link>
  );
};
