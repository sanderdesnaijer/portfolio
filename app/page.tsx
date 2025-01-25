import { sanityFetch } from "@/sanity/lib/fetch";
import { pageQuery, postsQuery } from "@/sanity/lib/queries";
import { SanityDocument } from "next-sanity";
import { Posts } from "./components/Posts";
import Image from "next/image";

const icons = ["linkedin", "github", "gitlab"];
const iconSize = 30;

export default async function Home({ params }: { params: { slug: string } }) {
  const slug = params.slug || null;

  const page = await sanityFetch<SanityDocument>({
    query: pageQuery,
    params: { slug: null },
  });

  // Fetch posts data
  const posts = await sanityFetch<SanityDocument[]>({
    query: postsQuery,
  });

  if (!page) {
    return (
      <div>
        <p>Page not found for slug: {slug}</p>
      </div>
    );
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-5xl">{page.title || "Home page"}</h1>
        <p>{page.description}</p>
        {icons.map((icon) => (
          <Image
            key={icon}
            aria-hidden
            src={`/icons/${icon}.svg`}
            alt={`${icon} icon`}
            width={iconSize}
            height={iconSize}
          />
        ))}
        <Posts posts={posts} />
      </main>
    </div>
  );
}
