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
  *[_type == "job"] | order(startDate desc){
    _id,
    companyName,
    jobTitle,
    startDate,
    endDate,
    link,
    description,
    tags,
    "imageAlt": logo.asset.alt,
    "imageURL": logo.asset->alt,
    employmentType,    
    "contractName": contractName->companyName
  }
`;

export const projectsQuery = groq`
  *[_type == "project"]{
    publishedAt,
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
    _createdAt,
    publishedAt,
    title,
    description,
    mainImage,
    body,
    links,
    "companyName": job->companyName,
    "companyLogo": job->logo.asset->url,
  }
`;

export const projectPathsQuery = groq`
  *[_type == "project" && defined(slug.current)][]{
    "params": { "slug": slug.current }
  }
`;
