import Image from "next/image";
import Link from "next/link";
import { convertDate } from "../utils/utils";
import { Tags } from "./Tags";
import { TagSanity } from "@/sanity/types/tagType";
import { getChevronClasses } from "../utils/tailwind";

interface ProjectListItemProps {
  imageURL?: string;
  imageALT?: string;
  href: string;
  title: string;
  date: string;
  body?: string | null;
  tags?: TagSanity[];
}

export const ProjectListItem = ({
  imageURL,
  imageALT,
  href,
  title,
  date,
  body,
  tags,
}: ProjectListItemProps) => (
  <li className="group/item transition-del relative mt-0 mb-0 grid grid-cols-5 justify-between pl-0 no-underline transition-opacity duration-200">
    <div className="col-span-1 md:col-span-2">
      {imageURL && imageALT && (
        <div className="inline-block overflow-hidden">
          <Image
            className="mt-0 mb-0 scale-100 object-fill transition group-hover:blur-[2px] group-hover/item:scale-105 group-hover/item:blur-none"
            src={imageURL}
            alt={imageALT}
            width={350}
            height={350}
            priority
          />
        </div>
      )}
    </div>
    <div className="col-span-4 px-4 md:col-span-3">
      <Link
        href={href}
        className="no-underline group-hover/item:italic before:absolute before:right-0 before:left-0 before:h-full before:opacity-0"
      >
        <h2
          className={`-mt-2 mb-0 translate-x-0 text-3xl leading-10 transition-transform group-hover/item:translate-x-2 md:text-[2.5rem] md:leading-11 ${getChevronClasses()} after:mt-0.5 after:h-11 after:w-11`}
        >
          {title}
        </h2>
      </Link>
      <p className="mt-1 mb-1 py-2 text-xs font-light text-gray-700 uppercase dark:dark:text-gray-100">
        {convertDate(date)}
      </p>

      {body ? (
        <p className="mt-0 text-base text-gray-600 dark:text-white">{body}</p>
      ) : null}

      {tags && <Tags tags={tags} />}
    </div>
  </li>
);
