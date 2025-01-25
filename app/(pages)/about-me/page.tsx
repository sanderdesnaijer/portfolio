import { sanityFetch } from "@/sanity/lib/fetch";
import { pageQuery } from "@/sanity/lib/queries";
import { PortableText, SanityDocument } from "next-sanity";

const slug = "about-me";

export default async function Page() {
  const page = await sanityFetch<SanityDocument>({
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
      {page?.body ? <PortableText value={page.body} /> : null}
    </main>
  );
}
