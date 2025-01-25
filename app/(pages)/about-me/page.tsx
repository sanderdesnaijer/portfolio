import { sanityFetch } from "@/sanity/lib/fetch";
import { pageQuery } from "@/sanity/lib/queries";
import { PortableText } from "next-sanity";
import Image from "next/image";
import imageUrlBuilder from "@sanity/image-url";
import { client } from "@/sanity/lib/client";
import { PageSanity } from "@/sanity/lib/types";

const slug = "about-me";

const builder = imageUrlBuilder(client);

export default async function Page() {
  const page = await sanityFetch<PageSanity>({
    query: pageQuery,
    params: { slug: slug },
  });

  if (!page) {
    return (
      <div>
        <p>Page not found</p>
      </div>
    );
  }

  return (
    <main className="container mx-auto prose prose-xl px-4 py-16">
      <h1>{page.title}</h1>
      <Image
        alt={page.imageAlt}
        src={builder.image(page.imageURL).width(300).height(300).url()}
        width={300}
        height={300}
        priority
      />
      {page?.body ? <PortableText value={page.body} /> : null}
    </main>
  );
}
