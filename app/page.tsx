import { sanityFetch } from "@/sanity/lib/fetch";
import { authorQuery, pageQuery } from "@/sanity/lib/queries";
import { AuthorSanity, PageSanity } from "@/sanity/lib/types";
import Image from "next/image";
import Link from "next/link";

const iconSize = 30;

export default async function Home({ params }: { params: { slug: string } }) {
  const slug = params.slug || null;

  const page = await sanityFetch<PageSanity>({
    query: pageQuery,
    params: { slug: null },
  });

  const author = await sanityFetch<AuthorSanity>({
    query: authorQuery,
    params: { name: "Sander de Snaijer" },
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
        {author.socialMedia.map((media) => {
          const { icon, link } = media;
          const iconUrl = `/icons/${icon}.svg`;

          return (
            <Link key={icon} href={link} target="_blank">
              <Image
                aria-hidden
                src={iconUrl}
                alt={`${icon} icon`}
                width={iconSize}
                height={iconSize}
              />
            </Link>
          );
        })}
      </main>
    </div>
  );
}
