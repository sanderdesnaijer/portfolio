import { QueryParams } from "@sanity/client";
import { postPathsQuery, postQuery } from "@/sanity/lib/queries";
import { sanityFetch } from "@/sanity/lib/fetch";
import { client } from "@/sanity/lib/client";
import { Post } from "../../components/Post";
import { PostTypeSanity } from "@/sanity/lib/types";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await client.fetch(postPathsQuery);
  return posts;
}

const PostPage = async ({ params }: { params: QueryParams }) => {
  const post = await sanityFetch<PostTypeSanity>({ query: postQuery, params });
  return <Post post={post} />;
};

export default PostPage;
