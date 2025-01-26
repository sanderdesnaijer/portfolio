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

export const settingsQuery = `*[_type == "setting"][0] {
_id,
title,
description,
socialMedia[] {
  title,
  link,
  icon
}
}`;

// Get all projects
export const projectsQuery = groq`*[_type == "project"] {
  _createdAt,
  _id,
  title,
  slug,
  mainImage,
  links,
  body,
  "imageURL": mainImage.asset->url,
}`;

// Get a single project by its slug
export const projectQuery = groq`*[_type == "project" && slug.current == $slug][0]{ 
    title, 
    description, 
    mainImage, 
    body, 
    links
  }`;

// Get all project slugs
export const projectPathsQuery = groq`*[_type == "project" && defined(slug.current)][]{
    "params": { "slug": slug.current }
  }`;
