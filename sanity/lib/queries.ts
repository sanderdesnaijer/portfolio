import { groq } from "next-sanity";

export const allPagesQuery = groq`
  *[_type == "pages"]{
    _id,
    title,
    description,
    slug,
    content,
    "imageURL": mainImage.asset->url
  }
`;

export const pageQuery = groq`
  *[_type == "pages" && slug.current == $slug][0]{
    _id,
    title,
    description,
    slug,
    body,    
    "imageAlt": mainImage.alt,
    "imageURL": mainImage.asset->url
  }
`;

export const settingsQuery = groq`
  *[_type == "setting"][0]{
    _id,
    title,
    description,
    socialMedia[]{
      title,
      link,
      icon
    }
  }
`;

export const jobsQuery = groq`
  *[_type == "job"]{    
    _id,
    companyName,
    jobTitle,
    startDate,
    endDate,
    link,
    description,
    tags,
    "imageURL": logo.asset->url
  }
`;

export const projectsQuery = groq`
  *[_type == "project"]{
    _createdAt,
    _id,
    title,
    slug,
    mainImage,
    links,
    body,
    "imageURL": mainImage.asset->url
  }
`;

export const projectQuery = groq`
  *[_type == "project" && slug.current == $slug][0]{
    title,
    description,
    mainImage,
    body,
    links
  }
`;

export const projectPathsQuery = groq`
  *[_type == "project" && defined(slug.current)][]{
    "params": { "slug": slug.current }
  }
`;
