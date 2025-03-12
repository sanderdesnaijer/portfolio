import { groq } from "next-sanity";

export const allPagesQuery = groq`
  *[_type == "pages"] | order(order asc) {
    _id,
    title,
    description,
    _updatedAt,
    slug,
    content,
    name,
    order,
    "imageURL": mainImage.asset->url
  }
`;

export const pageQuery = groq`
  *[_type == "pages" && (slug.current == $slug || $slug == "")][0]{
    _id,
    _createdAt,
    _updatedAt,
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
    "tags": tags[]->{
      _id,
      label
    },
    "imageURL": logo.asset->url,
    employmentType,    
    "contractName": contractName->companyName
  }
`;

export const projectsQuery = groq`
  *[_type == "project"] | order(publishedAt desc){
    publishedAt,
    _updatedAt,
    _id,
    title,
    slug,
    mainImage,
    body,
    "imageURL": mainImage.asset->url,
    "tags": tags[]->{
      _id,
      label
    }
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
    slug,
    "companyName": job->companyName,
    "companyLogo": job->logo.asset->url,
    "imageURL": mainImage.asset->url,
    "imageAlt": mainImage.alt,
    "tags": tags[]->{
      _id,
      label
    }
  }
`;

export const projectPathsQuery = groq`
  *[_type == "project" && defined(slug.current)][]{
    "params": { "slug": slug.current }
  }
`;
