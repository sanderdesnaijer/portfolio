import Image from "next/image";
import Link from "next/link";
import { convertDate } from "../utils/utils";
import { Tags } from "./Tags";
import { TagSanity } from "@/sanity/types/tagType";
import { DynamicElement } from "./DynamicElement";
import { getIcon } from "./Icons";

interface ProjectListItemProps {
  imageURL?: string;
  imageALT?: string;
  href: string;
  title: string;
  date: string;
  body?: string | null;
  tags?: TagSanity[];
}

const IconComponent = getIcon("chevronRight");

export const ProjectListItem = ({
  imageURL,
  imageALT,
  href,
  title,
  date,
  body,
  tags,
}: ProjectListItemProps) => (
  <li className="group/item relative mt-0 mb-0 grid grid-cols-5 justify-between pl-0 no-underline transition-opacity duration-200">
    <div className="col-span-1 md:col-span-2">
      {imageURL && imageALT && (
        <div className="inline-block overflow-hidden">
          <Image
            className="mt-0 mb-0 scale-100 transform-gpu object-fill transition group-hover:blur-[2px] group-hover/item:scale-105 group-hover/item:blur-none"
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
        className="no-underline before:absolute before:right-0 before:left-0 before:h-full before:opacity-0"
      >
        <h2
          className="group before:content-[] relative -mt-2 mb-0 transform-gpu bg-[linear-gradient(to_left,_black_50%,_white_50%)] bg-[length:200%] bg-[position:right] text-transparent transition-all duration-200 ease-out group-hover/item:bg-[position:0] before:absolute before:top-0 before:left-0 before:-z-10 before:h-full before:w-0 before:bg-black before:transition-all before:duration-200 group-hover/item:before:w-full dark:bg-[linear-gradient(to_left,_white_50%,_black_50%)] dark:before:bg-white"
          style={{
            backgroundClip: "text",
          }}
        >
          {title}
          <IconComponent className="absolute mt-1 inline h-10 translate-x-0 transform-gpu text-black transition-transform delay-100 duration-75 group-hover/item:translate-x-2 group-hover/item:text-white group-hover/item:hover:delay-200 dark:text-white dark:group-hover/item:text-black" />
        </h2>
      </Link>
      <p className="mt-1 mb-1 py-2 text-xs text-gray-800 uppercase group-hover/item:text-gray-900 dark:text-gray-300 dark:group-hover/item:text-gray-100">
        {convertDate(date)}
      </p>

      {body ? (
        <p className="mt-0 text-base text-gray-800 group-hover/item:text-gray-900 dark:text-gray-100 dark:group-hover/item:text-gray-50">
          {body}
        </p>
      ) : null}

      {tags && <Tags tags={tags} />}
    </div>
  </li>
);
