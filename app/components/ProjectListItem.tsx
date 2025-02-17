import Image from "next/image";
import Link from "next/link";
import { convertDate } from "../utils/utils";
import { Tags } from "./Tags";
import { TagSanity } from "@/sanity/types/tagType";

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
  <div className="relative grid grid-cols-5 justify-between no-underline hover:opacity-90">
    <div className="col-span-1 sm:col-span-2">
      {imageURL && imageALT && (
        <Image
          className="mt-0 object-fill"
          src={imageURL}
          alt={imageALT}
          width={350}
          height={350}
          priority
        />
      )}
    </div>
    <div className="col-span-4 px-4 sm:col-span-3">
      <Link
        href={href}
        className="no-underline before:absolute before:right-0 before:left-0 before:h-full before:opacity-0"
      >
        <h2 className="-mt-2 mb-0 text-3xl leading-10 font-normal sm:text-[2.5rem] sm:leading-12">
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
  </div>
);
