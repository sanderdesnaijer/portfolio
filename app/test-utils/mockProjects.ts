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
  publishedAt: "",
  _updatedAt: "",
  _rev: "",
  _type: "",
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
    body: null!,
    links: [],
    publishedAt: "",
    _updatedAt: "",
    _rev: "",
    _type: "",
  },
];
