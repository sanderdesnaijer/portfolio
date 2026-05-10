import Image from "next/image";
import Link from "next/link";
import { convertDate } from "../utils/utils";
import { Tags } from "./Tags";
import { TagSanity } from "@/sanity/types/tagType";
import { DynamicElement } from "./DynamicElement";

interface ProjectListItemProps {
  imageURL?: string;
  imageALT?: string;
  href: string;
  title: string;
  date: string;
  body?: string | null;
  tags?: TagSanity[];
  index?: number;
  headingLevel?: "h2" | "h3";
}

export const ProjectListItem = ({
  imageURL,
  imageALT,
  href,
  title,
  date,
  body,
  tags,
  index,
  headingLevel = "h2",
}: ProjectListItemProps) => {
  const formattedDate = convertDate(date, true);

  return (
    <li className="group/item relative mt-0 mb-0 grid grid-cols-5 justify-between pl-0 no-underline transition-opacity duration-200">
      <div className="col-span-1 md:col-span-2">
        {imageURL && imageALT && (
          <div className="relative inline-block overflow-hidden">
            <p className="absolute top-0 right-0 z-10 mt-0 bg-neutral-900/90 px-2.5 py-0.5 text-[10px] font-semibold tracking-wide text-neutral-50 uppercase shadow-sm ring-1 ring-black/10 dark:bg-white/90 dark:text-neutral-900 dark:ring-white/40">
              {formattedDate}
            </p>
            <Image
              className="mt-0 mb-0 scale-100 object-fill transition group-hover:blur-[2px] group-hover/item:scale-105 group-hover/item:blur-none md:transform-gpu"
              src={imageURL}
              alt={imageALT}
              width={350}
              height={350}
              sizes="(max-width: 768px) 100vw, 350px"
              priority={index !== undefined && index <= 2}
            />
          </div>
        )}
      </div>
      <div className="col-span-4 px-4 md:col-span-3">
        <Link
          href={href}
          className="no-underline group-hover/item:italic group-hover/item:underline before:absolute before:right-0 before:left-0 before:h-full before:opacity-0"
        >
          <DynamicElement
            as={headingLevel}
            className={`-mt-2 mb-4 translate-x-0 text-3xl leading-10 group-hover/item:translate-x-2 md:text-[2.5rem] md:leading-11`}
            size="11"
          >
            {title}
          </DynamicElement>
        </Link>
        {(!imageURL || !imageALT) && (
          <p className="mt-1 mb-1 py-2 text-xs text-gray-800 uppercase group-hover/item:text-gray-900 dark:text-gray-300 dark:group-hover/item:text-gray-100">
            {formattedDate}
          </p>
        )}

        {body ? (
          <p className="mt-0 line-clamp-3 text-base text-gray-800 group-hover/item:text-gray-900 dark:text-gray-100 dark:group-hover/item:text-gray-50">
            {body}
          </p>
        ) : null}

        {tags && <Tags tags={tags} maxTags={3} />}
      </div>
    </li>
  );
};
