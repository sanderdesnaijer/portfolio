import { PostTypeSanity } from "@/sanity/lib/types";
import { toPlainText } from "next-sanity";
import Image from "next/image";
import Link from "next/link";
import { ICON_SIZE } from "../utils/constants";

const convertDate = (date: string) => {
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
};

const truncateText = (text: string, length: number) => {
  if (text.length <= length) return text;
  return text.slice(0, length) + "...";
};

export const Posts = ({ posts = [] }: { posts: PostTypeSanity[] }) => {
  return (
    <div className="py-10 mx-auto grid grid-cols-1">
      <div className="grid gap-10">
        {posts.map((post) => (
          <Link
            className="items-center justify-between hover:opacity-90"
            key={post._id}
            href={post.slug.current}
          >
            <h2 className="font-medium text-xl">{post.title}</h2>
            <p className="py-2 text-gray-400 text-xs font-light uppercase">
              {convertDate(post._createdAt)}
            </p>
            {post?.mainImage && (
              <Image
                className="w-32 object-fill rounded-lg"
                src={post.imageURL}
                alt={post.mainImage.alt}
                width={350}
                height={350}
                priority
              />
            )}
            {post.body ? (
              <p className="text-gray-600 text-sm">
                {truncateText(toPlainText(post.body), 200)}
              </p>
            ) : null}
            {post.links && post.links.length && (
              <ul>
                {post.links.map((link) => (
                  <li key={link.title}>
                    <Image
                      aria-hidden
                      src={`/icons/${link.icon}.svg`}
                      alt={`${link.icon} icon`}
                      width={ICON_SIZE}
                      height={ICON_SIZE}
                    />
                    <h3>{link.title}</h3>
                  </li>
                ))}
              </ul>
            )}
          </Link>
        ))}
      </div>
    </div>
  );
};

export default Posts;
