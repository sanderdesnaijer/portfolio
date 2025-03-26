import { ProjectTypeSanity } from "@/sanity/types";

export const mockProject: ProjectTypeSanity = {
  _id: "1",
  title: "Project 1",
  _createdAt: "2025-01-01",
  slug: { _type: "slug", current: "/project-1" },
  imageURL: "http://mocked-image-url.com/image1.jpg",
  mainImage: {
    _type: "image",
    alt: "Project 1 Image Alt",
    asset: { _ref: "string", _type: "ref" },
  },
  body: [
    {
      _type: "block",
      children: [{ text: "Mock body content", _type: "span", marks: [] }],
      style: "",
    },
  ],
  links: [
    { title: "GitHub", icon: "github", link: "http://test" },
    { title: "Live Demo", icon: "external-link", link: "http://test" },
  ],
  tags: [
    {
      _type: "tag",
      name: "React",
      label: "React",
      _id: "tag-1",
      _rev: "",
      _createdAt: "",
      _updatedAt: "",
    },
    {
      _type: "tag",
      name: "TypeScript",
      label: "Typescript",
      _id: "tag-2",
      _rev: "",
      _createdAt: "",
      _updatedAt: "",
    },
  ],
  publishedAt: "2025-01-02",
  _updatedAt: "2025-01-02",
  _rev: "",
  _type: "",
  jsonLdType: [],
};

export const mockProjects: ProjectTypeSanity[] = [
  mockProject,
  {
    _id: "2",
    title: "Project 2",
    _createdAt: "2025-01-02",
    slug: { current: "/project-2", _type: "slug" },
    imageURL: "http://mocked-image-url.com/image2.jpg",
    mainImage: {
      _type: "image",
      alt: "Project 2 Image Alt",
      asset: { _ref: "string", _type: "ref" },
    },
    body: [],
    links: [],
    publishedAt: "",
    _updatedAt: "",
    _rev: "",
    _type: "",
    jsonLdType: [],
  },
];
