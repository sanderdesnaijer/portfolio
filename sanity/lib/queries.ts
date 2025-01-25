import { groq } from "next-sanity";

export const allPagesQuery = groq`*[_type == "pages"]{
_id,
title,
description,
slug,
content, // Replace with your specific fields for pages
"imageURL": mainImage.asset->url, 
}`;

export const pageQuery = groq`*[_type == "pages" && slug.current == $slug][0]{
_id,
title,
description,
slug,
body,
"imageAlt": mainImage.alt, 
"imageURL": mainImage.asset->url, 
}`;

export const authorQuery = `*[_type == "author" && name == $name][0] {
_id,
name,
bio,
socialMedia,
}`;

// Get all posts
export const postsQuery = groq`*[_type == "post"] {
  _createdAt,
  _id,
  title,
  slug,
  mainImage,
  "imageURL": mainImage.asset->url,
  "authorName": author->name,
}`;

// Get a single post by its slug
export const postQuery = groq`*[_type == "post" && slug.current == $slug][0]{ 
    title, description, mainImage, body
  }`;

// Get all post slugs
export const postPathsQuery = groq`*[_type == "post" && defined(slug.current)][]{
    "params": { "slug": slug.current }
  }`;
