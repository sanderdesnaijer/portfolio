import Link from "next/link";
import React from "react";
import { DynamicElement } from "./DynamicElement";

export const CustomLink: React.FC<{
  href: string;
  title: string;
  target?: string;
  icon?: React.ReactNode;
  className?: string;
}> = ({ href, title, target = "_blank", icon, className }) => (
  <Link
    className={`flex w-full no-underline underline-offset-4 group-hover/item:underline hover:underline ${className}`}
    href={href}
    target={target}
    aria-label={title}
    {...(target === "_blank" && {
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
