import Posts from '@/app/components/Posts';
import { sanityFetch } from '@/sanity/lib/fetch';
import { postsQuery } from '@/sanity/lib/queries';
import { SanityDocument } from 'next-sanity';
export default async function Page() {
  const posts = await sanityFetch<SanityDocument[]>({ query: postsQuery });

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-8 row-start-2 items-center sm:items-start">
        <h1 className="text-5xl">Projects</h1>
        <Posts posts={posts} />
      </main>
    </div>
  );
}
