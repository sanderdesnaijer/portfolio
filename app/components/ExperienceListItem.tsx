import Image from "next/image";
import Link from "next/link";
import { convertDate } from "../utils/utils";
import { urlFor } from "@/sanity/lib/image";

interface ExperienceListItemProps {
  companyName: string;
  jobTitle: string;
  startDate: string;
  endDate?: string | null;
  link: string;
  imageURL: string;
  presentLabel: string;
}

const LOGO_SIZE = 36;

export const ExperienceListItem = ({
  companyName,
  jobTitle,
  startDate,
  endDate,
  link,
  imageURL,
  presentLabel,
}: ExperienceListItemProps) => {
  const start = convertDate(startDate);
  const end = endDate ? convertDate(endDate) : presentLabel;

  return (
    <li className="group/item mt-0 list-none pl-0">
      <Link
        href={link}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`${companyName} - ${jobTitle}`}
        className="flex items-start gap-3 py-3 no-underline transition-opacity hover:opacity-80"
      >
        <Image
          alt={`${companyName} logo`}
          src={urlFor(imageURL).width(LOGO_SIZE).height(LOGO_SIZE).url()}
          width={LOGO_SIZE}
          height={LOGO_SIZE}
          className="mt-0 mb-0 rounded-md"
          loading="lazy"
        />
        <div className="min-w-0">
          <p className="mt-0 mb-0 text-base font-bold group-hover/item:underline">
            {companyName}
          </p>
          <p className="mt-0 mb-0 text-sm text-gray-800 dark:text-gray-200">
            {jobTitle}
          </p>
          <p className="mt-0 mb-0 text-xs text-gray-600 italic dark:text-gray-400">
            {start}
            {" - "}
            {end}
          </p>
        </div>
      </Link>
    </li>
  );
};
